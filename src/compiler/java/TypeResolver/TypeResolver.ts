import { ErrorLevel } from "../../common/Error";
import { Helpers, Klass, StepParams } from "../../common/interpreter/StepFunction";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaModuleManager } from "../module/JavaModuleManager";
import { JavaLibraryModuleManager } from "../module/libraries/JavaLibraryModuleManager";
import { ASTClassDefinitionNode, ASTEnumDefinitionNode, ASTInterfaceDefinitionNode, ASTMethodDeclarationNode, ASTTypeDefinitionWithGenerics, ASTTypeNode, TypeScope } from "../parser/AST";
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
import { Visibility } from "../types/Visibility.ts";


export class TypeResolver {

    dirtyModules: JavaCompiledModule[];

    classDeclarationNodes: ASTClassDefinitionNode[] = [];
    interfaceDeclarationNodes: ASTInterfaceDefinitionNode[] = [];
    enumDeclarationNodes: ASTEnumDefinitionNode[] = [];

    constructor(private moduleManager: JavaModuleManager, private libraryModuleManager: JavaLibraryModuleManager) {
        this.dirtyModules = this.moduleManager.getNewOrDirtyModules();
    }

    resolve() {

        this.gatherTypeDefinitionNodes();

        this.generateNewTypesWithGenericsButWithoutFieldsAndMethodsAndResolveOuterTypes();

        this.resolveTypeReferences();

        this.resolveGenericParameterTypesAndExtendsImplements();

        this.buildAllMethods();

        this.buildRuntimeClassesAndTheirFields();
    }


    gatherTypeDefinitionNodes() {
        for (let module of this.dirtyModules) {
            this.gatherTypeDefinitionNodesRecursively(module.ast!);
        }
    }

    gatherTypeDefinitionNodesRecursively(typeScope: TypeScope) {
        for (let tdn of typeScope.classOrInterfaceOrEnumDefinitions) {
            switch (tdn.kind) {
                case TokenType.keywordClass:
                    this.classDeclarationNodes.push(tdn);
                    break;
                case TokenType.keywordInterface:
                    this.interfaceDeclarationNodes.push(tdn);
                    break;
                case TokenType.keywordEnum:
                    this.enumDeclarationNodes.push(tdn);
                    break;
            }
            this.gatherTypeDefinitionNodesRecursively(tdn);
        }
    }

    generateNewTypesWithGenericsButWithoutFieldsAndMethodsAndResolveOuterTypes() {

        let declarationNodesWithClassParent: (ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode)[] = [];

        for (let klassNode of this.classDeclarationNodes) {
            let resolvedType = new JavaClass(klassNode.identifier, klassNode.identifierRange, klassNode.path, klassNode.module);
            this.generateGenericParameters(klassNode, <JavaClass>resolvedType);
            klassNode.resolvedType = resolvedType;
            resolvedType.visibility = klassNode.visibility;
            resolvedType.isStatic = klassNode.isStatic;
            resolvedType._isAbstract = klassNode.isAbstract;

            this.moduleManager.typestore.addType(resolvedType);
            klassNode.module.types.push(klassNode.resolvedType);

            if (klassNode.parent?.kind != TokenType.global) declarationNodesWithClassParent.push(klassNode);

            this.generateMethodGenerics(klassNode.methods, klassNode.module);
        }

        for (let interfaceNode of this.interfaceDeclarationNodes) {
            let resolvedType = new JavaInterface(interfaceNode.identifier, interfaceNode.identifierRange, interfaceNode.path, interfaceNode.module);
            this.generateGenericParameters(interfaceNode, <JavaInterface>resolvedType);
            interfaceNode.resolvedType = resolvedType;
            resolvedType.visibility = interfaceNode.visibility;
            this.moduleManager.typestore.addType(resolvedType);
            interfaceNode.module.types.push(interfaceNode.resolvedType);

            if (interfaceNode.parent?.kind != TokenType.global) declarationNodesWithClassParent.push(interfaceNode);

            this.generateMethodGenerics(interfaceNode.methods, interfaceNode.module);
        }

        let baseEnumClass = <JavaClass><any>this.libraryModuleManager.typestore.getType("Enum");

        for (let enumNode of this.enumDeclarationNodes) {
            let resolvedType = new JavaEnum(enumNode.identifier, enumNode.identifierRange, enumNode.path, enumNode.module, baseEnumClass);
            enumNode.resolvedType = resolvedType;
            resolvedType.visibility = enumNode.visibility;
            resolvedType.isStatic = true;                       // "Nested enum types are implicitly static. It is permissible to explicitly declare a nested enum type to be static.", see https://docs.oracle.com/javase/specs/jls/se7/html/jls-8.html#jls-8.9
            this.moduleManager.typestore.addType(resolvedType);
            enumNode.module.types.push(enumNode.resolvedType);

            if (enumNode.parent?.kind != TokenType.global) declarationNodesWithClassParent.push(enumNode);

            this.generateMethodGenerics(enumNode.methods, enumNode.module);
        }

        for (let node of declarationNodesWithClassParent) {
            //@ts-ignore
            node.resolvedType!.outerType = node.parent.resolvedType;
        }

    }

