import { Step } from "../../common/interpreter/Program";
import { CodeSnippetContainer } from "./CodeSnippet";
import { CodeSnippet } from "./CodeSnippet";

export class SnippetLinker {

    constructor(){

    }

    linkOld(snippets: CodeSnippet[]): Step[] {

        this.index(snippets, 0);
        
        let steps: Step[] = [];
        let currentStep = new Step(0);
        for(let snippet of snippets){
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


    /**
     * eliminate all CodeSnippet-container
     */
    link(snippets: CodeSnippet[]) {

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

}