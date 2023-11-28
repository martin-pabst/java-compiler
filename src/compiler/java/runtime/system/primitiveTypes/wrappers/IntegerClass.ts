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
        {type: "a", signature: "static final int MAX_VALUE", constantValue: 0x80000000 - 1},
        {type: "a", signature: "static final int MIN_VALUE", constantValue: -0x80000000},
        // for doubleValue(), floatValue(), intValue() and longValue() there are methods (if called for a Number variable containing an Integer value) and templates
        // (if called fo Integer variable). Offering templates to the compiler is only possible because the methods are final.
        {type: "m", signature: "public final double doubleValue()", native: IntegerClass.prototype.doubleValue, template: "§1.value"},
        {type: "m", signature: "public final float floatValue()", native: IntegerClass.prototype.floatValue, template: "§1.value"},
        {type: "m", signature: "public final int intValue()", native: IntegerClass.prototype.intValue, template: "§1.value"},
        {type: "m", signature: "public final long longValue()", native: IntegerClass.prototype.longValue, template: "§1.value"},
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

    _compareTo(otherValue: IntegerClass){
        return this.value - otherValue.value;
    }

    parseInt(s: StringClass, radix: number = 10){
        return Number.parseInt(s.value, radix) % 0x100000000 - 0x80000000;
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
        return new IntegerClass(i);
    }

    static valueOfString(s: string, radix: number): IntegerClass {
        return new IntegerClass(Number.parseInt(s, radix) % 0x100000000 - 0x80000000);
    }

}