import { Program } from "../../common/interpreter/Program";
import { CallbackFunction, Helpers, StepParams } from "../../common/interpreter/StepFunction.ts";
import { Thread } from "../../common/interpreter/Thread.ts";
import { EmptyRange } from "../../common/range/Range.ts";
import { JCM } from "../JavaCompilerMessages.ts";
import { TokenType } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTAnonymousClassNode, ASTBlockNode, ASTClassDefinitionNode, ASTEnumDefinitionNode, ASTFieldDeclarationNode, ASTInstanceInitializerNode, ASTInterfaceDefinitionNode, ASTLambdaFunctionDeclarationNode, ASTMethodCallNode, ASTMethodDeclarationNode, ASTStatementNode, ASTStaticInitializerNode, TypeScope } from "../parser/AST";
import { ObjectClass } from "../runtime/system/javalang/ObjectClassStringClass.ts";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType.ts";
import { Field } from "../types/Field.ts";
import { GenericTypeParameter } from "../types/GenericTypeParameter.ts";
import { IJavaClass, JavaClass } from "../types/JavaClass.ts";
import { JavaEnum } from "../types/JavaEnum.ts";
import { IJavaInterface, JavaInterface } from "../types/JavaInterface.ts";
import { JavaType } from "../types/JavaType.ts";
import { StaticNonPrimitiveType } from "../types/StaticNonPrimitiveType.ts";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";
import { CodeSnippetContainer } from "./CodeSnippetKinds.ts";
import { OneParameterTemplate } from "./CodeTemplate.ts";
import { ExceptionTree } from "./ExceptionTree.ts";
import { MissingStatementManager } from "./MissingStatementsManager.ts";
import { SnippetLinker } from "./SnippetLinker";
import { StatementCodeGenerator } from "./StatementCodeGenerator";

export class CodeGenerator extends StatementCodeGenerator {

    linker: SnippetLinker;



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

        for (let cdef of typeScope.classOrInterfaceOrEnumDefinitions) {
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

        for (let cdef of typeScope.classOrInterfaceOrEnumDefinitions) {
            if (cdef.isAnonymousInnerType) continue;     // anonymous inner class

            let type = cdef.resolvedType;
            if (!type || !cdef.resolvedType) return;

            if (cdef.symbolTable) {
                this.pushSymbolTable(cdef.symbolTable);
            } else {
                cdef.symbolTable = this.pushAndGetNewSymbolTable(cdef.range, false, type);
            }

            this.compileStaticFieldsAndInitializerAndEnumValues(type, cdef);

            this.compileStaticFieldsAndInitializerAndEnumValuesRecursive(cdef);

            this.popSymbolTable();
        }
    }


