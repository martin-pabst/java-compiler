import { Step } from "../../common/interpreter/Program";
import { EmptyRange, IRange } from "../../common/range/Range";
import { JavaType } from "../types/JavaType";
import { CodeSnippetPart } from "./CodeSnippetPart";




export class CodeSnippet extends CodeSnippetPart {
    parts: CodeSnippetPart [] = [];
    type?: JavaType;  // undefined for for-loop, ...
    isLefty: boolean = false; // can you assign a value to it?
    
    stopStepOverBeforeStep: boolean = false;

    constructor(range: IRange | undefined, public finalValueIsOnStack: boolean, 
        public endStepAfterSnippet: boolean, type: JavaType | undefined, ...parts: CodeSnippetPart []){
        super();
        this.parts = parts;
        this.range = range;
        this.type = type;
    }

    isPureTerm(): boolean {
        return !this.finalValueIsOnStack && this.parts.length == 1 && (this.parts[0] instanceof StringCodeSnippet);
    }

    getPureTerm(): string {
        return this.parts[0].emit();
    }

    alterPureTerm(newCode: string){
        (<StringCodeSnippet>this.parts[0]).text = newCode;
    }

    emit(): string {
        let ret: string = "";
        for(let part of this.parts){
            ret += part.emit();
        }
        return ret;
    }

    emitToStep(currentStep: Step, steps: Step[]): Step {
        currentStep.setRangeStartIfUndefined(this.range);
        
        if(this.stopStepOverBeforeStep) currentStep.stopStepOverBeforeStep = true;

        for(let part of this.parts){
            currentStep = part.emitToStep(currentStep, steps);
        }

        if(this.endStepAfterSnippet){
            steps.push(currentStep);
            return new Step(this.stepIndex + 1);
        }

        currentStep.adaptRangeEnd(this.range);
        return currentStep;
    }

    public addSemicolon(endStepAfterSnippet: boolean): CodeSnippet {
        this.addStringPart(";\n", undefined);
        this.endStepAfterSnippet = endStepAfterSnippet;
        return this;
    }

    public setEndStepAfterSnippet(): CodeSnippet {
        this.endStepAfterSnippet = true;
        return this;
    }

    public static newStringPart(s: string, range: IRange){
        return new StringCodeSnippet(s, range);
    }

    public static applyMethod(object: CodeSnippet, methodIdentifier: string, parameters: CodeSnippet[], range: IRange, type: JavaType){
        let snipp = new CodeSnippet(range, false, false, type);

        let lastParts: CodeSnippetPart[] = [];

        
        for(let i = parameters.length - 1; i >= 0; i--){
            let p = parameters[i];
            snipp.parts = snipp.parts.concat(p.finalValueIsOnStack ? p : p.allButLastPart());
        }
        
        for(let p of parameters){
            lastParts.push(p.lastPartOrPop());
        }

        snipp.parts = snipp.parts.concat(object.finalValueIsOnStack ? object : object.allButLastPart());
        let objectTerm = object.lastPartOrPop();
        
        snipp.addStringPart(objectTerm.emit() + "." + methodIdentifier + "(" + lastParts.map(lp => lp.emit()).join(", ") + ")", range);

        return snipp;
    }



    addStringPart(part: string, range: IRange | undefined ){
        this.parts.push(new StringCodeSnippet(part, range!));
    }

    addStringPartWithoutRange(part: string){
        this.parts.push(new StringCodeSnippet(part, undefined));
    }

    addPart(part: CodeSnippetPart){
            this.parts.push(part);
    }

    addParts(parts: CodeSnippetPart[]){
        this.parts = this.parts.concat(parts);
    }

    allButLastPart(): CodeSnippetPart[] {
        if(this.parts.length < 2) return [];
        return this.finalValueIsOnStack ? this.parts : this.parts.slice(0, this.parts.length - 1);
    }

    lastPartOrPop(): CodeSnippetPart {
        if(this.parts.length == 0) return new EmptyPart(); // shouldn't occur

        return this.finalValueIsOnStack ? new StringCodeSnippet("s.pop()", this.range) : this.parts[this.parts.length - 1];
    }

    ensureFinalValueIsOnStack() {
        if(this.finalValueIsOnStack) return;
        if(this.parts.length == 0) return;
        this.addStringPartWithoutRange(`s.push(${this.parts.pop()!.emit()})`)
    }

    index(currentIndex: number): number {
        this.stepIndex = currentIndex;

        let i = currentIndex;

        for(let part of this.parts){
            i = part.index(i);
        }

        return this.endStepAfterSnippet ? i + 1 : i;
    }


}


export class StringCodeSnippet extends CodeSnippetPart {

    constructor(public text: string, range: IRange | undefined){
        super();
        this.range = range;
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

}

export class EmptyPart extends CodeSnippetPart {
    constructor(){
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

}

