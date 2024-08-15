import { Thread } from "../../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { StringClass } from "../../javalang/ObjectClassStringClass";
import { NumberClass } from "./NumberClass";

/**
 * @link https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Integer.html
 */
export class IntegerClass extends NumberClass {

    static isPrimitiveTypeWrapper: boolean = true;

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Integer extends Number implements Comparable<Integer>"},
        {type: "field", signature: "static final int MAX_VALUE", constantValue: 0x80000000 - 1},
        {type: "field", signature: "static final int MIN_VALUE", constantValue: -0x80000000},
        // for doubleValue(), floatValue(), intValue() and longValue() there are methods (if called for a Number variable containing an Integer value) and templates
        // (if called fo Integer variable). Offering templates to the compiler is only possible because the methods are final.
        {type: "method", signature: "public final double doubleValue()", native: IntegerClass.prototype.doubleValue, template: "§1.value"},
        {type: "method", signature: "public final float floatValue()", native: IntegerClass.prototype.floatValue, template: "§1.value"},
        {type: "method", signature: "public final int intValue()", native: IntegerClass.prototype.intValue, template: "§1.value"},
        {type: "method", signature: "public final long longValue()", native: IntegerClass.prototype.longValue, template: "§1.value"},
        {type: "method", signature: "public int compareTo(Integer anotherInteger)", native: IntegerClass.prototype._compareTo},
        {type: "method", signature: "public static int parseInt(String s)", native: IntegerClass.parseInt},
        {type: "method", signature: "public static int parseInt(String sr, int radix)", native: IntegerClass.parseInt},
        {type: "method", signature: "public static Integer valueOf(int i)", native: IntegerClass.valueOf},
        {type: "method", signature: "public static Integer valueOf(String s)", native: IntegerClass.valueOfString},
        {type: "method", signature: "public static Integer valueOf(String s, int radix)", native: IntegerClass.valueOfString},
    ]

    static type: NonPrimitiveType;

    constructor(i: number){
        super(i || 0);
    }

    _compareTo(otherValue: IntegerClass){
        return this.value - otherValue.value;
    }

    static parseInt(s: StringClass, radix: number = 10){
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