import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "./ObjectClassStringClass";

export class PrimitiveStringClass extends ObjectClass {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class string"},
        {type: "m", signature: "public int length()", template: "§1.length"},
        {type: "m", signature: "public int indexOf(string str)", template: "§1.indexOf(§2)", constantFoldingFunction: (obj, str) => obj.indexOf(str)},

    ]

    static type: NonPrimitiveType;

    constructor(){
        super();
    }


}