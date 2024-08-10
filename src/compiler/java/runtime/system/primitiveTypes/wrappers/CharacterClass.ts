import { Thread } from "../../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { ObjectClass, StringClass } from "../../javalang/ObjectClassStringClass";
import { IPrimitiveTypeWrapper } from "./IPrimitiveTypeWrapper";
import { NumberClass } from "./NumberClass";

/**
 * @link https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Boolean.html
 */
export class CharacterClass extends ObjectClass implements IPrimitiveTypeWrapper {

    static isPrimitiveTypeWrapper: boolean = true;

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Character extends Object implements Comparable<Character>" },

        { type: "method", signature: "Character(char value)", native: CharacterClass.prototype._constructor1 },
        { type: "method", signature: "public final char charValue()", template: "§1.value" },
        { type: "method", signature: "public int compareTo(Character otherCharacter)", native: CharacterClass.prototype._compareTo },
        { type: "method", signature: "public static Character valueOf(char c)", native: CharacterClass._valueOf },
        { type: "method", signature: "public String toString()", native: CharacterClass.prototype._toString },
    ]

    static type: NonPrimitiveType;


    constructor(public value: string) {
        super();
    }

    debugOutput(): string {
        return "'" + this.value + "'";
    }

    static _valueOf(c: string) {
        return new CharacterClass(c);
    }

    _constructor1() {
        return this;
    }

    __internalHashCode(): any {
        return this.value;
    }

    _compareTo(otherValue: CharacterClass) {
        return this == otherValue ? 0 : 1;
    }

    _toString() {
        return new StringClass(this.value);
    }

}