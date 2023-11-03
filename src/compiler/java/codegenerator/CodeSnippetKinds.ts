import { Step } from "../../common/interpreter/Program";
import { EmptyRange, IRange } from "../../common/range/Range";
import { JavaType } from "../types/JavaType";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";
import { LabelCodeSnippet } from "./LabelManager";




export class CodeSnippetContainer extends CodeSnippet {
    parts: CodeSnippet[] = [];

    //@ts-ignore
    declare range: { startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number };

    constructor(parts: CodeSnippet | CodeSnippet[], range?: IRange, type?: JavaType) {
        super();
        this.type = type;
        if (Array.isArray(parts)) {
            this.parts = parts;
        } else {
            this.parts = [parts];
        }
        if (range) {
            this.range = { startLineNumber: range.startLineNumber, startColumn: range.startColumn, endLineNumber: range.endLineNumber, endColumn: range.endColumn };
        } else {
            this.range = { startLineNumber: -1, startColumn: -1, endLineNumber: -1, endColumn: -1 }
            if(this.parts.length > 0){
                this.setRangeStartIfUndefined(this.parts[0].range);
                this.adaptRangeEnd(this.parts[this.parts.length - 1].range)
            }
        }
    }

    setRangeStartIfUndefined(range?: IRange) {
        if (this.range.startLineNumber < 0 && range) {
            this.range.startLineNumber = range.startLineNumber;
            this.range.startColumn = range.startColumn;
        }
    }

    adaptRangeEnd(range?: IRange) {
        if (range) {
            if (this.range.endLineNumber < 0) {
                this.range.endLineNumber = range.endLineNumber;
                this.range.endColumn = range.endColumn;
            } else if (this.range.endLineNumber < range.endLineNumber) {
                this.range.endLineNumber = range.endLineNumber;
                this.range.endColumn = range.endColumn;
            } else if (this.range.endLineNumber == range.endLineNumber && this.range.endColumn! < range.endColumn) {
                this.range.endColumn = range.endColumn;
            }
        }
    }

    enforceNewStepBeforeSnippet(){
        this.parts.unshift(new NextStepMark());
    }

    isPureTerm(): boolean {
        return !this.finalValueIsOnStack && this.parts.length == 1 && (this.parts[0] instanceof StringCodeSnippet);
    }

    getPureTerm(): string {
        return this.parts[0].emit();
    }

    alterPureTerm(newCode: string) {
        (<StringCodeSnippet>this.parts[0]).text = newCode;
    }

    emit(): string {
        let ret: string = "";
        for (let part of this.parts) {
            ret += part.emit();
        }
        return ret;
    }

    flattenInto(flatList: CodeSnippet[]): void {
        if(this.parts.length == 0) return;

        if(this.parts[0] instanceof NextStepMark){
            if(flatList.length == 0 || flatList[flatList.length - 1] instanceof NextStepMark){
                this.parts.shift();
            } 
        }

        if(!this.parts[0].range) this.parts[0].range = this.range;
//        flatList.push(new StartPositionMark(this.range));

        for (let part of this.parts) {
            part.flattenInto(flatList);
        }

        if(!this.parts[this.parts.length - 1].range) this.parts[this.parts.length - 1].range = this.range;
        // flatList.push(new EndPositionMark(this.range));

    }

    emitToStep(currentStep: Step, steps: Step[]): Step {

        currentStep.setRangeStartIfUndefined(this.range);

        let lastCurrentStep = currentStep;
        for (let part of this.parts) {
            if (lastCurrentStep != currentStep) {
                currentStep.setRangeStartIfUndefined(part.range);
                lastCurrentStep = currentStep;
            }
            currentStep = part.emitToStep(currentStep, steps);
        }

        currentStep.adaptRangeEnd(this.range);
        return currentStep;
    }


    public static newStringPart(s: string, range: IRange) {
        return new StringCodeSnippet(s, range);
    }

    public static applyMethod(object: CodeSnippetContainer, methodIdentifier: string, parameters: CodeSnippetContainer[], range: IRange, type: JavaType) {
        let snipp = new CodeSnippetContainer([], range);
        snipp.type = type;

        let lastParts: CodeSnippet[] = [];


        for (let i = parameters.length - 1; i >= 0; i--) {
            let p = parameters[i];
            snipp.parts = snipp.parts.concat(p.finalValueIsOnStack ? p : p.allButLastPart());
        }

        for (let p of parameters) {
            lastParts.push(p.lastPartOrPop());
        }

        snipp.parts = snipp.parts.concat(object.finalValueIsOnStack ? object : object.allButLastPart());
        let objectTerm = object.lastPartOrPop();

        snipp.addStringPart(objectTerm.emit() + "." + methodIdentifier + "(" + lastParts.map(lp => lp.emit()).join(", ") + ")", range);

        return snipp;
    }

