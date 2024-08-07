import { JavaRepl } from "../java/parser/repl/JavaRepl";
import { Compiler } from "./Compiler";
import { IMain } from "./IMain";

export abstract class Language {

    constructor(public name: string, public fileEndingWithDot: string){

    }

    abstract registerLanguageAtMonacoEditor(main: IMain):void;

    abstract getCompiler(): Compiler;

    abstract getRepl(): JavaRepl; // TODO: Base Repl class

}