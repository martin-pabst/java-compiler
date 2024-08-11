import { BaseType } from "../BaseType";
import { Program } from "../interpreter/Program";
import { IPosition } from "../range/Position";
import { IRange } from "../range/Range";

export type CodeFragment = {
    type: BaseType;
    signature: string;
    program: Program;
    methodDeclarationRange?: IRange;
}