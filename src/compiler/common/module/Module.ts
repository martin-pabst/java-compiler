import { Error } from "../Error";
import { Program } from "../interpreter/Program";
import { Thread } from "../interpreter/Thread";
import { File } from "./File";

export abstract class Module {

    errors: Error[] = [];
    bracketError?: string;
    colorInformation: monaco.languages.IColorInformation[] = [];

    dirty: boolean = true;

    programsToCompileToFunctions: Program[] = [];


    constructor(public file: File, public isLibraryModule: boolean){

    }

    abstract hasMainProgram(): boolean;

    abstract startMainProgram(thread: Thread): boolean;

    isStartable(): boolean {
        if(this.hasMainProgram()){ 
            return !this.hasErrors();
        }
        
        return false;
    }
    
    hasErrors(): boolean {
        return this.errors.find(error => error.level == "error") ? true : false;
    }

}