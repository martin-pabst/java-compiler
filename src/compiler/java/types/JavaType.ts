import { BaseType } from "../../common/BaseType";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";

export interface JavaType extends BaseType {
    isPrimitive: boolean;
    genericInformation: GenericInformation | undefined;

    module: JavaBaseModule;
    identifierRange: IRange;

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType;

    canCastTo(otherType: JavaType): boolean;

}