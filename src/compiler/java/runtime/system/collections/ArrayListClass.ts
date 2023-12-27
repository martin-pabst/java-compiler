import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { NullPointerExceptionClass } from "../javalang/NullPointerExceptionClass.ts";
import { ObjectClass } from "../javalang/ObjectClassStringClass.ts";
import { CollectionInterface } from "./CollectionInterface.ts";
import { SystemCollection } from "./SystemCollection.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { IndexOutOfBoundsExceptionClass } from "../javalang/IndexOutOfBoundsExceptionClass.ts";

export class ArrayListClass extends SystemCollection {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class ArrayList<E> Implements List<E>" },

        { type: "method", signature: "ArrayList()", native: ArrayListClass.prototype._constructor },

        // from InterableInterface
        { type: "method", signature: "Iterator<E> iterator()", native: ArrayListClass.prototype._iterator },
 
        // from CollectionInterface
        { type: "method", signature: "Object[] toArray()", native: ArrayListClass.prototype._toArray, template: "§1.elements.slice()" },
        { type: "method", signature: "<T> T[] toArray(T[] a)", native: ArrayListClass.prototype._toArray, template: "§1.elements.slice()" },
        { type: "method", signature: "boolean add(E e)", native: ArrayListClass.prototype._add, template: "(§1.push(§2) >= 0)" },
        { type: "method", signature: "boolean addAll(Collection<? extends E> c)", java: ArrayListClass.prototype._addAll },
        { type: "method", signature: "void clear()", native: ArrayListClass.prototype._clear, template: "§1.elements.length = 0" },
        { type: "method", signature: "boolean contains(Object o)", native: ArrayListClass.prototype._contains, template: "(§1.elements.indexOf(§2) >= 0)" },
        { type: "method", signature: "boolean containsAll(Collection<?> c)", java: ArrayListClass.prototype._containsAll },
        { type: "method", signature: "boolean isEmpty()", native: ArrayListClass.prototype._isEmpty, template: "(§1.elements.length == 0)" },
        { type: "method", signature: "boolean remove(Object o)", native: ArrayListClass.prototype._remove, template: "(§1.elements.splice(§1.elements.indexOf(§2), 1))" },
        { type: "method", signature: "boolean removeAll(Collection<?> c)", java: ArrayListClass.prototype._removeAll },
        { type: "method", signature: "int size()", native: ArrayListClass.prototype._size, template: "§1.elements.length" },
        
