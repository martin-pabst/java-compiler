import { BaseSymbolTable } from "../BaseSymbolTable";
import { Module } from "../module/Module";
import { IRange } from "../range/Range";
import { Thread } from "./Thread";
import { HelperObject } from "./Scheduler";



export class Step {
    // compiled function returns new programposition
    run?: (thread: Thread, stack: any[], stackBase: number, helperObject: HelperObject) => number;

    isBreakpoint: boolean = false;
    range!: {startLineNumber?:number, startColumn?: number, endLineNumber?: number, endColumn?: number};
    codeAsString: string = "";
    stopStepOverBeforeStep: boolean = false;

    constructor(public index: number){
        this.range = {startLineNumber: undefined, startColumn: undefined, endLineNumber: undefined, endColumn: undefined};
    }

    isEmpty(): boolean {
        return this.codeAsString.trim() == "";
    }

    adaptRangeStart(range?: IRange){
        if(!this.range.startLineNumber && range){
            this.range.startLineNumber = range.startLineNumber;
            this.range.startColumn = range.startColumn;
        }
    }

    adaptRangeEnd(range?: IRange){
        if(range){
            if(!this.range.endLineNumber){
                this.range.endLineNumber = range.endLineNumber;
                this.range.endColumn = range.endColumn;
            } else if(this.range.endLineNumber < range.endLineNumber){
                this.range.endLineNumber = range.endLineNumber;
                this.range.endColumn = range.endColumn;
            } else if(this.range.endLineNumber == range.endLineNumber && this.range.endColumn! < range.endColumn){
                this.range.endColumn = range.endColumn;
            }
        }
    }

}

export class Program {
    numberOfThisObjects: number = 0;
    numberOfParameters: number = 0;         // without "this"
    numberOfLocalVariables: number = 0;

    stepsSingle: Step[] = [];
    stepsMultiple: Step[] = [];

    constructor(public module: Module, public symbolTable: BaseSymbolTable, public methodIdentifierWithClass: string) {
        let stackFrame = symbolTable.stackframe;
        if(stackFrame){
            this.numberOfThisObjects = stackFrame.numberOfThisObjects;
            this.numberOfParameters = stackFrame.numberOfParameters;
            this.numberOfLocalVariables = stackFrame.numberOfLocalVariables;
        }
    }
}