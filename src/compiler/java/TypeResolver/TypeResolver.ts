import { ErrormessageWithId } from "../../../tools/language/LanguageManager.ts";
import { ErrorLevel } from "../../common/Error";
import { Helpers, Klass, StepParams } from "../../common/interpreter/StepFunction";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaModuleManager } from "../module/JavaModuleManager";
import { JavaLibraryModuleManager } from "../module/libraries/JavaLibraryModuleManager";
import { ASTArrayTypeNode, ASTBaseTypeNode, ASTClassDefinitionNode, ASTEnumDefinitionNode, ASTGenericTypeInstantiationNode, ASTInterfaceDefinitionNode, ASTMethodDeclarationNode, ASTTypeDefinitionWithGenerics, ASTTypeNode, ASTWildcardTypeNode, TypeScope } from "../parser/AST";
import { InterfaceClass } from "../runtime/system/javalang/InterfaceClass";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType.ts";
import { JavaArrayType } from "../types/JavaArrayType";
import { JavaField } from "../types/JavaField";
import { GenericTypeParameter } from "../types/GenericTypeParameter";
import { IJavaClass, JavaClass } from "../types/JavaClass";
import { JavaEnum } from "../types/JavaEnum";
import { IJavaInterface, JavaInterface } from "../types/JavaInterface";
import { JavaType } from "../types/JavaType";
import { GenericMethod, JavaMethod } from "../types/JavaMethod";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { JavaParameter } from "../types/JavaParameter";
import { CycleFinder } from "./CycleFinder";
import { JCM } from "../language/JavaCompilerMessages.ts";


export class TypeResolver {

    dirtyModules: JavaCompiledModule[];

    classDeclarationNodes: ASTClassDefinitionNode[] = [];
    interfaceDeclarationNodes: ASTInterfaceDefinitionNode[] = [];
    enumDeclarationNodes: ASTEnumDefinitionNode[] = [];

    absoluteNameToResolvedTypeMap: Map<string, JavaType> = new Map();

    constructor(private moduleManager: JavaModuleManager, private libraryModuleManager: JavaLibraryModuleManager) {
        this.dirtyModules = this.moduleManager.getNewOrDirtyModules();
    }

    resolve(): boolean {

        this.gatherTypeDefinitionNodes();

        this.generateNewTypesWithGenericsButWithoutFieldsAndMethodsAndResolveOuterTypes();

        this.resolveTypeReferences();

        this.resolveGenericParameterTypesAndExtendsImplements();

        if (CycleFinder.findCycle(this.moduleManager)) return false;

        this.buildAllMethods();

        this.buildRuntimeClassesAndTheirFields();

        return true;
    }


    gatherTypeDefinitionNodes() {
        for (let module of this.dirtyModules) {
            if(module.ast){
                this.gatherTypeDefinitionNodesRecursively(module.ast);
            }
        }
    }

