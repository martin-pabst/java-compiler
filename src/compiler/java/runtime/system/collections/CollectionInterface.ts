import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";

export class CollecionInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "interface Collection<E> extends Iterable<E>"},
        {type: "method", signature: "boolean add(E e)"},
        {type: "method", signature: "boolean addAll(Collection<? extends E> c)"},
        {type: "method", signature: "void clear()"},
        {type: "method", signature: "boolean contains(Object o)"},
        {type: "method", signature: "boolean containsAll(Collection<?> c)"},
        {type: "method", signature: "boolean isEmpty()"},
        {type: "method", signature: "boolean remove(Object o)"},
        {type: "method", signature: "boolean removeAll(Collection<?> c)"},
        {type: "method", signature: "int size()"},
        {type: "method", signature: "Object[] toArray()"},
        {type: "method", signature: "<T> T[] toArray(T[] a)"},
        
        // TODO: toArray, ...
    ]

    static type: NonPrimitiveType;


}