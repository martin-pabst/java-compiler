import { Program, Step } from "../../common/interpreter/Program";
import { Helpers, StepParams } from "../../common/interpreter/StepFunction.ts";
import { TokenType } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTClassDefinitionNode, ASTEnumDefinitionNode, ASTFieldDeclarationNode, ASTInstanceInitializerNode, ASTInterfaceDefinitionNode, ASTMethodDeclarationNode, ASTStaticInitializerNode, TypeScope } from "../parser/AST";
import { Field } from "../types/Field.ts";
import { IJavaClass, JavaClass } from "../types/JavaClass.ts";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";
import { CodeSnippetContainer } from "./CodeSnippetKinds.ts";
import { CodeTemplate, OneParameterTemplate } from "./CodeTemplate.ts";
import { JavaSymbolTable } from "./JavaSymbolTable";
import { SnippetLinker } from "./SnippetLinker";
import { StatementCodeGenerator } from "./StatementCodeGenerator";
import { type TypeResolver } from "../TypeResolver/TypeResolver.ts"; // only for jsDoc below
import { NonPrimitiveType } from "../types/NonPrimitiveType.ts";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType.ts";
import { Method } from "../types/Method.ts";
import { JavaEnum } from "../types/JavaEnum.ts";
import { JavaTypeWithInstanceInitializer } from "../types/JavaTypeWithInstanceInitializer.ts";
import { JavaInterface } from "../types/JavaInterface.ts";

export class CodeGenerator extends StatementCodeGenerator {

    linker: SnippetLinker;


    /*
     * These fields describe state of code generation:
     */
    callingOtherConstructorInSameClassHappened: boolean = false;    // only relevant while compiling constructor
    superConstructorHasBeenCalled: boolean = false;                 // only relevant while compiling constructor

    constructor(module: JavaCompiledModule, libraryTypestore: JavaTypeStore, compiledTypesTypestore: JavaTypeStore) {
        super(module, libraryTypestore, compiledTypesTypestore);
        this.linker = new SnippetLinker();
    }

    start() {
        this.compileClassesEnumsAndInterfaces(this.module.ast);
        this.compileMainProgram();
    }

    compileMainProgram() {
        let ast = this.module.ast!;
        this.currentSymbolTable = new JavaSymbolTable(this.module, ast.range, true);
        this.missingStatementManager.beginMethodBody([]);

        let snippets: CodeSnippet[] = [];

        for (let statement of ast.mainProgramNode.statements) {
            let snippet = this.compileStatementOrTerm(statement);
            if (snippet) snippets.push(snippet);
        }

        this.missingStatementManager.endMethodBody(undefined, this.module.errors);

        let endOfProgramSnippet = new CodeSnippetContainer(new StringCodeSnippet(`${Helpers.exit}();`, {startLineNumber: -1, startColumn: -1, endLineNumber: -1, endColumn: -1}));
        endOfProgramSnippet.enforceNewStepBeforeSnippet();

        snippets.push(endOfProgramSnippet);


        this.module.mainProgram = new Program(this.module, this.currentSymbolTable,
            "main program");
        this.linker.link(snippets, this.module.mainProgram);

        ast.program = this.module.mainProgram;  // only for debugging

    }

    compileClassesEnumsAndInterfaces(typeScope: TypeScope | undefined) {
        if (!typeScope) return;

        for (let cdef of typeScope.classOrInterfaceOrEnumDefinitions) {
            switch (cdef.kind) {
                case TokenType.keywordClass:
                    this.compileClassDeclaration(cdef);
                    break;
                case TokenType.keywordEnum:
                    this.compileEnumDeclaration(cdef);
                    break;
                case TokenType.keywordInterface:
                    this.compileInterfaceDeclaration(cdef);
                    break;
            }

            this.compileClassesEnumsAndInterfaces(cdef);
        }
    }

