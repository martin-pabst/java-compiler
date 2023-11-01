import { IRange } from "../../common/range/Range";
import { TokenType, TokenTypeReadable } from "../TokenType";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { JavaType } from "../types/JavaType";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";
import { LabelCodeSnippet } from "./LabelManager";
import { CharToNumberConverter, SnippetFramer, Unboxer } from "./SnippetTools";


export abstract class CodeTemplate {
    
    abstract applyToSnippets(resultType: JavaType, range: IRange, typestore: JavaTypeStore,
          ...snippets: CodeSnippet[]): CodeSnippet;
            
}

export class IdentityTemplate extends CodeTemplate {

    applyToSnippets(_resultType: JavaType, _range: IRange, _typestore: JavaTypeStore,
         ...snippets: CodeSnippet[]): CodeSnippet {
        return snippets[0];
    }
}

export class OneParameterOnceTemplate extends CodeTemplate {

    constructor(private templateString: string){
        super();
    }

    applyToSnippets(resultType: JavaType, range: IRange, _typestore: JavaTypeStore,
         ...snippets: CodeSnippet[]): CodeSnippet {
        let snippet = new CodeSnippet(range, false, false, resultType);
        if(snippets[0].isPureTerm()){
            snippet.addStringPart(this.templateString.replace('$1', snippets[0].parts[0].emit()), range);
            return snippet;
        }
        
        snippet.addParts(snippets[0].allButLastPart());
        snippet.addStringPart(this.templateString.replace('$1', snippets[0].lastPartOrPop().emit()), range);
        return snippet;
    }

}

export class OneParameterTemplate extends CodeTemplate {

    constructor(private templateString: string){
        super();
    }

    applyToSnippets(resultType: JavaType, range: IRange, _typestore: JavaTypeStore,
         ...snippets: CodeSnippet[]): CodeSnippet {
        let snippet = new CodeSnippet(range, false, false, resultType);
        if(snippets[0].isPureTerm()){
            snippet.addStringPart(this.templateString.replace(new RegExp('\\$1', 'g'), snippets[0].parts[0].emit()), range);
            return snippet;
        }
        
        snippet.addParts(snippets[0].allButLastPart());
        snippet.addStringPart(this.templateString.replace(new RegExp('\\$1', 'g'), snippets[0].lastPartOrPop().emit()), range);
        return snippet;
    }

}

export class TwoParameterTemplate extends CodeTemplate {

    constructor(private templateString: string, private isEndOfStep: boolean = false){
        super();
    }

    applyToSnippets(resultType: JavaType, range: IRange, _typestore: JavaTypeStore,
         ...snippets: CodeSnippet[]): CodeSnippet {
        let snippet = new CodeSnippet(range, false, false, resultType);
        snippet.endStepAfterSnippet = this.isEndOfStep;

        let snippet0Pure = snippets[0].isPureTerm();
        let snippet1Pure = snippets[1].isPureTerm();

        if(snippet0Pure && snippet1Pure){
            snippet.addStringPart(this.templateString.replace(new RegExp('\\$1', 'g'), snippets[0].getPureTerm())
            .replace(new RegExp('\\$2', 'g'), snippets[1].getPureTerm()), range);
            return snippet;
        }

        if(snippet0Pure || snippet1Pure){
            snippet.addParts(snippets[0].allButLastPart());
            snippet.addParts(snippets[1].allButLastPart());

            snippet.addStringPart(this.templateString.replace(new RegExp('\\$1', 'g'), snippets[0].lastPartOrPop().emit())
            .replace(new RegExp('\\$2', 'g'), snippets[1].lastPartOrPop().emit()), range);
            return snippet;
        }

        // Not good: we have to evaluate operands in wrong order to get pop() right...
        if(this.templateString.indexOf('$1') < this.templateString.indexOf('$2')){
            snippet.addParts(snippets[1].allButLastPart());
            snippet.addParts(snippets[0].allButLastPart());
        } else {
            snippet.addParts(snippets[0].allButLastPart());
            snippet.addParts(snippets[1].allButLastPart());0
        }

        snippet.addStringPart(this.templateString.replace(new RegExp('\\$1', 'g'), 's.pop()')
        .replace(new RegExp('\\$2', 'g'), 's.pop()'), range);
        return snippet;

    }

}


export class UnarySuffixTemplate extends CodeTemplate {
    constructor(private operator: TokenType.plusPlus | TokenType.minusMinus){
        super();
    }

