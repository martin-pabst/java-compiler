import { Program, Step } from "../../common/interpreter/Program";
import { Helpers, StepParams } from "../../common/interpreter/StepFunction.ts";
import { TokenType } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTClassDefinitionNode, ASTFieldDeclarationNode, ASTMethodDeclarationNode } from "../parser/AST";
import { Field } from "../types/Field.ts";
import { JavaClass } from "../types/JavaClass.ts";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";
import { CodeSnippetContainer } from "./CodeSnippetKinds.ts";
import { OneParameterTemplate } from "./CodeTemplate.ts";
import { JavaSymbolTable } from "./JavaSymbolTable";
import { SnippetLinker } from "./SnippetLinker";
import { StatementCodeGenerator } from "./StatementCodeGenerator";
import { type TypeResolver } from "../TypeResolver/TypeResolver.ts"; // only for jsDoc below

export class CodeGenerator extends StatementCodeGenerator {

    linker: SnippetLinker;

    constructor(module: JavaCompiledModule, libraryTypestore: JavaTypeStore, compiledTypesTypestore: JavaTypeStore) {
        super(module, libraryTypestore, compiledTypesTypestore);
        this.linker = new SnippetLinker();
    }

    start() {
        this.compileMainProgram();
        this.compileClasses();
    }

    compileMainProgram() {
        let ast = this.module.ast!;
        this.currentSymbolTable = new JavaSymbolTable(this.module, ast.range, true);

        let snippets: CodeSnippet[] = [];

        for (let statement of ast.mainProgramNode.statements) {
            let snippet = this.compileStatementOrTerm(statement);
            if (snippet) snippets.push(snippet);
        }

        snippets.push(new StringCodeSnippet("t.state = 4;"));

        let steps = this.linker.link(snippets);

        this.module.mainProgram = new Program(this.module, this.currentSymbolTable,
            "main program");
        this.module.mainProgram.stepsSingle = steps;

        ast.program = this.module.mainProgram;  // only for debugging

    }

    compileClasses() {
        if (!this.module.ast?.classOrInterfaceOrEnumDefinitions) return;

        for (let cdef of this.module.ast?.classOrInterfaceOrEnumDefinitions) {
            switch (cdef.kind) {
                case TokenType.keywordClass:
                    this.compileClass(cdef);
                    break;
                case TokenType.keywordEnum:
                    break;
                case TokenType.keywordInterface:
                    break;
            }
        }
    }

    compileClass(cdef: ASTClassDefinitionNode) {
        let type = cdef.resolvedType;
        if (!type || !cdef.resolvedType) return;
        let classContext = <JavaClass>cdef.resolvedType;

        this.pushAndGetNewSymbolTable(cdef.range, false, classContext);

        let fieldSnippets: CodeSnippet[] = [];
        let staticFieldSnippets: CodeSnippet[] = [new StringCodeSnippet(`let __Klass = ${Helpers.classes}[${classContext.identifier}];\n`)];

        for (let field of cdef.fields) {
            let snippet = this.compileField(field, classContext);
            if(snippet){
                if(field.isStatic){
                    staticFieldSnippets.push(snippet);
                } else {
                    fieldSnippets.push(snippet);
                }
            } 
        }
        
        classContext.fieldConstructor = this.buildFieldConstructor(fieldSnippets, "fieldInitializer");
        cdef.fieldConstructorProgram = classContext.fieldConstructor;

        classContext.staticFieldConstructor = this.buildFieldConstructor(staticFieldSnippets, "staticFieldInitializer");
        cdef.staticFieldConstructorProgram = classContext.staticFieldConstructor;

        for (let method of cdef.methods) {
            this.compileMethod(method, classContext);
        }

        this.popSymbolTable();

    }


    buildFieldConstructor(snippets: CodeSnippet[], identifier: string): Program {
        let program = new Program(this.module, this.currentSymbolTable, identifier);
        snippets.push(new StringCodeSnippet(`${Helpers.return}();`));
        program.stepsSingle = this.linker.link(snippets);
        return program;
    }