    compileClassDeclaration(cdef: ASTClassDefinitionNode) {
        let type = cdef.resolvedType;
        if (!type || !cdef.resolvedType) return;
        let classContext = <JavaClass>cdef.resolvedType;

        this.pushAndGetNewSymbolTable(cdef.range, false, classContext);

        // first step: static fields and static initializers
        this.compileStaticFieldsAndInitializerAndEnumValues(classContext, cdef);

        // second step: non-static fields and instance initializers
        this.compileInstanceFieldsAndInitializer(cdef, classContext);
        
        this.compileMethodsAndConstructors(cdef, classContext);

        this.popSymbolTable();

    }

    compileInterfaceDeclaration(cdef: ASTInterfaceDefinitionNode) {
        let type = cdef.resolvedType;
        if (!type || !cdef.resolvedType) return;
        let classContext = <JavaInterface>cdef.resolvedType;

        this.pushAndGetNewSymbolTable(cdef.range, false, classContext);

        // first step: static fields and static initializers
        this.compileStaticFieldsAndInitializerAndEnumValues(classContext, cdef);
        
        this.compileMethodsAndConstructors(cdef, classContext);

        this.popSymbolTable();

    }

    compileEnumDeclaration(cdef: ASTEnumDefinitionNode) {
        let type = cdef.resolvedType;
        if (!type || !cdef.resolvedType) return;
        let classContext = <JavaEnum>cdef.resolvedType;

        this.pushAndGetNewSymbolTable(cdef.range, false, classContext);

        // first step: static fields and static initializers
        this.compileStaticFieldsAndInitializerAndEnumValues(classContext, cdef);

        // second step: non-static fields and instance initializers
        this.compileInstanceFieldsAndInitializer(cdef, classContext);
        
        this.compileMethodsAndConstructors(cdef, classContext);

        this.popSymbolTable();

    }

    private compileMethodsAndConstructors(cdef: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode, classContext: JavaClass | JavaEnum | JavaInterface) {
        let constructorFound: boolean = false;
        for (let method of cdef.methods) {
            this.compileMethodDeclaration(method, classContext);
            if (method.isContructor){
                constructorFound = true;
                if(cdef.kind == TokenType.keywordEnum){
                    if(method.visibility != TokenType.keywordPrivate){
                        this.pushError("Konstruktoren von enums müssen die Sichtbarkeit private haben.", "error", method.range);
                    }
                }
            } 
        }

        if (!constructorFound && classContext instanceof JavaClass) this.buildStandardConstructors(classContext);
    }

    private compileInstanceFieldsAndInitializer(cdef: ASTClassDefinitionNode | ASTEnumDefinitionNode, classContext: JavaClass | JavaEnum) {
        let fieldSnippets: CodeSnippet[] = [];
        for (let fieldOrInitializer of cdef.fieldsOrInstanceInitializers) {

            switch (fieldOrInitializer.kind) {
                case TokenType.fieldDeclaration:
                    if (fieldOrInitializer.isStatic) continue;
                    let snippet = this.compileField(fieldOrInitializer, classContext);
                    if (snippet) {
                        fieldSnippets.push(snippet);
                    }
                    break;
                case TokenType.instanceInitializerBlock:
                    let snippet1 = this.compileInstanceInitializerBlock(fieldOrInitializer);
                    if (snippet1) {
                        fieldSnippets.push(snippet1);
                    }
                    break;
                default:
                    break;
            }

        }

        classContext.instanceInitializer = fieldSnippets;
    }

