import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";

export class IteratorInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "interface Iterator<E>"},
        {type: "method", signature: "boolean hasNext()"},
        {type: "method", signature: "E next()"},
    ]

    static type: NonPrimitiveType;

}