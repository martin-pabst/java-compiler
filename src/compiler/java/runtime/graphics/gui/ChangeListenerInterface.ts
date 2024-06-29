import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { CallbackParameter } from "../../../../common/interpreter/CallbackParameter.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { InterfaceClass } from "../../system/javalang/InterfaceClass.ts";
import { ObjectClass } from "../../system/javalang/ObjectClassStringClass.ts";

export class ChangeListenerInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [

        { type: "declaration", signature: "interface ChangeListener", comment: JRC.ChangeListenerInterfaceComment },

        { type: "method", signature: "void onChange(Object changedObject, string newValue)", java: ChangeListenerInterface.prototype._mj$onChange$void$Object$string, comment: JRC.ChangeListenerOnChangeComment },
    ]

    static type: NonPrimitiveType;
   
    _mj$onChange$void$Object$string(t: Thread, callback: CallbackParameter, changedObject: ObjectClass, newValue: string){
        
    }


}