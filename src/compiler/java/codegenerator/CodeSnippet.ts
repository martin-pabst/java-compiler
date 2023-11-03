import { Step } from "../../common/interpreter/Program";
import { IRange } from "../../common/range/Range";
import { JavaType } from "../types/JavaType";

export abstract class CodeSnippet {
    
    public stepIndex: number = -1;
    public range?: IRange;
    public type?: JavaType;
    isLefty: boolean = false; // can you assign a value to it?
    finalValueIsOnStack: boolean = false;


    abstract emit(): string;
    abstract index(currentIndex: number): number;
    abstract emitToStep(currentStep: Step, steps: Step[]): Step;

    abstract flattenInto(flatList: CodeSnippet[]): void;

    allButLastPart(): CodeSnippet[] {
        return [this];
    }

    lastPartOrPop(): CodeSnippet {
        return this.finalValueIsOnStack ? new StringCodeSnippet("s.pop()", this.range) : this;
    }

    isPureTerm() {
        return true;
    }

    alterPureTerm(newCode: string) {
        // standard implementation is empty
    }

    getPureTerm(){
        return "";
    }

    ensureFinalValueIsOnStack(){
        // standard implementation is empty
    }

}

export class StringCodeSnippet extends CodeSnippet {

    constructor(public text: string, range?: IRange, type?: JavaType) {
        super();
        this.range = range;
        this.type = type;
    }

    ensureFinalValueIsOnStack(): void {
        this.text = `push(${this.text})`
    }

    index(lastIndex: number): number {
        this.stepIndex = lastIndex;
        return lastIndex;
    }

    emit(): string {
        return this.text;
    }

    emitToStep(currentStep: Step, _steps: Step[]): Step {
        currentStep.codeAsString = currentStep.codeAsString + this.text;

        currentStep.adaptRangeEnd(this.range);

        return currentStep;
    }

    flattenInto(flatList: CodeSnippet[]): void {
        flatList.push(this);
    }

    isPureTerm() {
        return true;
    }

    alterPureTerm(newCode: string) {
        this.text = newCode;        
    }

    getPureTerm(){
        return this.text;
    }

}
