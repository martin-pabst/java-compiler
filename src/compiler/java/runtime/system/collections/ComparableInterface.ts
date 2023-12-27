import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";

export class ComparableInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "interface Comparable<T>"},
        {type: "method", signature: "int compareTo(T object)", java: ComparableInterface.prototype._mj$compareTo$int$T},
    ]

    static type: NonPrimitiveType;

    _mj$compareTo$int$T(t: Thread, callback: CallbackFunction){}

}