    gatherTypeDefinitionNodesRecursively(typeScope: TypeScope) {
        for (let tdn of typeScope.innerTypes) {
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
            let module = klassNode.module;
            let resolvedType = new JavaClass(klassNode.identifier, klassNode.identifierRange, klassNode.path, klassNode.module);
            this.generateGenericParameters(klassNode, <JavaClass>resolvedType);
            klassNode.resolvedType = resolvedType;
            resolvedType.visibility = klassNode.visibility;
            resolvedType.isStatic = klassNode.isStatic;
            resolvedType._isAbstract = klassNode.isAbstract;
            resolvedType.documentation = klassNode.documentation;

            if(klassNode.identifier != ""){
                this.moduleManager.typestore.addType(resolvedType);
                module.types.push(klassNode.resolvedType); 
            }

            if (klassNode.parent?.kind != TokenType.global) declarationNodesWithClassParent.push(klassNode);

            module.compiledSymbolsUsageTracker.registerUsagePosition(resolvedType, module.file, klassNode.identifierRange);

            this.generateMethodGenerics(klassNode.methods, module);
        }

        for (let interfaceNode of this.interfaceDeclarationNodes) {
            let resolvedType = new JavaInterface(interfaceNode.identifier, interfaceNode.identifierRange, interfaceNode.path, interfaceNode.module);
            let module = interfaceNode.module;
            this.generateGenericParameters(interfaceNode, <JavaInterface>resolvedType);
            interfaceNode.resolvedType = resolvedType;
            resolvedType.visibility = interfaceNode.visibility;
            resolvedType.documentation = interfaceNode.documentation;
            this.moduleManager.typestore.addType(resolvedType);
            module.types.push(interfaceNode.resolvedType);

            if (interfaceNode.parent?.kind != TokenType.global) declarationNodesWithClassParent.push(interfaceNode);

            module.compiledSymbolsUsageTracker.registerUsagePosition(resolvedType, module.file, interfaceNode.identifierRange);

            this.generateMethodGenerics(interfaceNode.methods, module);
        }

        let baseEnumClass = <JavaClass><any>this.libraryModuleManager.typestore.getType("Enum");

        for (let enumNode of this.enumDeclarationNodes) {
            let resolvedType = new JavaEnum(enumNode.identifier, enumNode.identifierRange, enumNode.path, enumNode.module, baseEnumClass);
            let module = enumNode.module;
            enumNode.resolvedType = resolvedType;
            resolvedType.visibility = enumNode.visibility;
            resolvedType.documentation = enumNode.documentation;
            resolvedType.isStatic = true;                       // "Nested enum types are implicitly static. It is permissible to explicitly declare a nested enum type to be static.", see https://docs.oracle.com/javase/specs/jls/se7/html/jls-8.html#jls-8.9
            this.moduleManager.typestore.addType(resolvedType);
            module.types.push(enumNode.resolvedType);

            if (enumNode.parent?.kind != TokenType.global) declarationNodesWithClassParent.push(enumNode);

            module.compiledSymbolsUsageTracker.registerUsagePosition(resolvedType, module.file, enumNode.identifierRange);


            this.generateMethodGenerics(enumNode.methods, module);
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


    generateGenericParameters(node: ASTClassDefinitionNode | ASTInterfaceDefinitionNode, type: JavaClass | JavaInterface) {
        for (let gpNode of node.genericParameterDeclarations) {
            let gp = new GenericTypeParameter(gpNode.identifier, type.module, gpNode.identifierRange);
            gpNode.resolvedType = gp;
            type.genericTypeParameters!.push(gp);
        }
    }

    resolveTypeReferences() {
        for (let module of this.dirtyModules) {
            if(module.ast){
                for (let typeNode of module.ast.collectedTypeNodes) {
                    this.resolveTypeNode(typeNode, module);
                }
            }
        }
    }

    resolveTypeNode(typeNode: ASTTypeNode, module: JavaBaseModule): JavaType | undefined {

        if(typeNode.resolvedType) return typeNode.resolvedType;

        switch (typeNode.kind) {
            case TokenType.baseType: {
                let type = this.findPrimaryTypeByIdentifier(<ASTBaseTypeNode>typeNode, module);
                if(type){
                    typeNode.resolvedType = type;
                    module.registerTypeUsage(type, typeNode.range);
                }
                return type;
            }
            case TokenType.genericTypeInstantiation:
                let genericTypeNode = <ASTGenericTypeInstantiationNode>typeNode;
                this.resolveTypeNode(genericTypeNode.baseType, module);
                
                
                let baseType = genericTypeNode.baseType.resolvedType;
                if (!baseType) return undefined;
                if (!baseType.hasGenericParameters()) {
                    this.pushError(JCM.typeIsNotGeneric(baseType.toString()), typeNode.range, module);
                    return undefined;
                }
                // ArrayList<> -> ArrayList
                if(genericTypeNode.actualTypeArguments.length == 0) {

                }
                if (genericTypeNode.actualTypeArguments.length > baseType.genericTypeParameters!.length) {
                    this.pushError(JCM.wrongNumberOfGenericParameters(baseType.toString(), baseType.genericTypeParameters!.length, genericTypeNode.actualTypeArguments.length), genericTypeNode.range, module);
                    return undefined;
                }
                let typeMap: Map<GenericTypeParameter, NonPrimitiveType> = new Map();
                for (let i = 0; i < genericTypeNode.actualTypeArguments.length; i++) {
                    let gp = baseType.genericTypeParameters![i];
                    let gpNode = genericTypeNode.actualTypeArguments[i];
                    let gpType = this.resolveTypeNode(gpNode, module);
                    // TODO: Check upper/lower bounds of gp against gpType!
                    if (gpType) {
                        if (gpType.isPrimitive) {
                            this.pushError(JCM.noPrimitiveTypeForGenericParameter(baseType.identifier), typeNode.range, module);
                        } else {
                            if(!gp.canBeReplacedByConcreteType(gpType)){
                                this.pushError(JCM.cantReplaceGenericParamterBy(gp.getDeclaration(), gpType.toString()), typeNode.range, module);
                            }
                            typeMap.set(gp, <NonPrimitiveType>gpType);
                        }
                    }
                }

                for(let i = genericTypeNode.actualTypeArguments.length; i < baseType.genericTypeParameters!.length; i++){
                    let gp = baseType.genericTypeParameters![i];
                    if(gp.upperBounds.length > 0){
                        typeMap.set(gp, gp.upperBounds[0]);
                    } else {
                        typeMap.set(gp, <NonPrimitiveType>this.libraryModuleManager.typestore.getType("Object"))
                    }
                }


                if (baseType instanceof JavaClass || baseType instanceof JavaInterface) {
                    genericTypeNode.resolvedType = baseType.getCopyWithConcreteType(typeMap);
                } else {
                    genericTypeNode.resolvedType = baseType;
                }
                
                let newType = genericTypeNode.resolvedType;
                let absoluteName = newType.getAbsoluteName();
                let cachedType = this.absoluteNameToResolvedTypeMap.get(absoluteName);
                if(cachedType){
                    genericTypeNode.resolvedType = cachedType;
                } else {
                    this.absoluteNameToResolvedTypeMap.set(absoluteName, newType);
                }

                return genericTypeNode.resolvedType;
            case TokenType.arrayType:
                let arrayTypeNode = <ASTArrayTypeNode>typeNode;
                let baseType1 = this.resolveTypeNode(arrayTypeNode.arrayOf, module);
                if (!baseType1) return undefined;
                typeNode.resolvedType = new JavaArrayType(baseType1, arrayTypeNode.arrayDimensions, module, arrayTypeNode.range);

                let absoluteName1 = typeNode.resolvedType.getAbsoluteName();
                let cachedType1 = this.absoluteNameToResolvedTypeMap.get(absoluteName1);
                if(cachedType1){
                    typeNode.resolvedType = cachedType1;
                } else {
                    this.absoluteNameToResolvedTypeMap.set(absoluteName1, typeNode.resolvedType);
                }
                return typeNode.resolvedType;
            case TokenType.voidType:
                return typeNode.resolvedType = this.libraryModuleManager.typestore.getType("void");
            case TokenType.varType:
                // resolve later...
                return undefined;
            case TokenType.wildcardType:
                let wildcardTypeNode = <ASTWildcardTypeNode>typeNode;
                let upperBounds: (IJavaClass | IJavaInterface)[] = [];
                for (let ubNode of wildcardTypeNode.extends) {
                    let upperBound = this.resolveTypeNode(ubNode, module);
                    if (!(upperBound instanceof IJavaClass || upperBound instanceof IJavaInterface)) {
                        this.pushError(JCM.onlyClassesOrInterfacesAsUpperBounds(), ubNode.range, module);
                    } else if (upperBound) {
                        upperBounds.push(upperBound);
                    }
                }

                let type = new GenericTypeParameter("?", module, wildcardTypeNode.range, upperBounds);
                if (wildcardTypeNode.super) {
                    let lowerBound = this.resolveTypeNode(wildcardTypeNode.super, module);
                    if (!(lowerBound instanceof IJavaClass)) {
                        this.pushError(JCM.onlyClassesOrInterfacesAsLowerBounds(), wildcardTypeNode.range, module);
                    } else {
                        type.lowerBound = lowerBound;
                    }
                }

                return wildcardTypeNode.resolvedType = type;
        }

    }


    findPrimaryTypeByIdentifier(typeNode: ASTBaseTypeNode, module: JavaBaseModule): JavaType | undefined {
        let identifer = typeNode.identifiers[0].identifier;

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
                for (let innerclass of classOrInterfaceNode.innerTypes) {
                    if (innerclass.identifier == identifer && innerclass.resolvedType) {
                        type = innerclass.resolvedType;
                    }
                }
            }

            // if (typeNode.identifiers.indexOf(".") >= 0) {
            //     let parentTypeScope1: TypeScope | undefined = parentTypeScope;
            //     while (parentTypeScope1) {
            //         let path: string = parentTypeScope1.path;

            //         if (path != "") {
            //             type = this.moduleManager.typestore.getType(path + "." + typeNode.identifiers);
            //             if (type) return type;
            //         }

            //         //@ts-ignore
            //         parentTypeScope1 = parentTypeScope1.parentTypeScope;
            //     }
            // }

        }

        if(!type){
            type = this.moduleManager.typestore.getType(identifer);
            if(!type){
                type = this.libraryModuleManager.typestore.getType(identifer);
            }
        }

        let i = 1;
        while(i < typeNode.identifiers.length && type){
            let id = typeNode.identifiers[i];
            if(type instanceof NonPrimitiveType){
                let innerType = type.innerTypes.find(it => it.identifier == id.identifier) as NonPrimitiveType;
                if(innerType){
                    module.registerTypeUsage(innerType, id.identifierRange);
                    if(innerType.visibility != TokenType.keywordPublic){
                        this.pushError(JCM.typeIsNotVisible(innerType.identifier), id.identifierRange, module, "error");
                    }
                    type = innerType;
                } else {
                    this.pushError(JCM.typeNotDefined(id.identifier), typeNode.range, module);
                    return undefined;
                }
            } else {
                this.pushError(JCM.typeHasNoSubtype(type.identifier, id.identifier), id.identifierRange, module, "error");
                return undefined;
            }  
            i++;
        }

        if(!type){
            this.pushError(JCM.typeNotDefined(identifer), typeNode.range, module);
        }

        return type;

    }

