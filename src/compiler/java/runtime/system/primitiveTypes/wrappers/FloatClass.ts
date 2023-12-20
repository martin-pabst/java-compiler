import { Thread } from "../../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { StringClass } from "../../javalang/ObjectClassStringClass";
import { NumberClass } from "./NumberClass";

/**
 * @link https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Float.html
 */
export class FloatClass extends NumberClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Float extends Number"},
        {type: "field", signature: "static final int MAX_VALUE", constantValue: Number.MAX_VALUE}, 
        {type: "field", signature: "static final int MIN_VALUE", constantValue: Number.MIN_VALUE},
        // for doubleValue(), floatValue(), intValue() and longValue() there are methods (if called for a Number variable containing an Long value) and templates
        // (if called fo Long variable). Offering templates to the compiler is only possible because the methods are final.
        {type: "method", signature: "public final double doubleValue()", native: FloatClass.prototype.doubleValue, template: "§1.value"},
        {type: "method", signature: "public final float floatValue()", native: FloatClass.prototype.floatValue, template: "§1.value"},
        {type: "method", signature: "public final int intValue()", native: FloatClass.prototype.intValue, template: "(Math.trunc(§1.value) % 0x100000000 - 0x80000000)"},
        {type: "method", signature: "public final long longValue()", native: FloatClass.prototype.longValue, template: "Math.trunc(§1.value)"},
        {type: "method", signature: "public int compareTo(Float otherValue)", native: FloatClass.prototype._compareTo},
        {type: "method", signature: "public int parseFloat(String s)", native: FloatClass.prototype.parseFloat},
        {type: "method", signature: "public static Float valueOf(float f)", native: FloatClass.valueOf},
        {type: "method", signature: "public static Float valueOf(String s)", native: FloatClass.valueOfString},
    ]

    static type: NonPrimitiveType;

    constructor(i: number){
        super(i);
    }

    _compareTo(otherValue: FloatClass){
        return this.value - otherValue.value;
    }

    parseFloat(s: StringClass){
        return Math.fround(Number.parseFloat(s.value));
    }

    intValue(){
        return Math.trunc(this.value) % 0x100000000 - 0x80000000;
    }

    longValue(){
        return Math.trunc(this.value);
    }

    floatValue(){
        return this.value;
    }

    doubleValue(){
        return this.value;
    }

    static valueOf(i: number){
        return new FloatClass(Math.fround(i));
    }

    static valueOfString(s: string): FloatClass {
        return new FloatClass(Math.fround(Number.parseFloat(s)));
    }

}