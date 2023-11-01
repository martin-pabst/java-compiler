import { Step } from "../../common/interpreter/Program";
import { CodeSnippetPart } from "./CodeSnippetPart";

export class SnippetLinker {

    constructor(){

    }

    link(snippets: CodeSnippetPart[]): Step[] {

        this.index(snippets, 0);
        
        let steps: Step[] = [];
        let currentStep = new Step(0);
        for(let snippet of snippets){
            currentStep = snippet.emitToStep(currentStep, steps);
        }
        
        if(!currentStep.isEmpty()) steps.push(currentStep);

        return steps;

    }

    private index(snippetParts: CodeSnippetPart[], lastIndex: number){
        let index = lastIndex;
        for(let part of snippetParts){
            index = part.index(index);
        }
    }


}