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

    abstract getFields(): Field[];
    abstract getMethods(): Method[];

    constructor(identifier: string, identifierRange: IRange, module: JavaBaseModule){
        super(identifier, identifierRange, module);
        this.isPrimitive = false;
    }

}