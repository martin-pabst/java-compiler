import { IThrowable, Stacktrace } from "../../../../common/interpreter/ThrowableType.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ExceptionClass } from "./ExceptionClass.ts";
import { ObjectClass, StringClass } from "./ObjectClassStringClass.ts";
import { RuntimeExceptionClass } from "./RuntimeException.ts";
import { ThrowableClass } from "./ThrowableClass.ts";

export class ClassCastExceptionClass extends RuntimeExceptionClass {

    stacktrace: Stacktrace = [];

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class ClassCastException extends RuntimeException"},
        {type: "method", signature: "public ClassCastException()", native: ExceptionClass.prototype._constructor},
        {type: "method", signature: "public ClassCastException(String message)", native: ThrowableClass.prototype._constructor_m},
        {type: "method", signature: "public ClassCastException(Throwable cause)", native: ThrowableClass.prototype._constructor_c},
        {type: "method", signature: "public ClassCastException(String message, Throwable cause)", native: ThrowableClass.prototype._constructor_m_c},
        {type: "method", signature: "public String toString()", native: ThrowableClass.prototype._toString}
    ]


    static type: NonPrimitiveType;

    constructor(public message?: string, public cause?: ThrowableClass){
        super();
    }



}