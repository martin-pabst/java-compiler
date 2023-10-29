import { Error } from "../Error";
import { File } from "./File";

export class Module {

    errors: Error[] = [];
    bracketError?: string;
    colorInformation: monaco.languages.IColorInformation[] = [];

    constructor(public file: File){

    }

}