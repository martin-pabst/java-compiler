import { IThrowable, Stacktrace } from "../../../../common/interpreter/ThrowableType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ObjectClass, StringClass } from "./ObjectClassStringClass.ts";

export class ThrowableClass extends ObjectClass implements IThrowable {

    stacktrace: Stacktrace = [];

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class Throwable extends Object"},
        {type: "m", signature: "public Throwable()", native: ThrowableClass.prototype._constructor},
        {type: "m", signature: "public Throwable(String message)", native: ThrowableClass.prototype._constructor_m},
        {type: "m", signature: "public Throwable(Throwable cause)", native: ThrowableClass.prototype._constructor_c},
        {type: "m", signature: "public Throwable(String message, Throwable cause)", native: ThrowableClass.prototype._constructor_m_c},
        {type: "m", signature: "public String toString()", native: ThrowableClass.prototype._toString},
        {type: "m", signature: "public String getMessage()", native: ThrowableClass.prototype._getMessage},
    ]


    static type: NonPrimitiveType;

    constructor(public message?: string, public cause?: ThrowableClass){
        super();
    }

    _constructor_m(message: string): void {
        this.message = message;
    }

    _constructor_c(cause: ThrowableClass): void {
        this.cause = cause;
    }

    _constructor_m_c(message: string, cause: ThrowableClass): void {
        this.message = message;
        this.cause = cause;
    }


    _toString() {
        return new StringClass(this.getClassName() + ": " + this.message ? this.message : "");        
    }

    _getMessage() {
        return new StringClass(this.message ? this.message : "");        
    }



}