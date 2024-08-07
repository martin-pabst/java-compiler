import { Program } from "../../common/interpreter/Program";
import { Helpers } from "../../common/interpreter/StepFunction.ts";
import { TokenType } from "../TokenType";
import { JCM } from "../language/JavaCompilerMessages.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTClassDefinitionNode, ASTEnumDefinitionNode, ASTInterfaceDefinitionNode, ASTStaticInitializerNode, TypeScope } from "../parser/AST";
import { JavaClass } from "../types/JavaClass.ts";
import { JavaEnum } from "../types/JavaEnum.ts";
import { JavaInterface } from "../types/JavaInterface.ts";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";
import { CodeSnippetContainer } from "./CodeSnippetKinds.ts";
import { OneParameterTemplate } from "./CodeTemplate.ts";
import { ExceptionTree } from "./ExceptionTree.ts";
import { InnerClassCodeGenerator } from "./InnerClassCodeGenerator.ts";
import { SnippetLinker } from "./SnippetLinker";

export class CodeGenerator extends InnerClassCodeGenerator {


    constructor(module: JavaCompiledModule, libraryTypestore: JavaTypeStore, compiledTypesTypestore: JavaTypeStore,
        exceptionTree: ExceptionTree) {
        super(module, libraryTypestore, compiledTypesTypestore, exceptionTree);
        this.linker = new SnippetLinker();
    }

    start() {
        this.module.programsToCompileToFunctions = [];
        this.compileClassesEnumsAndInterfaces(this.module.ast);
        // this.compileMainProgram();
    }


    compileClassesEnumsAndInterfaces(typeScope: TypeScope | undefined) {

        // First compile all static fields and static initializers in all types:
        // If they can be evaluated to constants, then you can use them in switch...case-statements later on
        this.compileStaticFieldsAndInitializerAndEnumValuesRecursive(typeScope);

        this.compileInstanceFieldsInitializersAndStandardConstructorsRecursively(typeScope);

        this.compileMethodsRecursively(typeScope);

    }

    compileInstanceFieldsInitializersAndStandardConstructorsRecursively(typeScope: TypeScope | undefined) {
        if (!typeScope) return;

        for (let cdef of typeScope.innerTypes) {
            if (cdef.isAnonymousInnerType) continue;     // anonymous inner class
            if(cdef.kind != TokenType.keywordClass && cdef.kind != TokenType.keywordEnum) continue;

            let type = cdef.resolvedType;
            if (!type || !cdef.resolvedType) return;

            if (cdef.symbolTable) {
                this.pushSymbolTable(cdef.symbolTable);
            } else {
                cdef.symbolTable = this.pushAndGetNewSymbolTable(cdef.range, false, type);
            }
            
            this.compileInstanceFieldsAndInitializer(cdef, type as JavaClass | JavaEnum);

            if (cdef.kind == TokenType.keywordClass) {
                this.buildStandardConstructors(type as JavaClass);
            }


            this.compileInstanceFieldsInitializersAndStandardConstructorsRecursively(cdef);

            this.popSymbolTable();
        }
    }

    compileStaticFieldsAndInitializerAndEnumValuesRecursive(typeScope: TypeScope | undefined) {
        if (!typeScope) return;

        for (let cdef of typeScope.innerTypes) {
            if (cdef.isAnonymousInnerType) continue;     // anonymous inner class

            let type = cdef.resolvedType;
            if (!type || !cdef.resolvedType) return;

            if (cdef.symbolTable) {
                this.pushSymbolTable(cdef.symbolTable);
            } else {
                cdef.symbolTable = this.pushAndGetNewSymbolTable(cdef.range, false, type);
                //@ts-ignore
                if(cdef.identifier == "" && cdef.parent["mainProgramNode"]){
                    cdef.symbolTable.hiddenWhenDebugging = true;
                }
                
            }

            this.compileStaticFieldsAndInitializerAndEnumValues(type, cdef);

            this.compileStaticFieldsAndInitializerAndEnumValuesRecursive(cdef);

            this.popSymbolTable();
        }
    }


    compileMethodsRecursively(typeScope: TypeScope | undefined) {
        if (!typeScope) return;

        for (let cdef of typeScope.innerTypes) {
            if (cdef.isAnonymousInnerType) continue;     // anonymous inner class

            let type = cdef.resolvedType;
            if (!type || !cdef.resolvedType) return;

            if (cdef.symbolTable) {
                this.pushSymbolTable(cdef.symbolTable);
            } else {
                cdef.symbolTable = this.pushAndGetNewSymbolTable(cdef.range, false, type);
            }

            this.compileMethods(cdef, type);

            this.compileMethodsRecursively(cdef);

            this.popSymbolTable();
        }

    }

