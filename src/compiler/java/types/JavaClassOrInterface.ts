import { NonPrimitiveType } from "./NonPrimitiveType";

export interface JavaClassOrInterface extends NonPrimitiveType {
    isPrimitive: false;
}