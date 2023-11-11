import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "./ObjectClassStringClass";

export class EnumClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class Enum extends Object"},
        {type: "m", signature: "public String name()", native: EnumClass.prototype._name},
        {type: "m", signature: "public String ordinal()", native: EnumClass.prototype._ordinal},
    ]

    public name: string;
    public ordinal: number;

    static type: NonPrimitiveType;

    constructor(name: string, ordinal: number){
        super();
        this.name = name;
        this.ordinal = ordinal;
    }

    _name(): string {
        return this.name;
    }

    _ordinal(): number {
        return this.ordinal;
    }

}