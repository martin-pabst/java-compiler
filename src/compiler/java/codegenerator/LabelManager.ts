import { Step } from "../../common/interpreter/Program";
import { CodeSnippetPart } from "./CodeSnippetPart";

export class LabelCodeSnippet extends CodeSnippetPart {

    static count: number = 0;

    id: number;

    constructor(){
        super();
        this.id = LabelCodeSnippet.count++;
    }

    emit(): string {
        return "\n// Label \n" + this.id;
    }

    emitToStep(currentStep: Step, _steps: Step[]): Step {
        currentStep.codeAsString = currentStep.codeAsString + this.emit();
        return currentStep;
    }

    getJumpToSnippet(): JumpToLabelCodeSnippet {
        return new JumpToLabelCodeSnippet(this);
    }

    index(lastIndex: number): number {
        this.stepIndex = lastIndex;
        return lastIndex;
    }

}

export class JumpToLabelCodeSnippet extends CodeSnippetPart {

    constructor(private label: LabelCodeSnippet){
        super();
    }
    
    index(lastIndex: number): number {
        this.stepIndex = lastIndex;
        return lastIndex;
    }

    emit(): string {
        return "return " + this.label.stepIndex + "; // Jump to label " + this.label.id + "\n";    
    }

    emitToStep(currentStep: Step, _steps: Step[]): Step {
        currentStep.codeAsString = currentStep.codeAsString + this.emit();
        return currentStep;
    }

}