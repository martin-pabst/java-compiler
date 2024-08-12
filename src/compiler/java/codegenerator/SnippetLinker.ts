import { Program, Step } from "../../common/interpreter/Program";
import { CodeSnippet } from "./CodeSnippet";
import { NextStepMark } from "./CodeSnippetKinds";
import { LabelCodeSnippet } from "./LabelManager";

export class SnippetLinker {

    constructor(){

    }

    link(snippets: CodeSnippet[], program: Program) {

        // unpack CodeSnippetContainer objects:
        let flatList: CodeSnippet[] = [];
        snippets.forEach(snippet => snippet.flattenInto(flatList));

        /**
         * If between two nextStepMarks there are only labels, then remove the latter one
         */
        let onlyLabelsSinceLastStepMark: boolean = false;
        for(let i = 0; i < flatList.length; i++){

            let snippet = flatList[i];
            if(snippet instanceof NextStepMark){
                if(onlyLabelsSinceLastStepMark){
                    flatList.splice(i, 1); 
                    i--;
                } 
                onlyLabelsSinceLastStepMark = true;
            } else if(!(snippet instanceof LabelCodeSnippet)){
                onlyLabelsSinceLastStepMark = false;
            }

        }

        this.index(flatList, 0);

        let steps: Step[] = [];
        let currentStep = new Step(0, program.module);
        for(let snippet of flatList){
            currentStep = snippet.emitToStep(currentStep, steps, program.module);
        }
        
        if(!currentStep.isEmpty()) steps.push(currentStep);

        program.stepsSingle = steps;

    }

    private index(snippetParts: CodeSnippet[], lastIndex: number){
        let index = lastIndex;
        for(let part of snippetParts){
            index = part.index(index);
        }
    }

}