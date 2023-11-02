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

}