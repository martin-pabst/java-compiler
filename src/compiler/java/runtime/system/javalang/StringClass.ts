import { Thread } from "../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass } from "./ObjectClass";

export class StringClass extends ObjectClass {

    static __declareType(): string[] {
        return [
            "class String extends Object",
            "public String toString(): _toString"
        ]
    }

    static type: NonPrimitiveType;

    constructor(public text: string){
        super();
    }

    _toString(t: Thread) {
        t.stack.push(this.text);        
    }


}