    resolveGenericParameterTypesAndExtendsImplements() {

        for (let klassNode of this.classDeclarationNodes) {
            let module = klassNode.resolvedType!.module;
            let resolvedType1 = <JavaClass>klassNode.resolvedType;
            this.resolveGenericParameters(klassNode, module);
            this.resolveClassExtendsImplements(klassNode, resolvedType1, module);
            for (let method of klassNode.methods) {
                this.resolveGenericParameters(method, module);
            }
        }

        for (let interfaceNode of this.interfaceDeclarationNodes) {
            let module = interfaceNode.resolvedType!.module;
            let resolvedType2 = <JavaInterface>interfaceNode.resolvedType;
            this.resolveGenericParameters(interfaceNode, module);
            this.resolveInterfaceExtends(interfaceNode, resolvedType2, module);
            for (let method of interfaceNode.methods) {
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
                // anonymous inner class? 
                if (declNode.identifier == "" && extType instanceof IJavaInterface) {
                    declNode.implements.push(declNode.extends);
                    declNode.extends = undefined;
                } else {
                    this.pushError(JCM.afterExtendsClassNeeded(), declNode.extends.range, module);
                }
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
                this.pushError(JCM.onlyInterfacesAfterImplements(), implNode.range, module);
            }
        }
    }