        // from ListInterface
        {type: "method", signature: "boolean add(int index, E element)", native: ArrayListClass.prototype._addWithIndex},
        {type: "method", signature: "boolean addAll(int index, Collection<? extends E> c)", java: ArrayListClass.prototype._addAllWithIndex},
        {type: "method", signature: "E get (int index)", native: ArrayListClass.prototype._getWithIndex},
        {type: "method", signature: "int indexOf (Object o)", native: ArrayListClass.prototype._indexOf},
        {type: "method", signature: "E remove (int index)", native: ArrayListClass.prototype._removeWithIndex},
        {type: "method", signature: "E set (int index, E Element)", native: ArrayListClass.prototype._setWithIndex},
    ]

    static type: NonPrimitiveType;

    protected elements: ObjectClass[] = [];

    _constructor() {
        return this;
    }

    _iterator(){

        let iterator = new ObjectClass();

        let nextIndex = 0;

        //@ts-ignore
        iterator["_mj$hasNext$boolean$"] = (t: Thread, callback: CallbackFunction) => {
            t.s.push(nextIndex < this.elements.length);
            if(callback) callback();
        }
        
        //@ts-ignore
        iterator["_mj$next$E$"] = (t: Thread, callback: CallbackFunction) => {
            if(nextIndex < this.elements.length) nextIndex++;
            t.s.push(this.elements[nextIndex - 1]);
            if(callback) callback();
        }

        return iterator;
    }

    getAllElements(): ObjectClass[] {
        return this.elements;
    }

    _add(element: ObjectClass) {
        this.elements.push(element);
    }

    _addWithIndex(element: ObjectClass, index: number) {
        if(index < 0 || index > this.elements.length){
            throw new IndexOutOfBoundsExceptionClass(`Der Index beim Einfügen in die ArrayList (${index}) liegt außerhalb des zulässigen Bereichs (0 bis ${this.elements.length})`);            
        }

        this.elements.splice(index, 0, element);
        return true;
    }

    _removeWithIndex(index: number) {
        if(index < 0 || index >= this.elements.length){
            throw new IndexOutOfBoundsExceptionClass(`Der Index beim Löschen aus der ArrayList (${index}) liegt außerhalb des zulässigen Bereichs (0 bis ${this.elements.length})`);            
        }

        return this.elements.splice(index, 1);
    }

    _setWithIndex(index: number, element: ObjectClass) {
        if(index < 0 || index >= this.elements.length){
            throw new IndexOutOfBoundsExceptionClass(`Der Index beim Setzen eines Elements der ArrayList (${index}) liegt außerhalb des zulässigen Bereichs (0 bis ${this.elements.length})`);            
        }

        let ret = this.elements[index];

        this.elements[index] = element;
        return ret;
    }

    _getWithIndex(index: number) {
        if(index < 0 || index >= this.elements.length){
            throw new IndexOutOfBoundsExceptionClass(`Der Index beim Einfügen in die ArrayList (${index}) liegt außerhalb des zulässigen Bereichs (0 bis ${this.elements.length - 1})`);            
        }

        return this.elements[index];
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

    _addAllWithIndex(t: Thread, callback: CallbackFunction, index: number, collection: CollectionInterface) {

        if(index < 0 || index > this.elements.length){
            t.throwException(new IndexOutOfBoundsExceptionClass(`Der Index beim Einfügen in die ArrayList (${index}) liegt außerhalb des zulässigen Bereichs (0 bis ${this.elements.length})`));
            return;            
        }

        if (collection == null) {
            t.throwException(new NullPointerExceptionClass("ArrayList.addAll wurde mit null als Argument aufgerufen."));
            return;
        }

        if (collection instanceof SystemCollection) {
            this.elements.splice(index, 0, ...collection.getAllElements())
            t.s.push(true);
            if (callback) callback();
            return;
        }

        collection._mj$toArray$Object_I$(t, () => {
            let newElements = t.s.pop();
            if (newElements != null && Array.isArray(newElements)) {
                this.elements.splice(index, 0, ...newElements)
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

    _size(){
        return this.elements.length;
    }

    _toArray(){
        return this.elements.slice();
    }

    _remove(o: ObjectClass) {
        let index = this.elements.indexOf(o);
        if(index >= 0){
            this.elements.splice(index, 1)
            return true;
        } 
        return false;
    }

    _removeAll(t: Thread, callback: CallbackFunction, collection: CollectionInterface) {

        if (collection == null) {
            t.throwException(new NullPointerExceptionClass("ArrayList.removeAll wurde mit null als Argument aufgerufen."));
            return;
        }

        if (collection instanceof SystemCollection) {
            let oldLength = this.elements.length;
            let elementsToRemove = collection.getAllElements();
            this.elements = this.elements.filter(element => elementsToRemove.indexOf(element) < 0);
            t.s.push(this.elements.length != oldLength);
            if (callback) callback();
            return;
        }

        collection._mj$toArray$Object_I$(t, () => {
            let elementsToRemove = t.s.pop();
            let oldLength = this.elements.length;
            if (elementsToRemove != null && Array.isArray(elementsToRemove)) {
                this.elements = this.elements.filter(element => elementsToRemove.indexOf(element) < 0);
                t.s.push(this.elements.length != oldLength);
                if (callback) callback();
            }
        })

    }

    _indexOf(element: ObjectClass): number {
        return this.elements.indexOf(element);
    }

}