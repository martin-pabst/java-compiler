import { Error } from "../Error";
import { Program } from "../interpreter/Program";
import { File } from "./File";

export abstract class Module {

    errors: Error[] = [];
    bracketError?: string;
    colorInformation: monaco.languages.IColorInformation[] = [];

    dirty: boolean = true;

    programsToCompileToFunctions: Program[] = [];


    constructor(public file: File, public isLibraryModule: boolean){

    }

    abstract getMainProgram(): Program | undefined;

    isStartable(): boolean {
        if(this.getMainProgram()){ 
            return !this.hasErrors();
        }
        
        return false;
    }
    
    hasErrors(): boolean {
        return this.errors.find(error => error.level == "error") ? true : false;
    }

}