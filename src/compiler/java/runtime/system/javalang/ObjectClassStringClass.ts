import { Program } from "../../../../common/interpreter/Program";
import { Scheduler } from "../../../../common/interpreter/Scheduler.ts";
import { CallbackFunction, Helpers } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { IndexOutOfBoundsExceptionClass } from "./IndexOutOfBoundsExceptionClass.ts";
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
        {type: "method", signature: "public final String toString()", native: StringClass.prototype._nToString, template: "§1"},

        {type: "method", signature: "public final int length()", native: StringClass.prototype._nLength, template: "§1.value.length"},
        {type: "method", signature: "public final int indexOf(string str)", native: StringClass.prototype._nIndexOf1, template: "§1.value.indexOf(§2)"}, 
        {type: "method", signature: "public final int indexOf(string str, int fromIndex)", native: StringClass.prototype._nIndexOf2, template: "§1.value.indexOf(§2, §3)"}, 
        {type: "method", signature: "public final int indexOf(char c)", native: StringClass.prototype._nIndexOf1, template: "§1.value.indexOf(§2)"}, 
        {type: "method", signature: "public final int indexOf(char c, int fromIndex)", native: StringClass.prototype._nIndexOf2, template: "§1.value.indexOf(§2, §3)"}, 
        {type: "method", signature: "public final char charAt(int index)", native: StringClass.prototype._nCharAt, template: `(§1.value.charAt(§2) || __t.IOBE("String charAt: Zugriff auf Zeichen außerhalb des zulässingen BEreichs."))`}, 
        {type: "method", signature: "public final int compareTo(String otherString)", template: "§1.value.localeCompare(§2)", java: StringClass.prototype._mj$compareTo$int$T}, 
        {type: "method", signature: "public final int compareToIgnoreCase(String otherString)", native: StringClass.prototype._nCompareToIgnoreCase, template: "§1.value.localeCompare(§2, undefined, { sensitivity: 'accent' })"}, 
        {type: "method", signature: "public final string concat(string otherString)", native: StringClass.prototype._nConcat, template: "§1.value.concat(§2)"}, 
        {type: "method", signature: "public final boolean contains(string otherString)", native: StringClass.prototype._nContains, template: "(§1.value.indexOf(§2) >= 0)"}, 
        {type: "method", signature: "public final boolean endsWith(string otherString)", native: StringClass.prototype._nEndsWith, template: "§1.value.endsWith(§2)"}, 
        {type: "method", signature: "public final boolean startsWith(string otherString)", native: StringClass.prototype._nStartsWith,template: "§1.value.startsWith(§2)"}, 
        {type: "method", signature: "public boolean equals(Object otherObject)", java: StringClass.prototype._mjEquals}, 
        {type: "method", signature: "public boolean equals(String otherObject)", java: StringClass.prototype._mjEquals}, 
        {type: "method", signature: "public final boolean equalsIgnoreCase(string otherString)", native: StringClass.prototype._nEqualsIgnoreCase, template: "§1.value.toLocaleUpperCase() == §2.toLocaleUpperCase()"}, 
        {type: "method", signature: "public final boolean isEmpty()", native: StringClass.prototype._nIsEmpty,  template: "(§1.value.length == 0)"}, 
        {type: "method", signature: "public final int lastIndexOf(string str)", native: StringClass.prototype._nLastIndexOf1, template: "§1.value.lastIndexOf(§2)"}, 
        {type: "method", signature: "public final int lastIndexOf(string str, int fromIndex)", native: StringClass.prototype._nLastIndexOf2, template: "§1.value.lastIndexOf(§2, §3)"}, 
        {type: "method", signature: "public final int lastIndexOf(char c)", native: StringClass.prototype._nLastIndexOf1,template: "§1.value.lastIndexOf(§2)"}, 
        {type: "method", signature: "public final int lastIndexOf(char c, int fromIndex)", native: StringClass.prototype._nLastIndexOf2, template: "§1.value.lastIndexOf(§2, §3)"}, 
        {type: "method", signature: "public final string toLowerCase()", native: StringClass.prototype._nToLowerCase,  template: "§1.value.toLocaleLowerCase()"}, 
        {type: "method", signature: "public final string toUpperCase()", native: StringClass.prototype._nToUpperCase, template: "§1.value.toLocaleUpperCase()"}, 
        {type: "method", signature: "public final string substring(int beginIndex)", native: StringClass.prototype._nSubstring1, template: "§1.value.substring(§2)"}, 
        {type: "method", signature: "public final string substring(int beginIndex, int endIndex)", native: StringClass.prototype._nSubstring2, template: "§1.value.substring(§2, §3)"}, 
        {type: "method", signature: "public final string trim()", native: StringClass.prototype._nTrim, template: "§1.value.trim()"}, 
        {type: "method", signature: "public final string replace(string target, string replacement)", native: StringClass.prototype._nReplace, template: "§1.value.replace(§2, §3)"}, 
        {type: "method", signature: "public final string replaceAll(string regex, string replacement)", native: StringClass.prototype._nReplaceAll, template: "§1.value.replace(new RegExp(§2, 'g'), §3)"}, 
        {type: "method", signature: "public final string matches(string regex)", native: StringClass.prototype._nMatches, template: "(§1.value.match(new RegExp(§2, 'g')) != null)"}, 
        {type: "method", signature: "public final string replaceFirst(string regex, string replacement)", native: StringClass.prototype._nReplaceFirst, template: "§1.value.replace(new RegExp(§2, ''), §3)"}, 
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

    _nLength(){
        return this.value.length;
    }

    _nIndexOf1(str: string): number {
        return this.value.indexOf(str);
    }
    
    _nIndexOf2(str: string, fromIndex: number): number {
        return this.value.indexOf(str, fromIndex);
    }
    
    _nLastIndexOf1(str: string): number {
        return this.value.lastIndexOf(str);
    }
    
    _nLastIndexOf2(str: string, fromIndex: number): number {
        return this.value.lastIndexOf(str, fromIndex);
    }
    
    _nCharAt(index: number): string {
        if(index < 0 || index > this.value.length - 1){
            // throw new IndexOutOfBoundsExceptionClass(`String.charAt: Zugriff auf Zeichen mit Index ${index} in String der Länge ${this.value.length}.`);
            return "";
        }
        return this.value.charAt(index);
    }

    _nCompareToIgnoreCase(otherString: StringClass){
        if(otherString == null) return 1;
        return this.value.localeCompare(otherString.value, undefined, { sensitivity: 'accent' })
    }

    _nConcat(otherString: string){
        return this.value.concat(otherString);
    }

    _nContains(otherString: string): boolean {
        return this.value.indexOf(otherString) >= 0;
    }

    _nEndsWith(otherString: string): boolean {
        return this.value.endsWith(otherString);
    }

    _nStartsWith(otherString: string): boolean {
        return this.value.startsWith(otherString);
    }

    _nEqualsIgnoreCase(otherString: string): boolean {
        if(otherString == null) return false;
        return this.value.toLocaleUpperCase() == otherString.toLocaleUpperCase();
    }

    _nIsEmpty(): boolean {
        return this.value.length == 0;
    }

    _nToLowerCase(): string {
        return this.value.toLocaleLowerCase();
    }

    _nToUpperCase(): string {
        return this.value.toLocaleUpperCase();
    }

    _nSubstring1(beginIndex: number): string {
        return this.value.substring(beginIndex);
    }

    _nSubstring2(beginIndex: number, endIndex: number): string {
        return this.value.substring(beginIndex, endIndex);
    }

    _nTrim(): string {
        return this.value.trim();
    }

    _nReplace(target: string, replacement: string): string {
        return this.value.replace(target, replacement);
    }

    _nReplaceAll(regEx: string, replacement: string): string {
        return this.value.replace(new RegExp(regEx, 'g'), replacement);
    }

    _nReplaceFirst(regEx: string, replacement: string): string {
        return this.value.replace(new RegExp(regEx, ''), replacement);
    }

    _nMatches(regEx: string){
        return this.value.match(new RegExp(regEx, 'g')) != null;
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