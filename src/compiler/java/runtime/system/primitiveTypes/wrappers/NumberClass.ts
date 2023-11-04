import { Thread } from "../../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { ObjectClass, StringClass } from "../../javalang/ObjectClassStringClass";

/**
 * @link https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Integer.html
 */
export class NumberClass extends ObjectClass {

    value: number = 0;

    static __declareType(): string[] {
        return [
            "class Number extends Object",
            "byte byteValue(): byteValue",
            "short shortValue(): shortValue",
            "abstract double doubleValue()",
            "abstract float floatValue()",
            "abstract int intValue()",
            "abstract long longValue()",
            "String toString(): toString"
        ]
    }

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

}