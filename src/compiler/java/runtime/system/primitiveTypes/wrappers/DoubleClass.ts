import { Thread } from "../../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { StringClass } from "../../javalang/ObjectClassStringClass";
import { NumberClass } from "./NumberClass";

/**
 * @link https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Double.html
 */
export class DoubleClass extends NumberClass {

    static isPrimitiveTypeWrapper: boolean = true;

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Double extends Number implements Comparable<Double>"},
        {type: "field", signature: "static final int MAX_VALUE", constantValue: Number.MAX_VALUE}, 
        {type: "field", signature: "static final int POSITIVE_INFINITY", constantValue: Number.POSITIVE_INFINITY}, 
        {type: "field", signature: "static final int NEGATIVE_INFINITY", constantValue: Number.NEGATIVE_INFINITY}, 
        {type: "field", signature: "static final int MIN_VALUE", constantValue: Number.MIN_VALUE},
        // for doubleValue(), floatValue(), intValue() and longValue() there are methods (if called for a Number variable containing an Long value) and templates
        // (if called fo Long variable). Offering templates to the compiler is only possible because the methods are final.
        {type: "method", signature: "public final double doubleValue()", native: DoubleClass.prototype.doubleValue, template: "§1.value"},
        {type: "method", signature: "public final float floatValue()", native: DoubleClass.prototype.floatValue, template: "Math.fround(§1.value)"},
        {type: "method", signature: "public final int intValue()", native: DoubleClass.prototype.intValue, template: "(Math.trunc(§1.value) % 0x100000000 - 0x80000000)"},
        {type: "method", signature: "public final long longValue()", native: DoubleClass.prototype.longValue, template: "Math.trunc(§1.value)"},
        {type: "method", signature: "public int compareTo(Double otherValue)", native: DoubleClass.prototype._compareTo},
        {type: "method", signature: "public static double parseDouble(String s)", native: DoubleClass.parseDouble},
        {type: "method", signature: "public static Double valueOf(double f)", native: DoubleClass.valueOf},
        {type: "method", signature: "public static Double valueOf(String s)", native: DoubleClass.valueOfString},
    ]

    static type: NonPrimitiveType;

    constructor(i: number){
        super(i || 0);
    }

    _compareTo(otherValue: DoubleClass){
        return this.value - otherValue.value;
    }

    static parseDouble(s: StringClass){
        return Number.parseFloat(s.value);
    }

    intValue(){
        return Math.trunc(this.value) % 0x100000000 - 0x80000000;
    }

    longValue(){
        return Math.trunc(this.value);
    }

    floatValue(){
        return Math.fround(this.value);
    }

    doubleValue(){
        return this.value;
    }

    static valueOf(i: number){
        return new DoubleClass(i);
    }

    static valueOfString(s: string): DoubleClass {
        return new DoubleClass(Number.parseFloat(s));
    }

}