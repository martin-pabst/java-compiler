import { Error } from "../Error";
import { Program } from "../interpreter/Program";
import { File } from "./File";

export abstract class Module {

    errors: Error[] = [];
    bracketError?: string;
    colorInformation: monaco.languages.IColorInformation[] = [];

    dirty: boolean = true;

    constructor(public file: File, public isLibraryModule: boolean){

    }

    abstract getMainProgram(): Program | undefined;

    isStartable(): boolean {
        let hasError: boolean = this.errors.find(error => error.level == "error") ? true : false;
        if(this.getMainProgram()){ 
            return !hasError;
        }

        return false;
    }

}