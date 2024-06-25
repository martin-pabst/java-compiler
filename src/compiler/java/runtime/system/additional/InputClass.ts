import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ObjectClass } from "../javalang/ObjectClassStringClass.ts";

export class InputClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Input extends Object", comment: JRC.InputClassComment}
    ];

    static type: NonPrimitiveType;

    
}