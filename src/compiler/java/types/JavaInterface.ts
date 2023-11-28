import { UsagePosition } from "../../common/UsagePosition";
import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";
import { JavaClass } from "./JavaClass";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility";

export abstract class IJavaInterface extends NonPrimitiveType {

    constructor(public identifier: string, public module: JavaBaseModule, public identifierRange: IRange) {
        super(identifier, identifierRange, module);
    }

    getFile(): File {
        return this.module.file;
    }

    getFields(): Field[] { return [] };

    abstract getMethods(): Method[];

    abstract getExtends(): IJavaInterface[];


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
        
        if(this.genericInformation && this.genericInformation.length > 0){
            s += "<" + this.genericInformation.map(gi => gi.toString()).join(", ") + ">";
        }
        return s;
    }

    getReifiedIdentifier(): string {
        return this.identifier;
    }

}


export class JavaInterface extends IJavaInterface {
    genericInformation: GenericInformation = [];

    methods: Method[] = [];
    fields: Field[] = [];               // A interface may have fields, but they must be static final

    private extends: IJavaInterface[] = [];

    visibility: Visibility = TokenType.keywordPublic;
    enclosingParent: JavaClass | undefined = undefined;

    public usagePositions: UsagePosition[] = [];

    constructor(identifier: string, module: JavaBaseModule, declarationRange: IRange) {
        super(identifier, module, declarationRange);
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

    public getMethods(): Method[] {
        return this.methods;
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
        if (!(otherType instanceof JavaInterface)) return false;

        if (otherType == this) return true;

        for (let intf of this.extends) {
            if (intf.canExplicitlyCastTo(otherType)) return true;
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

    clearUsagePositionsAndInheritanceInformation(): void {
        this.usagePositions = [];
        this.genericInformation.forEach(gi => gi.usagePositions = []);
        this.methods.forEach(m => m.clearUsagePositions());
    }
}


export class GenericVariantOfJavaInterface extends IJavaInterface {

    private cachedMethods?: Method[];

    private cachedExtends?: IJavaInterface[];

    public usagePositions: UsagePosition[] = [];

    constructor(public isGenericVariantOf: JavaInterface, public typeMap: Map<GenericTypeParameter, NonPrimitiveType>) {
        super(isGenericVariantOf.identifier, isGenericVariantOf.module, isGenericVariantOf.identifierRange);
    }

    toString(): string {
        let s: string = this.identifier;

        let genericInformation = this.isGenericVariantOf.genericInformation;
        
        if(genericInformation && genericInformation.length > 0){
            s += "<" + genericInformation.map(gi => {
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
            newTypeMap.set(gt, jt);
        })

        if (!copyNeeded) return this;

        return new GenericVariantOfJavaInterface(this.isGenericVariantOf, newTypeMap);
    }

    public getMethods(): Method[] {
        if (!this.cachedMethods) {
            this.cachedMethods = [];

            for (let method of this.isGenericVariantOf.getMethods()) {
                this.cachedMethods.push(method.getCopyWithConcreteType(this.typeMap));
            }
        }
        return this.cachedMethods;
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
        if (!(otherType instanceof IJavaInterface)) return false;

        // List<Integer> or ArrayList<Integer> can cast to List
        if (otherType instanceof JavaInterface) {
            if (this.isGenericVariantOf.canExplicitlyCastTo(otherType)) return true;
            return false;
        }

        // Now otherType instanceof GenericVariantFromJavaInteface
        // Collection<Integer> can cast to Collection<Integer> or List<? extends Number>
        let ot1 = <GenericVariantOfJavaInterface><any>otherType;

        if (!this.isGenericVariantOf.canExplicitlyCastTo(ot1.isGenericVariantOf)) return false;

        // Find concrete parameterized supertype of this.isGenericVariantFrom which is generic variant from otherType
        // ... Find concrete parameterized supertype of ArrayList<Integer> which is generic variant from List (so: find List<Integer>)

        // superTypeOfMeWhichIsGenericVariantOfOtherType ==> smgvo
        let smgvo = this.findSuperTypeOfMeWhichIsGenericVariantOf(ot1);

        if (smgvo == null) return false;

        for (let genericParameter of smgvo.isGenericVariantOf.genericInformation) {
            let myType = smgvo.typeMap.get(genericParameter);
            let othersType = ot1.typeMap.get(genericParameter);

            if (myType?.toString() == othersType?.toString()) continue;

            if (othersType instanceof GenericTypeParameter && othersType.isWildcard) {
                for (let ext of othersType.upperBounds) {
                    if (myType?.canExplicitlyCastTo(ext)) return true;
                }
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

    clearUsagePositionsAndInheritanceInformation(): void {
        this.usagePositions = [];
    }

}