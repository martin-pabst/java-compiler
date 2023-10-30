import { BaseSymbolTable } from "../BaseSymbolTable";
import { Module } from "../module/Module";
import { IRange } from "../range/Range";
import { Thread } from "./Thread";

export class Step {
    // compiled function returns new programposition
    run?: (thread: Thread, stack: any[], stackBase: number) => number;

    isBreakpoint: boolean = false;

    constructor(public codeAsString: string, public range: IRange, public stopStepOverBeforeStep: boolean){

    }

}

export class Program {
    numberOfParameters: number = 0;         // including "this"
    numberOfLocalVariables: number = 0;

    stepsSingle: Step[] = [];
    stepsMultiple: Step[] = [];

    constructor(public module: Module, public symbolTable: BaseSymbolTable, public methodIdentifierWithClass: string) {

    }
}