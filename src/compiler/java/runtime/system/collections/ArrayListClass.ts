import { Thread } from "../../../../common/interpreter/Thread.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { NullPointerExceptionClass } from "../javalang/NullPointerExceptionClass.ts";
import { ObjectClass } from "../javalang/ObjectClassStringClass.ts";
import { CollecionInterface } from "./CollectionInterface.ts";
import { SystemCollection } from "./SystemCollection.ts";

export class ArrayListClass extends SystemCollection {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class ArrayList<E> Implements List<E>"}, 
        
        {type: "method", signature: "ArrayList()", native: ArrayListClass.prototype._constructor},

        // from InterableInterface
        {type: "method", signature: "Iterator<T> iterator()"},

        // from CollectionInterface
        {type: "method", signature: "boolean add(E e)", native: ArrayListClass.prototype._add},
        {type: "method", signature: "boolean addAll(Collection<? extends E> c)", java: ArrayListClass.prototype._addAll},
        {type: "method", signature: "void clear()"},
        {type: "method", signature: "boolean contains(Object o)"},
        {type: "method", signature: "boolean containsAll(Collection<?> c)"},
        {type: "method", signature: "boolean isEmpty()"},
        {type: "method", signature: "boolean remove(Object o)"},
        {type: "method", signature: "boolean removeAll(Collection<?> c)"},
        {type: "method", signature: "int size()"},
        {type: "method", signature: "Object[] toArray()"},
        {type: "method", signature: "<T> T[] toArray(T[] a)"},

        // from ListInterface
        {type: "method", signature: "boolean add(E e)"},
        {type: "method", signature: "boolean addAll(Collection<? extends E> c)"},
        {type: "method", signature: "void clear()"},
        {type: "method", signature: "boolean contains(Object o)"},
        {type: "method", signature: "boolean containsAll(Collection<?> c)"},
        {type: "method", signature: "boolean isEmpty()"},
        {type: "method", signature: "boolean remove(Object o)"},
        {type: "method", signature: "boolean removeAll(Collection<?> c)"},
        {type: "method", signature: "int size()"},
        
        // TODO: toArray, ...
    ]

    protected elements: ObjectClass[] = [];

    _constructor() {
        return this;
    }

    getAllElements(): ObjectClass[] {
        return this.elements;
    }

    _add(element: ObjectClass){
        this.elements.push(element);
    }

    _addAll(t: Thread, collection: CollecionInterface){

        if(collection == null){
            t.throwException(new NullPointerExceptionClass("ArrayList.addAll wurde mit null als Argument aufgerufen."));
            return;
        }

        if(collection instanceof SystemCollection){
            this.elements = this.elements.concat(collection.getAllElements());
            return true;
        } 

        t.pushCallback(() => {

        });

        collection.m$

    }


    static type: NonPrimitiveType;

}