    generateMethodGenerics(methods: ASTMethodDeclarationNode[], module: JavaCompiledModule) {
        for (let method of methods) {
            for (let gpNode of method.genericParameterDeclarations) {
                let gp = new GenericTypeParameter(gpNode.identifier, module, gpNode.identifierRange);
                gpNode.resolvedType = gp;
                // type.genericInformation.push(gp);
            }
        }
    }

    // generateNewTypesWithGenericsButWithoutFieldsAndMethodsOld() {

    //     let baseEnumClass = <JavaClass><any>this.libraryModuleManager.typestore.getType("Enum");

    //     for (let module of this.dirtyModules) {
    //         for (let declNode of module.ast!.classOrInterfaceOrEnumDefinitions) {
    //             let resolvedType: NonPrimitiveType | undefined = undefined;

    //             switch (declNode.kind) {
    //                 case TokenType.keywordClass:
    //                     resolvedType = new JavaClass(declNode.identifier, module, declNode.identifierRange);
    //                     this.generateGenericParameters(declNode, <JavaClass>resolvedType);
    //                     break;
    //                 case TokenType.keywordInterface:
    //                     resolvedType = new JavaInterface(declNode.identifier, module, declNode.identifierRange);
    //                     this.generateGenericParameters(declNode, <JavaInterface>resolvedType);
    //                     break;
    //                 case TokenType.keywordEnum:
    //                     resolvedType = new JavaEnum(declNode.identifier, module, declNode.identifierRange, baseEnumClass);
    //             }

    //             if (resolvedType) {
    //                 declNode.resolvedType = resolvedType;
    //                 this.moduleManager.typestore.addType(resolvedType);
    //                 module.types.push(declNode.resolvedType);
    //             }
    //         }
    //     }
    // }

