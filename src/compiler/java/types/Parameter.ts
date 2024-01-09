import { SymbolOnStackframe } from "../../common/BaseSymbolTable";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericTypeParameter } from "./GenericTypeParameter";
import { JavaType } from "./JavaType";

export class Parameter extends SymbolOnStackframe {

    declare module: JavaBaseModule;

    constructor(identifier: string, identifierRange: IRange,
        module: JavaBaseModule, public type: JavaType, public isFinal: boolean, public isEllipsis: boolean, public trackMissingReadAccess: boolean) {
        super(identifier, identifierRange, module);
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): Parameter {
        let newType: JavaType = this.type.getCopyWithConcreteType(typeMap);
        if (newType == this.type) return this;

        let copy = new Parameter(this.identifier, this.identifierRange, this.module, newType, this.isFinal, this.isEllipsis, this.trackMissingReadAccess);

        return copy;
    }

    getValue(stack: any, stackframeStart: number) {
        throw new Error("Method not implemented.");
    }

    getCopy(): Parameter {
        return new Parameter(this.identifier, this.identifierRange, this.module, this.type, this.isFinal, this.isEllipsis, this.trackMissingReadAccess);
    }

}