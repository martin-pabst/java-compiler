import { GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";

export abstract class PrimitiveType implements JavaType {
    isPrimitive: boolean;
    isGenericTypeParameter: boolean;

    constructor(public identifier: string){
        this.isPrimitive = true;
        this.isGenericTypeParameter = false;
    }

    getCopyWithConcreteType(_typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        return this;
    }

    abstract canCastTo(otherType: JavaType): boolean;
}