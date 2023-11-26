import { IThrowable, Stacktrace } from "../../../../common/interpreter/ThrowableType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ExceptionClass } from "./ExceptionClass.ts";
import { ObjectClass, StringClass } from "./ObjectClassStringClass.ts";
import { RuntimeExceptionClass } from "./RuntimeException.ts";
import { ThrowableClass } from "./ThrowableClass.ts";

export class ArithmeticExceptionClass extends RuntimeExceptionClass {

    stacktrace: Stacktrace = [];

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class ArithmeticException extends RuntimeException"},
        {type: "m", signature: "public ArithmeticException()", native: ExceptionClass.prototype._constructor},
        {type: "m", signature: "public ArithmeticException(String message)", native: ThrowableClass.prototype._constructor_m},
        {type: "m", signature: "public ArithmeticException(Throwable cause)", native: ThrowableClass.prototype._constructor_c},
        {type: "m", signature: "public ArithmeticException(String message, Throwable cause)", native: ThrowableClass.prototype._constructor_m_c},
        {type: "m", signature: "public String toString()", native: ThrowableClass.prototype._toString}
    ]


    static type: NonPrimitiveType;

    constructor(public message?: string, public cause?: ThrowableClass){
        super();
    }



}