    private compileStaticFieldsAndInitializerAndEnumValues(classContext: JavaClass | JavaEnum | JavaInterface, cdef: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode) {
        let staticFieldSnippets: CodeSnippet[] = [];

        if (cdef.kind == TokenType.keywordEnum) {
            this.compileEnumValueConstruction(<JavaEnum>classContext, cdef, staticFieldSnippets);
        }


        for (let fieldOrInitializer of cdef.fieldsOrInstanceInitializers) {

            switch (fieldOrInitializer.kind) {
                case TokenType.fieldDeclaration:
                    if (!fieldOrInitializer.isStatic) {
                        if (classContext instanceof JavaInterface) {
                            this.pushError(JCM.interfaceFieldsMustBeStatic(), "error", cdef);
                        }
                        continue;
                    }
                    let snippet = this.compileFieldDeclaration(fieldOrInitializer, classContext);
                    if (snippet) {
                        staticFieldSnippets.push(snippet);
                    }
                    break;
                case TokenType.staticInitializerBlock:
                    let snippet2 = this.compileStaticInitializerBlock(fieldOrInitializer);
                    if (snippet2) {
                        staticFieldSnippets.push(snippet2);
                    }
                    break;
                default:
                    break;
            }

        }


        classContext.staticInitializer = this.buildInitializer(staticFieldSnippets, "staticInitializer");
        cdef.staticInitializer = classContext.staticInitializer;
    }

    compileEnumValueConstruction(javaEnum: JavaEnum, enumDeclNode: ASTEnumDefinitionNode, staticFieldSnippets: CodeSnippet[]) {

        staticFieldSnippets.push(new StringCodeSnippet(`${Helpers.classes}["${javaEnum.identifier}"].values = [];\n`));
        
        let parameterlessConstructor = javaEnum.methods.find(m => m.isConstructor && m.parameters.length == 0);
        
        let enumValueIndex: number = 0;
        for (let valueNode of enumDeclNode.valueNodes) {

            // find suitable constructor and invoke it!
            let callConstructorSnippet: CodeSnippet;
            if (valueNode.parameterValues.length > 0 || parameterlessConstructor) {

                let parameterSnippets = <CodeSnippet[]>valueNode.parameterValues.map(pv => this.compileTerm(pv));
                if (parameterSnippets.some(sn => (!sn || !sn.type))) continue; // if there had been an error when compiling parameter values

                let constructors = this.searchMethod(javaEnum.identifier, javaEnum, parameterSnippets.map(sn => sn!.type!), true, false, false, enumDeclNode.range);

                let constructor = constructors.best;
                if (!constructor) {
                    this.pushError(JCM.cantFindConstructor(), "error", enumDeclNode);
                    continue;
                }

                callConstructorSnippet = this.invokeConstructor(parameterSnippets, constructor, javaEnum, valueNode, undefined, valueNode.identifier, enumValueIndex);
                callConstructorSnippet = new CodeSnippetContainer(callConstructorSnippet);
                (<CodeSnippetContainer>callConstructorSnippet).ensureFinalValueIsOnStack();
                (<CodeSnippetContainer>callConstructorSnippet).addNextStepMark();
            } else {
                callConstructorSnippet = new StringCodeSnippet(`new ${Helpers.classes}["${javaEnum.identifier}"]("${valueNode.identifier}", ${enumValueIndex})`);
            }

            let buildEnumValueSnippet = new OneParameterTemplate(`${Helpers.classes}["${javaEnum.identifier}"].values.push(${Helpers.classes}["${javaEnum.identifier}"]["${valueNode.identifier}"] = §1);\n`).applyToSnippet(javaEnum, valueNode.range, callConstructorSnippet);
            staticFieldSnippets.push(buildEnumValueSnippet);

            enumValueIndex++;
        }
    }



    buildInitializer(snippets: CodeSnippet[], identifier: string): Program {
        let program = new Program(this.module, this.currentSymbolTable, identifier);
        if(snippets.length > 0){
            snippets.push(new StringCodeSnippet(`${Helpers.return}();`));
        }
        this.linker.link(snippets, program);
        return program;
    }




    compileStaticInitializerBlock(node: ASTStaticInitializerNode): CodeSnippetContainer | undefined {

        this.missingStatementManager.beginMethodBody([]);
        let snippet = new CodeSnippetContainer([], node.range);
        for (let statementNode of node.statements) {
            let statementSnippet = this.compileStatementOrTerm(statementNode);
            if (statementSnippet) snippet.addParts(statementSnippet);
        }
        this.missingStatementManager.endMethodBody(undefined, this.module.errors);

        return snippet;
    }


}