    private compileStaticFieldsAndInitializerAndEnumValues(classContext: JavaClass | JavaEnum | JavaInterface, cdef: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode) {
        let staticFieldSnippets: CodeSnippet[] = [];
        for (let fieldOrInitializer of cdef.fieldsOrInstanceInitializers) {

            switch (fieldOrInitializer.kind) {
                case TokenType.fieldDeclaration:
                    if (!fieldOrInitializer.isStatic) {
                        if(classContext instanceof JavaInterface){
                            this.pushError("Interfaces können nur statische Attribute besitzen.", "error", cdef);
                        }
                        continue;
                    } 
                    let snippet = this.compileField(fieldOrInitializer, classContext);
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

        if(cdef.kind == TokenType.keywordEnum){
            this.compileEnumValueConstruction(<JavaEnum>classContext, cdef, staticFieldSnippets);
        }

        classContext.staticInitializer = this.buildInitializer(staticFieldSnippets, "staticInitializer");
        cdef.staticInitializer = classContext.staticInitializer;
    }

    compileEnumValueConstruction(javaEnum: JavaEnum, enumDeclNode: ASTEnumDefinitionNode, staticFieldSnippets: CodeSnippet[]) {

        let parameterlessConstructor = javaEnum.methods.find(m => m.isConstructor && m.parameters.length == 0);

        let enumValueIndex: number = 0;
        for(let valueNode of enumDeclNode.valueNodes){
            
            // find suitable constructor and invoke it!
            let callConstructorSnippet: CodeSnippet;
            if(valueNode.parameterValues.length > 0 || parameterlessConstructor){

                let parameterSnippets = <CodeSnippet[]>valueNode.parameterValues.map(pv => this.compileTerm(pv));
                if(parameterSnippets.some(sn => (!sn || !sn.type))) continue; // if there had been an error when compiling parameter values

                let constructor = this.searchMethod(javaEnum.identifier, javaEnum, parameterSnippets.map(sn => sn!.type!), true, false, false);
                if(!constructor){
                    this.pushError("Es konnte kein passender Konstruktor gefunden werden ", "error", enumDeclNode);
                    continue;
                }

                callConstructorSnippet = this.invokeConstructor(parameterSnippets, constructor, javaEnum, valueNode, valueNode.identifier, enumValueIndex);
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

    /**
     * if a class has no explicitly declared constructor then foreach constructor of it's base class build
     * a constructor with same signature 
     */
    buildStandardConstructors(classContext: JavaClass) {

        let baseClass: IJavaClass = classContext;
        while (!baseClass.getMethods().find(m => m.isConstructor && m.visibility != TokenType.keywordPrivate)) baseClass = baseClass.getExtends()!;
        // TypeResolver enforces base class to be at least Object
        for (let baseConstructor of baseClass.getMethods().filter(m => m.isConstructor && m.visibility != TokenType.keywordPrivate)) {

            let method = baseConstructor.getCopy();

            classContext.methods.push(method);

            if (classContext.instanceInitializer?.length == 0) {
                method.hasImplementationWithNativeCallingConvention = baseConstructor.hasImplementationWithNativeCallingConvention;
                return; // unaltered implementation of base class constructor suffices for child class
            }

            method.identifier = classContext.identifier;
            method.hasImplementationWithNativeCallingConvention = false;

            let parametersForSuperCall = baseConstructor.parameters.map(p => `${StepParams.stack}[${p.stackframePosition}]`).join(", ");

            if (!baseConstructor.hasImplementationWithNativeCallingConvention) {
                parametersForSuperCall = StepParams.thread + (parametersForSuperCall.length == 0 ? "" : ", ") + parametersForSuperCall;
            }

            if (parametersForSuperCall.length > 0) parametersForSuperCall = ", " + parametersForSuperCall;

            let steps = classContext.instanceInitializer.slice();
            let getBaseClass: string = `let obj = ${StepParams.stack}[${StepParams.stackBase}];\nlet baseKlass = Object.getPrototypeOf(Object.getPrototypeOf(obj));\n`
            let superCall: string = `baseKlass.${baseConstructor.getInternalName(baseConstructor.hasImplementationWithNativeCallingConvention ? "native" : "java")}.call(obj${parametersForSuperCall});\n`;
            let returnCall: string = `${Helpers.return}(${StepParams.stack}[${StepParams.stackBase}]);\n`;

            steps.push(new StringCodeSnippet(getBaseClass + superCall));
            let returnSnippet = new CodeSnippetContainer(new StringCodeSnippet(returnCall));
            returnSnippet.enforceNewStepBeforeSnippet();
            steps.push(returnSnippet);

            method.program = new Program(this.module, this.currentSymbolTable, classContext.identifier + method.identifier);
            method.program.numberOfThisObjects = 1;
            this.linker.link(steps, method.program);

            method.program.compileToJavascriptFunctions();

            let runtimeClass = classContext.runtimeClass;

            if (runtimeClass) {

                runtimeClass.__programs.push(method.program);
                let methodIndex = runtimeClass.__programs.length - 1;

                let parameterIdentifiers = method.parameters.map(p => p.identifier);
                let thisFollowedByParameterIdentifiers = ["this"].concat(parameterIdentifiers);

                runtimeClass.prototype[method.getInternalName("java")] = new Function(StepParams.thread, ...parameterIdentifiers,
                    `${Helpers.threadStack}.push(${thisFollowedByParameterIdentifiers.join(", ")});
                                 ${Helpers.pushProgram}(this.constructor.__programs[${methodIndex}]);`);

            }

        }

    }


    buildInitializer(snippets: CodeSnippet[], identifier: string): Program {
        let program = new Program(this.module, this.currentSymbolTable, identifier);
        snippets.push(new StringCodeSnippet(`${Helpers.return}();`));
        this.linker.link(snippets, program);
        return program;
    }


    /**
     * All fields inside types are already built by TypeResolver
     * @see TypeResolver#buildRuntimeClassesAndTheirFields
     * @returns 
     */
    compileField(fieldNode: ASTFieldDeclarationNode, classContext: JavaClass | JavaEnum | JavaInterface): CodeSnippet | undefined {

        if (!fieldNode.type.resolvedType) return undefined;

        let field = classContext.fields.find(f => f.identifier == fieldNode.identifier);
        if (!field) return undefined;

        this.currentSymbolTable.addSymbol(field);

        field.initialValue = field.type instanceof PrimitiveType ? field.type.getDefaultValue() : null;

        if(classContext instanceof JavaInterface){
            if(!fieldNode.isStatic || !fieldNode.isFinal){
                this.pushError("Attribute von Interfaces müssen static und final sein.", "error", fieldNode);
            }
        }

        if (fieldNode.isStatic) {

            this.classOfCurrentlyCompiledStaticInitialization = classContext;
            let snippet = this.compileTerm(fieldNode.initialization);
            this.classOfCurrentlyCompiledStaticInitialization = undefined;


            if (snippet) {

                snippet = this.compileCast(snippet, field.type, "implicit");

                if (snippet.isConstant()) {
                    field.initialValue = snippet.getConstantValue();
                    field.initialValueIsConstant = true;
                }

                let assignmentTemplate = `${Helpers.classes}.${classContext.identifier}.${field.getInternalName()} = §1;\n`;

                snippet = new OneParameterTemplate(assignmentTemplate).applyToSnippet(field.type, fieldNode.initialization!.range, snippet);

                snippet = new CodeSnippetContainer(snippet);
                (<CodeSnippetContainer>snippet).addNextStepMark();

            } else {
                field.initialValueIsConstant = true;
                let initialValueAsString = field.type instanceof PrimitiveType ? field.type.defaultValueAsString : "null";
                snippet = new StringCodeSnippet(`${Helpers.classes}.${classContext.identifier}.${field.getInternalName()} = ${initialValueAsString};\n`);
            }

            if (classContext.runtimeClass) {
                classContext.runtimeClass[field.getInternalName()] = field.initialValue;
            }

            return snippet;
        } else {
            let snippet = this.compileTerm(fieldNode.initialization);
            if (snippet) {

                snippet = this.compileCast(snippet, field.type, "implicit");

                if (snippet.isConstant()) {
                    field.initialValue = snippet.getConstantValue();
                    field.initialValueIsConstant = true;
                    snippet = undefined;
                } else {
                    let assignmentTemplate = `${StepParams.stack}[${StepParams.stackBase}].${field.getInternalName()} = §1;\n`;

                    snippet = new OneParameterTemplate(assignmentTemplate).applyToSnippet(field.type, fieldNode.initialization!.range, snippet);

                    snippet = new CodeSnippetContainer(snippet);
                    (<CodeSnippetContainer>snippet).addNextStepMark();
                }

            } else {
                field.initialValueIsConstant = true;
            }

            if (classContext.runtimeClass) {
                classContext.runtimeClass.prototype[field.getInternalName()] = field.initialValue;
            }

            return snippet;
        }

    }

    compileMethodDeclaration(methodNode: ASTMethodDeclarationNode, classContext: JavaClass | JavaEnum | JavaInterface) {

        let method = methodNode.method;
        if (!method) return;

        
        if (methodNode.isContructor) {
            this.callingOtherConstructorInSameClassHappened = false;
            this.superConstructorHasBeenCalled = false;
        }
        
        let symbolTable = this.pushAndGetNewSymbolTable(methodNode.range, true, classContext, method);
        
        for (let parameter of method.parameters) {
            this.currentSymbolTable.addSymbol(parameter);
        }
        
        
        let snippets: CodeSnippet[] = [];
        
        if (method.isConstructor) {
            
            if(classContext instanceof JavaInterface){
                this.pushError("Interfaces haben keinen Konstruktor.", "error", methodNode);
                return undefined;
            }
            
            if (!this.callingOtherConstructorInSameClassHappened && classContext.instanceInitializer.length > 0) {
                snippets = snippets.concat(classContext.instanceInitializer);
            }
            
            if (!this.superConstructorHasBeenCalled) {
                // TODO: insert call to default super constructor
            }
            
        }
        
        if(methodNode.statement){

            if(method.isAbstract) this.pushError("Eine abstrakte Methode kann keinen Methodenrumpf besitzen.", "error", methodNode);
            if(classContext instanceof JavaInterface && !(method.isAbstract || method.isDefault)) this.pushError("In Interfaces können nur default-Methoden und abstrakte Methoden einen Methodenrumpf haben.", "error", methodNode);

            this.missingStatementManager.beginMethodBody(method.parameters);
            
            let snippet = methodNode.statement ? this.compileStatementOrTerm(methodNode.statement) : undefined;
            if (snippet) snippets.push(snippet);
            
            if (methodNode.isContructor) {
                snippets.push(new StringCodeSnippet(`${Helpers.return}(${StepParams.stack}[0]);\n`))
            }
    
            method.program = new Program(this.module, symbolTable, classContext.identifier + method.identifier);
    
            if (!this.missingStatementManager.hasReturnHappened() && !methodNode.isContructor) {
                snippets.push(new StringCodeSnippet(`${Helpers.return}();`));
            }
    
            this.missingStatementManager.endMethodBody(method, this.module.errors);
    
            this.linker.link(snippets, method.program);
    
            methodNode.program = method.program;    // only for debugging purposes
    
            let runtimeClass = classContext.runtimeClass;
    
            if (runtimeClass) {
                runtimeClass.__programs.push(method.program);
                method.program.compileToJavascriptFunctions();

                method.callbackAfterCodeGeneration.forEach(callback => callback());

                let methodIndex = runtimeClass.__programs.length - 1;
    
                let parameterIdentifiers = method.parameters.map(p => p.identifier);
                let thisFollowedByParameterIdentifiers = ["this"].concat(parameterIdentifiers);
    
                if (method.isStatic) {
                    method.programStub =
                        `${Helpers.threadStack}.push(${thisFollowedByParameterIdentifiers.join(", ")});\n` +
                        `${Helpers.pushProgram}(this.__programs[${methodIndex}]);`;
                } else {
                    method.programStub =
                        `${Helpers.threadStack}.push(${thisFollowedByParameterIdentifiers.join(", ")});\n` +
                        `${Helpers.pushProgram}(this.constructor.__programs[${methodIndex}]);`;
                }
                runtimeClass.prototype[method.getInternalName("java")] = new Function(StepParams.thread, ...parameterIdentifiers,
                    method.programStub);
            }
        }

        this.popSymbolTable();

    }


    compileInstanceInitializerBlock(node: ASTInstanceInitializerNode): CodeSnippetContainer | undefined {

        this.missingStatementManager.beginMethodBody([]);

        let snippet = new CodeSnippetContainer([], node.range);
        for (let statementNode of node.statements) {
            let statementSnippet = this.compileStatementOrTerm(statementNode);
            if (statementSnippet) snippet.addParts(statementSnippet);
        }

        this.missingStatementManager.endMethodBody(undefined, this.module.errors);

        return snippet;
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