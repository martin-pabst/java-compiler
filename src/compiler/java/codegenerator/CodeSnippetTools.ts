import { JavaTypeStore } from "../module/JavaTypeStore";
import { JavaType } from "../types/JavaType";
import { CodeSnippetContainer } from "./CodeSnippetKinds";
import { CodeSnippet } from "./CodeSnippet";

export class SnippetFramer {
    static frame(snippet: CodeSnippet, template: string, newType?: JavaType): CodeSnippet {

        let type = newType ? newType : snippet.type;

        if(snippet.isPureTerm()){
                snippet.alterPureTerm(template.replace(new RegExp('\\§1', 'g'), snippet.getPureTerm()));
                return snippet;
        }

        let framedSnippet = new CodeSnippetContainer(snippet.allButLastPart(), snippet.range);
        framedSnippet.addStringPart(template.replace(new RegExp('\\§1', 'g'), snippet.lastPartOrPop().emit()), snippet.range, type);
        if(snippet instanceof CodeSnippetContainer && snippet.endsWithNextStepMark()){
            framedSnippet.addNextStepMark();
        }
        
        return framedSnippet;
    }

}

