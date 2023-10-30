import { BaseType } from "../../common/BaseType";
import { UsagePosition } from "../../common/UsagePosition";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";

export interface JavaType extends BaseType {
    isPrimitive: boolean;
    genericInformation: GenericInformation | undefined;

    module: JavaBaseModule;
    identifierRange: IRange;

    usagePositions: UsagePosition[];

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType;

    canCastTo(otherType: JavaType): boolean;

    clearUsagePositions(): void;

}