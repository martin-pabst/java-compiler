import { UsagePosition } from "../../common/UsagePosition";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";

export class Parameter {

    usagePositions: UsagePosition[] = [];

    constructor(public identifier: string, public identifierRange: IRange,
         public module: JavaBaseModule, public type: JavaType){}

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): Parameter {
        let newType: JavaType = this.type.getCopyWithConcreteType(typeMap);
        if(newType == this.type) return this;
        
        let copy = new Parameter(this.identifier, this.identifierRange, this.module, newType);

        return copy;
    }



}