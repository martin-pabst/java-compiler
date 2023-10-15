import { BaseType } from "../../common/BaseType";
import { GenericTypeParameter } from "./GenericInformation";

export interface JavaType extends BaseType {
    isPrimitive: boolean;
    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType;

    canCastTo(otherType: JavaType): boolean;
}