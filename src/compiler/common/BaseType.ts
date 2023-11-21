import { UsagePosition } from "./UsagePosition";
import { File } from "./module/File";
import { IRange } from "./range/Range";

/**
 * encapsultes methods for debugger
 */
export class BaseType {
    usagePositions: UsagePosition[] = [];

    constructor(public identifier: string, public identifierRange: IRange, public file: File){

    }

    clearUsagePositionsAndInheritanceInformation(): void {
        this.usagePositions = [];
    }
}