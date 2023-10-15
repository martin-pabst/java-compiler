import { Field } from "./Field";
import { JavaClass } from "./JavaClass";
import { JavaClassOrInterface } from "./JavaClassOrInterface";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";

export class GenericTypeParameter implements NonPrimitiveType {

    isPrimitive: false;
    isGenericTypeParameter: true;

    isWildcard: boolean;

    private fieldCache?: Field[];
    private methodCache?: Method[];

    /**
     * 
     * @param identifier 
     * @param upperBounds: ? extends B1 & B2 & B3...  B1 can be class or interface, B2, ... only interfaces; The type is SUBtype of B1, B2, ...
     * @param lowerBound : ? super B: the given type has B as its subtype
     */
    constructor(public identifier: string, public upperBounds: JavaClassOrInterface[] = [], public lowerBound?: JavaClass){
        this.isPrimitive = false;
        this.isGenericTypeParameter = true;
        this.isWildcard = (this.identifier == '?');
    }

    getFields(): Field[]{
        if(!this.fieldCache){
            if(this.upperBounds.length == 0){
                this.fieldCache = [];     // TODO: fields of Object class!
            } else {
                this.fieldCache = this.upperBounds[0].getFields();
            } 
        }
        return this.fieldCache;
    }

    getMethods(): Method[]{
        if(!this.methodCache){
            this.methodCache = [];
            for(let ub of this.upperBounds){
                this.methodCache = this.methodCache.concat(ub.getMethods());
            }
        }
        return this.methodCache;
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        let ownMappedType = typeMap.get(this);
        if(ownMappedType) return ownMappedType;

        return this;
    }

    canCastTo(otherType: JavaType): boolean {
        if(otherType.isPrimitive) return false;
        if(otherType == this) return true;

        if(otherType instanceof GenericTypeParameter){
            if(!otherType.lowerBound) return false;
            for(let ub of this.upperBounds){
                if(ub.canCastTo(otherType.lowerBound)) return true;
            }
            return false;
        }

        for(let ub of this.upperBounds){
            if(ub.canCastTo(otherType)) return true;
        }

        return false;
    }


}

export type GenericInformation  = GenericTypeParameter[];