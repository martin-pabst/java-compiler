import { Step } from "../../common/interpreter/Program";
import { IRange } from "../../common/range/Range";
import { JavaType } from "../types/JavaType";

export type ConstantValue = number | boolean | string | null;

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

    isPureTermWithoutPop(){
        return true;
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

    isConstant() {
        return false;
    }

    getConstantValue(): ConstantValue | undefined {
        return undefined;
    }

    endsWith(suffix: string){
        return false;
    }
}

export type EmitToStepListener = (step: Step) => void;

export class StringCodeSnippet extends CodeSnippet {

    private constantValue: ConstantValue | undefined;
    private emitToStepListeners: EmitToStepListener[] = [];

    constructor(public text: string, range?: IRange, type?: JavaType, constantValue?: ConstantValue ) {
        super();
        this.range = range;
        this.type = type;
        this.constantValue = constantValue;
    }

    getConstantValue(): ConstantValue | undefined {
        return this.constantValue;
    }

    isConstant(): boolean {
        return typeof this.constantValue !== "undefined";
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

    addEmitToStepListener(emitToStepListener: EmitToStepListener){
        this.emitToStepListeners.push(emitToStepListener);
    }

    emitToStep(currentStep: Step, _steps: Step[]): Step {
        currentStep.codeAsString = currentStep.codeAsString + this.text;

        currentStep.adaptRangeEnd(this.range);

        this.emitToStepListeners.forEach(esl => esl(currentStep));

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

    allButLastPart(): CodeSnippet[] {
        return this.finalValueIsOnStack ? [this] : [];
    }

    lastPartOrPop(): CodeSnippet {
        return this.finalValueIsOnStack ? new StringCodeSnippet("s.pop()", this.range) : this;
    }

    endsWith(suffix: string){
        return this.text.endsWith(suffix);
    }


}