    applyToSnippets(_resultType: JavaType, _range: IRange, _typestore: JavaTypeStore,
         ...snippets: CodeSnippet[]): CodeSnippet {
        let snippet = snippets[0];
        snippet = Unboxer.doUnboxing(snippet);
        if(!snippet.type) return snippet;

        let primitiveTypeIndex = PrimitiveType.getTypeIndex(snippet.type);
        if(!primitiveTypeIndex || primitiveTypeIndex === 0) return snippet; // boolean

        let operatorString = TokenTypeReadable[this.operator];

        if(primitiveTypeIndex > 1) return SnippetFramer.frame(snippet, '$1' + operatorString);

        // char
        return SnippetFramer.frame(snippet, '($1 = String.fromCharCode(($1.charCodeAt(0) + 1)))')

    }
}

export class BinaryOperatorTemplate extends CodeTemplate {

    constructor(private operator: string, private isCommutative: boolean) {
        super();
    }

    applyToSnippets(resultType: JavaType, range: IRange, typestore: JavaTypeStore, ...snippets: CodeSnippet[]): CodeSnippet {

        snippets[0] = Unboxer.doUnboxing(snippets[0]);
        snippets[1] = Unboxer.doUnboxing(snippets[1]);

        snippets[0] = CharToNumberConverter.convertCharToNumber(snippets[0], typestore);
        snippets[1] = CharToNumberConverter.convertCharToNumber(snippets[1], typestore);

        let snippet0IsPure = snippets[0].isPureTerm();
        let snippet1IsPure = snippets[1].isPureTerm();

        if (snippet0IsPure && snippet1IsPure) {
            return new CodeSnippet(range, false, false, resultType,
                new StringCodeSnippet("(" + snippets[0].parts[0].emit() + " " + this.operator + " " + snippets[1].parts[0].emit() + ")", range));
        }

        if (this.operator == '&&') return lazyEvaluationAND(resultType, snippets, range);
        if (this.operator == '||') return lazyEvaluationOR(resultType, snippets, range);

        let snippet = new CodeSnippet(range, false, false, resultType);
        snippet.type = resultType;
        snippet.finalValueIsOnStack = false;


        if (this.isCommutative || snippet0IsPure || snippet1IsPure) {
            snippet.addParts(snippets[0].allButLastPart());
            snippet.addParts(snippets[1].allButLastPart());
            snippet.addStringPart(`(${snippets[0].lastPartOrPop()} ${this.operator} ${snippets[1].lastPartOrPop()})`, range)
            return snippet;
        }

        if (['-', '/', '<', '>', '<=', '>='].indexOf(this.operator) >= 0) {
            snippet.addParts(snippets[0].allButLastPart());
            snippet.addParts(snippets[1].allButLastPart());

            switch (this.operator) {
                case '-': snippet.addStringPart(`(-s.pop() + s.pop())`, range); break;
                case '/': snippet.addStringPart(`(1/s.pop() * s.pop())`, range); break;
                case '<': snippet.addStringPart(`(pop() > pop())`, range); break;
                case '>': snippet.addStringPart(`(pop() < pop())`, range); break;
                case '<=': snippet.addStringPart(`(pop() >= pop())`, range); break;
                case '>=': snippet.addStringPart(`(pop() <= pop())`, range); break;
            }
            return snippet;
        }

        snippet.addParts(snippets[1].allButLastPart());
        snippet.addParts(snippets[0].allButLastPart());
        snippet.addStringPart(`(pop() ${this.operator} pop())`, range);

        return snippet;
    }



}

function lazyEvaluationAND(resultType: JavaType, snippets: CodeSnippet[], range: IRange): CodeSnippet {

    let snippet = new CodeSnippet(range, true, false, resultType);
    snippet.type = resultType;

    snippet.addParts(snippets[0].allButLastPart());

    let sn1 = new CodeSnippet(range, false, true, resultType);
    let label = new LabelCodeSnippet();
    sn1.addStringPart(`if(!s.pop()){s.push(false);`, range);
    sn1.addPart(label.getJumpToSnippet());
    sn1.addStringPart('\n}', range);
    snippet.addPart(sn1);

    snippets[1].ensureFinalValueIsOnStack();
    snippet.addPart(snippets[1]);

    snippet.addPart(label);

    return snippet;
}

function lazyEvaluationOR(resultType: JavaType, snippets: CodeSnippet[], range: IRange): CodeSnippet {

    let snippet = new CodeSnippet(range, true, false, resultType);
    snippet.type = resultType;

    snippet.addParts(snippets[0].allButLastPart());

    let sn1 = new CodeSnippet(range, false, true, resultType);
    let label = new LabelCodeSnippet();
    sn1.addStringPart(`if(s.pop()){s.push(true);`, range);
    sn1.addPart(label.getJumpToSnippet());
    sn1.addStringPart('\n}', range);
    snippet.addPart(sn1);

    snippets[1].ensureFinalValueIsOnStack();
    snippet.addPart(snippets[1]);

    snippet.addPart(label);

    return snippet;
}

