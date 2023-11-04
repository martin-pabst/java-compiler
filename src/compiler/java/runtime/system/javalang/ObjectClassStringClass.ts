import { Thread } from "../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";

export class ObjectClass {
    
    declare _m$toString$String$: (t: Thread) => void;

    static __declareType(): string[] {
        return [
            "class Object",
            "public Object()",
            "public String toString(): toString"
        ]
    }

    static type: NonPrimitiveType;

    constructor(){

    }

    toString() {
        return new StringClass("Object");
        // t.stack.push(new t.scheduler.helperObject.classes["String"]("Object"));
    }


}

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

    plusOtherString(s: StringClass): StringClass {
        return new StringClass(this.text + s.text);
    }

    plusObject(t: Thread, o: ObjectClass){
        t.pushCallback(() => {
            t.stack.push(new StringClass(this.text + t.stack.pop().text))
        });
        o._m$toString$String$(t);
    }

    plusObjectFromLeft(t: Thread, o: ObjectClass){
        t.pushCallback(() => {
            t.stack.push(new StringClass(t.stack.pop().text + this.text))
        });
        o._m$toString$String$(t);
    }

}