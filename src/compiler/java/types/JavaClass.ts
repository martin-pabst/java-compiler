import { UsagePosition } from "../../common/UsagePosition";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { GenericTypeParameters, GenericTypeParameter } from "./GenericTypeParameter.ts";
import { JavaTypeWithInstanceInitializer } from "./JavaTypeWithInstanceInitializer.ts";
import { GenericVariantOfJavaInterface, IJavaInterface, JavaInterface } from "./JavaInterface";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility";
import { Helpers, StepParams } from "../../common/interpreter/StepFunction.ts";



export abstract class IJavaClass extends JavaTypeWithInstanceInitializer {
    isPrimitive: false;

    constructor(identifier: string, identifierRange: IRange, path: string, module: JavaBaseModule) {
        super(identifier, identifierRange, path, module);
        this.isPrimitive = false;
    }

    abstract getFields(): Field[];
    abstract getOwnMethods(): Method[];

    abstract getExtends(): IJavaClass | undefined;
    abstract getImplements(): IJavaInterface[];

    getField(identifier: string, uptoVisibility: Visibility, forceStatic: boolean = false): Field | undefined {
        let field = this.getFields().find(f => f.identifier == identifier && f.visibility <= uptoVisibility && (f.isStatic || !forceStatic));
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

    getReifiedIdentifier(): string {
        return this.identifier;
    }

    abstract isAbstract(): boolean;

}


export class JavaClass extends IJavaClass {

    isStatic: boolean = false;
    isFinal: boolean = false;
    _isAbstract: boolean = false;

    fields: Field[] = [];
    methods: Method[] = [];

    private extends?: IJavaClass;
    private implements: IJavaInterface[] = [];

    constructor(identifier: string, identifierRange: IRange, path: string, module: JavaBaseModule) {
        super(identifier, identifierRange, path, module);
        this.genericTypeParameters = [];
    }

    getAbstractMethodsNotYetImplemented(): Method[] {

        let abstractMethods: Method[] = [];
        let concreteMethodSignatures: Map<string, Method> = new Map();

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

    findMethodWithSignature(signature: string): Method | undefined {
        for (let method of this.methods) {
            if (method.getInternalName("java") == signature) return method;
        }
        if (this.extends) {
            return (<JavaClass>this.extends).findMethodWithSignature(signature);
        }

        return undefined;
    }

    checkIfAbstractParentsAreImplemented() {
        if (!this._isAbstract) {
            let abstractMethodsNotYetImplemented: Method[] = this.getAbstractMethodsNotYetImplemented();
            if (abstractMethodsNotYetImplemented.length > 0) {
                this.module.errors.push({
                    message: "Die Klasse " + this.identifier + " muss noch folgende Methoden ihrer abstrakten Oberklassen implementieren: " + abstractMethodsNotYetImplemented.map(m => m.getSignature()).join(", "),
                    level: "error",
                    range: this.identifierRange
                })
            }
        }
    }

    takeSignaturesFromOverriddenMethods() {

        let baseClass = this.getExtends();
        let allBaseClassMethods = baseClass?.getAllMethods();
        for(let m of this.methods){
            let internalName = m.getInternalName("java");
            let baseMethod = allBaseClassMethods?.find(m1 => m1.getInternalName("java") == internalName);
            if(baseMethod){
                m.takeInternalJavaNameWithGenericParamterIdentifiersFrom(baseMethod);
            }
        }

    }


    checkIfInterfacesAreImplementedAndSupplementDefaultMethods() {
        for (let ji of this.getImplements()) {
            let javaInterface = <JavaInterface>ji;
            let notImplementedMethods: Method[] = [];
            for (let method of javaInterface.getOwnMethods()) {

                let classesMethod = this.findMethodWithSignature(method.getInternalName("java"));

                if (!classesMethod) {
                    if (method.isDefault) {
                        let copy = method.getCopy();
                        this.methods.push(copy);
                        method.callbackAfterCodeGeneration.push(() => {
                            copy.program = method.program;

                            let runtimeClass = this.runtimeClass!;
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
                        notImplementedMethods.push(method);
                    }
                } else {
                    classesMethod.takeInternalJavaNameWithGenericParamterIdentifiersFrom(method);
                }

            }

            if (notImplementedMethods.length > 0) {
                this.module.errors.push({
                    message: "Die Klasse " + this.identifier + " muss noch folgende Methoden des Interfaces " + javaInterface.identifier + " implementieren: " + notImplementedMethods.map(m => m.getSignature()).join(", "),
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

    public getFields(): Field[] {

        return this.fields;

    }

    public getOwnMethods(): Method[] {
        return this.methods;
    }

    public getAllMethods(): Method[] {
        if(this.extends){
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

        if(bType instanceof GenericTypeParameter){
            for(let ext of bType.upperBounds){
                if(!this.canImplicitlyCastTo(ext)) return false;
            }

            if(bType.catches) bType.catches.push(this);

            return true;
        }

        if (bType instanceof JavaInterface) {               // can class A cast to interface BI?
            for (let x of this.implements) {                 // A implements X
                if (x.canImplicitlyCastTo(bType)) return true;  // if x can cast to BI, then A can cast, too
            }
            return false;
        }

        if (bType instanceof JavaClass) {                   // can class A cast to class B?
            if (bType == this) return true;
            if (!this.extends) return false;               // A should at least extend Object, so this must not happen...
            return this.extends.canImplicitlyCastTo(bType); // A extends C; if C can cast to B, then also A can
        }

        if(bType instanceof GenericTypeParameter){
            for(let ext of bType.upperBounds){
                if(!this.canImplicitlyCastTo(ext)) return false;
            }

            if(bType.lowerBound && !bType.lowerBound.canImplicitlyCastTo(this)) return false;
            
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

    clearUsagePositionsAndInheritanceInformation(): void {
        this.usagePositions = [];
        this.genericTypeParameters?.forEach(gi => gi.usagePositions = []);
        this.methods.forEach(m => m.clearUsagePositions());
        this.fields.forEach(f => f.usagePositions = []);
    }
}

export class GenericVariantOfJavaClass extends IJavaClass {

    private cachedFields?: Field[];
    private cachedMethods?: Method[];

    private cachedExtends?: IJavaClass;

    private cachedImplements?: IJavaInterface[];

    public usagePositions: UsagePosition[] = [];

    constructor(public isGenericVariantOf: JavaClass, public typeMap: Map<GenericTypeParameter, NonPrimitiveType>) {
        super(isGenericVariantOf.identifier, isGenericVariantOf.identifierRange, isGenericVariantOf.pathAndIdentifier, isGenericVariantOf.module);
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

    public getFields(): Field[] {
        if (!this.cachedFields) {
            this.cachedFields = [];

            for (let field of this.isGenericVariantOf.getFields()) {
                this.cachedFields.push(field.getCopyWithConcreteType(this.typeMap));
            }
        }
        return this.cachedFields;
    }

    public getOwnMethods(): Method[] {
        if (!this.cachedMethods) {
            this.cachedMethods = [];

            for (let method of this.isGenericVariantOf.getOwnMethods()) {
                this.cachedMethods.push(method.getCopyWithConcreteType(this.typeMap));
            }
        }
        return this.cachedMethods;
    }

    public getAllMethods(): Method[] {
        let extend = this.getExtends();
        if(extend){
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

        if(otherType instanceof GenericTypeParameter){
            for(let ext of otherType.upperBounds){
                if(!this.canImplicitlyCastTo(ext)) return false;
            }

            if(otherType.catches) otherType.catches.push(this);

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

    clearUsagePositionsAndInheritanceInformation(): void {
        this.usagePositions = [];

    }

}