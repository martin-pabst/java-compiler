import { IThrowable, Stacktrace } from "../../../../common/interpreter/ThrowableType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ExceptionClass } from "./ExceptionClass.ts";
import { ObjectClass, StringClass } from "./ObjectClassStringClass.ts";
import { ThrowableClass } from "./ThrowableClass.ts";

export class RuntimeExceptionClass extends ExceptionClass {

    stacktrace: Stacktrace = [];

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class RuntimeException extends Exception"},
        {type: "m", signature: "public RuntimeException()", native: ExceptionClass.prototype._constructor},
        {type: "m", signature: "public RuntimeException(String message)", native: ThrowableClass.prototype._constructor_m},
        {type: "m", signature: "public RuntimeException(Throwable cause)", native: ThrowableClass.prototype._constructor_c},
        {type: "m", signature: "public RuntimeException(String message, Throwable cause)", native: ThrowableClass.prototype._constructor_m_c},
        {type: "m", signature: "public String toString()", native: ThrowableClass.prototype._toString}
    ]


    static type: NonPrimitiveType;

    constructor(public message?: string, public cause?: ThrowableClass){
        super();
    }



}