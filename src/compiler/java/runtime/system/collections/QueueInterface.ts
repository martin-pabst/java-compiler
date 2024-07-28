import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ObjectClass } from "../javalang/ObjectClassStringClass.ts";
import { CollectionInterface } from "./CollectionInterface.ts";
import { ComparatorInterface } from "./ComparatorInterface.ts";

export class QueueInterface extends CollectionInterface {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "interface Queue<E> extends Collection<E>", comment: JRC.queueInterfaceComment },
        { type: "method", signature: "E remove()", java: QueueInterface.prototype._mj$remove$E, comment: JRC.queueRemoveComment },
        { type: "method", signature: "E poll()", java: QueueInterface.prototype._mj$poll$E, comment: JRC.queuePollComment },
        { type: "method", signature: "E peek()", java: QueueInterface.prototype._mj$peek$E, comment: JRC.queuePeekComment },
        
    ]

    static type: NonPrimitiveType;

    _mj$remove$E(t: Thread, callback: CallbackFunction) { }

    _mj$poll$E(t: Thread, callback: CallbackFunction) { }

    _mj$peek$E(t: Thread, callback: CallbackFunction) { }



}