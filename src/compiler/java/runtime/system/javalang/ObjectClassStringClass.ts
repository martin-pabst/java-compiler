import { Program } from "../../../../common/interpreter/Program";
import { Scheduler } from "../../../../common/interpreter/Scheduler.ts";
import { Thread } from "../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";

export class ObjectClass {
    
    declare _m$toString$String$: (t: Thread) => void;

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Object"},
        {type: "method", signature: "public Object()", native: ObjectClass.prototype._constructor},
        {type: "method", signature: "public String toString()", native: ObjectClass.prototype._nToString}
    ]

    declare __programs: Program[]; // only for compatibility with java classes; not used in library classes

    static type: NonPrimitiveType;

    constructor(){

    }

    _constructor() {
        return this;
    }

    getType(): NonPrimitiveType {
        //@ts-ignore
        return this.constructor.type;
    }

    getClassName(): string {
        return this.getType().identifier;
    }


    _nToString(t: Thread) {
        return new StringClass("Object");
        // `t.stack.push(new ${Helpers.classes}["String"]("Object"));`
    }


}

export class StringClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class String extends Object"},
        {type: "method", signature: "public String()", native: StringClass.prototype._emptyConstructor},
        {type: "method", signature: "public String(String original)", native: StringClass.prototype._constructor2},
        {type: "method", signature: "public String toString()", template: "§1"},
        {type: "method", signature: "public int length()", template: "§1.value.length"},
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

    _nToString() {
        return this;        
    }

    add(secondString: string): StringClass {
        return new StringClass(this.value + secondString);
    }

}