    compileMethodsRecursively(typeScope: TypeScope | undefined) {
        if (!typeScope) return;

        for (let cdef of typeScope.classOrInterfaceOrEnumDefinitions) {
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

    private compileMethods(cdef: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode, classContext: JavaClass | JavaEnum | JavaInterface) {
        let constructorFound: boolean = false;
        for (let method of cdef.methods) {
            this.compileMethodDeclaration(method, classContext);
            if (method.isContructor) {
                constructorFound = true;
                if (cdef.kind == TokenType.keywordEnum) {
                    if (method.visibility != TokenType.keywordPrivate) {
                        this.pushError(JCM.enumConstructorsMustBePrivate(), "error", method.range);
                    }
                }
            }
        }
    }

    private compileInstanceFieldsAndInitializer(cdef: ASTClassDefinitionNode | ASTEnumDefinitionNode, classContext: JavaClass | JavaEnum) {
        let fieldSnippets: CodeSnippet[] = [];
        for (let fieldOrInitializer of cdef.fieldsOrInstanceInitializers) {

            switch (fieldOrInitializer.kind) {
                case TokenType.fieldDeclaration:
                    if (fieldOrInitializer.isStatic) continue;
                    let snippet = this.compileFieldDeclaration(fieldOrInitializer, classContext);
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

        if (cdef.kind == TokenType.keywordEnum) {
            this.compileEnumValueConstruction(<JavaEnum>classContext, cdef, staticFieldSnippets);
        }

        classContext.staticInitializer = this.buildInitializer(staticFieldSnippets, "staticInitializer");
        cdef.staticInitializer = classContext.staticInitializer;
    }

    compileEnumValueConstruction(javaEnum: JavaEnum, enumDeclNode: ASTEnumDefinitionNode, staticFieldSnippets: CodeSnippet[]) {

        let parameterlessConstructor = javaEnum.methods.find(m => m.isConstructor && m.parameters.length == 0);

        let enumValueIndex: number = 0;
        for (let valueNode of enumDeclNode.valueNodes) {

            // find suitable constructor and invoke it!
            let callConstructorSnippet: CodeSnippet;
            if (valueNode.parameterValues.length > 0 || parameterlessConstructor) {

                let parameterSnippets = <CodeSnippet[]>valueNode.parameterValues.map(pv => this.compileTerm(pv));
                if (parameterSnippets.some(sn => (!sn || !sn.type))) continue; // if there had been an error when compiling parameter values

                let constructor = this.searchMethod(javaEnum.identifier, javaEnum, parameterSnippets.map(sn => sn!.type!), true, false, false, enumDeclNode.range);
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

    /**
     * if a class has no explicitly declared constructor then foreach constructor of it's base class build
     * a constructor with same signature 
     */
    buildStandardConstructors(classContext: JavaClass) {
        if(classContext.methods.some(m => m.isConstructor)) return;

        let baseClass: IJavaClass = classContext;
        while (!baseClass.getOwnMethods().find(m => m.isConstructor && m.visibility != TokenType.keywordPrivate)) baseClass = baseClass.getExtends()!;
        // TypeResolver enforces base class to be at least Object
        for (let baseConstructor of baseClass.getOwnMethods().filter(m => m.isConstructor && m.visibility != TokenType.keywordPrivate)) {

            let method = baseConstructor.getCopy();
            if (classContext.outerType && !classContext.isStatic) {
                method.hasOuterClassParameter = true;
            }

            classContext.methods.push(method);

            if (classContext.instanceInitializer?.length == 0 && !method.hasOuterClassParameter) {
                method.hasImplementationWithNativeCallingConvention = baseConstructor.hasImplementationWithNativeCallingConvention;
                return; // unaltered implementation of base class constructor suffices for child class
            }

            // let's build a new method!
            let symbolTable = this.pushAndGetNewSymbolTable(EmptyRange.instance, true, classContext, method);

            method.identifier = classContext.identifier;
            method.hasImplementationWithNativeCallingConvention = false;

            let parametersForSuperCall = baseConstructor.parameters.map(p => `${StepParams.stack}[${p.stackframePosition}]`).join(", ");

            if (!baseConstructor.hasImplementationWithNativeCallingConvention) {
                parametersForSuperCall = StepParams.thread + (parametersForSuperCall.length == 0 ? "" : ", ") + parametersForSuperCall;
            }

            if (parametersForSuperCall.length > 0) parametersForSuperCall = ", " + parametersForSuperCall;

            let steps = classContext.instanceInitializer.slice();

            if (method.hasOuterClassParameter) {
                let storeOuterClassReferenceSnippet = new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}.${Helpers.outerClassAttributeIdentifier} = ${Helpers.elementRelativeToStackbase(1)};\n`);
                steps.unshift(storeOuterClassReferenceSnippet);
            }

            let getBaseClass: string = `let obj = ${Helpers.elementRelativeToStackbase(0)};\nlet baseKlass = Object.getPrototypeOf(Object.getPrototypeOf(obj));\n`
            let superCall: string = `baseKlass.${baseConstructor.getInternalName(baseConstructor.hasImplementationWithNativeCallingConvention ? "native" : "java")}.call(obj${parametersForSuperCall});\n`;
            let returnCall: string = `${Helpers.return}(${Helpers.elementRelativeToStackbase(0)});\n`;

            steps.push(new StringCodeSnippet(getBaseClass + superCall));
            let returnSnippet = new CodeSnippetContainer(new StringCodeSnippet(returnCall));
            returnSnippet.enforceNewStepBeforeSnippet();
            steps.push(returnSnippet);

            let parameterIdentifiers = method.parameters.map(p => p.identifier);
            if (method.hasOuterClassParameter) {
                parameterIdentifiers.unshift(Helpers.outerClassAttributeIdentifier);
            }
            let thisFollowedByParameterIdentifiers = ["this"].concat(parameterIdentifiers);

            method.program = new Program(this.module, symbolTable, classContext.identifier + method.identifier);
            method.program.numberOfThisObjects = 1;
            method.program.numberOfParameters = parameterIdentifiers.length;

            this.linker.link(steps, method.program);

            let runtimeClass = classContext.runtimeClass;

            if (runtimeClass) {

                // runtimeClass.__programs.push(method.program);
                // let methodIndex = runtimeClass.__programs.length - 1;


                // runtimeClass.prototype[method.getInternalName("java")] = new Function(StepParams.thread, ...parameterIdentifiers,
                //     `${Helpers.threadStack}.push(${thisFollowedByParameterIdentifiers.join(", ")});` + 
                //                  `${Helpers.pushProgram}(this.constructor.__programs[${methodIndex}]);`);


                let functionStub = function (this: any, __t: Thread, ...parameters: any) {
                    __t.s.push(this, ...parameters);
                    __t.pushProgram(method!.program!);
                }

                runtimeClass.prototype[method.getInternalName("java")] = functionStub;

            }

            this.popSymbolTable();
        }

    }


    buildInitializer(snippets: CodeSnippet[], identifier: string): Program {
        let program = new Program(this.module, this.currentSymbolTable, identifier);
        snippets.push(new StringCodeSnippet(`${Helpers.return}();`));
        this.linker.link(snippets, program);
        return program;
    }


    /**
     * All fields inside types are already built by TypeResolver. 
     * This method handles field initialization and adds all fields to the
     * symbol table.
     * @see TypeResolver#buildRuntimeClassesAndTheirFields
     * @returns 
     */
    compileFieldDeclaration(fieldNode: ASTFieldDeclarationNode, classContext: JavaClass | JavaEnum | JavaInterface): CodeSnippet | undefined {

        if (!fieldNode.type.resolvedType) return undefined;

        let field = classContext.fields.find(f => f.identifier == fieldNode.identifier);
        if (!field) return undefined;

        // this.currentSymbolTable.addSymbol(field);

        field.initialValue = field.type instanceof PrimitiveType ? field.type.getDefaultValue() : null;

        if (classContext instanceof JavaInterface) {
            if (!fieldNode.isStatic || !fieldNode.isFinal) {
                this.pushError(JCM.interfaceFieldsMustBeStatic(), "error", fieldNode);
            }
        }

        if (fieldNode.isStatic) {

            this.classOfCurrentlyCompiledStaticInitialization = classContext;
            let snippet = this.compileInitialValue(fieldNode.initialization, fieldNode.type.resolvedType);
            this.classOfCurrentlyCompiledStaticInitialization = undefined;


            if (snippet) {

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

            let snippet = this.compileInitialValue(fieldNode.initialization, fieldNode.type.resolvedType);
            if (snippet) {

                if (snippet.isConstant()) {
                    field.initialValue = snippet.getConstantValue();
                    field.initialValueIsConstant = true;
                    snippet = undefined;
                } else {
                    let assignmentTemplate = `${Helpers.elementRelativeToStackbase(0)}.${field.getInternalName()} = §1;\n`;

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

    compileMethodDeclaration(methodNode: ASTMethodDeclarationNode, classContext: JavaClass | JavaEnum | JavaInterface ) {

        const method = methodNode.method;
        if (!method) return;


        if (methodNode.isContructor) {
            if (classContext.outerType && !classContext.isStatic) {
                method.hasOuterClassParameter = true;
            }
        }

        let symbolTable = this.pushAndGetNewSymbolTable(methodNode.range, true, method.isStatic ? new StaticNonPrimitiveType(classContext) : classContext, method);

        if (method.hasOuterClassParameter) {
            this.currentSymbolTable.insertInvisibleParameter(); // make room for __outer-Parameter
        }

        for (let parameter of method.parameters) {
            this.currentSymbolTable.addSymbol(parameter);
        }


        let snippets: CodeSnippet[] = [];

        let thisCallHappened: boolean = false;
        let superCallHappened: boolean = false;

        if (method.isConstructor) {

            if (classContext instanceof JavaInterface) {
                this.pushError(JCM.interfacesDontHaveConstructors(), "error", methodNode);
                this.popSymbolTable();
                return undefined;
            }

            [thisCallHappened, superCallHappened] = this.checkIfSuperconstructorCallPresent(methodNode.statement);

            if (!thisCallHappened && classContext.instanceInitializer.length > 0) {
                snippets = snippets.concat(classContext.instanceInitializer);
            }

            if (method.hasOuterClassParameter) {
                let storeOuterClassReferenceSnippet = new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}.${Helpers.outerClassAttributeIdentifier} = ${Helpers.elementRelativeToStackbase(1)};\n`);
                snippets.push(storeOuterClassReferenceSnippet);
            }

        }

        if (methodNode.statement) {
            if (method.isAbstract) this.pushError(JCM.abstractMethodsDontHaveMethodBodies(), "error", methodNode);
            if (classContext instanceof JavaInterface && !(method.isAbstract || method.isDefault)) this.pushError(JCM.interfaceOnlyDefaultMethodsHaveBody(), "error", methodNode);

            let msm = this.missingStatementManager;
            this.missingStatementManager = new MissingStatementManager();
            this.missingStatementManager.beginMethodBody(method.parameters);

            let snippet = methodNode.statement ? this.compileStatementOrTerm(methodNode.statement) : undefined;
            if (snippet) snippets.push(snippet);

            if (methodNode.isContructor) {
                snippets.push(new StringCodeSnippet(`${Helpers.return}(${Helpers.elementRelativeToStackbase(0)});\n`))

                if (!(thisCallHappened || superCallHappened)) {
                    // Has base class a parameterless super constructor?
                    let baseClass = classContext.getExtends();
                    if (baseClass instanceof IJavaClass) {
                        let parameterlessConstructors = baseClass.getPossibleMethods(baseClass.identifier, 0, true, false);
                        if (parameterlessConstructors.length == 0) {
                            this.pushError(JCM.superCallInConstructorMissing(baseClass.identifier), "error", methodNode.identifierRange);
                        } else {
                            let parameterlessConstructor = parameterlessConstructors[0];
                            if (parameterlessConstructor.hasImplementationWithNativeCallingConvention) {
                                let superConstructorCall = new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}.${parameterlessConstructor.getInternalName("native")}();\n`);
                                snippets.unshift(superConstructorCall);
                            } else {
                                let superConstructorCall = new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}.${parameterlessConstructor.getInternalName("java")}(${StepParams.thread}, undefined);\n`);
                                snippets.unshift(superConstructorCall);
                            }
                        }
                    }
                }

            }

            
            method.program = new Program(this.module, symbolTable, classContext.identifier + method.identifier);
            
            if(method.isSynchronized){
                snippets.unshift(new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}.${ObjectClass.prototype.enterSynchronizedBlock.name}(${StepParams.thread});\n`));

                let beforeEnteringSynchronizedBlockStatement = new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}.${ObjectClass.prototype.beforeEnteringSynchronizedBlock.name}(${StepParams.thread});\n`);
                let sn = new CodeSnippetContainer([beforeEnteringSynchronizedBlockStatement]);
                sn.addNextStepMark();
                snippets.unshift(sn);

            }

            if (!this.missingStatementManager.hasReturnHappened() && !methodNode.isContructor) {
                if(method.isSynchronized){
                    snippets.push(new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}.${ObjectClass.prototype.leaveSynchronizedBlock.name}(${StepParams.thread});\n`));
                }
                snippets.push(new StringCodeSnippet(`${Helpers.return}();`));
            }

            this.missingStatementManager.endMethodBody(method, this.module.errors);
            this.missingStatementManager = msm;

            this.linker.link(snippets, method.program);

            methodNode.program = method.program;    // only for debugging purposes

            let runtimeClass = classContext.runtimeClass;

            if (runtimeClass) {
                method.callbackAfterCodeGeneration.forEach(callback => callback());

                let functionStub: Function;
                if (method.isStatic) {
                    functionStub = function (this: any, __t: Thread, ...parameters: any) {
                        __t.s.push(this, ...parameters);
                        __t.pushProgram(method!.program!);
                    }
                    runtimeClass[method.getInternalNameWithGenericParameterIdentifiers("java")] = functionStub;
                } else {
                    functionStub = function (this: any, __t: Thread, __callback: CallbackFunction, ...parameters: any) {
                        __t.s.push(this, ...parameters);
                        __t.pushProgram(method!.program!, __callback);
                    }
                    runtimeClass.prototype[method.getInternalNameWithGenericParameterIdentifiers("java")] = functionStub;
                }

            }
        }


        this.popSymbolTable();

    }

    checkIfSuperconstructorCallPresent(statement: ASTStatementNode | undefined): [boolean, boolean] {
        if (!statement) return [false, false];
        if (statement.kind = TokenType.block) {
            let blockstatement = <ASTBlockNode>statement;
            if (blockstatement.statements.length > 0) {
                statement = blockstatement.statements[0];
            } else {
                return [false, false];
            }
        }
        //@ts-ignore
        if (!statement.kind == TokenType.methodCall) return [false, false];

        let methodCall = <ASTMethodCallNode>statement;

        let objectKind = methodCall.nodeToGetObject?.kind;
        if (!objectKind) return [false, false];

        if (objectKind == TokenType.keywordThis) return [true, false];
        if (objectKind == TokenType.keywordSuper) return [false, true];

        return [false, false];
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

    /**
 * 
 *  Compiles expressions like new MyAbstractClass(p1, p2){ attributeDeclarations, instanceInitializers, methodDeclarations }
 * 
 * @param node 
 */
    compileAnonymousInnerClass(node: ASTAnonymousClassNode): CodeSnippet | undefined {

        // let outerClass = this.currentSymbolTable.classContext;
        let klass = node.klass.resolvedType!;
        // let klass = new JavaClass("", node.newObjectNode.range, "", this.module);
        // klass.outerType = outerClass;
        // klass.setExtends(this.objectType);

        // node.klass.resolvedType = klass;

        // setup provisionally version of runtime class to collect programs: 
        klass.runtimeClass = class {

        };  //

        let oldClass = klass.runtimeClass;
        // oldClass.__programs = [];

        // let type = node.newObjectNode.type.resolvedType;
        // if (type instanceof IJavaInterface) {
        //     node.klass.implements.push(node.newObjectNode.type);
        //     klass.addImplements(type);
        // } else if (type instanceof IJavaClass) {
        //     node.klass.extends = node.newObjectNode.type;
        //     klass.setExtends(type);
        // } else {
        //     this.pushError("Anonyme innere Klassen können nur auf Grundlage von Interfaces oder von Klassen erstellt werden.", "error", node.newObjectNode.range);
        // }

        // klass.methods = node.klass.methods.map(m => m.method!);

        // node.klass.fieldsOrInstanceInitializers.filter(fieldNode => fieldNode.kind == TokenType.fieldDeclaration).forEach(fn => {
        //     let field: ASTFieldDeclarationNode = <any>fn;
        //     let f: Field = new Field(field.identifier, field.range, klass.module, field.type.resolvedType!, field.visibility);
        //     f.isStatic = field.isStatic;
        //     f.isFinal = field.isFinal;
        //     f.classEnum = klass;
        //     klass.fields.push(f);
        // });

        node.newObjectNode.type.resolvedType = klass;

        this.compileInstanceFieldsAndInitializer(node.klass, klass);
        this.buildStandardConstructors(klass);
        this.compileMethods(node.klass, klass);



        let outerLocalVariables = klass.fields.filter(f => f.isInnerClassCopyOfOuterClassLocalVariable).map(f => f.isInnerClassCopyOfOuterClassLocalVariable);
        let invisibleFieldIdentifiers = klass.fields.filter(f => f.isInnerClassCopyOfOuterClassLocalVariable).map(f => f.getInternalName());

        // final version of runtime class:
        klass.runtimeClass = class extends klass.getExtends()?.runtimeClass!{

            constructor(...args: any) {
                super();
                for (let i = 0; i < invisibleFieldIdentifiers.length; i++) {
                    this[invisibleFieldIdentifiers[i]] = args[i];
                }
            }

        };  //

        Object.assign(klass.runtimeClass, oldClass);
        Object.assign(klass.runtimeClass.prototype, oldClass.prototype);
        // snippet which instantiates object of this class calling it's typescript constructor and it's java constructor

        // klass.checkIfInterfacesAreImplementedAndSupplementDefaultMethods({});
        // klass.takeSignaturesFromOverriddenMethods({});
        // klass.checkIfAbstractParentsAreImplemented();

        let template = `new this.innerClass(${outerLocalVariables.map(v => Helpers.elementRelativeToStackbase(v!.stackframePosition!)).join(", ")})`;
        let newClassSnippet = new StringCodeSnippet(template, node.range, klass);
        newClassSnippet.addEmitToStepListener((step) => {
            step.innerClass = klass.runtimeClass;
        });

        let snippet = this.compileNewObjectNode(node.newObjectNode, newClassSnippet);

        return snippet;
    }

    compileLambdaFunction(node: ASTLambdaFunctionDeclarationNode, expectedType: JavaType | undefined): CodeSnippet | undefined {
        if (!node || !expectedType) return undefined;

        if (!this.isFunctionalInterface(expectedType)) {
            this.pushError(JCM.lambdaFunctionHereNotPossible(), "error", node.range);
            return undefined;
        }

        if (!node.statement) return undefined;

        let functionalInterface = <IJavaInterface>expectedType;
        let methodToImplement = functionalInterface.getOwnMethods().find(m => !m.isDefault)!;

        if (node.parameters.length != methodToImplement.parameters.length) {
            this.pushError(JCM.lambdaFunctionWrongParameterCount(node.parameters.length, methodToImplement.parameters.length, functionalInterface.identifier), "error", node.range);
            return;
        }

        let methodToImplementParameterTypes: JavaType[] = methodToImplement.parameters.map(p => {
            if (p.type instanceof GenericTypeParameter) {
                if (p.type.lowerBound) return p.type.lowerBound;
                return p.type;
            } else {
                return p.type;
            }
        })

        for (let i = 0; i < node.parameters.length; i++) {
            let lambdaParameter = node.parameters[i];
            let fiParameterType = methodToImplementParameterTypes[i];
            if (lambdaParameter.type && lambdaParameter.type.resolvedType) {
                if (!this.canCastTo(fiParameterType, lambdaParameter.type.resolvedType, "implicit")) {
                    this.pushError(JCM.lambdaFunctionWrongParameterType(lambdaParameter.identifier, fiParameterType.toString()), "error", lambdaParameter.range);
                }
            }
        }

        let method = methodToImplement.getCopy();
        for (let i = 0; i < method.parameters.length; i++) {
            method.parameters[i].identifier = node.parameters[i].identifier;
            method.parameters[i].type = methodToImplementParameterTypes[i];
        }
        method.takeInternalJavaNameWithGenericParamterIdentifiersFrom(methodToImplement);

        //@ts-ignore    (fake methodNode to use compileMethodDeclaration later)
        let methodNode: ASTMethodDeclarationNode = {
            range: node.range,
            statement: node.statement,
            isContructor: false,
            identifier: method.identifier,
            method: method,
            program: undefined
        }

        // build class...
        //
        let outerClass = this.currentSymbolTable.classContext!;
        let klass = new JavaClass("", node.range, "", this.module);
        klass.outerType = outerClass;
        klass.setExtends(this.objectType);

        // setup provisionally version of runtime class to collect programs: 
        klass.runtimeClass = class {

        };  //

        let oldClass = klass.runtimeClass;
        // oldClass.__programs = [];
        klass.addImplements(functionalInterface);

        klass.methods = [method];

        this.outerClassFieldAccessTracker.startTracking();

        this.compileMethodDeclaration(methodNode, klass);

        let outerClassFieldAccessHappened = this.outerClassFieldAccessTracker.hasAccessHappened();

        klass.checkIfInterfacesAreImplementedAndSupplementDefaultMethods();

        let outerLocalVariables = klass.fields.filter(f => f.isInnerClassCopyOfOuterClassLocalVariable).map(f => f.isInnerClassCopyOfOuterClassLocalVariable);
        outerLocalVariables.forEach(v => this.missingStatementManager.onSymbolRead(v!, v!.getLastUsagePosition(), this.module.errors));
        let invisibleFieldIdentifiers = klass.fields.filter(f => f.isInnerClassCopyOfOuterClassLocalVariable).map(f => f.getInternalName());

        // final version of runtime class:
        klass.runtimeClass = class extends klass.getExtends()?.runtimeClass!{

            constructor(__outer__: any, ...args: any) {
                super();
                this[Helpers.outerClassAttributeIdentifier] = __outer__;
                for (let i = 0; i < invisibleFieldIdentifiers.length; i++) {
                    this[invisibleFieldIdentifiers[i]] = args[i];
                }
            }

        };  //

        Object.assign(klass.runtimeClass, oldClass);
        Object.assign(klass.runtimeClass.prototype, oldClass.prototype);
        // snippet which instantiates object of this class calling it's typescript constructor and it's java constructor

        let parameterString = Helpers.elementRelativeToStackbase(0);
        if (outerLocalVariables.length > 0) {
            parameterString += ", " + outerLocalVariables.map(v => Helpers.elementRelativeToStackbase(v!.stackframePosition!)).join(", ");
        }

        let instantiationAtRuntimeNeeded = outerClassFieldAccessHappened || outerLocalVariables.length > 0;

        let template = instantiationAtRuntimeNeeded ? `new this.innerClass(${parameterString})` : `this.lambdaObject`;
        let newClassSnippet = new StringCodeSnippet(template, node.range, klass);
        newClassSnippet.addEmitToStepListener((step) => {
            if (instantiationAtRuntimeNeeded) {
                step.innerClass = klass.runtimeClass;
            } else {
                step.lambdaObject = new klass.runtimeClass!(null);
            }
        });

        return newClassSnippet;
    }

    isFunctionalInterface(type: JavaType | undefined) {
        if (!type) return false;
        if (!(type instanceof IJavaInterface)) return false;
        if (type.getOwnMethods().filter(m => !m.isDefault).length != 1) return false;
        return true;
    }

}