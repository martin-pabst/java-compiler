import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ConsumerInterface } from "../functional/ConsumerInterface.ts";
import { NullPointerExceptionClass } from "../javalang/NullPointerExceptionClass.ts";
import { ObjectClass } from "../javalang/ObjectClassStringClass.ts";
import { CollectionInterface } from "./CollectionInterface.ts";
import { IteratorInterface } from "./IteratorInterface.ts";
import { SystemCollection } from "./SystemCollection.ts";


export class HashSetClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class HashSet<E> implements Set<E>", comment: JRC.hashSetClassComment },

        { type: "method", signature: "HashSet()", native: HashSetClass.prototype._constructor, comment: JRC.hashSetConstructorComment },

        // from Iterable
        {type: "method", signature: "Iterator<E> iterator()", java: HashSetClass.prototype._mj$iterator$Iterator$ , comment: JRC.iterableIteratorComment},
        {type: "method", signature: "void forEach(Consumer<? super E> action)", java: HashSetClass.prototype._mj$forEach$void$Consumer , comment: JRC.iterableForEachComment},

        // from Collection
        { type: "method", signature: "boolean add(E e)", java: HashSetClass.prototype._mj$add$boolean$E, comment: JRC.collectionAddElementComment },
        { type: "method", signature: "boolean addAll(Collection<? extends E> c)", java: HashSetClass.prototype._mj$addAll$boolean$Collection, comment: JRC.collectionAddAllComment },
        { type: "method", signature: "void clear()", java: HashSetClass.prototype._mj$clear$void$, comment: JRC.collectionClearComment },
        { type: "method", signature: "boolean contains(E element)", java: HashSetClass.prototype._mj$contains$boolean$E, comment: JRC.collectionContainsComment },
        { type: "method", signature: "boolean containsAll(Collection<?> c)", java: HashSetClass.prototype._mj$containsAll$boolean$Collection, comment: JRC.collectionContainsAllComment },
        { type: "method", signature: "boolean isEmpty()", java: HashSetClass.prototype._mj$isEmpty$boolean$, comment: JRC.collectionIsEmptyComment },
        { type: "method", signature: "boolean remove(E element)", java: HashSetClass.prototype._mj$remove$boolean$E, comment: JRC.collectionRemoveObjectComment },
        { type: "method", signature: "boolean removeAll(Collection<?> c)", java: HashSetClass.prototype._mj$removeAll$boolean$Collection, comment: JRC.collectionRemoveAllComment },
        { type: "method", signature: "int size()", java: HashSetClass.prototype._mj$size$int$, comment: JRC.collectionSizeComment },
        { type: "method", signature: "Object[] toArray()", java: HashSetClass.prototype._mj$toArray$Object_I$, comment: JRC.collectionToArrayComment },
        { type: "method", signature: "<T> T[] toArray(T[] a)", java: HashSetClass.prototype._mj$toArray$T_I$T_I, comment: JRC.collectionToArrayComment2 },

        // from Set
        { type: "declaration", signature: "interface Set<E> extends Collection<E>", comment: JRC.setInterfaceComment },
        { type: "method", signature: "boolean contains(E element)", java: HashSetClass.prototype._mj$contains$boolean$E, comment: JRC.setContainsComment },
        { type: "method", signature: "boolean containsAll(Collection c)", java: HashSetClass.prototype._mj$containsAll$boolean$Collection, comment: JRC.setContainsAllComment },

    ]

    static type: NonPrimitiveType;

    map: Map<any, any> = new Map(); // maps keys/hashCodes to original keys

    _constructor() {
        return this;
    }


    _mj$contains$boolean$E(t: Thread, callback: CallbackFunction, element: ObjectClass | null) {
        if (element == null) {
            t.s.push((typeof this.map.get(null)) != "undefined");
        } else {
            let hashCode = element.__internalHashCode();
            t.s.push((typeof this.map.get(hashCode)) != "undefined");
        }
        if (callback) callback();
        return;
    }

    _mj$containsAll$boolean$Collection(t: Thread, callback: CallbackFunction, collection: CollectionInterface) {
        if (collection == null) {
            throw new NullPointerExceptionClass(JRC.collectionContainsAllNullPointerException());
        }


        let f = (t: Thread, callback: CallbackFunction, elementsToCheck: ObjectClass[]) => {

            if (elementsToCheck.length > 0) {
                this._mj$contains$boolean$E(t, () => {
                    if (t.s.pop()) {
                        f(t, callback, elementsToCheck);
                    } else {
                        t.s.push(false);
                        if (callback) callback();
                    }
                }, elementsToCheck.pop()!);
            } else {
                t.s.push(true);
                if (callback) callback();
            }

        }

        if (collection instanceof SystemCollection) {
            let elementsToCheck = collection.getAllElements().slice();
            f(t, callback, elementsToCheck);
            return;
        } else {
            collection._mj$toArray$Object_I$(t, () => {
                let elementsToCheck = <any[]>t.s.pop();
                f(t, callback, elementsToCheck.slice());
                return;
            })
        }

    }

    _mj$add$boolean$E(t: Thread, callback: CallbackFunction, element: ObjectClass) {
        if (element == null) {
            let oldValue = this.map.get(null);
            t.s.push(typeof oldValue == "undefined");
            this.map.set(null, element);
        } else {
            let hashCode = element.__internalHashCode();
            let oldValue = this.map.get(hashCode);
            t.s.push(typeof oldValue == "undefined");
            this.map.set(hashCode, element);
        }
        if (callback) callback();
        return;
    };

    _mj$addAll$boolean$Collection(t: Thread, callback: CallbackFunction, collection: CollectionInterface) {
        if (collection == null) {
            throw new NullPointerExceptionClass(JRC.collectionAddAllNullPointerException());
        }

        if (collection instanceof SystemCollection) {
            collection.getAllElements().forEach(element => this._mj$add$boolean$E(t, undefined, element));
            t.s.push(true);
            if (callback) callback();
            return;
        }

        collection._mj$toArray$Object_I$(t, () => {
            let newElements = t.s.pop();
            if (newElements != null && Array.isArray(newElements)) {
                newElements.forEach(element => this._mj$add$boolean$E(t, undefined, element));
                t.s.push(true);
                if (callback) callback();
            }
        })

    };

    _mj$remove$boolean$E(t: Thread, callback: CallbackFunction, element: ObjectClass) {
        if (element == null) {
            let oldValue = this.map.get(null);
            t.s.push(typeof oldValue == "undefined");
            this.map.delete(null);
        } else {
            let hashCode = element.__internalHashCode();
            let oldValue = this.map.get(hashCode);
            t.s.push(typeof oldValue == "undefined");
            this.map.delete(hashCode);
        }
        if (callback) callback();
        return;

    };

    _mj$removeAll$boolean$Collection(t: Thread, callback: CallbackFunction, collection: CollectionInterface) {
        if (collection == null) {
            throw new NullPointerExceptionClass(JRC.collectionAddAllNullPointerException());
        }

        if (collection instanceof SystemCollection) {
            collection.getAllElements().forEach(element => this._mj$remove$boolean$E(t, undefined, element));
            t.s.push(true);
            if (callback) callback();
            return;
        }

        collection._mj$toArray$Object_I$(t, () => {
            let newElements = t.s.pop();
            if (newElements != null && Array.isArray(newElements)) {
                newElements.forEach(element => this._mj$remove$boolean$E(t, undefined, element));
                t.s.push(true);
                if (callback) callback();
            }
        })

    };

    private toArray(): ObjectClass[] {
        let keys: ObjectClass[] = [];
        for(let v of this.map.values()){
            keys.push(v);
        }
        return keys;        
    }

    _mj$toArray$Object_I$(t: Thread, callback: CallbackFunction) { 
        t.s.push(this.toArray());
        if(callback) callback();
    };

    _mj$toArray$T_I$T_I(t: Thread, callback: CallbackFunction, templateArray: any) { 
        this._mj$toArray$Object_I$(t, callback);
    };


    _mj$size$int$(t: Thread, callback: CallbackFunction) {
        t.s.push(this.map.size);
        if (callback) callback();
        return;
    }

    _mj$isEmpty$boolean$(t: Thread, callback: CallbackFunction) {
        t.s.push(this.map.size == 0);
        if (callback) callback();
        return;
    }

    _mj$clear$void$(t: Thread, callback: CallbackFunction) {
        this.map.clear();
    }

    _mj$iterator$Iterator$(t: Thread, callback: CallbackFunction){
        let iterator = new ObjectClass();

        let nextIndex = 0;

        let elements: ObjectClass[] = this.toArray();

        //@ts-ignore
        iterator["_mj$hasNext$boolean$"] = (t: Thread, callback: CallbackFunction) => {
            t.s.push(nextIndex < elements.length);
            if (callback) callback();
        }

        //@ts-ignore
        iterator["_mj$next$E$"] = (t: Thread, callback: CallbackFunction) => {
            if (nextIndex < elements.length) nextIndex++;
            t.s.push(elements[nextIndex - 1]);
            if (callback) callback();
        }

        t.s.push(iterator);
        if(callback) callback();
        return;
    }

    _mj$forEach$void$Consumer(t: Thread, callback: CallbackFunction, consumer: ConsumerInterface){

        let index: number = -1;
        let elements = this.toArray();

        let f = () => {
            index++;
            if (index < elements.length) {
                consumer._mj$accept$void$T(t, f, elements[index]);
            } else {
                if (callback) callback();
            }
        }

        f();


    }

}