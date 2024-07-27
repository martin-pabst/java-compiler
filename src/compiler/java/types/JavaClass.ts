import { JCM } from "../../../tools/language/JavaCompilerMessages.ts";
import { IRange } from "../../common/range/Range";
import { TokenType, TokenTypeReadable } from "../TokenType";
import { ColorHelper } from "../lexer/ColorHelper.ts";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericTypeParameter } from "./GenericTypeParameter.ts";
import { JavaField } from "./JavaField";
import { GenericVariantOfJavaInterface, IJavaInterface, JavaInterface } from "./JavaInterface";
import { JavaMethod } from "./JavaMethod";
import { JavaType } from "./JavaType";
import { JavaTypeWithInstanceInitializer } from "./JavaTypeWithInstanceInitializer.ts";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility";

export abstract class IJavaClass extends JavaTypeWithInstanceInitializer {
    isPrimitive: false;

    constructor(identifier: string, identifierRange: IRange, path: string, module: JavaBaseModule) {
        super(identifier, identifierRange, path, module);
        this.isPrimitive = false;
    }

    abstract getFields(): JavaField[];
    abstract getOwnMethods(): JavaMethod[];

    abstract getExtends(): IJavaClass | undefined;
    abstract getImplements(): IJavaInterface[];

    getOwnAndInheritedFields(): JavaField[] {
        let fields: JavaField[] = this.getFields();

        let baseClass = this.getExtends();
        if (baseClass) {
            fields = fields.concat(baseClass.getOwnAndInheritedFields())
        }

        return fields;
    }

    getCompletionItemDetail(): string {
        return JCM.class();
    }

    getCompletionItems(visibilityUpTo: Visibility, leftBracketAlreadyThere: boolean, identifierAndBracketAfterCursor: string,
        rangeToReplace: monaco.IRange, methodContext: JavaMethod | undefined, onlyStatic?: false): monaco.languages.CompletionItem[] {

        let itemList: monaco.languages.CompletionItem[] = [];

        for (let field of this.getFields().filter(f => f.visibility <= visibilityUpTo && (f._isStatic || !onlyStatic))) {
            let isColor = this.identifier == 'Color' && field._isStatic;

            itemList.push({
                label: field.toString(),
                kind: isColor ? monaco.languages.CompletionItemKind.Color : monaco.languages.CompletionItemKind.Field,
                detail: isColor ? ColorHelper.intColorToHexRGB(ColorHelper.predefinedColors[field.identifier]) : "",
                insertText: field.identifier,
                range: rangeToReplace,
                documentation: field.documentation == null ? undefined : {
                    value: typeof field.documentation == "string" ? field.documentation : field.documentation()
                }
            });
        }

        for (let method of this.getOwnMethods().filter(m => (m.classEnumInterface == this || m.visibility != TokenType.keywordPrivate) && (m.isStatic || !onlyStatic))) {
            if (method.isConstructor) {
                if (methodContext?.isConstructor && methodContext != method && method.classEnumInterface == this.getExtends()) {
                    this.pushSuperCompletionItem(itemList, method, leftBracketAlreadyThere, rangeToReplace);
                    continue;
                } else {
                    continue;
                }
            }

            itemList.push({
                label: method.getCompletionLabel(),
                filterText: method.identifier,
                command: {
                    id: "editor.action.triggerParameterHints",
                    title: '123',
                    arguments: []
                },
                detail: method.returnParameterType ? method.returnParameterType.getDeclaration() : "void",
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: method.getCompletionSnippet(leftBracketAlreadyThere),
                range: rangeToReplace,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: method.documentation == null ? undefined : {
                    value: typeof method.documentation == "string" ? method.documentation : method.documentation()
                }
            });
        }

        if (this.getExtends()) {
            if (visibilityUpTo == TokenType.keywordPrivate) visibilityUpTo = TokenType.keywordProtected;
            itemList = itemList.concat(this.getExtends()!.getCompletionItems(visibilityUpTo, leftBracketAlreadyThere, identifierAndBracketAfterCursor,
                rangeToReplace, methodContext, onlyStatic));
        }

        return itemList;


    }

