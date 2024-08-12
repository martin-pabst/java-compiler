import { lm } from "../../../tools/language/LanguageManager";

export class InterpreterMessages {

    static ArrayLengthNegative = () => lm({
    "de": "Negative Array-Längen sind nicht möglich.",
    "en": "Negative array length is not feasible.",
    })

    static SystemException = () => lm({
    "de": "Interner Fehler: ",
    "en": "System exception: ",
    })

    static NullPointerException = () => lm({
    "de": "Auf ein Attribut/eine Methode von null kann nicht zugegriffen werden.",
    "en": "Can't access field/method of null.",
    })

    static ClassCastException = (type: string, destType: string) => lm({
    "de": `Ein Objekt der Klasse ${type} ist kein Objekt der Klasse ${destType} und kann daher nicht in diesen Typ gecastet werden.`,
    "en": `An object of class ${type} is no object of class ${destType}, therefore casting ist not possible.`,
    })

    

}