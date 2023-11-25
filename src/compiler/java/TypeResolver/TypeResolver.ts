import { ErrorLevel } from "../../common/Error";
import { Helpers, Klass, StepParams } from "../../common/interpreter/StepFunction";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaModuleManager } from "../module/JavaModuleManager";
import { JavaLibraryModuleManager } from "../module/libraries/JavaLibraryModuleManager";
import { ASTClassDefinitionNode, ASTEnumDefinitionNode, ASTInterfaceDefinitionNode, ASTTypeNode } from "../parser/AST";
import { EnumClass } from "../runtime/system/javalang/EnumClass.ts";
import { InterfaceClass } from "../runtime/system/javalang/InterfaceClass.ts";
import { ArrayType } from "../types/ArrayType";
import { Field } from "../types/Field";
import { GenericTypeParameter } from "../types/GenericInformation";
import { IJavaClass, JavaClass } from "../types/JavaClass";
import { JavaEnum } from "../types/JavaEnum";
import { IJavaInterface, JavaInterface } from "../types/JavaInterface";
import { JavaType } from "../types/JavaType";
import { Method } from "../types/Method";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { Parameter } from "../types/Parameter";

export class TypeResolver {

    dirtyModules: JavaCompiledModule[];

    constructor(private moduleManager: JavaModuleManager, private libraryModuleManager: JavaLibraryModuleManager) {
        this.dirtyModules = this.moduleManager.getNewOrDirtyModules();
    }

    resolve() {

        this.generateNewTypesWithGenericsButWithoutFieldsAndMethods();

        this.resolveTypeReferences();

        this.resolveGenericParameterTypesAndExtendsImplements();

        this.buildAllMethods();

        this.buildRuntimeClassesAndTheirFields();
    }

    generateNewTypesWithGenericsButWithoutFieldsAndMethods() {

        let baseEnumClass = <JavaClass><any>this.libraryModuleManager.typestore.getType("Enum");

        for (let module of this.dirtyModules) {
            for (let declNode of module.ast!.classOrInterfaceOrEnumDefinitions) {
                let resolvedType: NonPrimitiveType | undefined = undefined;

                switch (declNode.kind) {
                    case TokenType.keywordClass:
                        resolvedType = new JavaClass(declNode.identifier, module, declNode.identifierRange);
                        this.generateGenericParameters(declNode, <JavaClass>resolvedType);
                        break;
                    case TokenType.keywordInterface:
                        resolvedType = new JavaInterface(declNode.identifier, module, declNode.identifierRange);
                        this.generateGenericParameters(declNode, <JavaInterface>resolvedType);
                        break;
                    case TokenType.keywordEnum:
                        resolvedType = new JavaEnum(declNode.identifier, module, declNode.identifierRange, baseEnumClass);
                }

                if (resolvedType) {
                    declNode.resolvedType = resolvedType;
                    this.moduleManager.typestore.addType(resolvedType);
                    module.types.push(declNode.resolvedType);
                }
            }
        }
    }

    generateGenericParameters(node: ASTClassDefinitionNode | ASTInterfaceDefinitionNode, type: JavaClass | JavaInterface) {
        for (let gpNode of node.genericParameterDefinitions) {
            let gp = new GenericTypeParameter(gpNode.identifier, type.module, gpNode.identifierRange);
            gpNode.resolvedType = gp;
            type.genericInformation.push(gp);
        }
    }

    resolveTypeReferences() {
        for (let module of this.dirtyModules) {
            for (let typeNode of module.ast!.collectedTypeNodes) {
                this.resolveTypeNode(typeNode, module);
            }
        }
    }

