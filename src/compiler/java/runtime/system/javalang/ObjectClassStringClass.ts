import { Program } from "../../../../common/interpreter/Program";
import { Thread } from "../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";

export class ObjectClass {
    
    declare _m$toString$String$: (t: Thread) => void;

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class Object"},
        {type: "m", signature: "public Object()", native: ObjectClass.prototype._constructor},
        {type: "m", signature: "public String toString()", native: ObjectClass.prototype.toString}
    ]

    declare __programs: Program[]; // only for compatibility with java classes; not used in library classes

    static type: NonPrimitiveType;

    constructor(){

    }

    _constructor() {
        return this;
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

    public value: string;

    static type: NonPrimitiveType;

    constructor(value?: string){
        super();
        this.value = value || "";
    }

    _emptyConstructor(){
        return this;
    }

    _constructor2(original: string){
        this.value = original;
        return this;
    }

    _toString(t: Thread) {
        t.s.push(this.value);        
    }

    plusOtherString(s: StringClass): StringClass {
        return new StringClass(this.value + s.value);
    }

    plusObject(t: Thread, o: ObjectClass){
        t.pushCallback(() => {
            t.s.push(new StringClass(this.value + t.s.pop().text))
        });
        o._m$toString$String$(t);
    }

    plusObjectFromLeft(t: Thread, o: ObjectClass){
        t.pushCallback(() => {
            t.s.push(new StringClass(t.s.pop().text + this.value))
        });
        o._m$toString$String$(t);
    }

}