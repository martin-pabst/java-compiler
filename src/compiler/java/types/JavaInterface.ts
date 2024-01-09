import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { GenericTypeParameters, GenericTypeParameter } from "./GenericTypeParameter";
import { JavaClass } from "./JavaClass";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility";

export abstract class IJavaInterface extends NonPrimitiveType {

    constructor(public identifier: string, public identifierRange: IRange, path: string, public module: JavaBaseModule) {
        super(identifier, identifierRange, path, module);
    }

    getFile(): File {
        return this.module.file;
    }

    getFields(): Field[] { return [] };

    abstract getOwnMethods(): Method[];

    abstract getExtends(): IJavaInterface[];

    abstract isFunctionalInterface(): boolean;

    findImplementedInterface(identifier: string): IJavaInterface | undefined {
        if(this.identifier == identifier) return this;
        for(let ext of this.getExtends()){
            let intf = ext.findImplementedInterface(identifier);
            if(intf) return intf;
        }
        return undefined;
    }

    getField(identifier: string, uptoVisibility: Visibility, forceStatic: boolean = false): Field | undefined {
        let field = this.getFields().find(f => f.identifier == identifier && f.visibility <= uptoVisibility && (f.isStatic || !forceStatic));
        if (field) return field;
        if (uptoVisibility == TokenType.keywordPrivate) uptoVisibility = TokenType.keywordProtected;
        for(let interf of this.getExtends()){
            field = interf.getField(identifier, uptoVisibility, forceStatic);
            if(field) return field
        }
        return undefined;
    }

    toString(): string {
        let s: string = this.identifier;
        
        if(this.genericTypeParameters && this.genericTypeParameters.length > 0){
            s += "<" + this.genericTypeParameters.map(gi => gi.toString()).join(", ") + ">";
        }
        return s;
    }

    getReifiedIdentifier(): string {
        return this.identifier;
    }

}


export class JavaInterface extends IJavaInterface {

    methods: Method[] = [];
    fields: Field[] = [];               // A interface may have fields, but they must be static final

    private extends: IJavaInterface[] = [];

    constructor(identifier: string, identifierRange: IRange, path: string, module: JavaBaseModule) {
        super(identifier, identifierRange, path, module);
        this.genericTypeParameters = [];
    }

    isFunctionalInterface(): boolean {
        return this.methods.length == 1;
    }

    getFields(): Field[] {
        return this.fields;
    }

    isGenericVariant(): boolean {
        return false;
    }

    isGenericTypeParameter(): boolean {
        return false;
    }

    addExtends(ext: IJavaInterface | IJavaInterface[]) {
        if (!Array.isArray(ext)) ext = [ext];
        this.extends = this.extends.concat(ext);
    }

    public registerExtendsImplementsOnAncestors(type?: NonPrimitiveType) {
        if (type) this.registerChildType(type);

        type = type || this;

        for (let impl of this.extends) {
            (<JavaInterface>impl).registerExtendsImplementsOnAncestors(type);
        }

    }


    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, NonPrimitiveType>): IJavaInterface {
        return new GenericVariantOfJavaInterface(this, typeMap);
    }

    getExtends(): IJavaInterface[] {
        return this.extends;
    }

    public getOwnMethods(): Method[] {
        return this.methods;
    }

    public getAllMethods(): Method[] {
        let methods: Method[] = this.methods;
        for(let impl of this.extends){
            methods = methods.concat(impl.getAllMethods());
        }    
        return methods;
    }

    private getAllInheritedMethodsHelper(alreadyFoundSignatureMap: Map<string, Method>) {
        for(let m of this.methods){
            let signature = m.getInternalName("java");
            if(!alreadyFoundSignatureMap.get(signature)){
                alreadyFoundSignatureMap.set(signature, m);
            }
        }
        for(let intf of this.extends){
            (<JavaInterface>intf).getAllInheritedMethodsHelper(alreadyFoundSignatureMap);
        }
    }

    public getAllInheritedMethods(): Method[] {
        let map: Map<string, Method> = new Map();
        this.getAllInheritedMethodsHelper(map);
        let list: Method[] = [];
        map.forEach((method, signatur) => list.push(method));
        return list;
    }

    canImplicitlyCastTo(otherType: JavaType): boolean {
        if(otherType instanceof GenericTypeParameter){
            for(let ext of otherType.upperBounds){
                if(!this.canImplicitlyCastTo(ext)) return false;
            }

            if(otherType.catches) otherType.catches.push(this);

            return true;
        }

        if (!(otherType instanceof JavaInterface)) return false;

        if (otherType == this) return true;

        for (let intf of this.extends) {
            if (intf.canImplicitlyCastTo(otherType)) return true;
        }

        if(otherType.identifier == 'Object') return true;


        return false;
    }

    canExplicitlyCastTo(otherType: JavaType): boolean {
        if (this.canImplicitlyCastTo(otherType)) return true;
        if (otherType instanceof NonPrimitiveType) {
            return otherType.canImplicitlyCastTo(this);
        }

        return false;
    }

}


export class GenericVariantOfJavaInterface extends IJavaInterface {

    private cachedMethods?: Method[];

    private cachedExtends?: IJavaInterface[];

    constructor(public isGenericVariantOf: JavaInterface, public typeMap: Map<GenericTypeParameter, NonPrimitiveType>) {
        super(isGenericVariantOf.identifier, isGenericVariantOf.identifierRange, isGenericVariantOf.pathAndIdentifier, isGenericVariantOf.module);
        this.runtimeClass = isGenericVariantOf.runtimeClass;
    }