    /**
     * All fields inside types are already built by 
     * @see TypeResolver#buildRuntimeClassesAndTheirFields
     * @returns 
     */
    compileField(fieldNode: ASTFieldDeclarationNode, classContext: JavaClass): CodeSnippet | undefined {

        if (!fieldNode.type.resolvedType) return undefined;

        let field = classContext.fields.find(f => f.identifier == fieldNode.identifier);
        if (!field) return undefined;

        this.currentSymbolTable.addSymbol(field);

        if (fieldNode.initialization) {
                
            if (fieldNode.isStatic) {
                
                    this.currentlyCompiledStaticConstructor = classContext;
                    let snippet = this.compileTerm(fieldNode.initialization);
                    this.currentlyCompiledStaticConstructor = undefined;

                    if(snippet){
    
                        snippet = this.compileCast(snippet, field.type, "implicit");
    
                        let assignmentTemplate = `__Klass.${field.getInternalName()} = §1;\n`;
    
                        snippet = new OneParameterTemplate(assignmentTemplate).applyToSnippet(field.type, fieldNode.initialization.range, snippet);
    
                        let snippet1 = new CodeSnippetContainer(snippet);
                        snippet1.addNextStepMark();
    
                        return snippet1;                        
                    }
                    
                } else {
                    // TODO: Optimize if field values are constant
                    let snippet = this.compileTerm(fieldNode.initialization);
                    if(snippet){
                        if (!classContext.fieldConstructor) classContext.fieldConstructor = new Program(this.module, this.currentSymbolTable, classContext.identifier + ".fieldConstructor");
    
                        snippet = this.compileCast(snippet, field.type, "implicit");
    
                        let assignmentTemplate = `${StepParams.stack}[${StepParams.stackBase}].${field.getInternalName()} = §1;\n`;
                        
                        snippet = new OneParameterTemplate(assignmentTemplate).applyToSnippet(field.type, fieldNode.initialization.range, snippet);
    
                        let snippet1 = new CodeSnippetContainer(snippet);
                        snippet1.addNextStepMark();
                        return snippet1;
                    }
                }
        } else {
            // no explicit field initialization => set default value
            if (classContext.runtimeClass) {
                if (fieldNode.isStatic) {
                    classContext.runtimeClass[field.getInternalName()] = field.type.getDefaultValue();
                } else {
                    classContext.runtimeClass.prototype[field.getInternalName()] = field.type.getDefaultValue();
                }
            }
        }
    }

    compileMethod(methodNode: ASTMethodDeclarationNode, classContext: JavaClass) {

        let method = methodNode.method;
        if (!method) return;

        let symbolTable = this.pushAndGetNewSymbolTable(methodNode.range, true, classContext, method);

        for (let parameter of method.parameters) {
            this.currentSymbolTable.addSymbol(parameter);
        }

        if (methodNode.statement) {
            let snippet = this.compileStatementOrTerm(methodNode.statement);

            if (snippet) {

                method.program = new Program(this.module, symbolTable, classContext.identifier + method.identifier);
                method.program.stepsSingle = this.linker.link([snippet]);

                method.program.addStep(`${Helpers.return}();`)

                methodNode.program = method.program;    // only for debugging purposes

                let runtimeClass = classContext.runtimeClass;

                if (runtimeClass) {
                    runtimeClass.__programs.push(method.program);
                    let methodIndex = runtimeClass.__programs.length - 1;

                    let parameterIdentifiers = method.parameters.map(p => p.identifier);
                    let thisFollowedByParameterIdentifiers = ["this"].concat(parameterIdentifiers);

                    if (method.isStatic) {
                        runtimeClass[method.getInternalName("java")] = new Function(StepParams.thread, ...parameterIdentifiers,
                            `${Helpers.threadStack}.push(${thisFollowedByParameterIdentifiers.join(", ")});
                             ${Helpers.pushProgram}(this.__programs[${methodIndex}]);`);
                    } else {
                        runtimeClass.prototype[method.getInternalName("java")] = new Function(...parameterIdentifiers,
                            `${Helpers.threadStack}.push(${thisFollowedByParameterIdentifiers.join(", ")});
                             ${Helpers.pushProgram}(this.constructor__programs[${methodIndex}]);`);
                    }
                }
            }
        }

        this.popSymbolTable();
    }





}