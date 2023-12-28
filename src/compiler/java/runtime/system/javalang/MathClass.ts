import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "./ObjectClassStringClass";

export class MathClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Math extends Object"},
        {type: "method", signature: "private Math()", native: MathClass.prototype._emptyConstructor},
        {type: "field", signature: "public static final double PI", template: 'Math.PI', constantValue: Math.PI},
        {type: "field", signature: "public static final double E", template: 'Math.E', constantValue: Math.E},

        {type: "method", signature: "public static int abs(int a)", template: 'Math.abs(§1)', constantFoldingFunction: (a) => Math.abs(a)},
        {type: "method", signature: "public static long abs(long a)", template: 'Math.abs(§1)', constantFoldingFunction: (a) => Math.abs(a)},
        {type: "method", signature: "public static float abs(float a)", template: 'Math.abs(§1)', constantFoldingFunction: (a) => Math.abs(a)},
        {type: "method", signature: "public static double abs(double a)", template: 'Math.abs(§1)', constantFoldingFunction: (a) => Math.abs(a)},
        {type: "method", signature: "public static double sin(double angleInRadians)", template: 'Math.sin(§1)', constantFoldingFunction: (a) => Math.sin(a)},
        {type: "method", signature: "public static double cos(double angleInRadians)", template: 'Math.cos(§1)', constantFoldingFunction: (a) => Math.cos(a)},
        {type: "method", signature: "public static double tan(double angleInRadians)", template: 'Math.tan(§1)', constantFoldingFunction: (a) => Math.tan(a)},
        {type: "method", signature: "public static double asin(double angleInRadians)", template: 'Math.asin(§1)', constantFoldingFunction: (a) => Math.asin(a)},
        {type: "method", signature: "public static double acos(double angleInRadians)", template: 'Math.acos(§1)', constantFoldingFunction: (a) => Math.acos(a)},
        {type: "method", signature: "public static double atan(double angleInRadians)", template: 'Math.atan(§1)', constantFoldingFunction: (a) => Math.atan(a)},
        {type: "method", signature: "public static double atan2(double y, double x)", template: 'Math.atan2(§1, §2)', constantFoldingFunction: (y, x) => Math.atan2(y, x)},
        {type: "method", signature: "public static int round(double value)", template: 'Math.round(§1)', constantFoldingFunction: (value) => Math.round(value)},
        {type: "method", signature: "public static int floor(double value)", template: 'Math.floor(§1)', constantFoldingFunction: (value) => Math.floor(value)},
        {type: "method", signature: "public static int ceil(double value)", template: 'Math.ceil(§1)', constantFoldingFunction: (value) => Math.ceil(value)},
        {type: "method", signature: "public static int signum(double value)", template: 'Math.sign(§1)', constantFoldingFunction: (value) => Math.sign(value)},
        {type: "method", signature: "public static double sqrt(double a)", template: 'Math.sqrt(§1)', constantFoldingFunction: (a) => Math.sqrt(a)},
        {type: "method", signature: "public static double random()", template: 'Math.random()', constantFoldingFunction: (a) => Math.random()},
        {type: "method", signature: "public static double pow(double basis, double exponent)", template: 'Math.pow(§1, §2)', constantFoldingFunction: (a, b) => Math.pow(a, b)},
        {type: "method", signature: "public static double toDegrees(double angleInRad)", template: '(§1 / Math.PI * 180)', constantFoldingFunction: (a) => a/Math.PI*180},
        {type: "method", signature: "public static double toRadians(double angleInDegrees)", template: '(§1 / 180 * Math.PI)', constantFoldingFunction: (a) => a/180*Math.PI},
        {type: "method", signature: "public static double exp(double value)", template: 'Math.exp(§1)', constantFoldingFunction: (value) => Math.exp(value)},
        {type: "method", signature: "public static double log(double value)", template: 'Math.log(§1)', constantFoldingFunction: (value) => Math.log(value)},
        {type: "method", signature: "public static double log10(double value)", template: 'Math.log10(§1)', constantFoldingFunction: (value) => Math.log10(value)},

        {type: "method", signature: "public static int max(int a, int b)", template: 'Math.max(§1)', constantFoldingFunction: (a) => Math.max(a)},
        {type: "method", signature: "public static long max(long a, long b)", template: 'Math.max(§1)', constantFoldingFunction: (a) => Math.max(a)},
        {type: "method", signature: "public static float max(float a, float b)", template: 'Math.max(§1)', constantFoldingFunction: (a) => Math.max(a)},
        {type: "method", signature: "public static double max(double a, double b)", template: 'Math.max(§1)', constantFoldingFunction: (a) => Math.max(a)},

        {type: "method", signature: "public static int min(int a, int b)", template: 'Math.min(§1)', constantFoldingFunction: (a) => Math.min(a)},
        {type: "method", signature: "public static long min(long a, long b)", template: 'Math.min(§1)', constantFoldingFunction: (a) => Math.min(a)},
        {type: "method", signature: "public static float min(float a, float b)", template: 'Math.min(§1)', constantFoldingFunction: (a) => Math.min(a)},
        {type: "method", signature: "public static double min(double a, double b)", template: 'Math.min(§1)', constantFoldingFunction: (a) => Math.min(a)},

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