    generateGenericParameters(node: ASTClassDefinitionNode | ASTInterfaceDefinitionNode, type: JavaClass | JavaInterface) {
        for (let gpNode of node.genericParameterDeclarations) {
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

        let type: JavaType | undefined;

        // Generic parameter variable?
        if (typeNode.parentTypeScope) {

            let parentTypeScope: TypeScope = typeNode.parentTypeScope;

            if (parentTypeScope.kind == TokenType.methodDeclaration) {
                let methodDeclarationNode: ASTMethodDeclarationNode = <any>parentTypeScope;
                for (let gpType of methodDeclarationNode.genericParameterDeclarations) {
                    let gp = gpType.resolvedType;
                    if (gp && gp.identifier == identifer) return gp;
                }
                parentTypeScope = methodDeclarationNode.parentTypeScope;
            }


            if ([TokenType.keywordClass, TokenType.keywordInterface].indexOf(parentTypeScope.kind) >= 0) {
                let classOrInterfaceNode: ASTClassDefinitionNode | ASTInterfaceDefinitionNode = <any>parentTypeScope;
                for (let gpType of classOrInterfaceNode.genericParameterDeclarations) {
                    let gp = gpType.resolvedType;
                    if (gp && gp.identifier == identifer) return gp;
                }
            }

            if (typeNode.identifier.indexOf(".") >= 0) {
                let parentTypeScope1: TypeScope | undefined = parentTypeScope;
                while (parentTypeScope1) {
                    let path: string = parentTypeScope1.path;

                    if (path != "") {
                        type = this.moduleManager.typestore.getType(path + "." + typeNode.identifier);
                        if (type) return type;
                    }

                    //@ts-ignore
                    parentTypeScope1 = parentTypeScope1.parentTypeScope;
                }
            }

        }

        type = this.moduleManager.typestore.getType(identifer);
        if (identifer.indexOf(".") >= 0) {
            if (!(type instanceof NonPrimitiveType)) return type; // should'nt be possible because primitive type identifiers don't contain dots
            if (type.visibility == TokenType.keywordPublic) return type;
            type = undefined;
        }

        if (!type) {
            type = this.libraryModuleManager.typestore.getType(identifer);
        }

        if (!type) {
            this.pushError("Der Datentyp " + identifer + " ist nicht definiert.", typeNode.range, module);
        }

        return type;

    }

    resolveGenericParameterTypesAndExtendsImplements() {

        for (let klassNode of this.classDeclarationNodes) {
            let module = klassNode.resolvedType!.module;
            let resolvedType1 = <JavaClass>klassNode.resolvedType;
            this.resolveGenericParameters(klassNode, module);
            this.resolveClassExtendsImplements(klassNode, resolvedType1, module);
            for(let method of klassNode.methods){
                this.resolveGenericParameters(method, module);
            }
        }
        
        for (let interfaceNode of this.interfaceDeclarationNodes) {
            let module = interfaceNode.resolvedType!.module;
            let resolvedType2 = <JavaInterface>interfaceNode.resolvedType;
            this.resolveGenericParameters(interfaceNode, module);
            this.resolveInterfaceExtends(interfaceNode, resolvedType2, module);
            for(let method of interfaceNode.methods){
                this.resolveGenericParameters(method, module);
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

    resolveGenericParameters(node: ASTTypeDefinitionWithGenerics, module: JavaBaseModule) {
        for (let gpNode of node.genericParameterDeclarations) {
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

        for (let klassNode of this.classDeclarationNodes) {
            this.buildMethods(klassNode);
        }

        for (let enumNode of this.enumDeclarationNodes) {
            this.buildMethods(enumNode);
        }

        for (let interfaceNode of this.interfaceDeclarationNodes) {
            this.buildMethods(interfaceNode)
        }

        let classes: JavaClass[] = this.classDeclarationNodes.filter(cn => cn.resolvedType).map(cn => <JavaClass>cn.resolvedType);

        // replenish class types with default methods of implemented interfaces if necessary
        for (let javaClass of classes) {

            javaClass.checkIfInterfacesAreImplementedAndSupplementDefaultMethods();

            javaClass.checkIfAbstractParentsAreImplemented();

        }


    }

    buildMethods(node: ASTInterfaceDefinitionNode | ASTClassDefinitionNode | ASTEnumDefinitionNode) {

        let type: JavaInterface | JavaClass | JavaEnum = <any>node.resolvedType;
        let module = type.module;

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
        for (let enumNode of this.enumDeclarationNodes) {
            let javaEnum = enumNode.resolvedType!;
            javaEnum.initRuntimeClass(enumRuntimeClass);
            for (let field of enumNode.fieldsOrInstanceInitializers) {
                if (field.kind == TokenType.fieldDeclaration) {
                    let f: Field = new Field(field.identifier, field.range, javaEnum.module, field.type.resolvedType!, field.visibility);
                    f.isStatic = field.isStatic;
                    f.isFinal = field.isFinal;
                    f.classEnum = javaEnum;
                    javaEnum.fields.push(f);
                }
            }

            // each enum value gets compiled to a public static final field
            for (let enumValue of enumNode.valueNodes) {
                let f: Field = new Field(enumValue.identifier, enumValue.identifierRange, javaEnum.module, javaEnum, TokenType.keywordPublic);
                f.isStatic = true;
                f.isFinal = true;
                f.classEnum = javaEnum;
                javaEnum.fields.push(f);
            }

        }

        for (let interfaceNode of this.interfaceDeclarationNodes) {
            let javaInterface = interfaceNode.resolvedType!;
            javaInterface.initRuntimeClass(interfaceClass);

            // interfaces may have static fields...
            for (let field of interfaceNode.fieldsOrInstanceInitializers) {
                if (field.kind == TokenType.fieldDeclaration) {
                    let f: Field = new Field(field.identifier, field.range, javaInterface.module, field.type.resolvedType!, field.visibility);
                    f.isStatic = field.isStatic;
                    f.isFinal = field.isFinal;
                    f.classEnum = javaInterface;
                    javaInterface.fields.push(f);
                }
            }

        }

        let objectClass = <JavaClass>this.libraryModuleManager.typestore.getType("Object");

        // initialize fields of classes
        let done: boolean = false;
        while (!done) {
            done = true;
            for (let classNode of this.classDeclarationNodes) {
                let javaClass = classNode.resolvedType!;
                if (!javaClass.runtimeClass) {
                    let baseClass = javaClass.getExtends();
                    if (!baseClass) baseClass = objectClass;
                    if (baseClass.runtimeClass) {
                        javaClass.initRuntimeClass(baseClass.runtimeClass);  // first recursively initialize field of base classes
                        for (let field of classNode.fieldsOrInstanceInitializers) {
                            if (field.kind == TokenType.fieldDeclaration) {
                                let f: Field = new Field(field.identifier, field.range, javaClass.module, field.type.resolvedType!, field.visibility);
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