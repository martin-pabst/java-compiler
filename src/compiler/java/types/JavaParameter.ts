import { SymbolOnStackframe } from "../../common/BaseSymbolTable";
import { BaseType } from "../../common/BaseType";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericTypeParameter } from "./GenericTypeParameter";
import { JavaType } from "./JavaType";

export class JavaParameter extends SymbolOnStackframe {

    declare module: JavaBaseModule;

    constructor(identifier: string, identifierRange: IRange,
        module: JavaBaseModule, public type: JavaType, public isFinal: boolean, public isEllipsis: boolean, public trackMissingReadAccess: boolean) {
        super(identifier, identifierRange, module);
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaParameter {
        let newType: JavaType = this.type.getCopyWithConcreteType(typeMap);
        if (newType == this.type) return this;

        let copy = new JavaParameter(this.identifier, this.identifierRange, this.module, newType, this.isFinal, this.isEllipsis, this.trackMissingReadAccess);

        return copy;
    }

    getCopy(): JavaParameter {
        return new JavaParameter(this.identifier, this.identifierRange, this.module, this.type, this.isFinal, this.isEllipsis, this.trackMissingReadAccess);
    }

    getDeclaration(): string {
        return this.type.toString() + " " + this.identifier;
    }

    getType(): BaseType {
        return this.type;
    }

}