import { UsagePosition } from "./UsagePosition";
import { File } from "./module/File";
import { IRange } from "./range/Range";

/**
 * encapsultes methods for debugger
 */
export interface BaseType {
    identifier: string;
    identifierRange: IRange;
    usagePositions: UsagePosition[];

    getFile(): File;

}