    pushSuperCompletionItem(itemList: monaco.languages.CompletionItem[], method: JavaMethod, leftBracketAlreadyThere: boolean,
        rangeToReplace: monaco.IRange) {
        itemList.push({
            label: method.getCompletionLabel().replace(method.identifier, "super"),
            filterText: "super",
            command: {
                id: "editor.action.triggerParameterHints",
                title: '123',
                arguments: []
            },
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: method.getCompletionSnippet(leftBracketAlreadyThere).replace(method.identifier, "super"),
            range: rangeToReplace,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: method.documentation == null ? undefined : {
                value: typeof method.documentation == "string" ? method.documentation : method.documentation()
            }
        });

    }


    findImplementedInterface(identifier: string): IJavaInterface | undefined {

        for (let ext of this.getImplements()) {
            let intf = ext.findImplementedInterface(identifier);
            if (intf) return intf;
        }

        if (this.getExtends()) return this.getExtends()?.findImplementedInterface(identifier);

        return undefined;
    }


    getField(identifier: string, uptoVisibility: Visibility, forceStatic: boolean = false): JavaField | undefined {
        let field = this.getFields().find(f => f.identifier == identifier && f.visibility <= uptoVisibility && (f._isStatic || !forceStatic));
        if (field) return field;
        if (uptoVisibility == TokenType.keywordPrivate) uptoVisibility = TokenType.keywordProtected;

        let baseClass = this.getExtends();
        if (baseClass) {
            return baseClass.getField(identifier, uptoVisibility, forceStatic);
        } else {
            return undefined;
        }
    }

    toString(): string {
        let s: string = this.identifier;

        if (this.genericTypeParameters && this.genericTypeParameters.length > 0) {
            s += "<" + this.genericTypeParameters.map(gi => gi.toString()).join(", ") + ">";
        }
        return s;
    }

    getAbsoluteName(): string {
        let s: string = this.pathAndIdentifier;

        if (this.genericTypeParameters && this.genericTypeParameters.length > 0) {
            s += "<" + this.genericTypeParameters.map(gi => gi.getAbsoluteName()).join(", ") + ">";
        }
        return s;
    }

    getReifiedIdentifier(): string {
        return this.identifier;
    }

    abstract isAbstract(): boolean;

    hasAncestorOrIs(objectType: NonPrimitiveType): boolean {
        if (this == objectType) return true;
        let ext = this.getExtends();
        if (ext == null) return false;
        if (ext == objectType) return true;
        return ext.hasAncestorOrIs(objectType);
    }

}


export class JavaClass extends IJavaClass {

    isStatic: boolean = false;
    _isAbstract: boolean = false;

    fields: JavaField[] = [];
    methods: JavaMethod[] = [];

    private extends?: IJavaClass;
    private implements: IJavaInterface[] = [];

    constructor(identifier: string, identifierRange: IRange, path: string, module: JavaBaseModule) {
        super(identifier, identifierRange, path, module);
        this.genericTypeParameters = [];
    }

    getAbstractMethodsNotYetImplemented(): JavaMethod[] {

        let abstractMethods: JavaMethod[] = [];
        let concreteMethodSignatures: Map<string, JavaMethod> = new Map();

        let klass: IJavaClass | undefined = this;

        while (klass) {
            for (let m of klass.getOwnMethods()) {
                if (m.isAbstract) {
                    abstractMethods.push(m);
                } else {
                    concreteMethodSignatures.set(m.getSignature(), m);
                }
            }
            klass = klass.getExtends();
        }

        let abstractMethodsNotYetImplemented = abstractMethods.filter(m => !concreteMethodSignatures.get(m.getSignature()));

        return abstractMethodsNotYetImplemented;

    }

