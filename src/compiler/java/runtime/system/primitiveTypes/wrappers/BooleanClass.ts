import { Thread } from "../../../../../common/interpreter/Thread";
import { NonPrimitiveType } from "../../../../types/NonPrimitiveType";
import { ObjectClass, StringClass } from "../../javalang/ObjectClassStringClass";
import { NumberClass } from "./NumberClass";

/**
 * @link https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Boolean.html
 */
export class BooleanClass extends ObjectClass {

    static FALSE: BooleanClass = new BooleanClass(false);
    static TRUE: BooleanClass = new BooleanClass(true);

    static __javaDeclarations: LibraryDeclarations = [
        {type: "c", signature: "class Boolean extends Object"},
        {type: "a", signature: "static final boolean FALSE", constantValue: BooleanClass.FALSE},
        {type: "a", signature: "static final boolean TRUE", constantValue: BooleanClass.TRUE},
        {type: "m", signature: "public final boolean booleanValue()", template: "§1.value"},
        {type: "m", signature: "public int compareTo(Boolean otherBoolean)", native: BooleanClass.prototype._compareTo},
        {type: "m", signature: "public static boolean getBoolean(String name)", template: '§1 == "true"'},
        {type: "m", signature: "public static boolean parseBoolean(String name)", template: '§1 == "true"'},
    ]

    static type: NonPrimitiveType;


    constructor(public value: boolean){
        super();
    }

    _compareTo(otherValue: BooleanClass){
        return this == otherValue ? 0 : 1;
    }


}