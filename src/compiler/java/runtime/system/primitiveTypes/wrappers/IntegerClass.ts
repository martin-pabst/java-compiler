import { Thread } from "../../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { StringClass } from "../../javalang/ObjectClassStringClass";
import { NumberClass } from "./NumberClass";

/**
 * @link https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Integer.html
 */
export class IntegerClass extends NumberClass {

    static __declareType(): string[] {
        return [
            "class Integer extends Number",
            "double doubleValue()",
            "float floatValue()",
            "int intValue()",
            "long longValue()",
            "int compareTo(Integer anotherInteger): compareTo",
            "int parseInt(String s): parseInt",
            "int parseInt(String s, int radix): parseInt",
            "static Integer valueOf(int i): valueOf",
            "static Integer valueOf(String s): valueOfString",
            "static Integer valueOf(String s, int radix): valueOfString",
        ]
    }

    static type: NonPrimitiveType;

    constructor(i: number){
        super(i);
    }

    compareTo(otherInteger: IntegerClass){
        return this.value - otherInteger.value;
    }

    parseInt(s: StringClass, radix: number = 10){
        return Number.parseInt(s.text, radix);
    }

    intValue(){
        return this.value;
    }

    longValue(){
        return this.value;
    }

    floatValue(){
        return this.value;
    }

    doubleValue(){
        return this.value;
    }

    static valueOf(i: number){
        new IntegerClass(i);
    }

    static valueOfString(s: string, radix: number){
        new IntegerClass(Number.parseInt(s, radix));
    }

}