    addNextStepMark(){
        this.parts.push(new NextStepMark());
    }

    addStringPart(part: string, range?: IRange) {
        this.parts.push(new StringCodeSnippet(part, range!));
        if(this.parts.length == 0) this.setRangeStartIfUndefined(range)
        this.adaptRangeEnd(range);
    }

    addPart(part: CodeSnippet) {
        this.parts.push(part);
        if(this.parts.length == 0) this.setRangeStartIfUndefined(part.range)
        this.adaptRangeEnd(part.range);
    }

    addParts(parts: CodeSnippet[]) {
        if(parts.length == 0) return;
        if(this.parts.length == 0) this.setRangeStartIfUndefined(parts[0].range)
        this.adaptRangeEnd(parts[parts.length - 1].range);
        this.parts = this.parts.concat(parts);
    }

    allButLastPart(): CodeSnippet[] {
        if (this.parts.length < 2) return [];
        return this.finalValueIsOnStack ? this.parts : this.parts.slice(0, this.parts.length - 1);
    }

    lastPartOrPop(): CodeSnippet {
        if (this.parts.length == 0) return new EmptyPart(); // shouldn't occur

        return this.finalValueIsOnStack ? new StringCodeSnippet("s.pop()", this.range) : this.parts[this.parts.length - 1];
    }

    ensureFinalValueIsOnStack() {
        if (this.finalValueIsOnStack) return;
        if (this.parts.length == 0) return;
        this.addStringPart(`s.push(${this.parts.pop()!.emit()})`)
    }

    index(currentIndex: number): number {

        this.stepIndex = currentIndex;

        let i = currentIndex;

        for (let part of this.parts) {
            i = part.index(i);
        }

        return i;
    }


}

class NextStepMark extends CodeSnippet {
    emit(): string {
        return "";
    }

    index(currentIndex: number): number {
        this.stepIndex = currentIndex;
        return currentIndex + 1;
    }

    emitToStep(currentStep: Step, steps: Step[]): Step {
        steps.push(currentStep);
        return new Step(this.stepIndex + 1);
    }

    flattenInto(flatList: CodeSnippet[]): void {
        if (flatList.length > 0 && flatList[flatList.length - 1] instanceof NextStepMark) return;

        if (flatList.length > 1 && flatList[flatList.length - 1] instanceof LabelCodeSnippet 
            && flatList[flatList.length - 2] instanceof NextStepMark) return;
        flatList.push(this);
    }
}



export class EmptyPart extends CodeSnippet {
    constructor() {
        super();
        this.range = EmptyRange.instance;
    }

    emitToStep(currentStep: Step, _steps: Step[]): Step {
        return currentStep;
    }

    index(lastIndex: number): number {
        this.stepIndex = lastIndex;
        return lastIndex;
    }

    emit(): string {
        return "";
    }

    flattenInto(flatList: CodeSnippet[]): void {
        // nothing to do
    }
}

class StartPositionMark extends CodeSnippet {

    emit(): string {
        return "";
    }

    index(currentIndex: number): number {
        return currentIndex;
    }

    emitToStep(currentStep: Step, steps: Step[]): Step {
        if (this.range) {
            currentStep.setRangeStartIfUndefined()
        }
        return currentStep;
    }

    flattenInto(flatList: CodeSnippet[]): void {
        flatList.push(this);
    }

    constructor(range?: IRange) {
        super();
        this.range = range;
    }
}

class EndPositionMark extends CodeSnippet {

    emit(): string {
        return "";
    }

    index(currentIndex: number): number {
        return currentIndex;
    }

    emitToStep(currentStep: Step, steps: Step[]): Step {
        if (this.range) {
            currentStep.adaptRangeEnd()
        }
        return currentStep;
    }

    flattenInto(flatList: CodeSnippet[]): void {
        flatList.push(this);
    }

    constructor(range?: IRange) {
        super();
        this.range = range;
    }
}