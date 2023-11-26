import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "./ObjectClassStringClass";

export class MathClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class Math extends Object"},
        {type: "m", signature: "private Math()", native: MathClass.prototype._emptyConstructor},
        {type: "a", signature: "public static final double PI", template: 'Math.PI', constantValue: Math.PI},
        {type: "a", signature: "public static final double E", template: 'Math.E', constantValue: Math.E},
        {type: "m", signature: "public static int abs(int a)", template: 'Math.abs(§1)', constantFoldingFunction: (a) => Math.abs(a)},
        {type: "m", signature: "public static long abs(long a)", template: 'Math.abs(§1)', constantFoldingFunction: (a) => Math.abs(a)},
        {type: "m", signature: "public static float abs(float a)", template: 'Math.abs(§1)', constantFoldingFunction: (a) => Math.abs(a)},
        {type: "m", signature: "public static double abs(double a)", template: 'Math.abs(§1)', constantFoldingFunction: (a) => Math.abs(a)},
        {type: "m", signature: "public static double sin(double angleInRadians)", template: 'Math.sin(§1)', constantFoldingFunction: (a) => Math.sin(a)},
        {type: "m", signature: "public static double cos(double angleInRadians)", template: 'Math.cos(§1)', constantFoldingFunction: (a) => Math.cos(a)},
        {type: "m", signature: "public static double tan(double angleInRadians)", template: 'Math.tan(§1)', constantFoldingFunction: (a) => Math.tan(a)},
        {type: "m", signature: "public static double atan2(double y, double x)", template: 'Math.atan2(§1, §2)', constantFoldingFunction: (y, x) => Math.atan2(y, x)},
    ]

    static type: NonPrimitiveType;

    static PI: number = Math.PI;
    static E: number = Math.E;

    constructor(){
        super();
    }

    _emptyConstructor(){
        return this;
    }

}