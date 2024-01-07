export var currentLanguage: string = "en";
export var fallbackLanguages: string[] = ["en", "de", "id"];

export type ErrormessageWithId = {
    message: string,
    id: string
}

export function lm(map: Record<string, string>): string {
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

export function le(map: Record<string, string>): ErrormessageWithId {
    let template = map[currentLanguage];
    if(!template){
        for(let lang of fallbackLanguages){
            template = map[lang];
            if(template) break;
        }
        if(!template){
            return {
                id: "MissingTemplate",
                message: "Missing template for language " + currentLanguage
            }
        }
    }

    let id = map["id"] || "no id";

    return {
        message: template,
        id: id
    }
}

export class LM {

    static setLanguage(languageAbbreviation: string){
        currentLanguage = languageAbbreviation;
    }



}