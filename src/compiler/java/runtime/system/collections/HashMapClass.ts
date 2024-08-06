import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { BiConsumerInterface } from "../functional/BiConsumerInterface.ts";
import { ObjectClass } from "../javalang/ObjectClassStringClass.ts";

type Value = {
    k: any;
    v: any;
}

export class HashMapClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class HashMap<K, V> implements Map<K, V>", comment: JRC.hashMapClassComment},

        { type: "method", signature: "HashMap()", native: HashMapClass.prototype._constructor , comment: JRC.hashMapConstructorComment},

        // from Map-interface
        { type: "method", signature: "int size()", native: HashMapClass.prototype._size, comment: JRC.mapSizeComment },
        { type: "method", signature: "boolean isEmpty()", native: HashMapClass.prototype._isEmpty, comment: JRC.mapIsEmptyComment },
        { type: "method", signature: "boolean containsKey(K key)", native: HashMapClass.prototype._containsKey, comment: JRC.mapContainsKeyComment },
        { type: "method", signature: "boolean containsValue(V value)", native: HashMapClass.prototype._containsValue, comment: JRC.mapContainsValueComment },
        { type: "method", signature: "V get(K key)", native: HashMapClass.prototype._get, comment: JRC.mapGetComment },
        { type: "method", signature: "V put(K key, V value)", native: HashMapClass.prototype._put, comment: JRC.mapPutComment },
        { type: "method", signature: "void clear()", native: HashMapClass.prototype._clear, comment: JRC.mapClearComment },
        { type: "method", signature: "void forEach(BiConsumer<? super K, ? super V> action)", java: HashMapClass.prototype._mj$forEach$void$BiConsumer , comment: JRC.mapForeachComment},

    ]

    static type: NonPrimitiveType;
    
    map: Map<any, Value> = new Map();

    _constructor() {
        return this;
    }

    _size() {
        return this.map.size;
     }

    _isEmpty() { 
        return this.map.size == 0;
    }

    _containsKey(key: ObjectClass) {
        if(key == null){
            return (typeof this.map.get(null)) !== "undefined";
        } else {
            let hashCode = key.__internalHashCode();
            return (typeof this.map.get(hashCode)) !== "undefined";
        }
     }

     _values(){
        let values: ObjectClass[] = [];
        this.map.forEach((v, k) => values.push(v.v));
        return values;
     }

    _containsValue(value: ObjectClass) { 
        let ret: boolean = false;
        for(let v of this.map.values()){
            if(v.v == value){
                ret = true;
                break;
            }
        }
        return ret;
    }

    _get(key: ObjectClass) { 
        if(key == null){
             return this.map.get(null)?.v  || null;
        } else {
            let hashCode = key.__internalHashCode();
             return this.map.get(hashCode)?.v || null;
        }
    }

    _put(key: ObjectClass, value: ObjectClass) { 
        if(key == null){
            let oldValue = this.map.get(null) || null;
            this.map.set(null, {k: null, v: value});
            return oldValue;
        } else {
            let hashCode = key.__internalHashCode();
            let oldValue = this.map.get(hashCode);
            this.map.set(hashCode, {k: key, v: value});
            return oldValue;
        }
    }

    _clear() { 
        this.map.clear();
    }

    _mj$forEach$void$BiConsumer(t: Thread, callback: CallbackFunction, biConsumer: BiConsumerInterface) { 

        let index: number = -1;
        let elements: Value[] = [];
        this.map.forEach((v, k) => elements.push(v));

        let f = () => {
            index++;
            if (index < elements.length) {
                biConsumer._mj$accept$void$T$U(t, f, elements[index].k, elements[index].v);
            } else {
                if (callback) callback();
            }
        }

        f();

    }

}