import { BaseSymbol, SymbolKind } from "../../common/BaseSymbolTable";
import { UsagePosition } from "../../common/UsagePosition";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";

export class Parameter extends BaseSymbol {
    
    usagePositions: UsagePosition[] = [];

    declare type: JavaType;

    constructor(identifier: string, identifierRange: IRange,
         public module: JavaBaseModule, type: JavaType){
            super(identifier, identifierRange, type, SymbolKind.parameter);
         }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): Parameter {
        let newType: JavaType = this.type.getCopyWithConcreteType(typeMap);
        if(newType == this.type) return this;
        
        let copy = new Parameter(this.identifier, this.identifierRange, this.module, newType);

        return copy;
    }

    getValue(stack: any, stackframeStart: number) {
        throw new Error("Method not implemented.");
    }


}