import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "./ObjectClassStringClass";

export class RandomClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Random extends Object"},
        {type: "method", signature: "private Random()", native: RandomClass.prototype._emptyConstructor},
        
        {type: "method", signature: "public static int randint(int from, int to)", template: 'Math.floor(Math.random()*(§2-§1+1)+§1)'},
        {type: "method", signature: "public final int nextInt(int to)", template: 'Math.floor(Math.random()*§1)'},
        {type: "method", signature: "public static double randdouble(double from, double to)", template: 'Math.random()*(§2-§1)+§1'},
    ]

    static type: NonPrimitiveType;

    constructor(){
        super();
    }

    _emptyConstructor(){
        return this;
    }

}