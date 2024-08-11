import { CompilerFile } from "../module/CompilerFile";
import { IPosition } from "../range/Position";
import { IRange } from "../range/Range";

export interface IJumpToCodeProvider {
    jumpTo(file: CompilerFile, range: IRange): void;
}