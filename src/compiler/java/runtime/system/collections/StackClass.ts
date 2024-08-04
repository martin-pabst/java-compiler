import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { VectorClass } from "./VectorClass";

export class StackClass extends VectorClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Stack<E> extends Vector<E>", comment: JRC.stackClassComment},
        {type: "method", signature: "Stack()", native: StackClass.prototype._constructor, comment: JRC.stackConstructorComment},
        {type: "method", signature: "E push(E element)", native: StackClass.prototype._push, comment: JRC.stackPushComment},
        {type: "method", signature: "E pop()", native: StackClass.prototype._pop, comment: JRC.stackPopComment},
        {type: "method", signature: "E peek()", native: StackClass.prototype._peek, comment: JRC.stackPeekComment},
        {type: "method", signature: "boolean empty()", native: StackClass.prototype._empty, comment: JRC.stackEmptyComment},
        {type: "method", signature: "int search(E element)", native: StackClass.prototype._search, comment: JRC.stackSearchComment},
    ];

    static type: NonPrimitiveType;


}