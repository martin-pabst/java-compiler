import { BaseType } from "./BaseType";
import { UsagePosition } from "./UsagePosition";
import { File } from "./module/File";
import { IRange } from "./range/Range";


/**
 * Fields, parameters and local variables
 */
export abstract class BaseSymbol {

    usagePositions: UsagePosition[] = [];

    constructor(public identifier: string, public identifierRange: IRange, public type: BaseType) {

    }

    // mouseover in debugger-mode => show value ...
    abstract getValue(stack: any, stackframeStart: number): any;

}

/**
 * Parameters and local variables
 */
export abstract class BaseSymbolOnStackframe extends BaseSymbol {

    public stackframePosition = -1;

    constructor(identifier: string, identifierRange: IRange, type: BaseType) {
        super(identifier, identifierRange, type);        
    }

}

/**
 * For a given program position the debugger has to know what to expect on the current stackframe
 */
export class BaseSymbolTable {

    symbols: BaseSymbol[] = [];
    childTables: BaseSymbolTable[] = [];

    parent?: BaseSymbolTable;

    identifierToSymbolMap: Map<string, BaseSymbol> = new Map();

    stackframe?: BaseStackframe;

    constructor(public range: IRange, public file: File) { }

    addSymbol(symbol: BaseSymbol){
        this.symbols.push(symbol);
        this.identifierToSymbolMap.set(symbol.identifier, symbol);
    }


}


export class BaseStackframe {

    nextFreePosition: number = 0;

    numberOfThisObjects: number = 0;
    numberOfParameters: number = 0;         // without "this"
    numberOfLocalVariables: number = 0;

    positionToSymbolMap: { [position: number]: BaseSymbol } = {};

    constructor(firstFreePosition: number) {
        this.nextFreePosition = firstFreePosition;
        this.numberOfThisObjects = firstFreePosition;
    }

    addSymbol(symbol: BaseSymbolOnStackframe, parameterOrVariable: "parameter" | "variable"){
        if(parameterOrVariable == "parameter"){
            this.numberOfParameters++;
        } else {
            this.numberOfLocalVariables++;
        }

        let position: number = this.nextFreePosition++;
        symbol.stackframePosition = position;
        this.positionToSymbolMap[position] = symbol;

    }

}