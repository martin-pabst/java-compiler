import { Language } from "../common/Language";

export class JavaLanguage extends Language {

    constructor(){
        super("Java", ".java");
        let t: () => string = () => {return "x"};
    }

}