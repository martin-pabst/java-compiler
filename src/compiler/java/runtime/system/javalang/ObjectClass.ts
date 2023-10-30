import { Thread } from "../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";

export class ObjectClass {
    
    static __declareType(): string[] {
        return [
            "class Object",
            "public Object()",
            "public String toString()"
        ]
    }

    static type: NonPrimitiveType;

    constructor(){

    }

    toString(t: Thread) {
        t.stack.push("Object");
    }


}