import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "./ObjectClassStringClass";

export class PrimitiveStringClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class string"},
        {type: "method", signature: "public int length()", template: "§1.length"},
        {type: "method", signature: "public int indexOf(string str)", template: "§1.indexOf(§2)", constantFoldingFunction: (obj, str) => obj.indexOf(str)},

    ]

    static type: NonPrimitiveType;

    constructor(){
        super();
    }


}