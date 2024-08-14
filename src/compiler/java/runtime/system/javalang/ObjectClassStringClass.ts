import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { ValueRenderer } from "../../../../common/debugger/ValueRenderer.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread, ThreadState } from "../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { JCM } from "../../../language/JavaCompilerMessages.ts";
import { IPrimitiveTypeWrapper } from "../primitiveTypes/wrappers/IPrimitiveTypeWrapper.ts";

export type ObjectClassOrNull = ObjectClass | null;

export class ObjectClass {

    // declare _mj$toString$String$: (t: Thread, callback: CallbackFunction) => void;

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Object" },
        { type: "method", signature: "public Object()", native: ObjectClass.prototype._constructor },
        { type: "method", signature: "public String toString()", java: ObjectClass.prototype._mj$toString$String$, comment: JRC.objectToStringComment },
        { type: "method", signature: "public boolean equals(Object otherObject)", java: ObjectClass.prototype._mj$equals$boolean$Object, comment: JRC.objectEqualsComment },
        { type: "method", signature: "public final void wait()", java: ObjectClass.prototype._mj$wait$void$, comment: JRC.objectWaitComment },
        { type: "method", signature: "public final void wait(int milliseconds)", java: ObjectClass.prototype._mj$wait$void$, comment: JRC.objectWaitWithTimeoutComment },
        { type: "method", signature: "public final void notify()", java: ObjectClass.prototype._mj$notify$void$, comment: JRC.objectNotifyComment },
        { type: "method", signature: "public final void notifyAll()", java: ObjectClass.prototype._mj$notifyAll$void$, comment: JRC.objectNotifyAllComment },
    ]

    // declare __programs: Program[]; // only for compatibility with java classes; not used in library classes

    static type: NonPrimitiveType;

    private waitingThreads?: Thread[];
    private threadHoldingLockToThisObject?: Thread;
    private reentranceCounter?: number;                 // == 1 when thread first entered synchronized block

    constructor() {

    }

    /**
     * 
     * To understand wait and notify see this answer:
     * https://stackoverflow.com/questions/75679994/why-notify-method-is-needed-in-java-synchronization
     * 
     * In almost all cases all you need is synchronized methods, nothing else.
     * 
     * @param t 
     * @param callback 
     * @param milliseconds 
    */
    _mj$wait$void$(t: Thread, callback: CallbackFunction, milliseconds?: number) {
        if (this.threadHoldingLockToThisObject != t) {
            this.throwIllegalMonitorException(t, JCM.threadWantsToWaitAndHasNoLockOnObject());
        }

        let that = this;

        if (milliseconds) {
            setTimeout(() => {
                if (t.state == ThreadState.timedWaiting) t.state = ThreadState.blocked;
            }, milliseconds);

            t.state = ThreadState.timedWaiting;
        } else {
            t.state = ThreadState.waiting;
        }

        if (!that.waitingThreads) that.waitingThreads = [];
        if (that.waitingThreads.indexOf(t) < 0) that.waitingThreads.push(t);

        t.scheduler.suspendThread(t);

        if (callback) callback();
    }


    _mj$notify$void$(t: Thread, callback: CallbackFunction) {
        if (this.threadHoldingLockToThisObject != t) {
            this.throwIllegalMonitorException(t, JCM.threadWantsToNotifyAndHasNoLockOnObject());
        }
        if (this.waitingThreads) {
            for (let i = 0; i < this.waitingThreads.length; i++) {
                if ([ThreadState.waiting, ThreadState.timedWaiting].indexOf(this.waitingThreads[i].state) >= 0) {
                    this.waitingThreads[i].state = ThreadState.blocked;
                    break;
                }
            }
        }
        if (callback) callback();
    }

    _mj$notifyAll$void$(t: Thread, callback: CallbackFunction) {
        if (this.threadHoldingLockToThisObject != t) {
            this.throwIllegalMonitorException(t, JCM.threadWantsToNotifyAndHasNoLockOnObject());
        }
        if (this.waitingThreads) {
            for (let t of this.waitingThreads) {
                t.state = ThreadState.blocked;
            }
        }
        if (callback) callback();
    }

    restoreOneBlockedThread() {
        if (this.waitingThreads) {
            for (let i = 0; i < this.waitingThreads.length - 1; i++) {
                let t = this.waitingThreads[i];
                if (t.state == ThreadState.blocked) {
                    this.waitingThreads.splice(i, 1);
                    t.scheduler.restoreThread(t);
                    break;
                }
            }
        }
    }

    throwIllegalMonitorException(t: Thread, message: string) {
        throw new t.classes["IllegalMonitorStateException"](message);
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


    _mj$toString$String$(t: Thread, callback: CallbackFunction) {
        t.s.push(new StringClass(ValueRenderer.renderValue(this, 200)));
        if (callback) callback();
        return;
    }

    _mj$equals$boolean$Object(t: Thread, callback: CallbackFunction, otherObject: ObjectClassOrNull) {
        t.s.push(this == otherObject);
        if (callback) callback();
        return;
    }

    beforeEnteringSynchronizedBlock(t: Thread, pushLockObject: boolean = false) {
        if (pushLockObject) t.s.push(this);

        if (this.threadHoldingLockToThisObject && this.threadHoldingLockToThisObject != t) {
            t.state == ThreadState.blocked;
            t.scheduler.suspendThread(t);
        }
    }


    enterSynchronizedBlock(t: Thread, pushLockObject: boolean = false) {

        if (pushLockObject) t.s.push(this);

        if (!this.threadHoldingLockToThisObject) {
            this.threadHoldingLockToThisObject = t;
            this.reentranceCounter = 1;
        } else {
            this.reentranceCounter!++;
        }

        t.registerEnteringSynchronizedBlock(this);
    }

    leaveSynchronizedBlock(t: Thread) {
        if (this.threadHoldingLockToThisObject == t) {
            this.reentranceCounter!--;
            if (this.reentranceCounter == 0) {
                this._mj$notifyAll$void$(t, undefined);
                this.threadHoldingLockToThisObject = undefined;
                this.reentranceCounter = undefined;
                this.restoreOneBlockedThread();
            }
        }
    }

    __internalHashCode(): any {
        return this;
    }

}

