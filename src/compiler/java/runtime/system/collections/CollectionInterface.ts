import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";

export class CollectionInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "interface Collection<E> extends Iterable<E>"},
        {type: "method", signature: "boolean add(E e)", java: CollectionInterface.prototype._mj$add$boolean$E},
        {type: "method", signature: "boolean addAll(Collection<? extends E> c)", java: CollectionInterface.prototype._mj$addAll$boolean$Collection},
        {type: "method", signature: "void clear()", java: CollectionInterface.prototype._mj$clear$void$},
        {type: "method", signature: "boolean contains(Object o)", java: CollectionInterface.prototype._mj$contains$boolean$Object},
        {type: "method", signature: "boolean containsAll(Collection<?> c)", java: CollectionInterface.prototype._mj$containsAll$boolean$Collection},
        {type: "method", signature: "boolean isEmpty()", java: CollectionInterface.prototype._mj$isEmpty$boolean$},
        {type: "method", signature: "boolean remove(Object o)", java: CollectionInterface.prototype._mj$remove$boolean$Object},
        {type: "method", signature: "boolean removeAll(Collection<?> c)", java: CollectionInterface.prototype._mj$removeAll$boolean$Collection},
        {type: "method", signature: "int size()", java: CollectionInterface.prototype._mj$size$int$},
        {type: "method", signature: "Object[] toArray()", java: CollectionInterface.prototype._mj$toArray$Object_I$},
        {type: "method", signature: "<T> T[] toArray(T[] a)", java: CollectionInterface.prototype._mj$toArray$T_I$T_I},
        
        // TODO: toArray, ...
    ]

    static type: NonPrimitiveType;

    _mj$add$boolean$E(t: Thread, callback: CallbackFunction){};
    
    _mj$addAll$boolean$Collection(t: Thread, callback: CallbackFunction){};
    
    _mj$clear$void$(t: Thread, callback: CallbackFunction){};
    
    _mj$contains$boolean$Object(t: Thread, callback: CallbackFunction){};
    
    _mj$containsAll$boolean$Collection(t: Thread, callback: CallbackFunction){};
    
    _mj$isEmpty$boolean$(t: Thread, callback: CallbackFunction){};

    _mj$remove$boolean$Object(t: Thread, callback: CallbackFunction){};
    
    _mj$removeAll$boolean$Collection(t: Thread, callback: CallbackFunction){};

    _mj$size$int$(t: Thread, callback: CallbackFunction){};

    _mj$toArray$Object_I$(t: Thread, callback: CallbackFunction){};

    _mj$toArray$T_I$T_I(t: Thread, callback: CallbackFunction){};
}