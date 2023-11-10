import { Program } from "../../common/interpreter/Program.ts";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { JavaType } from "./JavaType";
import { Method } from "./Method";

/**
 * A NonPrimitiveType 
 *  - may have attributes
 *  - may have fields (de: "Attribute")
 *  - may have methods
 */
export abstract class NonPrimitiveType extends JavaType {

    abstract isGenericVariant(): boolean;
    abstract isGenericTypeParameter(): boolean;

    abstract canExplicitlyCastTo(otherType: JavaType): boolean;  // you can cast long to int or Number to Integer EXPLICITLY, e.g. int c = (int)10L
    abstract canImplicitlyCastTo(otherType: JavaType): boolean; // int gets casted to long implicitly; Integer gets casted to Number implicitly e.g. in: Number n = new Integer(10);

    abstract getFields(): Field[];
    abstract getMethods(): Method[];

    constructor(identifier: string, identifierRange: IRange, module: JavaBaseModule){
        super(identifier, identifierRange, module);
        this.isPrimitive = false;
    }

}