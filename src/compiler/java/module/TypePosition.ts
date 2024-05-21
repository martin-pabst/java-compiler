import { Position } from "../../common/range/Position"
import { ArrayType } from "../types/ArrayType";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { StaticNonPrimitiveType } from "../types/StaticNonPrimitiveType";

export type TypePosition = {
    position: Position;
    type: NonPrimitiveType | StaticNonPrimitiveType | ArrayType;
}