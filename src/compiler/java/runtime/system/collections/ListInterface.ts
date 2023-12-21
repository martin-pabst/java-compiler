import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";

export class ListInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "interface List<E> extends Collection<E>"},
        {type: "method", signature: "boolean add(int index, E element)"},
        {type: "method", signature: "boolean addAll(int index, Collection<? extends E> c)"},
        {type: "method", signature: "E get (int index)"},
        {type: "method", signature: "int indexOf (Object o)"},
        {type: "method", signature: "E remove (int index)"},
        {type: "method", signature: "E set (int index, E Element)"},
        
        // TODO: sort, subList, ...
    ]

    static type: NonPrimitiveType;

}