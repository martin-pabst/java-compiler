import { Step } from "../../common/interpreter/Program";
import { CodeSnippet } from "./CodeSnippet";

export class SnippetLinker {

    constructor(){

    }

    link(snippets: CodeSnippet[]) {

        // unpack CodeSnippetContainer objects:
        let flatList: CodeSnippet[] = [];
        snippets.forEach(snippet => snippet.flattenInto(flatList));

        this.index(flatList, 0);

        let steps: Step[] = [];
        let currentStep = new Step(0);
        for(let snippet of flatList){
            currentStep = snippet.emitToStep(currentStep, steps);
        }
        
        if(!currentStep.isEmpty()) steps.push(currentStep);

        return steps;

    }

    private index(snippetParts: CodeSnippet[], lastIndex: number){
        let index = lastIndex;
        for(let part of snippetParts){
            index = part.index(index);
        }
    }

}