import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction";
import { Thread } from "../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass, StringClass } from "./ObjectClassStringClass";

export class BigIntegerClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class BigInteger extends Object", comment: JRC.BigIntegerClassComment },

        { type: "method", signature: "BigInteger(long val)", java: BigIntegerClass.prototype._cj$_constructor_$BigInteger$long, comment: JRC.BigIntegerConstructorComment },
        { type: "method", signature: "final BigInteger add(BigInteger otherNumber)", native: BigIntegerClass.prototype._add, comment: JRC.BigIntegerAddComment },
        { type: "method", signature: "final BigInteger divide(BigInteger otherNumber)", native: BigIntegerClass.prototype._divide, comment: JRC.BigIntegerDivideComment },
        { type: "method", signature: "final BigInteger multiply(BigInteger otherNumber)", native: BigIntegerClass.prototype._multiply, comment: JRC.BigIntegerMultiplyComment },
        { type: "method", signature: "final BigInteger remainder(BigInteger otherNumber)", native: BigIntegerClass.prototype._remainder, comment: JRC.BigIntegerRemainderComment },
        { type: "method", signature: "final String toString()", java: BigIntegerClass.prototype._mj$toString$String$, comment: JRC.BigIntegerToStringComment },
        { type: "method", signature: "final int intValue()", native: BigIntegerClass.prototype._intValue, comment: JRC.BigIntegerIntValueComment },
        
    ]

    static type: NonPrimitiveType;
    value!: bigint;

    constructor(value?: bigint){
        super();
        this.value = value!;
    }

    __internalHashCode(): any {
        return this.value;
    }

    _cj$_constructor_$BigInteger$long(t: Thread, callback: CallbackFunction, value: number){
        this.value = BigInt(value);
        t.s.push(this);
        if(callback) callback();
    }

    _add(other: BigIntegerClass): BigIntegerClass {
        return new BigIntegerClass(this.value + other.value);
    }

    _divide(other: BigIntegerClass): BigIntegerClass {
        return new BigIntegerClass(this.value / other.value);
    }

    _remainder(other: BigIntegerClass): BigIntegerClass {
        return new BigIntegerClass(this.value % other.value);
    }

    _multiply(other: BigIntegerClass): BigIntegerClass {
        return new BigIntegerClass(this.value * other.value);
    }

    _intValue(): number {
        return Number(BigInt.asIntN(52, this.value));
    }

    _mj$toString$String$(t: Thread, callback: CallbackFunction) {
        t.s.push(new StringClass(this.value.toString()));
        if(callback) callback();
        return;
    }

    _debugOutput(){
        let s = `${this.value.toString()}`;
        return s;
    }


}
