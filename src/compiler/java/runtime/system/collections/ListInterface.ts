import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";

export class ListInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "interface List<E> extends Collection<E>"},
        {type: "method", signature: "boolean add(int index, E element)", java: ListInterface.prototype._mj$add$boolean$int$E},
        {type: "method", signature: "boolean addAll(int index, Collection<? extends E> c)", java: ListInterface.prototype._mj$addAll$boolean$int$Collection},
        {type: "method", signature: "E get (int index)", java: ListInterface.prototype._mj$get$E$int},
        {type: "method", signature: "int indexOf (Object o)", java: ListInterface.prototype._mj$indexOf$int$Object},
        {type: "method", signature: "E remove (int index)", java: ListInterface.prototype._mj$remove$E$int},
        {type: "method", signature: "E set (int index, E Element)", java: ListInterface.prototype._mj$set$E$int$E},
        
        // TODO: sort, subList, ...
    ]

    static type: NonPrimitiveType;

    _mj$add$boolean$int$E(t: Thread, callback: CallbackFunction){}

    _mj$addAll$boolean$int$Collection(t: Thread, callback: CallbackFunction){}

    _mj$get$E$int(t: Thread, callback: CallbackFunction){}

    _mj$indexOf$int$Object(t: Thread, callback: CallbackFunction){}

    _mj$remove$E$int(t: Thread, callback: CallbackFunction){}

    _mj$set$E$int$E(t: Thread, callback: CallbackFunction){}

}