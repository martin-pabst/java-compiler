import { CallbackFunction, Klass } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { NullPointerExceptionClass } from "../javalang/NullPointerExceptionClass.ts";
import { ObjectClass, StringClass } from "../javalang/ObjectClassStringClass.ts";
import { CollectionInterface } from "./CollectionInterface.ts";
import { SystemCollection } from "./SystemCollection.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { IndexOutOfBoundsExceptionClass } from "../javalang/IndexOutOfBoundsExceptionClass.ts";
import { ConsumerInterface } from "../functional/ConsumerInterface.ts";
import { ComparatorInterface } from "./ComparatorInterface.ts";
import { BaseListType, BaseType } from "../../../../common/BaseType.ts";
import { ArrayToStringCaster } from "../../../../common/interpreter/ArrayToStringCaster.ts";
import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";

export class HashMapClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class HashMap<K, V> implements Map<K, V>", comment: JRC.hashMapClassComment},

        { type: "method", signature: "HashMap()", native: HashMapClass.prototype._constructor , comment: JRC.hashMapConstructorComment},

        // from Map-interface
        { type: "method", signature: "int size()", java: HashMapClass.prototype._mj$size$int$, comment: JRC.mapSizeComment },
        { type: "method", signature: "boolean isEmpty()", java: HashMapClass.prototype._mj$isEmpty$boolean$, comment: JRC.mapIsEmptyComment },
        { type: "method", signature: "boolean containsKey(K key)", java: HashMapClass.prototype._mj$containsKey$boolean$K, comment: JRC.mapContainsKeyComment },
        { type: "method", signature: "boolean containsValue(V value)", java: HashMapClass.prototype._mj$containsValue$boolean$V, comment: JRC.mapContainsValueComment },
        { type: "method", signature: "V get(K key)", java: HashMapClass.prototype._mj$get$boolean$K, comment: JRC.mapGetComment },
        { type: "method", signature: "V put(K key, V value)", java: HashMapClass.prototype._mj$put$V$K$V, comment: JRC.mapPutComment },
        { type: "method", signature: "voie clear()", java: HashMapClass.prototype._mj$clear$void$, comment: JRC.mapClearComment },


    ]

    static type: NonPrimitiveType;
    
    map: Map<any, any> = new Map();

    _constructor() {
        return this;
    }

    _mj$size$int$(t: Thread, callback: CallbackFunction) { }
    _mj$isEmpty$boolean$(t: Thread, callback: CallbackFunction) { }
    _mj$containsKey$boolean$K(t: Thread, callback: CallbackFunction, key: ObjectClass) { }
    _mj$containsValue$boolean$V(t: Thread, callback: CallbackFunction, value: ObjectClass) { }
    _mj$get$boolean$K(t: Thread, callback: CallbackFunction, key: ObjectClass) { }
    _mj$put$V$K$V(t: Thread, callback: CallbackFunction, key: ObjectClass, value: ObjectClass) { }
    _mj$clear$void$(t: Thread, callback: CallbackFunction) { }

}