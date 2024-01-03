import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";
import { ObjectClass } from "../javalang/ObjectClassStringClass.ts";

export class ComparatorInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "interface Comparator<T>"},
        {type: "method", signature: "int compare(T object1, T object2)", java: ComparatorInterface.prototype._mj$compare$int$T$T},
    ]

    static type: NonPrimitiveType;

    _mj$compare$int$T$T(t: Thread, callback: CallbackFunction, object1: ObjectClass, object2: ObjectClass){}

}