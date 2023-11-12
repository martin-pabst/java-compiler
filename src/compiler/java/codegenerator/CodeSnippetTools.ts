import { JavaTypeStore } from "../module/JavaTypeStore";
import { JavaType } from "../types/JavaType";
import { CodeSnippetContainer } from "./CodeSnippetKinds";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";

export class SnippetFramer {
    static frame(snippet: CodeSnippet, template: string, newType?: JavaType): CodeSnippet {

        let type = newType ? newType : snippet.type;

        if(snippet.isPureTerm()){
                snippet.alterPureTerm(template.replace(new RegExp('\\§1', 'g'), snippet.getPureTerm()));
                return snippet;
        }

        let framedSnippet = new CodeSnippetContainer(snippet.allButLastPart(), snippet.range);
        let lastPart = snippet.lastPartOrPop();
        framedSnippet.addStringPart(template.replace(new RegExp('\\§1', 'g'), lastPart.emit()), snippet.range, type, [lastPart]);
        if(snippet instanceof CodeSnippetContainer && snippet.endsWithNextStepMark()){
            framedSnippet.addNextStepMark();
        }
        
        return framedSnippet;
    }

}

