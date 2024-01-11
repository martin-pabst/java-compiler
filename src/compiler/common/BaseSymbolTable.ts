import { File } from "./module/File";
import { Module } from "./module/Module.ts";
import { IRange } from "./range/Range";

/**
 * Fields, parameters and local variables
 */
export abstract class BaseSymbol {

    constructor(public identifier: string, public identifierRange: IRange, public module: Module) {

    }

    onStackframe(): boolean {
        return false;
    }

    abstract getDeclaration(): string;

}

export abstract class SymbolOnStackframe extends BaseSymbol {
    public stackframePosition?: number;
    public isFinal: boolean = false;

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

    childTables: BaseSymbolTable[] = [];

    stackframe?: BaseStackframe;

    identifierToSymbolMap: Map<string, BaseSymbol> = new Map();

    constructor(public parent?: BaseSymbolTable) {
        if (parent) parent.childTables.push(this);
    }

    addSymbol(symbol: BaseSymbol) {
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

    addSymbol(symbol: SymbolOnStackframe, parameterOrLocalVariable: "parameter" | "localVariable") {
        switch (parameterOrLocalVariable) {
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

    insertInvisibleParameter() {
        this.numberOfParameters++;
    }

    insertInvisibleLocalVariableAndGetItsIndex(): number {
        let index = this.nextFreePosition++;
        this.numberOfLocalVariables++;
        return index;
    }

}