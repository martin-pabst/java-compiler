import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ObjectClass } from "../javalang/ObjectClassStringClass.ts";

export class HashMapClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class HashMap<K, V> implements Map<K, V>", comment: JRC.hashMapClassComment},

        { type: "method", signature: "HashMap()", native: HashMapClass.prototype._constructor , comment: JRC.hashMapConstructorComment},

        // from Map-interface
        { type: "method", signature: "int size()", java: HashMapClass.prototype._mj$size$int$, comment: JRC.mapSizeComment },
        { type: "method", signature: "boolean isEmpty()", java: HashMapClass.prototype._mj$isEmpty$boolean$, comment: JRC.mapIsEmptyComment },
        { type: "method", signature: "boolean containsKey(K key)", java: HashMapClass.prototype._mj$containsKey$boolean$K, comment: JRC.mapContainsKeyComment },
        { type: "method", signature: "boolean containsValue(V value)", java: HashMapClass.prototype._mj$containsValue$boolean$V, comment: JRC.mapContainsValueComment },
        { type: "method", signature: "V get(K key)", java: HashMapClass.prototype._mj$get$V$K, comment: JRC.mapGetComment },
        { type: "method", signature: "V put(K key, V value)", java: HashMapClass.prototype._mj$put$V$K$V, comment: JRC.mapPutComment },
        { type: "method", signature: "void clear()", java: HashMapClass.prototype._mj$clear$void$, comment: JRC.mapClearComment },


    ]

    static type: NonPrimitiveType;
    
    map: Map<any, any> = new Map();

    _constructor() {
        return this;
    }

    _mj$size$int$(t: Thread, callback: CallbackFunction) {
        t.s.push(this.map.size);
        if(callback) callback();
        return;
     }

    _mj$isEmpty$boolean$(t: Thread, callback: CallbackFunction) { 
        t.s.push(this.map.size == 0);
        if(callback) callback();
        return;
    }

    _mj$containsKey$boolean$K(t: Thread, callback: CallbackFunction, key: ObjectClass) {
        if(key == null){
            t.s.push(typeof (this.map.get(null) !== "undefined"));
        } else {
            let hashCode = key.__internalHashCode();
            t.s.push(typeof (this.map.get(hashCode) !== "undefined"));
        }
        if(callback) callback();
        return;
     }

    _mj$containsValue$boolean$V(t: Thread, callback: CallbackFunction, value: ObjectClass) { 
        let ret: boolean = false;
        for(let v of this.map.values()){
            if(v == value){
                ret = true;
                break;
            }
        }
        t.s.push(ret);
        if(callback) callback();
        return;
    }

    _mj$get$V$K(t: Thread, callback: CallbackFunction, key: ObjectClass) { 
        if(key == null){
            t.s.push(this.map.get(null)  || null);
        } else {
            let hashCode = key.__internalHashCode();
            t.s.push(this.map.get(hashCode) || null);
        }
        if(callback) callback();
        return;
    }

    _mj$put$V$K$V(t: Thread, callback: CallbackFunction, key: ObjectClass, value: ObjectClass) { 
        if(key == null){
            let oldValue = this.map.get(null) || null;
            t.s.push(oldValue);
            this.map.set(null, value);
        } else {
            let hashCode = key.__internalHashCode();
            let oldValue = this.map.get(hashCode);
            t.s.push(oldValue);
            this.map.set(hashCode, value);
        }
        if(callback) callback();
        return;
    }

    _mj$clear$void$(t: Thread, callback: CallbackFunction) { 
        this.map.clear();
    }

}