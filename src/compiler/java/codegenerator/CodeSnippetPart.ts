import { Step } from "../../common/interpreter/Program";
import { IRange } from "../../common/range/Range";

export abstract class CodeSnippetPart {
    
    public stepIndex: number = -1;
    public range?: IRange;

    abstract emit(): string;
    abstract index(currentIndex: number): number;
    abstract emitToStep(currentStep: Step, steps: Step[]): Step;
}
