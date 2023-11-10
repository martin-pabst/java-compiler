import { Thread } from "../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";

export class ObjectClass {
    
    declare _m$toString$String$: (t: Thread) => void;

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class Object"},
        {type: "m", signature: "public Object()", native: ObjectClass.prototype._constructor},
        {type: "m", signature: "public String toString()", native: ObjectClass.prototype.toString}
    ]


    static __declareType(): string[] {
        return [
            "class Object",
            "public Object(): _constructor",
            "public String toString(): toString"
        ]
    }

    static type: NonPrimitiveType;

    constructor(){

    }

    _constructor() {

    }

    getType(): NonPrimitiveType {
        return this.constructor.prototype.type;
    }

    getClassName(): string {
        return this.getType().identifier;
    }


    toString() {
        return new StringClass("Object");
        // `t.stack.push(new ${Helpers.classes}["String"]("Object"));`
    }


}

export class StringClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class String extends Object"},
        {type: "m", signature: "public String()", native: StringClass.prototype._emptyConstructor},
        {type: "m", signature: "public String(String original)", native: StringClass.prototype._constructor2},
        {type: "m", signature: "public String toString()", native: StringClass.prototype._toString}
    ]

    static __declareType(): string[] {
        return [
            "class String extends Object",
            "public String(): _emptyConstructor",
            "public String(String original): _constructor2",
            "public String toString(): _toString"
        ]
    }

    public value: string;

    static type: NonPrimitiveType;

    constructor(value?: string){
        super();
        this.value = value || "";
    }

    _emptyConstructor(){

    }

    _constructor2(original: string){
        this.value = original;
    }

    _toString(t: Thread) {
        t.stack.push(this.value);        
    }

    plusOtherString(s: StringClass): StringClass {
        return new StringClass(this.value + s.value);
    }

    plusObject(t: Thread, o: ObjectClass){
        t.pushCallback(() => {
            t.stack.push(new StringClass(this.value + t.stack.pop().text))
        });
        o._m$toString$String$(t);
    }

    plusObjectFromLeft(t: Thread, o: ObjectClass){
        t.pushCallback(() => {
            t.stack.push(new StringClass(t.stack.pop().text + this.value))
        });
        o._m$toString$String$(t);
    }

}