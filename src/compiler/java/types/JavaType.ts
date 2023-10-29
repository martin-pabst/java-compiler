import { BaseType } from "../../common/BaseType";
import { IRange } from "../../common/range/Range";
import { JavaModule } from "../module/JavaModule";
import { GenericTypeParameter } from "./GenericInformation";

export interface JavaType extends BaseType {
    isPrimitive: boolean;
    
    module: JavaModule;
    identifierRange: IRange;




    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType;

    canCastTo(otherType: JavaType): boolean;

}