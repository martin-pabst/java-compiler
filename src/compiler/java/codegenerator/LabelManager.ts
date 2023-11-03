import { Step } from "../../common/interpreter/Program";
import { CodeSnippet as CodeSnippet } from "./CodeSnippet";

export class LabelCodeSnippet extends CodeSnippet {

    static count: number = 0;

    id: number;

    constructor(){
        super();
        this.id = LabelCodeSnippet.count++;
    }

    flattenInto(flatList: CodeSnippet[]): void {
        flatList.push(this);
    }

    emit(): string {
        return "// Label " + this.id + "\n";
    }

    emitToStep(currentStep: Step, _steps: Step[]): Step {
        currentStep.codeAsString = currentStep.codeAsString + this.emit();
        return currentStep;
    }

    getJumpToSnippet(): JumpToLabelCodeSnippet {
        return new JumpToLabelCodeSnippet(this);
    }

    index(currentIndex: number): number {
        this.stepIndex = currentIndex;
        return currentIndex;
    }

    public static resetCount(){
        LabelCodeSnippet.count = 0;
    }

}

export class JumpToLabelCodeSnippet extends CodeSnippet {

    constructor(private label: LabelCodeSnippet){
        super();
    }
    
    flattenInto(flatList: CodeSnippet[]): void {
        flatList.push(this);
    }

    index(lastIndex: number): number {
        this.stepIndex = lastIndex;
        return lastIndex;
    }

    emit(): string {
        return "return " + this.label.stepIndex + "; // Jump to step " + this.label.stepIndex + "\n";    
    }

    emitToStep(currentStep: Step, _steps: Step[]): Step {
        currentStep.codeAsString = currentStep.codeAsString + this.emit();
        return currentStep;
    }

}