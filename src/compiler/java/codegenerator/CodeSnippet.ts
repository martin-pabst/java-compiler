import { FunctionTemplate } from "./FunctionTemplate";

type CodeSnippetPart = string | CodeSnippet;

export class CodeSnippet {
    parts: CodeSnippetPart [] = [];

    constructor(public finalValueIsOnStack: boolean, public endStepAfterSnippet: boolean, ...parts: CodeSnippetPart []){
        this.parts = parts;
    }

    public static fromTemplate(template: FunctionTemplate, ...parameter: CodeSnippet[]): CodeSnippet {
        let snipp = new CodeSnippet(false, false);

        let lastParts: string[] = [];

        for(let p of parameter){
            snipp.parts = snipp.parts.concat(p.finalValueIsOnStack ? p : p.allButLastPart());
            lastParts.push(p.finalValueIsOnStack ? "pop()" : <string>p.lastPart());
        }

        snipp.addParts(template.apply(lastParts));

        return snipp;
    }

    public static applyMethod(object: CodeSnippet, methodIdentifier: string, parameters: CodeSnippet[]){
        let snipp = new CodeSnippet(false, false);

        let lastParts: string[] = [];

        snipp.parts = snipp.parts.concat(object.finalValueIsOnStack ? object : object.allButLastPart());
        let objectTerm = (object.finalValueIsOnStack ? "pop()" : <string>object.lastPart());
        
        for(let p of parameters){
            snipp.parts = snipp.parts.concat(p.finalValueIsOnStack ? p : p.allButLastPart());
            lastParts.push(p.finalValueIsOnStack ? "pop()" : <string>p.lastPart());
        }

        snipp.addParts(objectTerm + "." + methodIdentifier + "(" + lastParts.join(", ") + ")");

        return snipp;
    }

    addParts(...parts: CodeSnippetPart[]){
        this.parts = this.parts.concat(parts);
    }

    allButLastPart(): CodeSnippetPart[] {
        if(this.parts.length < 2) return [];
        return this.parts.slice(0, this.parts.length - 1);
    }

    lastPart(): CodeSnippetPart {
        if(this.parts.length == 0) return "";
        return this.parts[this.parts.length - 1];
    }
}