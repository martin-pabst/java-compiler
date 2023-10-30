import { BaseType } from "./BaseType";
import { UsagePosition } from "./UsagePosition";
import { IRange } from "./range/Range";


export class BaseSymbol {

    usagePositions: UsagePosition[] = [];

    constructor(public identifier: string, public type: BaseType, public stackOffset: number){

    }
}



/**
 * For a given program position the debugger has to know what to expect on the current stackframe
 */
export class BaseSymbolTable {

    symbols: BaseSymbol[] = [];
    childTables: BaseSymbolTable[] = [];

    constructor(public range: IRange){}
}

