import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../javalang/InterfaceClass.ts";

export class IterableInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "interface Iterable<T>"},
        {type: "method", signature: "Iterator<T> iterator()"},
    ]

    static type: NonPrimitiveType;

}