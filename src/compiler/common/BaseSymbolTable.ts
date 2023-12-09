import { BaseType } from "./BaseType";
import { UsagePosition } from "./UsagePosition";
import { File } from "./module/File";
import { EmptyRange, IRange } from "./range/Range";

export enum SymbolKind { localVariable, parameter, field, staticField }

/**
 * Fields, parameters and local variables
 */
export abstract class BaseSymbol {

    usagePositions: UsagePosition[] = [];

    public stackframePosition?: number;

    public isFinal: boolean = false;

    constructor(public identifier: string, public identifierRange: IRange, public type: BaseType, public kind: SymbolKind) {

    }

    getLastUsagePosition(): IRange {
        if(this.usagePositions.length == 0) return EmptyRange.instance;
        return this.usagePositions[this.usagePositions.length - 1].range;
    }

    // mouseover in debugger-mode => show value ...
    abstract getValue(stack: any, stackframeStart: number): any;

    onStackframe(): boolean {
        return this.kind == SymbolKind.localVariable || this.kind == SymbolKind.parameter;
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

    addSymbol(symbol: BaseSymbol){
        switch(symbol.kind){
            case SymbolKind.parameter:
                this.numberOfParameters++;
                break;
            case SymbolKind.localVariable:
                this.numberOfLocalVariables++;
                break;
        }

        let position: number = this.nextFreePosition++;
        symbol.stackframePosition = position;
        this.positionToSymbolMap[position] = symbol;

    }

    insertInvisibleParameter(){
        this.nextFreePosition++;
        this.numberOfParameters++;
    }

}