import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { BiConsumerInterface } from "../functional/BiConsumerInterface.ts";
import { ObjectClass } from "../javalang/ObjectClassStringClass.ts";

export class MapInterface extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "interface Map<K, V>", comment: JRC.mapInterfaceComment },
        { type: "method", signature: "int size()", java: MapInterface.prototype._mj$size$int$, comment: JRC.mapSizeComment },
        { type: "method", signature: "boolean isEmpty()", java: MapInterface.prototype._mj$isEmpty$boolean$, comment: JRC.mapIsEmptyComment },
        { type: "method", signature: "boolean containsKey(K key)", java: MapInterface.prototype._mj$containsKey$boolean$K, comment: JRC.mapContainsKeyComment },
        { type: "method", signature: "boolean containsValue(V value)", java: MapInterface.prototype._mj$containsValue$boolean$V, comment: JRC.mapContainsValueComment },
        { type: "method", signature: "V get(K key)", java: MapInterface.prototype._mj$get$V$K, comment: JRC.mapGetComment },
        { type: "method", signature: "V put(K key, V value)", java: MapInterface.prototype._mj$put$V$K$V, comment: JRC.mapPutComment },
        { type: "method", signature: "void clear()", java: MapInterface.prototype._mj$clear$void$, comment: JRC.mapClearComment },
        { type: "method", signature: "void forEach(BiConsumer<? super K, ? super V> action)", java: MapInterface.prototype._mj$forEach$void$BiConsumer , comment: JRC.mapForeachComment},

    ]

    static type: NonPrimitiveType;

    _mj$size$int$(t: Thread, callback: CallbackFunction) { }
    _mj$isEmpty$boolean$(t: Thread, callback: CallbackFunction) { }
    _mj$containsKey$boolean$K(t: Thread, callback: CallbackFunction, key: ObjectClass) { }
    _mj$containsValue$boolean$V(t: Thread, callback: CallbackFunction, value: ObjectClass) { }
    _mj$get$V$K(t: Thread, callback: CallbackFunction, key: ObjectClass) { }
    _mj$put$V$K$V(t: Thread, callback: CallbackFunction, key: ObjectClass, value: ObjectClass) { }
    _mj$clear$void$(t: Thread, callback: CallbackFunction) { }
    _mj$forEach$void$BiConsumer(t: Thread, callback: CallbackFunction, biConsumer: BiConsumerInterface) { }

}