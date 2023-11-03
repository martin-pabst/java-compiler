import { JavaTypeStore } from "../module/JavaTypeStore";
import { JavaType } from "../types/JavaType";
import { CodeSnippetContainer } from "./CodeSnippetKinds";
import { CodeSnippet } from "./CodeSnippet";

export class Unboxer {

    static unboxingMethods: { [boxedTypeidentifier: string]: string } = {
        "Character": "charValue",
        "Byte": "byteValue",
        "Integer": "intValue",
        "Float": "floatValue",
        "Double": "doubleValue",
    
    }
    
    static doUnboxing(snippet: CodeSnippet): CodeSnippet {
        if(!snippet.type) return snippet;
        let unboxingMethod = Unboxer.unboxingMethods[snippet.type.identifier];
        if(!unboxingMethod) return snippet;
    
        snippet.type = snippet.type.getUnboxedType();

        return SnippetFramer.frame(snippet, '($1).' + unboxingMethod + '()');
    }
}

export class SnippetFramer {
    static frame(snippet: CodeSnippet, template: string, newType?: JavaType): CodeSnippet {

        let type = newType ? newType : snippet.type;

        if(snippet.isPureTerm()){
                snippet.alterPureTerm(template.replace(new RegExp('\\$1', 'g'), snippet.getPureTerm()));
                return snippet;
        }

        let framedSnippet = new CodeSnippetContainer(snippet.allButLastPart(), snippet.range);
        framedSnippet.addStringPart(template.replace(new RegExp('\\$1', 'g'), snippet.lastPartOrPop().emit()), snippet.range, type);
        
        return framedSnippet;
    }

}

export class CharToNumberConverter {
    static convertCharToNumber(snippet: CodeSnippet, typestore: JavaTypeStore): CodeSnippet {
        if(!snippet.type) return snippet;
        if(snippet.type.identifier != 'char') return snippet;

        let intType = typestore.getType("int");

        return SnippetFramer.frame(snippet, 'String.charCodeAt($1)', intType)
    }

}