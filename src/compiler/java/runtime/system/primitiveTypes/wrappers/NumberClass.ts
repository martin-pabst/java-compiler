import { CallbackFunction } from "../../../../../common/interpreter/StepFunction";
import { Thread } from "../../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { ObjectClass, StringClass } from "../../javalang/ObjectClassStringClass";

/**
 * @link https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Integer.html
 */
export class NumberClass extends ObjectClass {

    value: number = 0;

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "abstract class Number extends Object"},
        {type: "method", signature: "public byte byteValue()", native: NumberClass.prototype.byteValue},
        {type: "method", signature: "public short shortValue()", native: NumberClass.prototype.shortValue},
        {type: "method", signature: "abstract public double doubleValue()"},
        {type: "method", signature: "abstract public float floatValue()"},
        {type: "method", signature: "abstract public int intValue()"},
        {type: "method", signature: "abstract public long longValue()"},
        {type: "method", signature: "public String toString()", native: NumberClass.prototype.toString, java: NumberClass.prototype._mj$toString$String$}
    ]

    static type: NonPrimitiveType;

    constructor(n: number){
        super();
        this.value = n;
    }

    byteValue(){
        return (Math.trunc(this.value) + 0x80) % 0x100 - 0x80;
    }

    shortValue(){
        return (Math.trunc(this.value) + 0x8000) % 0x10000 - 0x8000;
    }

    toString(): StringClass {
        return new StringClass("" + this.value);
    }

    _mj$toString$String$(t: Thread, callback: CallbackFunction) {
        t.s.push(new StringClass("" + this.value));
        if(callback) callback();
    }

}