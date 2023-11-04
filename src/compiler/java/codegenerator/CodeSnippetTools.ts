import { JavaTypeStore } from "../module/JavaTypeStore";
import { JavaType } from "../types/JavaType";
import { CodeSnippetContainer } from "./CodeSnippetKinds";
import { CodeSnippet } from "./CodeSnippet";

export class Unboxer {

    static boxedTypeToUnboxedTypeMap: {[boxedIdentifier: string]: string} = {
        "Character": "char",
        "Byte": "byte",
        "Short": "short",
        "Integer": "int",
        "Float": "float",
        "Double": "double"
    }
    
    static unboxedTypeToboxedTypeMap: {[boxedIdentifier: string]: string} = {
        "char": "Character",
        "byte": "Byte",
        "short": "Short",
        "int": "Integer",
        "float": "Float",
        "double": "Double"
    }
    
    static unbox(snippet: CodeSnippet, typestore: JavaTypeStore): CodeSnippet {
        if(!snippet.type) return snippet;
        let unboxedIdentifier: string | undefined = Unboxer.boxedTypeToUnboxedTypeMap[snippet.type.identifier];

        if(!unboxedIdentifier) return snippet;

        let unboxedType = typestore.getType(unboxedIdentifier);

        return SnippetFramer.frame(snippet, '($1).value', unboxedType);
    }

    static box(snippet: CodeSnippet, typestore: JavaTypeStore): CodeSnippet {
        if(!snippet.type) return snippet;
        let boxedIdentifier: string | undefined = Unboxer.unboxedTypeToboxedTypeMap[snippet.type.identifier];

        if(!boxedIdentifier) return snippet;

        let boxedType = typestore.getType(boxedIdentifier);

        return SnippetFramer.frame(snippet, `ho.classes["${boxedIdentifier}"].valueOf($1)`, boxedType);
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