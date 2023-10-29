import { Field } from "./Field";
import { GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";
import { Method } from "./Method";

/**
 * A NonPrimitiveType 
 *  - may have attributes
 *  - may have fields (de: "Attribute")
 *  - may have methods
 */
export interface NonPrimitiveType extends JavaType {
    isPrimitive: false;

    getFields: () => Field[];
    getMethods: () => Method[];

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType;

}