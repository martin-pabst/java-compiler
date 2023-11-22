import { IThrowable, Stacktrace } from "../../../../common/interpreter/ThrowableType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ObjectClass, StringClass } from "./ObjectClassStringClass.ts";
import { ThrowableClass } from "./ThrowableClass.ts";

export class ExceptionClass extends ThrowableClass implements IThrowable {

    stacktrace: Stacktrace = [];

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class Exception extends Object"},
        {type: "m", signature: "public Exception()", native: ExceptionClass.prototype._constructor},
        {type: "m", signature: "public Exception(String message)", native: ThrowableClass.prototype._constructor_m},
        {type: "m", signature: "public Exception(Throwable cause)", native: ThrowableClass.prototype._constructor_c},
        {type: "m", signature: "public Exception(String message, Throwable cause)", native: ThrowableClass.prototype._constructor_m_c},
        {type: "m", signature: "public String toString()", native: ThrowableClass.prototype._toString}
    ]


    static type: NonPrimitiveType;

    constructor(public message?: string, public cause?: ThrowableClass){
        super();
    }



}