export class StringClass extends ObjectClass implements IPrimitiveTypeWrapper {

    static isPrimitiveTypeWrapper: boolean = true;

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class String extends Object implements Comparable<String>", comment: JRC.stringClassComment },
        { type: "method", signature: "public String()", native: StringClass.prototype._emptyConstructor, comment: JRC.stringConstructorComment },
        { type: "method", signature: "public String(String original)", native: StringClass.prototype._constructor2, comment: JRC.stringConstructorComment2 },
        { type: "method", signature: "public final String toString()", native: StringClass.prototype._nToString, template: "§1", comment: JRC.objectToStringComment },

        { type: "method", signature: "public final int length()", native: StringClass.prototype._nLength, template: "§1.value.length", comment: JRC.stringLengthComment },
        { type: "method", signature: "public final int indexOf(string str)", native: StringClass.prototype._nIndexOf1, template: "§1.value.indexOf(§2)", comment: JRC.stringIndexOfComment1 },
        { type: "method", signature: "public final int indexOf(string str, int fromIndex)", native: StringClass.prototype._nIndexOf2, template: "§1.value.indexOf(§2, §3)", comment: JRC.stringIndexOfComment2 },
        { type: "method", signature: "public final int indexOf(char c)", native: StringClass.prototype._nIndexOf1, template: "§1.value.indexOf(§2)", comment: JRC.stringIndexOfComment3 },
        { type: "method", signature: "public final int indexOf(char c, int fromIndex)", native: StringClass.prototype._nIndexOf2, template: "§1.value.indexOf(§2, §3)", comment: JRC.stringIndexOfComment4 },
        { type: "method", signature: "public final char charAt(int index)", native: StringClass.prototype._nCharAt, template: `(§1.value.charAt(§2) || __t.IOBE("String charAt: ${JCM.charIndexOutOfBounds()}."))`, comment: JRC.stringCharAtComment },
        { type: "method", signature: "public final int compareTo(String otherString)", java: StringClass.prototype._mj$compareTo$int$T, comment: JRC.comparableCompareToComment },
        { type: "method", signature: "public final int compareToIgnoreCase(String otherString)", java: StringClass.prototype._mj$compareToIgnoreCase$int$T, comment: JRC.compareToIgnoreCaseComment },
        { type: "method", signature: "public final string concat(string otherString)", native: StringClass.prototype._nConcat, template: "§1.value.concat(§2)", comment: JRC.stringConcatComment },
        { type: "method", signature: "public final boolean contains(string otherString)", native: StringClass.prototype._nContains, template: "(§1.value.indexOf(§2) >= 0)", comment: JRC.stringContainsComment },
        { type: "method", signature: "public final boolean endsWith(string otherString)", native: StringClass.prototype._nEndsWith, template: "§1.value.endsWith(§2)", comment: JRC.stringEndsWithComment },
        { type: "method", signature: "public final boolean startsWith(string otherString)", native: StringClass.prototype._nStartsWith, template: "§1.value.startsWith(§2)", comment: JRC.stringStartsWithComment },
        { type: "method", signature: "public boolean equals(Object otherObject)", java: StringClass.prototype._mj$equals$boolean$Object, comment: JRC.objectEqualsComment },
        { type: "method", signature: "public boolean equals(String otherObject)", java: StringClass.prototype._mj$equals$boolean$Object, comment: JRC.objectEqualsComment },
        { type: "method", signature: "public final boolean equalsIgnoreCase(string otherString)", native: StringClass.prototype._nEqualsIgnoreCase, template: "§1.value.toLocaleUpperCase() == §2.toLocaleUpperCase()", comment: JRC.stringEqualsIgnoreCaseComment },
        { type: "method", signature: "public final boolean isEmpty()", native: StringClass.prototype._nIsEmpty, template: "(§1.value.length == 0)", comment: JRC.stringIsEmptyComment },
        { type: "method", signature: "public final int lastIndexOf(string str)", native: StringClass.prototype._nLastIndexOf1, template: "§1.value.lastIndexOf(§2)", comment: JRC.stringLastIndexOfComment1 },
        { type: "method", signature: "public final int lastIndexOf(string str, int fromIndex)", native: StringClass.prototype._nLastIndexOf2, template: "§1.value.lastIndexOf(§2, §3)", comment: JRC.stringLastIndexOfComment2 },
        { type: "method", signature: "public final int lastIndexOf(char c)", native: StringClass.prototype._nLastIndexOf1, template: "§1.value.lastIndexOf(§2)", comment: JRC.stringLastIndexOfComment3 },
        { type: "method", signature: "public final int lastIndexOf(char c, int fromIndex)", native: StringClass.prototype._nLastIndexOf2, template: "§1.value.lastIndexOf(§2, §3)", comment: JRC.stringLastIndexOfComment4 },
        { type: "method", signature: "public final string toLowerCase()", native: StringClass.prototype._nToLowerCase, template: "§1.value.toLocaleLowerCase()", comment: JRC.stringToLowerCaseComment },
        { type: "method", signature: "public final string toUpperCase()", native: StringClass.prototype._nToUpperCase, template: "§1.value.toLocaleUpperCase()", comment: JRC.stringToUpperCaseComment },
        { type: "method", signature: "public final string substring(int beginIndex)", native: StringClass.prototype._nSubstring1, template: "§1.value.substring(§2)", comment: JRC.stringSubstringComment1 },
        { type: "method", signature: "public final string substring(int beginIndex, int endIndex)", native: StringClass.prototype._nSubstring2, template: "§1.value.substring(§2, §3)", comment: JRC.stringSubstringComment2 },
        { type: "method", signature: "public final string trim()", native: StringClass.prototype._nTrim, template: "§1.value.trim()", comment: JRC.stringTrimComment },
        { type: "method", signature: "public final string replace(string target, string replacement)", native: StringClass.prototype._nReplace, template: "§1.value.replace(§2, §3)", comment: JRC.stringReplaceComment },
        { type: "method", signature: "public final string replaceAll(string regex, string replacement)", native: StringClass.prototype._nReplaceAll, template: "§1.value.replace(new RegExp(§2, 'g'), §3)", comment: JRC.stringReplaceAllComment },
        { type: "method", signature: "public final string matches(string regex)", native: StringClass.prototype._nMatches, template: "(§1.value.match(new RegExp(§2, 'g')) != null)", comment: JRC.stringMatchesComment },
        { type: "method", signature: "public final string replaceFirst(string regex, string replacement)", native: StringClass.prototype._nReplaceFirst, template: "§1.value.replace(new RegExp(§2, ''), §3)", comment: JRC.stringReplaceFirstComment },
        { type: "method", signature: "public final String[] split(string regex)", native: StringClass.prototype._nSplit, comment: JRC.stringSplitComment },
        { type: "method", signature: "public final int hashCode()", native: StringClass.prototype._nHashCode, template: `Array.from(§1.value).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)`, comment: JRC.hashCodeComment },
        { type: "method", signature: "public final char[] toCharArray()", native: StringClass.prototype._nToCharArray, template: `Array.from(§1.value)`, comment: JRC.stringToCharArrayComment },
    ]

    public value: string;

    static type: NonPrimitiveType;

    static null = new StringClass("null");

    constructor(value?: string) {
        super();
        this.value = value || "";
    }

    debugOutput(): string {
        return JSON.stringify(this.value);
    }

    __internalHashCode(): any {
        return this.value;
    }

    _emptyConstructor() {
        return this;
    }

    _constructor2(original: string) {
        this.value = original;
        return this;
    }

    _nSplit(regEx: string): StringClass[] {
        return this.value.split(new RegExp(regEx, '')).map(s => new StringClass(s));
    }

    _nToString() {
        return this;
    }

    _nLength() {
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
        if (index < 0 || index > this.value.length - 1) {
            // throw new IndexOutOfBoundsExceptionClass(`String.charAt: Zugriff auf Zeichen mit Index ${index} in String der Länge ${this.value.length}.`);
            return "";
        }
        return this.value.charAt(index);
    }

    _nConcat(otherString: string) {
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
        if (otherString == null) return false;
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

    _nMatches(regEx: string) {
        return this.value.match(new RegExp(regEx, 'g')) != null;
    }

    add(secondString: string): StringClass {
        return new StringClass(this.value + secondString);
    }

    _mj$equals$boolean$Object(t: Thread, callback: CallbackFunction, otherString: StringClass) {
        let ret = false;
        if (otherString instanceof StringClass) {
            ret = this.value == otherString.value;
        }
        t.s.push(ret);
        if (callback) callback();
    }

    _mj$compareTo$int$T(t: Thread, callback: CallbackFunction, otherString: StringClass) {
        if (otherString === null) {
            throw new t.classes["NullPointerException"](JRC.stringCompareToNullpointerException());
        }
        t.s.push(this.value.localeCompare(otherString.value));
        if (callback) callback();
    }

    _mj$compareToIgnoreCase$int$T(t: Thread, callback: CallbackFunction, otherString: StringClass) {
        if (otherString === null) {
            throw new t.classes["NullPointerException"](JRC.stringCompareToNullpointerException());
        }    
        t.s.push(this.value.localeCompare(otherString.value, undefined, { sensitivity: 'accent' }));
        if (callback) callback();
    }

    _nHashCode() {
        // taken from https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
        return Array.from(this.value).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)
    }

    _nToCharArray() {
        return Array.from(this.value);
    }
}