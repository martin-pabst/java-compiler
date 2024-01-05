export var currentLanguage: string = "de";
export var fallbackLanguages: string[] = ["en", "de"];

export function le(map: Record<string, string>): string {
    let template = map[currentLanguage];
    if(!template){
        for(let lang of fallbackLanguages){
            template = map[lang];
            if(template) break;
        }
        if(!template){
            return "Missing template for language " + currentLanguage;
        }
    }

    return template;
}

export class LM {

    static setLanguage(languageAbbreviation: string){
        currentLanguage = languageAbbreviation;
    }



}