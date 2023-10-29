import { File } from "./module/File";
import { IRange } from "./range/Range";

export class UsagePosition {
    constructor(public file: File, public range: IRange){}
}
