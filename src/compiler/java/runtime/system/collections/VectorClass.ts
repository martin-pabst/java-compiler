import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { BaseListType } from "../../../../common/BaseType.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ConsumerInterface } from "../functional/ConsumerInterface.ts";
import { IndexOutOfBoundsExceptionClass } from "../javalang/IndexOutOfBoundsExceptionClass.ts";
import { NullPointerExceptionClass } from "../javalang/NullPointerExceptionClass.ts";
import { ObjectClass, StringClass } from "../javalang/ObjectClassStringClass.ts";
import { ArrayListClass } from "./ArrayListClass.ts";
import { CollectionInterface } from "./CollectionInterface.ts";
import { ComparatorInterface } from "./ComparatorInterface.ts";
import { SystemCollection } from "./SystemCollection.ts";

export class VectorClass extends ArrayListClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Vector<E> extends ArrayList<E>" },

        { type: "method", signature: "Vector()", native: VectorClass.prototype._constructor , comment: JRC.vectorConstructorComment},

        // 
    ]

    static type: NonPrimitiveType;

    _constructor() {
        return this;
    }



}