    resolveTypeNode(typeNode: ASTTypeNode, module: JavaBaseModule): JavaType | undefined {
        let primaryType = this.findPrimaryTypeByIdentifier(typeNode, module);

        if (!primaryType) return;

        if (typeNode.genericParameterInvocations.length > 0) {
            if (!primaryType.hasGenericParameters()) {
                this.pushError("Der Datentyp " + typeNode.identifier + " ist nicht generisch.", typeNode.range, module);
            } else if (primaryType.genericInformation!.length != typeNode.genericParameterInvocations.length) {
                this.pushError("Der Datentyp " + typeNode.identifier + " hat " + primaryType.genericInformation!.length + " generische Parameter, hier werden aber " + typeNode.genericParameterInvocations.length + " konkrete Datentypen dafür angegeben.", typeNode.range, module);
            } else {
                let typeMap: Map<GenericTypeParameter, NonPrimitiveType> = new Map();
                for (let i = 0; i < typeNode.genericParameterInvocations.length; i++) {
                    let gp = primaryType.genericInformation![i];
                    let gpNode = typeNode.genericParameterInvocations[i];
                    let gpType = this.resolveTypeNode(gpNode, module);
                    if (gpType) {
                        if (gpType.isPrimitive) {
                            this.pushError("Als konkreter Typ für einen generischen Typparameter kann kein primitiver Datentyp (hier: " + primaryType.identifier + ") verwendet werden.", typeNode.range, module);
                        } else {
                            typeMap.set(gp, <NonPrimitiveType>gpType);
                        }
                    }
                    if (primaryType instanceof JavaClass) primaryType = primaryType.getCopyWithConcreteType(typeMap);
                }
            }
        }

        if (typeNode.arrayDimensions > 0) {
            primaryType = new ArrayType(primaryType, typeNode.arrayDimensions, module, typeNode.range);
        }

        return typeNode.resolvedType = primaryType;;
    }

    findPrimaryTypeByIdentifier(typeNode: ASTTypeNode, module: JavaBaseModule): JavaType | undefined {
        let identifer = typeNode.identifier;

        // Generic parameter variable?
        if (typeNode.enclosingClassOrInterface) {
            for (let gpType of typeNode.enclosingClassOrInterface.genericParameterDefinitions) {
                let gp = gpType.resolvedType;
                if (gp && gp.identifier == identifer) return gp;
            }
        }

        let type = this.moduleManager.typestore.getType(identifer);

        if (!type) {
            type = this.libraryModuleManager.typestore.getType(identifer);
        }

        if (!type) {
            this.pushError("Der Datentyp " + identifer + " ist nicht definiert.", typeNode.range, module);
        }

        return type;

    }

    resolveGenericParameterTypesAndExtendsImplements() {
        for (let module of this.dirtyModules) {
            for (let declNode of module.ast!.classOrInterfaceOrEnumDefinitions) {

                switch (declNode.kind) {
                    case TokenType.keywordClass:
                        let resolvedType1 = <JavaClass>declNode.resolvedType;
                        this.resolveGenericParameters(declNode, module);
                        this.resolveClassExtendsImplements(declNode, resolvedType1, module);
                        break;
                    case TokenType.keywordInterface:
                        let resolvedType2 = <JavaInterface>declNode.resolvedType;
                        this.resolveGenericParameters(declNode, module);
                        this.resolveInterfaceExtends(declNode, resolvedType2, module);
                        break;
                }

            }
        }
    }

    resolveClassExtendsImplements(declNode: ASTClassDefinitionNode, resolvedType1: JavaClass, module: JavaBaseModule) {
        if (declNode.extends) {
            let extType = this.resolveTypeNode(declNode.extends, module);

            if (extType instanceof IJavaClass) {
                resolvedType1.setExtends(extType);
            } else {
                this.pushError("Hinter extends muss eine Klasse stehen.", declNode.extends.range, module);
            }
        }

        if (!resolvedType1.getExtends()) {
            resolvedType1.setExtends(<JavaClass>this.libraryModuleManager.typestore.getType("Object")!);
        }

        for (let implNode of declNode.implements) {
            let implType = this.resolveTypeNode(implNode, module);
            if (implType instanceof IJavaInterface) {
                resolvedType1.addImplements(implType);
            } else {
                this.pushError("Hinter implements können nur Interfaces stehen.", implNode.range, module);
            }
        }
    }

    resolveInterfaceExtends(declNode: ASTInterfaceDefinitionNode, resolvedType1: JavaInterface, module: JavaBaseModule) {
        for (let implNode of declNode.implements) {
            let implType = this.resolveTypeNode(implNode, module);
            if (implType instanceof IJavaInterface) {
                resolvedType1.addExtends(implType);
            } else {
                this.pushError("Hinter extends können nur Interfaces stehen.", implNode.range, module);
            }
        }
    }

