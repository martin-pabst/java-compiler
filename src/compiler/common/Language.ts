export abstract class Language {

    constructor(public name: string, public fileEndingWithDot: string){

    }

    abstract registerLanguageAtMonacoEditor():void;



}