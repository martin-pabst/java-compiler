import { BaseType } from "./BaseType";
import { UsagePosition } from "./UsagePosition";
import { File } from "./module/File";
import { Module } from "./module/Module.ts";
import { EmptyRange, IRange } from "./range/Range";

/**
 * Fields, parameters and local variables
 */
export abstract class BaseSymbol {

    usagePositions: UsagePosition[] = [];

    
    public isFinal: boolean = false;
    
    constructor(public identifier: string, public identifierRange: IRange, public module: Module) {
        
    }
    
    getLastUsagePosition(): IRange {
        if(this.usagePositions.length == 0) return EmptyRange.instance;
        return this.usagePositions[this.usagePositions.length - 1].range;
    }
    
    
    onStackframe(): boolean {
        return false;
    }
    
}

export abstract class SymbolOnStackframe extends BaseSymbol {
    public stackframePosition?: number;
    
    onStackframe(): boolean {
        return true;
    }
    
    // mouseover in debugger-mode => show value ...
    abstract getValue(stack: any, stackframeStart: number): any;
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

    addSymbol(symbol: SymbolOnStackframe, parameterOrLocalVariable: "parameter" | "localVariable"){
        switch(parameterOrLocalVariable){
            case "parameter":
                this.numberOfParameters++;
                break;
            case "localVariable":
                this.numberOfLocalVariables++;
                break;
        }

        let position: number = this.nextFreePosition++;
        symbol.stackframePosition = position;
        this.positionToSymbolMap[position] = symbol;

    }

    insertInvisibleParameter(){
        this.numberOfParameters++;
    }

    insertInvisibleLocalVariableAndGetItsIndex(): number {
        let index = this.nextFreePosition++;
        this.numberOfLocalVariables++;
        return index;
    }

}