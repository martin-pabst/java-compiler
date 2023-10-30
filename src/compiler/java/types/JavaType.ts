import { BaseType } from "../../common/BaseType";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";

export abstract class JavaType extends BaseType {
    isPrimitive: boolean;
    genericInformation: GenericInformation | undefined;

    abstract getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType;

    abstract canCastTo(otherType: JavaType): boolean;

    constructor(identifier: string, identifierRange: IRange, public module: JavaBaseModule){
        super(identifier, identifierRange, module.file);
        this.isPrimitive = false;
    }

}