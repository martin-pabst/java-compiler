import { UsagePosition } from "../../common/UsagePosition";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";
import { JavaTypeWithInstanceInitializer } from "./JavaTypeWithInstanceInitializer.ts";
import { GenericVariantOfJavaInterface, IJavaInterface, JavaInterface } from "./JavaInterface";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility";



export abstract class IJavaClass extends JavaTypeWithInstanceInitializer {
    isPrimitive: false;
    genericInformation: GenericInformation | undefined = undefined;

    public usagePositions: UsagePosition[] = [];

    
    constructor(identifier: string, module: JavaBaseModule, identifierRange: IRange){
        super(identifier, identifierRange, module);        
        this.isPrimitive = false;
    }

    abstract getFields(): Field[];
    abstract getMethods(): Method[];

    abstract getExtends(): IJavaClass | undefined;    
    abstract getImplements(): IJavaInterface[];

    getField(identifier: string, uptoVisibility: Visibility, forceStatic: boolean = false): Field | undefined {
            let field = this.getFields().find(f => f.identifier == identifier && f.visibility <= uptoVisibility && (f.isStatic || !forceStatic));
            if(field) return field;
            if(uptoVisibility == TokenType.keywordPrivate) uptoVisibility = TokenType.keywordProtected;

            let baseClass = this.getExtends();
            if(baseClass){
                return baseClass.getField(identifier, uptoVisibility, forceStatic);
            } else {
                return undefined;
            }
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


export class JavaClass extends IJavaClass {
    genericInformation: GenericInformation = [];

    isStatic: boolean = false;
    isFinal: boolean = false;
    isAbstract: boolean = false;

    fields: Field[] = [];
    methods: Method[] = [];

    visibility: Visibility = TokenType.keywordPublic;
    enclosingParent: JavaClass | undefined = undefined;

    private extends?: IJavaClass;
    private implements: IJavaInterface[] = [];

    constructor(identifier: string, module: JavaBaseModule, identifierRange: IRange) {
        super(identifier, module, identifierRange);
    }


    findMethodWithSignature(signature: string): Method | undefined {
        for(let method of this.methods){
            if(method.getInternalName("java") == signature) return method;
        }
        if(this.extends){
            return (<JavaClass>this.extends).findMethodWithSignature(signature);
        }

        return undefined;
    }

    isGenericVariant(): boolean {
        return false;
    }

    isGenericTypeParameter(): boolean {
        return false;
    }

    setExtends(ext: IJavaClass){
        this.extends = ext;
    }

    addImplements(impl: IJavaInterface | IJavaInterface[]){
        if(!Array.isArray(impl)) impl = [impl];
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



    public getFields(): Field[] {

        return this.fields;

    }

    public getMethods(): Method[] {
        return this.methods;
    }

    public registerExtendsImplementsOnAncestors(type?: NonPrimitiveType){
        if(type) this.registerChildType(type);

        type = type || this;

        (<JavaClass>this.extends)?.registerExtendsImplementsOnAncestors(type);
        for(let impl of this.implements){
            (<JavaInterface>impl).registerExtendsImplementsOnAncestors(type);
        }
    
    }

    canImplicitlyCastTo(otherType: JavaType): boolean {
        if(otherType instanceof JavaInterface){
            for(let intf of this.implements){
                if(intf.canExplicitlyCastTo(otherType)) return true;
            }
            return false;
        }

        if(otherType instanceof JavaClass){
            if(otherType == this) return true;
            if(!this.extends) return false;
            return this.extends.canExplicitlyCastTo(otherType);
        }

        return false;

    }

    canExplicitlyCastTo(otherType: JavaType): boolean {
        if(otherType.isPrimitive) return false;

        if(this.canImplicitlyCastTo(otherType)) return true;

        if(otherType instanceof NonPrimitiveType){
            return otherType.canImplicitlyCastTo(this);
        }

        return false;

    }

    clearUsagePositionsAndInheritanceInformation(): void {
        this.usagePositions = [];
        this.genericInformation.forEach(gi => gi.usagePositions = []);
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

    getCopyWithConcreteType(otherTypeMap: Map<GenericTypeParameter, NonPrimitiveType>): IJavaClass {
        let newTypeMap: Map<GenericTypeParameter, NonPrimitiveType> = new Map();
        let copyNeeded = false;
        this.typeMap.forEach((jt, gt) => {
            let jtCopy = jt.getCopyWithConcreteType(otherTypeMap);
            if(jt != jtCopy) copyNeeded = true;
            newTypeMap.set(gt, jt);
        })

        if(!copyNeeded) return this;

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

    public getMethods(): Method[] {
        if (!this.cachedMethods) {
            this.cachedMethods = [];

            for (let method of this.isGenericVariantOf.getMethods()) {
                this.cachedMethods.push(method.getCopyWithConcreteType(this.typeMap));
            }
        }
        return this.cachedMethods;
    }

    getExtends(): IJavaClass | undefined{
        let originalExtends = this.isGenericVariantOf.getExtends();
        if(!this.cachedExtends && originalExtends){
            this.cachedExtends = <IJavaClass>originalExtends.getCopyWithConcreteType(this.typeMap);
        }
        return this.cachedExtends;
    }

    getImplements(): IJavaInterface[]{
        if(!this.cachedImplements){
            this.cachedImplements = this.isGenericVariantOf.getImplements().map(impl => <IJavaInterface>impl.getCopyWithConcreteType(this.typeMap));
        }   
        
        return this.cachedImplements;
    }

    canImplicitlyCastTo(otherType: JavaType): boolean {
        if(!(otherType instanceof NonPrimitiveType)) return false;

        // ArrayList<Integer> can cast to List or to ArrayList
        if(otherType instanceof JavaInterface || otherType instanceof JavaClass){
            if(this.isGenericVariantOf.canExplicitlyCastTo(otherType)) return true;
            return false;
        } 

        if(otherType instanceof GenericVariantOfJavaInterface){

            // Now otherType instanceof GenericVariantOfJavaInterface
            // ArrayList<Integer> can cast to Collection<Integer> or Collection<? extends Number>
            let ot1 = <GenericVariantOfJavaInterface>otherType;
    
            if(!this.isGenericVariantOf.canExplicitlyCastTo(ot1.isGenericVariantOf)) return false;
    
            // Find concrete parameterized supertype of this.isGenericVariantFrom which is generic variant from otherType
            // ... Find concrete parameterized supertype of ArrayList<Integer> which is generic variant from List (so: find List<Integer>)
     
            // superTypeOfMeWhichIsGenericVariantOfOtherType ==> smgvo
            let iibm = this.findInterfaceImplementedByMeWhichIsGenericVariantOf(ot1);
    
            if(iibm == null) return false;
            
            for(let genericParameter of iibm.isGenericVariantOf.genericInformation){
                let myType = iibm.typeMap.get(genericParameter);
                let othersType = ot1.typeMap.get(genericParameter);
    
                if(myType?.toString() == othersType?.toString()) continue;
    
                if(othersType instanceof GenericTypeParameter && othersType.isWildcard){
                    for(let ext of othersType.upperBounds){
                        if(myType?.canExplicitlyCastTo(ext)) return true;
                    }
                }
    
            }
    
            return true;
        }

        if(otherType instanceof GenericVariantOfJavaClass){
            // Now otherType instanceof GenericVariantOfJavaClass
            // MyArrayList<Integer> can cast to ArrayList<Integer> or ArrayList<? extends Number>
            let ot1 = <GenericVariantOfJavaClass>otherType;
    
            if(!this.isGenericVariantOf.canExplicitlyCastTo(ot1.isGenericVariantOf)) return false;
    
            // Find concrete parameterized supertype of this.isGenericVariantFrom which is generic variant from otherType
            // ... Find concrete parameterized supertype of MyArrayList<Integer> which is generic variant from ArrayList (so: find ArrayList<Integer>)
     
            // superTypeOfMeWhichIsGenericVariantOfOtherType ==> smgvo
            let smgvo = this.findSuperTypeOfMeWhichIsGenericVariantOf(ot1);
    
            if(smgvo == null) return false;
            
            for(let genericParameter of smgvo.isGenericVariantOf.genericInformation){
                let myType = smgvo.typeMap.get(genericParameter);
                let othersType = ot1.typeMap.get(genericParameter);
    
                if(myType?.toString() == othersType?.toString()) continue;
    
                if(othersType instanceof GenericTypeParameter && othersType.isWildcard){
                    for(let ext of othersType.upperBounds){
                        if(myType?.canExplicitlyCastTo(ext)) return true;
                    }
                }
    
            }
    
            return true;

        }

        return false;
    }

    canExplicitlyCastTo(otherType: JavaType): boolean {
        if(this.canImplicitlyCastTo(otherType)) return true;

        if(otherType instanceof NonPrimitiveType){
            return otherType.canImplicitlyCastTo(this);
        }

        return false;

    }

    findInterfaceImplementedByMeWhichIsGenericVariantOf(otherType: GenericVariantOfJavaInterface): GenericVariantOfJavaInterface | null {

        for(let st of this.getImplements()){
            if(st instanceof GenericVariantOfJavaInterface){
                let found = st.findSuperTypeOfMeWhichIsGenericVariantOf(otherType);
                if(found != null) return found;
            }
        }

        return null;
    } 

    findSuperTypeOfMeWhichIsGenericVariantOf(otherType: GenericVariantOfJavaClass): GenericVariantOfJavaClass | null {
        let otherTypeIsGenericVariantOf = otherType.isGenericVariantOf;
        if(otherTypeIsGenericVariantOf == this.isGenericVariantOf) return this;

        let ext = this.getExtends();

        if(!ext) return null;

        if(ext instanceof GenericVariantOfJavaClass){
            return ext.findSuperTypeOfMeWhichIsGenericVariantOf(otherType);
        }

        return null;
    } 

    clearUsagePositionsAndInheritanceInformation(): void {
        this.usagePositions = [];

    }

}