import { Program } from "../../../../common/interpreter/Program";
import { Scheduler } from "../../../../common/interpreter/Scheduler.ts";
import { CallbackFunction, Helpers } from "../../../../common/interpreter/StepFunction.ts";
import { Thread, ThreadState } from "../../../../common/interpreter/Thread";
import { JCM } from "../../../JavaCompilerMessages.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";

export class ObjectClass {

    declare _m$toString$String$: (t: Thread) => void;

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Object" },
        { type: "method", signature: "public Object()", native: ObjectClass.prototype._constructor },
        { type: "method", signature: "public String toString()", native: ObjectClass.prototype._nToString },
        { type: "method", signature: "public boolean equals(Object otherObject)", native: ObjectClass.prototype._nEquals },
        { type: "method", signature: "public final void wait()", java: ObjectClass.prototype._mj$wait$void$ },
        { type: "method", signature: "public final void wait(int milliseconds)", java: ObjectClass.prototype._mj$wait$void$ },
        { type: "method", signature: "public final void notify()", java: ObjectClass.prototype._mj$notify$void$ },
        { type: "method", signature: "public final void notifyAll()", java: ObjectClass.prototype._mj$notifyAll$void$ },
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
                if (t.state == ThreadState.timed_waiting) t.state = ThreadState.blocked;
            }, milliseconds);

            t.state = ThreadState.timed_waiting;
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
                if ([ThreadState.waiting, ThreadState.timed_waiting].indexOf(this.waitingThreads[i].state) >= 0) {
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


    _nToString() {
        return new StringClass("Object");
        // `t.stack.push(new ${Helpers.classes}["String"]("Object"));`
    }

    _nEquals(otherObject: ObjectClass) {
        return this == otherObject;
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

}

export class StringClass extends ObjectClass {

    static isPrimitiveTypeWrapper: boolean = true;

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class String extends Object implements Comparable<String>" },
        { type: "method", signature: "public String()", native: StringClass.prototype._emptyConstructor },
        { type: "method", signature: "public String(String original)", native: StringClass.prototype._constructor2 },
        { type: "method", signature: "public final String toString()", native: StringClass.prototype._nToString, template: "§1" },

        { type: "method", signature: "public final int length()", native: StringClass.prototype._nLength, template: "§1.value.length" },
        { type: "method", signature: "public final int indexOf(string str)", native: StringClass.prototype._nIndexOf1, template: "§1.value.indexOf(§2)" },
        { type: "method", signature: "public final int indexOf(string str, int fromIndex)", native: StringClass.prototype._nIndexOf2, template: "§1.value.indexOf(§2, §3)" },
        { type: "method", signature: "public final int indexOf(char c)", native: StringClass.prototype._nIndexOf1, template: "§1.value.indexOf(§2)" },
        { type: "method", signature: "public final int indexOf(char c, int fromIndex)", native: StringClass.prototype._nIndexOf2, template: "§1.value.indexOf(§2, §3)" },
        { type: "method", signature: "public final char charAt(int index)", native: StringClass.prototype._nCharAt, template: `(§1.value.charAt(§2) || __t.IOBE("String charAt: ${JCM.charIndexOutOfBounds()}."))` },
        { type: "method", signature: "public final int compareTo(String otherString)", template: "§1.value.localeCompare(§2.value)", java: StringClass.prototype._mj$compareTo$int$T },
        { type: "method", signature: "public final int compareToIgnoreCase(String otherString)", native: StringClass.prototype._nCompareToIgnoreCase, template: "§1.value.localeCompare(§2, undefined, { sensitivity: 'accent' })" },
        { type: "method", signature: "public final string concat(string otherString)", native: StringClass.prototype._nConcat, template: "§1.value.concat(§2)" },
        { type: "method", signature: "public final boolean contains(string otherString)", native: StringClass.prototype._nContains, template: "(§1.value.indexOf(§2) >= 0)" },
        { type: "method", signature: "public final boolean endsWith(string otherString)", native: StringClass.prototype._nEndsWith, template: "§1.value.endsWith(§2)" },
        { type: "method", signature: "public final boolean startsWith(string otherString)", native: StringClass.prototype._nStartsWith, template: "§1.value.startsWith(§2)" },
        { type: "method", signature: "public boolean equals(Object otherObject)", java: StringClass.prototype._mjEquals },
        { type: "method", signature: "public boolean equals(String otherObject)", java: StringClass.prototype._mjEquals },
        { type: "method", signature: "public final boolean equalsIgnoreCase(string otherString)", native: StringClass.prototype._nEqualsIgnoreCase, template: "§1.value.toLocaleUpperCase() == §2.toLocaleUpperCase()" },
        { type: "method", signature: "public final boolean isEmpty()", native: StringClass.prototype._nIsEmpty, template: "(§1.value.length == 0)" },
        { type: "method", signature: "public final int lastIndexOf(string str)", native: StringClass.prototype._nLastIndexOf1, template: "§1.value.lastIndexOf(§2)" },
        { type: "method", signature: "public final int lastIndexOf(string str, int fromIndex)", native: StringClass.prototype._nLastIndexOf2, template: "§1.value.lastIndexOf(§2, §3)" },
        { type: "method", signature: "public final int lastIndexOf(char c)", native: StringClass.prototype._nLastIndexOf1, template: "§1.value.lastIndexOf(§2)" },
        { type: "method", signature: "public final int lastIndexOf(char c, int fromIndex)", native: StringClass.prototype._nLastIndexOf2, template: "§1.value.lastIndexOf(§2, §3)" },
        { type: "method", signature: "public final string toLowerCase()", native: StringClass.prototype._nToLowerCase, template: "§1.value.toLocaleLowerCase()" },
        { type: "method", signature: "public final string toUpperCase()", native: StringClass.prototype._nToUpperCase, template: "§1.value.toLocaleUpperCase()" },
        { type: "method", signature: "public final string substring(int beginIndex)", native: StringClass.prototype._nSubstring1, template: "§1.value.substring(§2)" },
        { type: "method", signature: "public final string substring(int beginIndex, int endIndex)", native: StringClass.prototype._nSubstring2, template: "§1.value.substring(§2, §3)" },
        { type: "method", signature: "public final string trim()", native: StringClass.prototype._nTrim, template: "§1.value.trim()" },
        { type: "method", signature: "public final string replace(string target, string replacement)", native: StringClass.prototype._nReplace, template: "§1.value.replace(§2, §3)" },
        { type: "method", signature: "public final string replaceAll(string regex, string replacement)", native: StringClass.prototype._nReplaceAll, template: "§1.value.replace(new RegExp(§2, 'g'), §3)" },
        { type: "method", signature: "public final string matches(string regex)", native: StringClass.prototype._nMatches, template: "(§1.value.match(new RegExp(§2, 'g')) != null)" },
        { type: "method", signature: "public final string replaceFirst(string regex, string replacement)", native: StringClass.prototype._nReplaceFirst, template: "§1.value.replace(new RegExp(§2, ''), §3)" },
        { type: "method", signature: "public final String[] split(string regex)", native: StringClass.prototype._nSplit },

    ]

    public value: string;

    static type: NonPrimitiveType;

    constructor(value?: string) {
        super();
        this.value = value || "";
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

    _nCompareToIgnoreCase(otherString: StringClass) {
        if (otherString == null) return 1;
        return this.value.localeCompare(otherString.value, undefined, { sensitivity: 'accent' })
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

    _mjEquals(t: Thread, callback: CallbackFunction, otherString: StringClass) {
        let ret = false;
        if (otherString instanceof StringClass) {
            ret = this.value == otherString.value;
        }
        t.s.push(ret);
        if (callback) callback();
    }

    _mj$compareTo$int$T(t: Thread, callback: CallbackFunction, otherString: StringClass) {
        //if(otherString === null) throw new NullPointerExceptionClass("compareTo called with argument null");
        t.s.push(this.value.localeCompare(otherString.value));
        if (callback) callback;
    }
}