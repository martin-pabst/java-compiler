import { Field } from "./Field";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";
import { JavaClassOrInterface } from "./JavaClassOrInterface";
import { GenericVariantOfJavaInteface, IJavaInterface, JavaInterface } from "./JavaInterface";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";



export abstract class IJavaClass implements JavaClassOrInterface {
    isPrimitive: false;
    isGenericTypeParameter: false;
    
    constructor(public identifier: string){
        this.isPrimitive = false;
        this.isGenericTypeParameter = false;
    }

    abstract getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType;
    abstract getFields(): Field[];
    abstract getMethods(): Method[];
    abstract getExtends(): IJavaClass | undefined;
    abstract getImplements(): IJavaInterface[];
    abstract canCastTo(otherType: JavaType): boolean;

}


export class JavaClass extends IJavaClass {
    genericInformation: GenericInformation = [];

    fields: Field[] = [];
    methods: Method[] = [];

    private extends?: JavaClass;
    private implements: JavaInterface[] = [];

    constructor(public identifier: string) {
        super(identifier);
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, NonPrimitiveType>): IJavaClass {
        return new GenericVariantOfJavaClass(this, typeMap);
    }

    getExtends(): JavaClass | undefined{
        return this.extends;
    }

    getImplements(): JavaInterface[]{
        return this.implements;
    }



    public getFields(): Field[] {

        return this.fields;

    }

    public getMethods(): Method[] {
        return this.methods;
    }

    canCastTo(otherType: JavaType): boolean {
        if(otherType.isPrimitive) return false;
        if(otherType instanceof JavaInterface){
            for(let intf of this.implements){
                if(intf.canCastTo(otherType)) return true;
            }
            return false;
        }

        if(otherType instanceof JavaClass){
            if(otherType == this) return true;
            if(!this.extends) return false;
            return this.extends.canCastTo(otherType);
        }

        return false;
    }


}

export class GenericVariantOfJavaClass extends IJavaClass {

    private cachedFields?: Field[];
    private cachedMethods?: Method[];

    private cachedExtends?: IJavaClass;

    private cachedImplements?: IJavaInterface[];

    constructor(public isGenericVariantOf: JavaClass, public typeMap: Map<GenericTypeParameter, NonPrimitiveType>) {
        super(isGenericVariantOf.identifier);
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
            this.cachedExtends = originalExtends.getCopyWithConcreteType(this.typeMap);
        }
        return this.cachedExtends;
    }

    getImplements(): IJavaInterface[]{
        if(!this.cachedImplements){
            this.cachedImplements = this.isGenericVariantOf.getImplements().map(impl => impl.getCopyWithConcreteType(this.typeMap));
        }   
        
        return this.cachedImplements;
    }

    canCastTo(otherType: JavaType): boolean {
        if(!(otherType instanceof IJavaInterface)) return false;

        // ArrayList<Integer> can cast to List or to ArrayList
        if(otherType instanceof JavaInterface || otherType instanceof JavaClass){
            if(this.isGenericVariantOf.canCastTo(otherType)) return true;
            return false;
        } 

        if(otherType instanceof GenericVariantOfJavaInteface){

            // Now otherType instanceof GenericVariantOfJavaInterface
            // ArrayList<Integer> can cast to Collection<Integer> or Collection<? extends Number>
            let ot1 = <GenericVariantOfJavaInteface>otherType;
    
            if(!this.isGenericVariantOf.canCastTo(ot1.isGenericVariantOf)) return false;
    
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
                        if(myType?.canCastTo(ext)) return true;
                    }
                }
    
            }
    
            return true;
        }

        if(otherType instanceof GenericVariantOfJavaClass){
            // Now otherType instanceof GenericVariantOfJavaClass
            // MyArrayList<Integer> can cast to ArrayList<Integer> or ArrayList<? extends Number>
            let ot1 = <GenericVariantOfJavaClass>otherType;
    
            if(!this.isGenericVariantOf.canCastTo(ot1.isGenericVariantOf)) return false;
    
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
                        if(myType?.canCastTo(ext)) return true;
                    }
                }
    
            }
    
            return true;

        }

        return false;
    }

    findInterfaceImplementedByMeWhichIsGenericVariantOf(otherType: GenericVariantOfJavaInteface): GenericVariantOfJavaInteface | null {

        for(let st of this.getImplements()){
            if(st instanceof GenericVariantOfJavaInteface){
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


}