    getFirstTypeParametersType(): JavaType | undefined {
        let genericInformation = this.isGenericVariantOf.genericTypeParameters;
        if(genericInformation && genericInformation.length > 0){
            return this.typeMap.get(genericInformation[0]);
        }
        return undefined;
    }

    isFunctionalInterface(): boolean {
        return this.isGenericVariantOf.isFunctionalInterface();
    }

    toString(): string {
        let s: string = this.identifier;

        let genericTypeParameters = this.isGenericVariantOf.genericTypeParameters;
        
        if(genericTypeParameters && genericTypeParameters.length > 0){
            s += "<" + genericTypeParameters.map(gi => {
                let type = this.typeMap.get(gi);
                return type?.toString();
            }).join(", ") + ">";
        }
        return s;
    }

    isGenericVariant(): boolean {
        return true;
    }

    isGenericTypeParameter(): boolean {
        return false;
    }

    getCopyWithConcreteType(otherTypeMap: Map<GenericTypeParameter, NonPrimitiveType>): IJavaInterface {
        let newTypeMap: Map<GenericTypeParameter, NonPrimitiveType> = new Map();
        let copyNeeded = false;
        this.typeMap.forEach((jt, gt) => {
            let jtCopy = jt.getCopyWithConcreteType(otherTypeMap);
            if (jt != jtCopy) copyNeeded = true;
            newTypeMap.set(gt, <NonPrimitiveType>jtCopy);
        })

        if (!copyNeeded) return this;

        return new GenericVariantOfJavaInterface(this.isGenericVariantOf, newTypeMap);
    }

    public getOwnMethods(): Method[] {
        if (!this.cachedMethods) {
            this.cachedMethods = [];

            for (let method of this.isGenericVariantOf.getOwnMethods()) {
                this.cachedMethods.push(method.getCopyWithConcreteType(this.typeMap, this));
            }
        }
        return this.cachedMethods;
    }


    public getAllMethods(): Method[] {
        let methods: Method[] = this.getOwnMethods();
        for(let impl of this.getExtends()){
            methods = methods.concat(impl.getAllMethods());
        }    
        return methods;
    }

    getExtends(): IJavaInterface[] {
        if (!this.cachedExtends) {
            this.cachedExtends = this.isGenericVariantOf.getExtends().map(impl => <IJavaInterface>impl.getCopyWithConcreteType(this.typeMap));
        }

        return this.cachedExtends;
    }

    canExplicitlyCastTo(otherType: JavaType): boolean {
        if (this.canImplicitlyCastTo(otherType)) return true;

        if (otherType instanceof NonPrimitiveType) {
            return otherType.canImplicitlyCastTo(this);
        }

        return false;
    }

    canImplicitlyCastTo(otherType: JavaType): boolean {

        if(otherType instanceof GenericTypeParameter){
            for(let ext of otherType.upperBounds){
                if(!this.canImplicitlyCastTo(ext)) return false;
            }

            if(otherType.catches) otherType.catches.push(this);

            return true;
        }


        if (!(otherType instanceof IJavaInterface)) return false;

        // List<Integer> or ArrayList<Integer> can cast to List
        if (otherType instanceof JavaInterface) {
            if (this.isGenericVariantOf.canImplicitlyCastTo(otherType)) return true;
            return false;
        }

        // Now otherType instanceof GenericVariantFromJavaInteface
        // Collection<Integer> can cast to Collection<Integer> or List<? extends Number>
        let ot1 = <GenericVariantOfJavaInterface><any>otherType;

        if (!this.isGenericVariantOf.canImplicitlyCastTo(ot1.isGenericVariantOf)) return false;

        // Find concrete parameterized supertype of this.isGenericVariantFrom which is generic variant from otherType
        // ... Find concrete parameterized supertype of ArrayList<Integer> which is generic variant from List (so: find List<Integer>)

        // superTypeOfMeWhichIsGenericVariantOfOtherType ==> smgvo
        let smgvo = this.findSuperTypeOfMeWhichIsGenericVariantOf(ot1);

        if (smgvo == null) return false;

        for (let genericParameter of smgvo.isGenericVariantOf.genericTypeParameters!) {
            let myType = smgvo.typeMap.get(genericParameter);
            let othersType = ot1.typeMap.get(genericParameter);

            if(!myType || !othersType) return false;

            let othersTypeIsGenericWildcardParameter = othersType instanceof GenericTypeParameter && othersType.isWildcard;

            if(!(myType.canImplicitlyCastTo(othersType) && (othersTypeIsGenericWildcardParameter || othersType.canImplicitlyCastTo(myType)))) {
                return false;
            }

        }

        return true;
    }

    findSuperTypeOfMeWhichIsGenericVariantOf(otherType: GenericVariantOfJavaInterface): GenericVariantOfJavaInterface | null {
        let otherTypeIsGenericVariantOf = otherType.isGenericVariantOf;
        if (otherTypeIsGenericVariantOf == this.isGenericVariantOf) return this;

        for (let st of this.getExtends()) {
            if (st instanceof GenericVariantOfJavaInterface) {
                let found = st.findSuperTypeOfMeWhichIsGenericVariantOf(otherType);
                if (found != null) return found;
            }
        }

        return null;
    }

}