    resolveGenericParameters(node: ASTClassDefinitionNode | ASTInterfaceDefinitionNode, module: JavaBaseModule) {
        for (let gpNode of node.genericParameterDefinitions) {
            let gpType = gpNode.resolvedType;
            if (!gpType) continue;
            if (gpNode.extends) {
                for (let extNode of gpNode.extends) {
                    let extType = this.resolveTypeNode(extNode, module);
                    if (extType) {
                        if (extType instanceof IJavaClass || extType instanceof IJavaInterface) {
                            gpType.upperBounds.push(extType);
                        } else {
                            this.pushError("Als upper bound eines generischen Typparameters sind nur classes und interfaces zugelassen.", extNode.range, module);
                        }
                    }
                }
                if (gpNode.super) {
                    let superType = this.resolveTypeNode(gpNode.super, module);
                    if (superType) {
                        if (superType instanceof IJavaClass) {
                            gpType.lowerBound = superType;
                        } else {
                            this.pushError("Als lower bound eines generischen Typparameters ist nur eine Klasse möglich.", gpNode.super.range, module);
                        }

                    }
                }
            }
        }
    }

    pushError(message: string, range: IRange, module: JavaBaseModule, level: ErrorLevel = "error") {
        module.errors.push({
            message: message,
            range: range,
            level: level
        })
    }


    buildAllMethods() {

        let classes: JavaClass[] = [];

        for (let module of this.dirtyModules) {
            for (let declNode of module.ast!.classOrInterfaceOrEnumDefinitions) {
                switch (declNode.kind) {
                    //@ts-ignore
                    case TokenType.keywordClass:
                        classes.push(<JavaClass>declNode.resolvedType);
                    case TokenType.keywordEnum:
                        let resolvedType1 = <JavaClass | JavaEnum>declNode.resolvedType;
                        // this.buildFields(declNode, resolvedType1, module);
                        this.buildMethods(declNode, resolvedType1, module);
                        break;
                    case TokenType.keywordInterface:
                        let resolvedType2 = <JavaInterface>declNode.resolvedType;
                        this.buildMethods(declNode, resolvedType2, module);
                        break;
                }
            }
        }

        // replenish class types with default methods of implemented interfaces if necessary
        for (let javaClass of classes) {

            for (let ji of javaClass.getImplements()) {
                let javaInterface = <JavaInterface>ji;
                for (let method of javaInterface.getMethods()) {

                    let classesMethod = javaClass.findMethodWithSignature(method.getInternalName("java"));

                    if (!classesMethod) {
                        if (method.isDefault) {
                            let copy = method.getCopy();
                            javaClass.methods.push(copy);
                            method.callbackAfterCodeGeneration.push(() => {
                                copy.program = method.program;

                                let runtimeClass = javaClass.runtimeClass!;
                                runtimeClass.__programs.push(method.program);

                                let methodIndex = runtimeClass.__programs.length - 1;

                                let parameterIdentifiers = method.parameters.map(p => p.identifier);
                                let thisFollowedByParameterIdentifiers = ["this"].concat(parameterIdentifiers);
                                method.programStub =
                                    `${Helpers.threadStack}.push(${thisFollowedByParameterIdentifiers.join(", ")});\n` +
                                    `${Helpers.pushProgram}(this.constructor.__programs[${methodIndex}]);`;
                                runtimeClass.prototype[method.getInternalName("java")] = new Function(StepParams.thread, ...parameterIdentifiers,
                                    method.programStub);
                            });
                        } else {
                            javaClass.module.errors.push({
                                message: "Die Klasse " + javaClass.identifier + " muss noch die Methode " + method.identifier + " des Interfaces " + javaInterface.identifier + " implementieren",
                                level: "error",
                                range: javaClass.identifierRange
                            })
                        }
                    }

                }
            }

        }


    }

    buildMethods(node: ASTInterfaceDefinitionNode | ASTClassDefinitionNode | ASTEnumDefinitionNode,
        type: JavaInterface | JavaClass | JavaEnum, module: JavaCompiledModule) {
        for (let methodNode of node.methods) {
            let method = new Method(methodNode.identifier, methodNode.identifierRange,
                module, methodNode.visibility);
            methodNode.method = method;
            method.isAbstract = methodNode.isAbstract;
            method.isFinal = methodNode.isFinal;
            method.isStatic = methodNode.isStatic;
            method.classEnumInterface = type;
            method.isConstructor = methodNode.isContructor;
            method.isDefault = methodNode.isDefault;

            method.returnParameterType = methodNode.returnParameterType?.resolvedType;
            for (let p of methodNode.parameters) {
                if (p.type?.resolvedType) {
                    let parameter = new Parameter(p.identifier, p.identifierRange,
                        module, p.type?.resolvedType, p.isFinal);
                    method.parameters.push(parameter);
                }
            }

            type.methods.push(method);
        }
    }

