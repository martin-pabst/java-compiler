import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";

export class IterableInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "interface Iterable<T>"},
        {type: "method", signature: "Iterator<T> iterator()", java: IterableInterface.prototype._mj$iterator$Iterator$},
    ]

    static type: NonPrimitiveType;

    _mj$iterator$Iterator$(t: Thread, callback: CallbackFunction){}

}