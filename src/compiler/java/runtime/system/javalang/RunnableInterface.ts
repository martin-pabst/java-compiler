import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";

export class RunnableInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "interface Runnable"},
        {type: "method", signature: "void run()", java: RunnableInterface.prototype._mj$run$void$},
    ]

    static type: NonPrimitiveType;

    _mj$run$void$(t: Thread, callback: CallbackFunction){}


}