    // buildFields(node: ASTClassDefinitionNode | ASTEnumDefinitionNode, type: JavaClass | JavaEnum, module: JavaCompiledModule) {
    //     for (let fieldNode of node.fieldsOrInstanceInitializers) {
    //         if (fieldNode.kind == TokenType.fieldDeclaration) {
    //             if (fieldNode.type.resolvedType) {
    //                 let field = new Field(fieldNode.identifier, fieldNode.identifierRange, module,
    //                     fieldNode.type.resolvedType, fieldNode.visibility);
    //                 field.isFinal = fieldNode.isFinal;
    //                 field.isStatic = fieldNode.isStatic;
    //                 field.classEnum = type;
    //                 type.fields.push(field);
    //             }
    //         }
    //     }
    // }


    buildRuntimeClassesAndTheirFields() {

        let enumRuntimeClass: Klass = (<JavaEnum>this.libraryModuleManager.typestore.getType("Enum")!).runtimeClass!;

        let interfaceClass: Klass = InterfaceClass;

        // initialize fields of enums and interfaces
        for (let module of this.dirtyModules) {
            for (let decl of module.ast!.classOrInterfaceOrEnumDefinitions) {
                if (decl.kind == TokenType.keywordEnum) {
                    let javaEnum = <JavaEnum>decl.resolvedType;
                    if (javaEnum) javaEnum.initRuntimeClass(enumRuntimeClass);
                    for (let field of decl.fieldsOrInstanceInitializers) {
                        if (field.kind == TokenType.fieldDeclaration) {
                            let f: Field = new Field(field.identifier, field.range, module, field.type.resolvedType!, field.visibility);
                            f.isStatic = field.isStatic;
                            f.isFinal = field.isFinal;
                            f.classEnum = javaEnum;
                            javaEnum.fields.push(f);
                        }
                    }

                    // each enum value gets compiled to a public static final field
                    for (let enumValue of decl.valueNodes) {
                        let f: Field = new Field(enumValue.identifier, enumValue.identifierRange, module, javaEnum, TokenType.keywordPublic);
                        f.isStatic = true;
                        f.isFinal = true;
                        f.classEnum = javaEnum;
                        javaEnum.fields.push(f);
                    }

                } else if (decl.kind == TokenType.keywordInterface) {
                    let javaInterface = <JavaInterface>decl.resolvedType;
                    javaInterface?.initRuntimeClass(interfaceClass);

                    // interfaces may have static fields...
                    for (let field of decl.fieldsOrInstanceInitializers) {
                        if (field.kind == TokenType.fieldDeclaration) {
                            let f: Field = new Field(field.identifier, field.range, module, field.type.resolvedType!, field.visibility);
                            f.isStatic = field.isStatic;
                            f.isFinal = field.isFinal;
                            f.classEnum = javaInterface;
                            javaInterface.fields.push(f);
                        }
                    }
                }
            }
        }

        let objectClass = <JavaClass>this.libraryModuleManager.typestore.getType("Object");

        // initialize fields of classes
        let done: boolean = false;
        while (!done) {
            done = true;
            for (let module of this.dirtyModules) {
                for (let decl of module.ast!.classOrInterfaceOrEnumDefinitions) {
                    if (decl.kind == TokenType.keywordClass) {
                        let javaClass = <JavaClass>decl.resolvedType;
                        if (!javaClass.runtimeClass) {
                            let baseClass = javaClass.getExtends();
                            if (!baseClass) baseClass = objectClass;
                            if (baseClass.runtimeClass) {
                                javaClass.initRuntimeClass(baseClass.runtimeClass);  // first recursively initialize field of base classes
                                for (let field of decl.fieldsOrInstanceInitializers) {
                                    if (field.kind == TokenType.fieldDeclaration) {
                                        let f: Field = new Field(field.identifier, field.range, module, field.type.resolvedType!, field.visibility);
                                        f.isStatic = field.isStatic;
                                        f.isFinal = field.isFinal;
                                        f.classEnum = javaClass;
                                        javaClass.fields.push(f);
                                    }
                                }
                                done = false;
                            }
                        }
                    }
                }
            }
        }

    }




}