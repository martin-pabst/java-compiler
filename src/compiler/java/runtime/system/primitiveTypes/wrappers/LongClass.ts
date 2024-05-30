import { Thread } from "../../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { StringClass } from "../../javalang/ObjectClassStringClass";
import { NumberClass } from "./NumberClass";

/**
 * @link https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Long.html
 */
export class LongClass extends NumberClass {

    static isPrimitiveTypeWrapper: boolean = true;

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Long extends Number implements Comparable<Long>"},
        {type: "field", signature: "static final int MAX_VALUE", constantValue: Number.MAX_SAFE_INTEGER}, 
        {type: "field", signature: "static final int MIN_VALUE", constantValue: Number.MIN_SAFE_INTEGER},
        // for doubleValue(), floatValue(), intValue() and longValue() there are methods (if called for a Number variable containing an Long value) and templates
        // (if called fo Long variable). Offering templates to the compiler is only possible because the methods are final.
        {type: "method", signature: "public final double doubleValue()", native: LongClass.prototype.doubleValue, template: "§1.value"},
        {type: "method", signature: "public final float floatValue()", native: LongClass.prototype.floatValue, template: "§1.value"},
        {type: "method", signature: "public final int intValue()", native: LongClass.prototype.intValue, template: "(§1.value % 0x100000000 - 0x80000000)"},
        {type: "method", signature: "public final long longValue()", native: LongClass.prototype.longValue, template: "§1.value"},
        {type: "method", signature: "public int compareTo(Long anotherLong)", native: LongClass.prototype._compareTo},
        {type: "method", signature: "public int parseInt(String s)", native: LongClass.prototype.parseInt},
        {type: "method", signature: "public int parseInt(String sr, int radix)", native: LongClass.prototype.parseInt},
        {type: "method", signature: "public static Long valueOf(long i)", native: LongClass.valueOf},
        {type: "method", signature: "public static Long valueOf(String s)", native: LongClass.valueOfString},
        {type: "method", signature: "public static Long valueOf(String s, int radix)", native: LongClass.valueOfString},
    ]

    static type: NonPrimitiveType;

    constructor(i: number){
        super(i || 0);
    }

    _compareTo(otherValue: LongClass){
        return this.value - otherValue.value;
    }

    parseInt(s: StringClass, radix: number = 10){
        return Number.parseInt(s.value, radix);
    }

    intValue(){
        return this.value % 0x100000000 - 0x80000000;
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
        return new LongClass(i);
    }

    static valueOfString(s: string, radix: number): LongClass {
        return new LongClass(Number.parseInt(s, radix));
    }

}