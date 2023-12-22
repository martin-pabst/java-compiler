import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { NullPointerExceptionClass } from "../javalang/NullPointerExceptionClass.ts";
import { ObjectClass } from "../javalang/ObjectClassStringClass.ts";
import { CollectionInterface } from "./CollectionInterface.ts";
import { SystemCollection } from "./SystemCollection.ts";

export class ArrayListClass extends SystemCollection {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class ArrayList<E> Implements List<E>" },

        { type: "method", signature: "ArrayList()", native: ArrayListClass.prototype._constructor },

        // from InterableInterface
        { type: "method", signature: "Iterator<T> iterator()" },

        // from CollectionInterface
        { type: "method", signature: "boolean add(E e)", native: ArrayListClass.prototype._add },
        { type: "method", signature: "boolean addAll(Collection<? extends E> c)", java: ArrayListClass.prototype._addAll },
        { type: "method", signature: "void clear()", native: ArrayListClass.prototype._clear },
        { type: "method", signature: "boolean contains(Object o)", native: ArrayListClass.prototype._contains },
        { type: "method", signature: "boolean containsAll(Collection<?> c)", java: ArrayListClass.prototype._containsAll },
        { type: "method", signature: "boolean isEmpty()", native: ArrayListClass.prototype._isEmpty },
        { type: "method", signature: "boolean remove(Object o)", native: ArrayListClass.prototype._remove },
        { type: "method", signature: "boolean removeAll(Collection<?> c)" },
        { type: "method", signature: "int size()" },
        { type: "method", signature: "Object[] toArray()" },
        { type: "method", signature: "<T> T[] toArray(T[] a)" },

        // from ListInterface
        { type: "method", signature: "boolean add(E e)" },
        { type: "method", signature: "boolean addAll(Collection<? extends E> c)" },
        { type: "method", signature: "void clear()" },
        { type: "method", signature: "boolean contains(Object o)" },
        { type: "method", signature: "boolean containsAll(Collection<?> c)" },
        { type: "method", signature: "boolean isEmpty()" },
        { type: "method", signature: "boolean remove(Object o)" },
        { type: "method", signature: "boolean removeAll(Collection<?> c)" },
        { type: "method", signature: "int size()" },

        // TODO: toArray, ...
    ]

    static type: NonPrimitiveType;

    protected elements: ObjectClass[] = [];

    _constructor() {
        return this;
    }

    getAllElements(): ObjectClass[] {
        return this.elements;
    }

    _add(element: ObjectClass) {
        this.elements.push(element);
    }

    _addAll(t: Thread, callback: CallbackFunction, collection: CollectionInterface) {

        if (collection == null) {
            t.throwException(new NullPointerExceptionClass("ArrayList.addAll wurde mit null als Argument aufgerufen."));
            return;
        }

        if (collection instanceof SystemCollection) {
            this.elements = this.elements.concat(collection.getAllElements());
            t.s.push(true);
            if (callback) callback();
            return;
        }

        collection._mj$toArray$Object_I$(t, () => {
            let newElements = t.s.pop();
            if (newElements != null && Array.isArray(newElements)) {
                this.elements = this.elements.concat(newElements);
                t.s.push(true);
                if (callback) callback();
            }
        })

    }

    _clear() {
        this.elements.length = 0;
    }

    _contains(o: ObjectClass) {
        return this.elements.indexOf(o) >= 0;
    }

    _containsAll(t: Thread, callback: CallbackFunction, collection: CollectionInterface) {

        if (collection == null) {
            t.throwException(new NullPointerExceptionClass("ArrayList.containsAll wurde mit null als Argument aufgerufen."));
            return;
        }

        let otherElements: ObjectClass[] = [];

        if (collection instanceof SystemCollection) {
            otherElements = collection.getAllElements();
            for (let e1 of otherElements) {
                if (this.elements.indexOf(e1) < 0) {
                    t.s.push(false);
                    if (callback) callback();
                    return;
                }
            }
            t.s.push(true);
            if (callback) callback();
            return;
        }


        collection._mj$toArray$Object_I$(t, () => {
            let newElements = t.s.pop();
            if (newElements != null && Array.isArray(newElements)) {
                for (let e1 of newElements) {
                    if (this.elements.indexOf(e1) < 0) {
                        t.s.push(false);
                        if (callback) callback();
                        return;
                    }
                }
                t.s.push(true);
                if (callback) callback();
                return;
            }
        })

    }

    _isEmpty(){
        return this.elements.length == 0;
    }

    _remove(o: ObjectClass) {
        let index = this.elements.indexOf(o);
        if(index >= 0){
            this.elements.splice(index, 1)
            return true;
        } 
        return false;
    }



}