import { Thread } from "../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";

export class ObjectClass {
    
    declare _m$toString$String$: (t: Thread) => void;

    static __declareType(): string[] {
        return [
            "class Object",
            "public Object()",
            "public String toString(): _toString"
        ]
    }

    static type: NonPrimitiveType;

    constructor(){

    }

    toString(t: Thread) {
        t.stack.push(new t.threadPool.helperObject.classes["String"]("Object"));
    }


}