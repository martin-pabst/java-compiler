import { Field } from "./Field";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";
import { JavaClassOrInterface } from "./JavaClassOrInterface";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";

export abstract class IJavaInterface implements JavaClassOrInterface {
    isPrimitive: false;
    isGenericTypeParameter: false;
    
    constructor(public identifier: string){
        this.isPrimitive = false;
        this.isGenericTypeParameter = false;
    }

    abstract getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, NonPrimitiveType>): NonPrimitiveType;
    getFields(): Field[] {return []};
    abstract getMethods(): Method[];
    abstract getExtends(): IJavaInterface[];

    abstract canCastTo(otherType: JavaType): boolean;

}


export class JavaInterface extends IJavaInterface {
    genericInformation: GenericInformation = [];

    methods: Method[] = [];

    private extends: JavaInterface[] = [];

    constructor(public identifier: string) {
        super(identifier);
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, NonPrimitiveType>): IJavaInterface {
        return new GenericVariantOfJavaInteface(this, typeMap);
    }

    getExtends(): JavaInterface[] {
        return this.extends;
    }

    public getMethods(): Method[] {
        return this.methods;
    }

    canCastTo(otherType: JavaType): boolean {
        if(!(otherType instanceof JavaInterface)) return false;

        if(otherType == this) return true;

        for(let intf of this.extends){
            if(intf.canCastTo(otherType)) return true;
        }

        return false;
    }


}


export class GenericVariantOfJavaInteface extends IJavaInterface {

    private cachedMethods?: Method[];

    private cachedExtends?: IJavaInterface[];

    constructor(public isGenericVariantOf: JavaInterface, public typeMap: Map<GenericTypeParameter, NonPrimitiveType>) {
        super(isGenericVariantOf.identifier);
    }

    getCopyWithConcreteType(otherTypeMap: Map<GenericTypeParameter, NonPrimitiveType>): IJavaInterface {
        let newTypeMap: Map<GenericTypeParameter, NonPrimitiveType> = new Map();
        let copyNeeded = false;
        this.typeMap.forEach((jt, gt) => {
            let jtCopy = jt.getCopyWithConcreteType(otherTypeMap);
            if(jt != jtCopy) copyNeeded = true;
            newTypeMap.set(gt, jt);
        })

        if(!copyNeeded) return this;

        return new GenericVariantOfJavaInteface(this.isGenericVariantOf, newTypeMap);
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

    getExtends(): IJavaInterface[]{
        if(!this.cachedExtends){
            this.cachedExtends = this.isGenericVariantOf.getExtends().map(impl => impl.getCopyWithConcreteType(this.typeMap));
        }   
        
        return this.cachedExtends;
    }

    canCastTo(otherType: JavaType): boolean {
        if(!(otherType instanceof IJavaInterface)) return false;

        // List<Integer> or ArrayList<Integer> can cast to List
        if(otherType instanceof JavaInterface){
            if(this.isGenericVariantOf.canCastTo(otherType)) return true;
            return false;
        } 

        // Now otherType instanceof GenericVariantFromJavaInteface
        // Collection<Integer> can cast to Collection<Integer> or List<? extends Number>
        let ot1 = <GenericVariantOfJavaInteface>otherType;

        if(!this.isGenericVariantOf.canCastTo(ot1.isGenericVariantOf)) return false;

        // Find concrete parameterized supertype of this.isGenericVariantFrom which is generic variant from otherType
        // ... Find concrete parameterized supertype of ArrayList<Integer> which is generic variant from List (so: find List<Integer>)
 
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

    findSuperTypeOfMeWhichIsGenericVariantOf(otherType: GenericVariantOfJavaInteface): GenericVariantOfJavaInteface | null {
        let otherTypeIsGenericVariantOf = otherType.isGenericVariantOf;
        if(otherTypeIsGenericVariantOf == this.isGenericVariantOf) return this;

        for(let st of this.getExtends()){
            if(st instanceof GenericVariantOfJavaInteface){
                let found = st.findSuperTypeOfMeWhichIsGenericVariantOf(otherType);
                if(found != null) return found;
            }
        }

        return null;
    } 


}