    resolveInterfaceExtends(declNode: ASTInterfaceDefinitionNode, resolvedType1: JavaInterface, module: JavaBaseModule) {
        for (let implNode of declNode.implements) {
            let implType = this.resolveTypeNode(implNode, module);
            if (implType instanceof IJavaInterface) {
                resolvedType1.addExtends(implType);
            } else {
                this.pushError(JCM.onlyInterfacesAfterExtends(), implNode.range, module);
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
                            this.pushError(JCM.onlyClassesOrInterfacesAsUpperBounds(), extNode.range, module);
                        }
                    }
                }
                if (gpNode.super) {
                    let superType = this.resolveTypeNode(gpNode.super, module);
                    if (superType) {
                        if (superType instanceof IJavaClass) {
                            gpType.lowerBound = superType;
                        } else {
                            this.pushError(JCM.onlyClassesOrInterfacesAsLowerBounds(), gpNode.super.range, module);
                        }

                    }
                }
            }
        }
    }

    pushError(messageWithId: ErrormessageWithId, range: IRange, module: JavaBaseModule, level: ErrorLevel = "error") {
        module.errors.push({
            message: messageWithId.message,
            id: messageWithId.id,
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

        this.moduleManager.overriddenOrImplementedMethodPaths = {};
        // replenish class types with default methods of implemented interfaces if necessary
        for (let javaClass of classes) {

            javaClass.checkIfInterfacesAreImplementedAndSupplementDefaultMethods();

            javaClass.takeSignaturesFromOverriddenMethods(this.moduleManager.overriddenOrImplementedMethodPaths);

            javaClass.checkIfAbstractParentsAreImplemented();

        }


    }

    buildMethods(node: ASTInterfaceDefinitionNode | ASTClassDefinitionNode | ASTEnumDefinitionNode) {

        let type: JavaInterface | JavaClass | JavaEnum = <any>node.resolvedType;
        let module = type.module;

        for (let methodNode of node.methods) {

            let method: JavaMethod;

            if (methodNode.genericParameterDeclarations.length > 0) {
                let genericParameters = methodNode.genericParameterDeclarations.map(gp => gp.resolvedType!);
                method = new GenericMethod(methodNode.identifier, methodNode.identifierRange,
                    module, methodNode.visibility, genericParameters);
            } else {
                method = new JavaMethod(methodNode.identifier, methodNode.identifierRange,
                    module, methodNode.visibility);
            }

            methodNode.method = method;
            method.isAbstract = methodNode.isAbstract; 
            method.isFinal = methodNode.isFinal;
            method.isStatic = methodNode.isStatic;
            method.classEnumInterface = type;
            method.isConstructor = methodNode.isContructor;
            method.isDefault = methodNode.isDefault;
            method.isSynchronized = methodNode.isSynchronized;
            method.documentation = methodNode.documentation;

            method.returnParameterType = methodNode.isContructor ? type : methodNode.returnParameterType?.resolvedType;
            for (let p of methodNode.parameters) {
                if (p.type?.resolvedType) {

                    let type = p.isEllipsis ? new JavaArrayType(p.type.resolvedType, 1, module, p.type.range) : p.type.resolvedType;

                    let parameter = new JavaParameter(p.identifier, p.identifierRange,
                        module, type, p.isFinal, p.isEllipsis, p.trackMissingReadAccess);

                    if(node.identifier == '' && methodNode.identifier == 'main' && parameter.identifier == 'args'){
                        parameter.hiddenWhenDebugging = true;
                    }

                    module.compiledSymbolsUsageTracker.registerUsagePosition(parameter, module.file, p.identifierRange);
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
            javaEnum.addValuesMethod(javaEnum.runtimeClass!, this.libraryModuleManager.typestore.getType("string") as PrimitiveType);
            for (let field of enumNode.fieldsOrInstanceInitializers) {
                if (field.kind == TokenType.fieldDeclaration) {
                    let f: JavaField = new JavaField(field.identifier, field.range, javaEnum.module, field.type.resolvedType!, field.visibility);
                    f._isStatic = field.isStatic;
                    f._isFinal = field.isFinal;
                    f.classEnum = javaEnum;
                    f.documentation = field.documentation;
                    javaEnum.fields.push(f);
                }
            }

            // each enum value gets compiled to a public static final field
            for (let enumValue of enumNode.valueNodes) {
                let f: JavaField = new JavaField(enumValue.identifier, enumValue.identifierRange, javaEnum.module, javaEnum, TokenType.keywordPublic);
                f._isStatic = true;
                f._isFinal = true;
                f.classEnum = javaEnum;
                f.documentation = enumValue.documentation;
                javaEnum.fields.push(f);
            }

        }

        for (let interfaceNode of this.interfaceDeclarationNodes) {
            let javaInterface = interfaceNode.resolvedType!;
            javaInterface.initRuntimeClass(interfaceClass);

            // interfaces may have static fields...
            for (let field of interfaceNode.fieldsOrInstanceInitializers) {
                if (field.kind == TokenType.fieldDeclaration) {
                    let f: JavaField = new JavaField(field.identifier, field.range, javaInterface.module, field.type.resolvedType!, field.visibility);
                    f._isStatic = field.isStatic;
                    f._isFinal = field.isFinal;
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
                                let f: JavaField = new JavaField(field.identifier, field.range, javaClass.module, field.type.resolvedType!, field.visibility);
                                f._isStatic = field.isStatic;
                                f._isFinal = field.isFinal;
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