    findMethodWithSignature(otherMethod: JavaMethod): JavaMethod | undefined {
        let otherMethodsIdentifier = otherMethod.identifier;
        let otherMethodsParameterCount = otherMethod.parameters.length;
        for (let method of this.methods) {
            if (method.identifier == otherMethodsIdentifier && method.parameters.length == otherMethodsParameterCount) {
                let parameterTypesCompatible: boolean = true;
                for (let i = 0; i < otherMethodsParameterCount; i++) {
                    let methodsParameterType = method.parameters[i].type;
                    let otherMethodsParameterType = otherMethod.parameters[i].type;
                    if (methodsParameterType && otherMethodsParameterType) {
                        if (methodsParameterType.toString() != otherMethodsParameterType.toString()) {
                            if (!(otherMethodsParameterType instanceof NonPrimitiveType && methodsParameterType instanceof NonPrimitiveType)) {
                                parameterTypesCompatible = false;
                                break;
                            } else {
                                if (!methodsParameterType.canImplicitlyCastTo(otherMethodsParameterType)) {
                                    parameterTypesCompatible = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (parameterTypesCompatible) return method;
            }
        }
        if (this.extends) {
            return (<JavaClass>this.extends).findMethodWithSignature(otherMethod);
        }

        return undefined;
    }

    checkIfAbstractParentsAreImplemented() {
        if (!this._isAbstract) {
            let abstractMethodsNotYetImplemented: JavaMethod[] = this.getAbstractMethodsNotYetImplemented();
            if (abstractMethodsNotYetImplemented.length > 0) {
                let jc = JCM.abstractMethodsNotImplemented(this.identifier, abstractMethodsNotYetImplemented.map(m => m.getSignature()).join(", "));
                this.module.errors.push({
                    message: jc.message,
                    id: jc.id,
                    level: "error",
                    range: this.identifierRange,
                })
            }
        }
    }

    takeSignaturesFromOverriddenMethods(overriddenOrImplementedMethodPaths: Record<string, boolean>) {

        let baseClass = this.getExtends();
        let allBaseClassMethods = baseClass?.getAllMethods();
        if (!allBaseClassMethods) return;

        for (let m of this.methods) {
            let internalName = m.getInternalName("java");
            let baseMethods = allBaseClassMethods?.filter(m1 => m1.getInternalName("java") == internalName);
            if (baseMethods.length > 0) {
                let baseMethod = baseMethods[0];
                m.takeInternalJavaNameWithGenericParamterIdentifiersFrom(baseMethod);
                if (baseMethod.isFinal) {
                    let jc = JCM.methodOverridesFinalMethod(m.getSignature(), baseMethod.classEnumInterface.identifier);
                    m.classEnumInterface.module.errors.push({
                        message: jc.message,
                        id: jc.id,
                        level: "error",
                        range: m.identifierRange
                    })
                }
            }
            baseMethods.forEach(m => overriddenOrImplementedMethodPaths[m.getPathWithMethodIdentifier()] = true);
        }

    }


    checkIfInterfacesAreImplementedAndSupplementDefaultMethods() {
        for (let ji of this.getImplements()) {
            let javaInterface = <JavaInterface>ji;
            let notImplementedMethods: JavaMethod[] = [];
            for (let method of javaInterface.getOwnMethods()) {

                let classesMethod = this.findMethodWithSignature(method);

                if (!classesMethod) {
                    if (method.isDefault) {
                        let copy = method.getCopy();
                        this.methods.push(copy);

                        let f = () => {
                            let runtimeClass = this.runtimeClass!;
                            let otherRuntimeClass = javaInterface.runtimeClass!;
                            let functionIdentifier = copy.getInternalNameWithGenericParameterIdentifiers("java");
                            runtimeClass.prototype[functionIdentifier] = otherRuntimeClass.prototype[functionIdentifier];
                        }

                        if (this.isLibraryType) {
                            f();
                        } else {
                            method.callbackAfterCodeGeneration.push(f);
                        }

                    } else {
                        notImplementedMethods.push(method);
                    }
                } else {
                    classesMethod.takeInternalJavaNameWithGenericParamterIdentifiersFrom(method);
                }

            }

            if (notImplementedMethods.length > 0) {
                let jc = JCM.interfaceMethodsNotImplemented(this.identifier, javaInterface.identifier, notImplementedMethods.map(m => m.getSignature()).join(", "));
                this.module.errors.push({
                    message: jc.message,
                    id: jc.id,
                    level: "error",
                    range: this.identifierRange
                })
            }
        }
    }

    isGenericVariant(): boolean {
        return false;
    }

    isGenericTypeParameter(): boolean {
        return false;
    }

    setExtends(ext: IJavaClass) {
        this.extends = ext;
    }

    addImplements(impl: IJavaInterface | IJavaInterface[]) {
        if (!Array.isArray(impl)) impl = [impl];
        this.implements = this.implements.concat(impl);
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, NonPrimitiveType>): IJavaClass {
        return new GenericVariantOfJavaClass(this, typeMap);
    }

    getExtends(): IJavaClass | undefined {
        return this.extends;
    }

    getImplements(): IJavaInterface[] {
        return this.implements;
    }

    isAbstract(): boolean {
        return this._isAbstract;
    }

    public getFields(): JavaField[] {

        return this.fields;

    }

    public getOwnMethods(): JavaMethod[] {
        return this.methods;
    }

    public getAllMethods(): JavaMethod[] {
        if (this.extends) {
            return this.methods.concat(this.extends?.getAllMethods());
        } else {
            return this.methods;
        }
    }

    public registerExtendsImplementsOnAncestors(type?: NonPrimitiveType) {
        if (type) this.registerChildType(type);

        type = type || this;

        (<JavaClass>this.extends)?.registerExtendsImplementsOnAncestors(type);
        for (let impl of this.implements) {
            (<JavaInterface>impl).registerExtendsImplementsOnAncestors(type);
        }

    }

    canImplicitlyCastTo(bType: JavaType): boolean {

        if (bType == this) return true;                   // A can cast to A.

        if (bType instanceof GenericTypeParameter) {
            for (let ext of bType.upperBounds) {
                if (!this.canImplicitlyCastTo(ext)) return false;
            }

            if (bType.lowerBound) {
                if (!bType.lowerBound.canImplicitlyCastTo(this)) return false;
            }

            if (bType.catches) bType.catches.push(this);

            return true;
        }

        if (bType instanceof IJavaInterface) {               // can class A cast to interface BI?
            for (let x of this.implements) {                 // A implements X
                if (x.canImplicitlyCastTo(bType)) return true;  // if x can cast to BI, then A can cast, too
            }

            if (this.extends) return this.extends.canImplicitlyCastTo(bType);

            return false;
        }

        if (bType instanceof JavaClass) {                   // can class A cast to class B?
            if (bType == this) return true;
            if (!this.extends) return false;               // A should at least extend Object, so this must not happen...
            return this.extends.canImplicitlyCastTo(bType); // A extends C; if C can cast to B, then also A can
        }

        if (bType instanceof GenericTypeParameter) {
            for (let ext of bType.upperBounds) {
                if (!this.canImplicitlyCastTo(ext)) return false;
            }

            if (bType.lowerBound && !bType.lowerBound.canImplicitlyCastTo(this)) return false;

            return true;
        }

        return false;

    }

    canExplicitlyCastTo(bType: JavaType): boolean {
        if (bType.isPrimitive) return false;

        if (bType == this) return true;                   // A can cast to A.

        if (this.canImplicitlyCastTo(bType)) return true;

        if (bType instanceof NonPrimitiveType) {
            return bType.canImplicitlyCastTo(this);
        }

        return false;

    }

    getDeclaration(): string {
        let decl: string = TokenTypeReadable[this.visibility] + " ";
        if (this.isStatic) decl += "static ";
        if (this.isAbstract()) decl += "abstract ";
        decl += "class " + this.identifier;
        if (this.genericTypeParameters && this.genericTypeParameters.length > 0) {
            decl += "<" + this.genericTypeParameters.map(gp => gp.getDeclaration()) + ">";
        }
        if (this.extends) decl += " extends " + this.extends.toString();
        if (this.implements.length > 0) {
            decl += " implements " + this.implements.map(impl => impl.toString()).join(", ");
        }
        return decl;
    }

}

export class GenericVariantOfJavaClass extends IJavaClass {

    private cachedFields?: JavaField[];
    private cachedMethods?: JavaMethod[];

    private cachedExtends?: IJavaClass;

    private cachedImplements?: IJavaInterface[];

    constructor(public isGenericVariantOf: JavaClass, public typeMap: Map<GenericTypeParameter, NonPrimitiveType>) {
        super(isGenericVariantOf.identifier, isGenericVariantOf.identifierRange, isGenericVariantOf.pathAndIdentifier, isGenericVariantOf.module);
        this.runtimeClass = this.isGenericVariantOf.runtimeClass;
        this.isFinal = this.isGenericVariantOf.isFinal;
    }

    toString(): string {
        let s: string = this.identifier;

        let genericInformation = this.isGenericVariantOf.genericTypeParameters;

        if (genericInformation && genericInformation.length > 0) {
            s += "<" + genericInformation.map(gi => {
                let type = this.typeMap.get(gi);
                return type?.toString();
            }).join(", ") + ">";
        }
        return s;
    }

    getAbsoluteName(): string {
        let s: string = this.pathAndIdentifier;

        let genericInformation = this.isGenericVariantOf.genericTypeParameters;

        if (genericInformation && genericInformation.length > 0) {
            s += "<" + genericInformation.map(gi => {
                let type = this.typeMap.get(gi);
                return type?.getAbsoluteName();
            }).join(", ") + ">";
        }
        return s;
    }

    getDeclaration(): string {
        let decl: string = TokenTypeReadable[this.visibility] + " ";
        if (this.isStatic) decl += "static ";
        if (this.isAbstract()) decl += "abstract ";
        decl += "class " + this.identifier;

        let genericInformation = this.isGenericVariantOf.genericTypeParameters;
        if (genericInformation && genericInformation.length > 0) {
            decl += "<" + genericInformation.map(gi => {
                let type = this.typeMap.get(gi);
                return type?.toString();
            }).join(", ") + ">";
        }
        if (this.getExtends()) decl += " extends " + this.getExtends()!.toString();
        if (this.getImplements().length > 0) {
            decl += " implements " + this.getImplements().map(impl => impl.toString()).join(", ");
        }

        return decl;
    }


    getFirstTypeParametersType(): JavaType | undefined {
        let genericInformation = this.isGenericVariantOf.genericTypeParameters;
        if (genericInformation && genericInformation.length > 0) {
            return this.typeMap.get(genericInformation[0]);
        }
        return undefined;
    }

    isAbstract(): boolean {
        return this.isGenericVariantOf.isAbstract();
    }

    isGenericVariant(): boolean {
        return true;
    }

    isGenericTypeParameter(): boolean {
        return false;
    }

    getCopyWithConcreteType(otherTypeMap: Map<GenericTypeParameter, NonPrimitiveType>): IJavaClass {
        let newTypeMap: Map<GenericTypeParameter, NonPrimitiveType> = new Map();
        let copyNeeded = false;
        this.typeMap.forEach((jt, gt) => {
            let jtCopy = jt.getCopyWithConcreteType(otherTypeMap);
            if (jt != jtCopy) copyNeeded = true;
            newTypeMap.set(gt, jt);
        })

        if (!copyNeeded) return this;

        return new GenericVariantOfJavaClass(this.isGenericVariantOf, newTypeMap);
    }

    public getFields(): JavaField[] {
        if (!this.cachedFields) {
            this.cachedFields = [];

            for (let field of this.isGenericVariantOf.getFields()) {
                this.cachedFields.push(field.getCopyWithConcreteType(this.typeMap));
            }
        }
        return this.cachedFields;
    }

    public getOwnMethods(): JavaMethod[] {
        if (!this.cachedMethods) {
            this.cachedMethods = [];

            for (let method of this.isGenericVariantOf.getOwnMethods()) {
                this.cachedMethods.push(method.getCopyWithConcreteType(this.typeMap, this));
            }
        }
        return this.cachedMethods;
    }

    public getAllMethods(): JavaMethod[] {
        let extend = this.getExtends();
        if (extend) {
            return this.getOwnMethods().concat(extend.getAllMethods());
        } else {
            return this.getOwnMethods();
        }
    }

    getExtends(): IJavaClass | undefined {
        let originalExtends = this.isGenericVariantOf.getExtends();
        if (!this.cachedExtends && originalExtends) {
            this.cachedExtends = <IJavaClass>originalExtends.getCopyWithConcreteType(this.typeMap);
        }
        return this.cachedExtends;
    }

    getImplements(): IJavaInterface[] {
        if (!this.cachedImplements) {
            this.cachedImplements = this.isGenericVariantOf.getImplements().map(impl => <IJavaInterface>impl.getCopyWithConcreteType(this.typeMap));
        }

        return this.cachedImplements;
    }

    canImplicitlyCastTo(otherType: JavaType): boolean {

        if (otherType instanceof GenericTypeParameter) {
            for (let ext of otherType.upperBounds) {
                if (!this.canImplicitlyCastTo(ext)) return false;
            }

            if (otherType.catches) otherType.catches.push(this);

            return true;
        }


        if (!(otherType instanceof NonPrimitiveType)) return false;          // we can't cast a class type to a primitive type. Auto-Unboxing is done in BinOpCastCodeGenerator.ts

        // ArrayList<Integer> can cast to List or to raw type ArrayList or to raw type List
        if (otherType instanceof JavaInterface || otherType instanceof JavaClass) {
            if (this.isGenericVariantOf.canExplicitlyCastTo(otherType)) return true;
            return false;
        }

        if (otherType instanceof GenericVariantOfJavaInterface) {

            // Now otherType instanceof GenericVariantOfJavaInterface
            // ArrayList<Integer> can cast to Collection<Integer> or Collection<? extends Number>
            let ot1 = <GenericVariantOfJavaInterface>otherType;

            if (!this.isGenericVariantOf.canImplicitlyCastTo(ot1.isGenericVariantOf)) return false;

            // Find concrete parameterized implemented interface of this.isGenericVariantOf which is generic variant of otherType
            // ... Find concrete parameterized supertype of ArrayList<Integer> which is generic variant of List (so: find List<Integer>)

            // interfaceImplementedByMeWhichIsGenericVariantOfOtherType ==> iibm
            // scenario class ArrayList<X> should get casted to List<String>
            // strategy: construct Type List<X> from ArrayList<X> and then compare X to String
            let iibm = this.findInterfaceImplementedByMeWhichIsGenericVariantOf(ot1);

            if (iibm == null) return false;

            for (let genericParameter of iibm.isGenericVariantOf.genericTypeParameters!) {
                let myType = iibm.typeMap.get(genericParameter);
                let othersType = ot1.typeMap.get(genericParameter);

                if (myType?.toString() == othersType?.toString()) continue;

                if (othersType instanceof GenericTypeParameter && othersType.isWildcard) {
                    for (let ext of othersType.upperBounds) {
                        if (myType?.canImplicitlyCastTo(ext)) return true;
                    }
                }

            }

            return true;
        }

        if (otherType instanceof GenericVariantOfJavaClass) {
            // Now otherType instanceof GenericVariantOfJavaClass
            // MyArrayList<Integer> can cast to ArrayList<Integer> or ArrayList<? extends Number>
            let ot1 = <GenericVariantOfJavaClass>otherType;

            if (!this.isGenericVariantOf.canImplicitlyCastTo(ot1.isGenericVariantOf)) return false;

            // Find concrete parameterized supertype of this.isGenericVariantFrom which is generic variant from otherType
            // ... Find concrete parameterized supertype of MyArrayList<Integer> which is generic variant from ArrayList (so: find ArrayList<Integer>)

            // superTypeOfMeWhichIsGenericVariantOfOtherType ==> smgvo
            let smgvo = this.findSuperTypeOfMeWhichIsGenericVariantOf(ot1);

            if (smgvo == null) return false;

            for (let genericParameter of smgvo.isGenericVariantOf.genericTypeParameters!) {
                let myType = smgvo.typeMap.get(genericParameter);
                let othersType = ot1.typeMap.get(genericParameter);

                if (myType?.toString() == othersType?.toString()) continue;

                if (othersType instanceof GenericTypeParameter && othersType.isWildcard) {
                    for (let ext of othersType.upperBounds) {
                        if (myType?.canImplicitlyCastTo(ext)) return true;
                    }
                }

            }

            return true;

        }

        return false;
    }

    canExplicitlyCastTo(otherType: JavaType): boolean {
        if (this.canImplicitlyCastTo(otherType)) return true;

        if (otherType instanceof NonPrimitiveType) {
            return otherType.canImplicitlyCastTo(this);
        }

        return false;

    }

    findInterfaceImplementedByMeWhichIsGenericVariantOf(otherType: GenericVariantOfJavaInterface): GenericVariantOfJavaInterface | null {

        for (let st of this.getImplements()) {
            if (st instanceof GenericVariantOfJavaInterface) {
                let found = st.findSuperTypeOfMeWhichIsGenericVariantOf(otherType);
                if (found != null) return found;
            }
        }

        return null;
    }

    findSuperTypeOfMeWhichIsGenericVariantOf(otherType: GenericVariantOfJavaClass): GenericVariantOfJavaClass | null {
        let otherTypeIsGenericVariantOf = otherType.isGenericVariantOf;
        if (otherTypeIsGenericVariantOf == this.isGenericVariantOf) return this;

        let ext = this.getExtends();

        if (!ext) return null;

        if (ext instanceof GenericVariantOfJavaClass) {
            return ext.findSuperTypeOfMeWhichIsGenericVariantOf(otherType);
        }

        return null;
    }



}