import { Program } from "../../../../common/interpreter/Program";
import { Scheduler } from "../../../../common/interpreter/Scheduler.ts";
import { CallbackFunction, Helpers } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { NullPointerExceptionClass } from "./NullPointerExceptionClass.ts";

export class ObjectClass {
    
    declare _m$toString$String$: (t: Thread) => void;

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Object"},
        {type: "method", signature: "public Object()", native: ObjectClass.prototype._constructor},
        {type: "method", signature: "public String toString()", native: ObjectClass.prototype._nToString},
        {type: "method", signature: "public boolean equals(Object otherObject)", native: ObjectClass.prototype._nEquals},
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

    _nEquals(otherObject: ObjectClass){
        return this == otherObject;
    }

}

export class StringClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class String extends Object implements Comparable<String>"},
        {type: "method", signature: "public String()", native: StringClass.prototype._emptyConstructor},
        {type: "method", signature: "public String(String original)", native: StringClass.prototype._constructor2},
        {type: "method", signature: "public final String toString()", template: "§1"},

        {type: "method", signature: "public final int length()", template: "§1.value.length"},
        {type: "method", signature: "public final int indexOf(string str)", template: "§1.value.indexOf(§2)"}, 
        {type: "method", signature: "public final int indexOf(string str, int fromIndex)", template: "§1.value.indexOf(§2, §3)"}, 
        {type: "method", signature: "public final int indexOf(char c)", template: "§1.value.indexOf(§2)"}, 
        {type: "method", signature: "public final int indexOf(char c, int fromIndex)", template: "§1.value.indexOf(§2, §3)"}, 
        {type: "method", signature: "public final char charAt(int index)", template: "§1.value.charAt(§2)"}, 
        {type: "method", signature: "public final int compareTo(String otherString)", template: "§1.value.localeCompare(§2)", java: StringClass.prototype._mj$compareTo$int$T}, 
        {type: "method", signature: "public final int compareToIgnoreCase(String otherString)", template: "§1.value.localeCompare(§2, undefined, { sensitivity: 'accent' })"}, 
        {type: "method", signature: "public final string concat(string otherString)", template: "§1.value.concat(§2)"}, 
        {type: "method", signature: "public final boolean contains(string otherString)", template: "(§1.value.indexOf(§2) >= 0)"}, 
        {type: "method", signature: "public final boolean endsWith(string otherString)", template: "§1.value.endsWith(§2)"}, 
        {type: "method", signature: "public final boolean startsWith(string otherString)", template: "§1.value.startsWith(§2)"}, 
        {type: "method", signature: "public boolean equals(Object otherObject)", java: StringClass.prototype._mjEquals}, 
        {type: "method", signature: "public boolean equals(String otherObject)", java: StringClass.prototype._mjEquals}, 
        {type: "method", signature: "public final boolean equalsIgnoreCase(string otherString)", template: "§1.value.toLocaleUpperCase() == §2.toLocaleUpperCase()"}, 
        {type: "method", signature: "public final boolean isEmpty()", template: "(§1.value.length == 0)"}, 
        {type: "method", signature: "public final int lastIndexOf(string str)", template: "§1.value.lastIndexOf(§2)"}, 
        {type: "method", signature: "public final int lastIndexOf(string str, int fromIndex)", template: "§1.value.lastIndexOf(§2, §3)"}, 
        {type: "method", signature: "public final int lastIndexOf(char c)", template: "§1.value.lastIndexOf(§2)"}, 
        {type: "method", signature: "public final int lastIndexOf(char c, int fromIndex)", template: "§1.value.lastIndexOf(§2, §3)"}, 
        {type: "method", signature: "public final string toLowerCase()", template: "§1.value.toLocaleLowerCase()"}, 
        {type: "method", signature: "public final string toUpperCase()", template: "§1.value.toLocaleUpperCase()"}, 
        {type: "method", signature: "public final string substring(int beginIndex)", template: "§1.value.substring(§2)"}, 
        {type: "method", signature: "public final string substring(int beginIndex, int endIndex)", template: "§1.value.substring(§2, §3)"}, 
        {type: "method", signature: "public final string trim()", template: "§1.value.trim()"}, 
        {type: "method", signature: "public final string replace(string target, string replacement)", template: "§1.value.replace(§2, §3)"}, 
        {type: "method", signature: "public final string replaceAll(string regex, string replacement)", template: "§1.value.replace(new RegExp(§2, 'g'), §3)"}, 
        {type: "method", signature: "public final string matches(string regex)", template: "(§1.value.match(new RegExp(§2, 'g')) != null)"}, 
        {type: "method", signature: "public final string replaceFirst(string regex, string replacement)", template: "§1.value.replace(new RegExp(§2, ''), §3)"}, 
        {type: "method", signature: "public final String[] split(string regex)", native: StringClass.prototype._nSplit}, 

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

    _nSplit(regEx: string): StringClass[]{
        return this.value.split(new RegExp(regEx, '')).map( s => new StringClass(s));
    }

    _nToString() {
        return this;        
    }

    add(secondString: string): StringClass {
        return new StringClass(this.value + secondString);
    }

    _mjEquals(t: Thread, callback: CallbackFunction, otherString: StringClass){
        let ret = false;
        if(otherString instanceof StringClass){
            ret = this.value == otherString.value;
        }
        t.s.push(ret);
        if(callback) callback();
    }

    _mj$compareTo$int$T(t: Thread, callback: CallbackFunction, otherString: StringClass){
        //if(otherString === null) throw new NullPointerExceptionClass("compareTo called with argument null");
        t.s.push(this.value.localeCompare(otherString.value));
        if(callback) callback;
    }
}