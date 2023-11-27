import { Thread } from "../../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { StringClass } from "../../javalang/ObjectClassStringClass";
import { NumberClass } from "./NumberClass";

/**
 * @link https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Integer.html
 */
export class IntegerClass extends NumberClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class Integer extends Number"},
        {type: "a", signature: "final static int MAX_VALUE", constantValue: 0x80000000-1},
        {type: "a", signature: "final static int MIN_VALUE", constantValue: -0x80000000},
        {type: "m", signature: "public double doubleValue()"},
        {type: "m", signature: "public float floatValue()"},
        {type: "m", signature: "public int intValue()"},
        {type: "m", signature: "public long longValue()"},
        {type: "m", signature: "public int compareTo(Integer anotherInteger)", native: IntegerClass.prototype._compareTo},
        {type: "m", signature: "public int parseInt(String s)", native: IntegerClass.prototype.parseInt},
        {type: "m", signature: "public int parseInt(String sr, int radix)", native: IntegerClass.prototype.parseInt},
        {type: "m", signature: "public static Integer valueOf(int i)", native: IntegerClass.valueOf},
        {type: "m", signature: "public static Integer valueOf(String s)", native: IntegerClass.valueOfString},
        {type: "m", signature: "public static Integer valueOf(String s, int radix)", native: IntegerClass.valueOfString},
    ]

    static type: NonPrimitiveType;

    constructor(i: number){
        super(i);
    }

    _compareTo(otherInteger: IntegerClass){
        return this.value - otherInteger.value;
    }

    parseInt(s: StringClass, radix: number = 10){
        return Number.parseInt(s.value, radix);
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