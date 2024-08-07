import { DebM } from "./DebuggerMessages";
import { BaseSymbolTable } from "../BaseSymbolTable";
import { Program, Step } from "../interpreter/Program";
import { ProgramState } from "../interpreter/Thread";
import { IRange } from "../range/Range";

export class DebuggerCallstackEntry {

    program: Program;
    currentStep: Step | undefined;
    range?: IRange;
    symbolTable: BaseSymbolTable | undefined;

    constructor(public programState: ProgramState){
        this.program = programState.program;

        this.symbolTable = this.program.symbolTable;

        this.currentStep = programState.lastExecutedStep;
        if(!this.currentStep) this.currentStep = programState.currentStepList[programState.stepIndex];

        if(this.currentStep){
            //@ts-ignore
            this.range = this.currentStep.range;
        }

        if(this.symbolTable && this.currentStep && this.currentStep.range?.startLineNumber && this.currentStep.range?.startColumn){
            this.symbolTable = this.symbolTable.findSymbolTableAtPosition({
                lineNumber: this.currentStep.range.startLineNumber!,
                column: this.currentStep.range.startColumn!
            })
        }
    }

    getCaption(){
        let caption: string = this.program.methodIdentifierWithClass;
        if(caption == ".main") caption = DebM.mainProgram();
        if(this.range && this.range.startLineNumber){
            caption += `:${this.range.startLineNumber}`
        }
        return caption;
    }



}