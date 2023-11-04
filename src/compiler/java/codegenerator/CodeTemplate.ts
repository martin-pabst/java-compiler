import { IRange } from "../../common/range/Range";
import { TokenType, TokenTypeReadable } from "../TokenType";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { JavaType } from "../types/JavaType";
import { CodeSnippetContainer } from "./CodeSnippetKinds";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";
import { LabelCodeSnippet } from "./LabelManager";
import { CharToNumberConverter, SnippetFramer, Unboxer } from "./CodeSnippetTools";


export abstract class CodeTemplate {

    abstract applyToSnippet(resultType: JavaType, range: IRange, typestore: JavaTypeStore,
        ...snippets: CodeSnippet[]): CodeSnippet;

}

export class IdentityTemplate extends CodeTemplate {

    applyToSnippet(_resultType: JavaType, _range: IRange, _typestore: JavaTypeStore,
        ...snippets: CodeSnippet[]): CodeSnippet {
        return snippets[0];
    }
}

export class OneParameterOnceTemplate extends CodeTemplate {

    constructor(private templateString: string) {
        super();
    }

    applyToSnippet(resultType: JavaType, range: IRange, _typestore: JavaTypeStore,
        ...snippets: CodeSnippet[]): CodeSnippet {

        if (snippets[0].isPureTerm()) {
            return new StringCodeSnippet(this.templateString.replace('$1', snippets[0].getPureTerm()), range, resultType);
        }

        let snippet = new CodeSnippetContainer(snippets[0].allButLastPart(), range, resultType);
        snippet.addStringPart(this.templateString.replace('$1', snippets[0].lastPartOrPop().emit()), range);
        return snippet;
    }

}

export class OneParameterTemplate extends CodeTemplate {

    constructor(private templateString: string) {
        super();
    }

    applyToSnippet(resultType: JavaType, range: IRange, _typestore: JavaTypeStore,
        ...snippets: CodeSnippet[]): CodeSnippet {

        if (snippets[0].isPureTerm()) {
            return new StringCodeSnippet(this.templateString.replace(new RegExp('\\$1', 'g'), snippets[0].getPureTerm()), range, resultType);
        }

        let snippetContainer = new CodeSnippetContainer(snippets[0].allButLastPart(), range, resultType);
        snippetContainer.addStringPart(this.templateString.replace(new RegExp('\\$1', 'g'), snippets[0].lastPartOrPop().emit()), range);
        return snippetContainer;
    }

}

export class TwoParameterTemplate extends CodeTemplate {

    constructor(private templateString: string) {
        super();
    }

    applyToSnippet(resultType: JavaType, range: IRange, _typestore: JavaTypeStore,
        ...snippets: CodeSnippet[]): CodeSnippet {

        let snippet0Pure = snippets[0].isPureTerm();
        let snippet1Pure = snippets[1].isPureTerm();

        if (snippet0Pure && snippet1Pure) {
            let code: string = this.templateString.replace(new RegExp('\\$1', 'g'), snippets[0].getPureTerm());
            code = code.replace(new RegExp('\\$2', 'g'), snippets[1].getPureTerm());
            return new StringCodeSnippet(code, range, resultType);
        }

        let snippetContainer = new CodeSnippetContainer([], range, resultType);
        if (snippet0Pure || snippet1Pure) {
            snippetContainer.addParts(snippets[0].allButLastPart());
            snippetContainer.addParts(snippets[1].allButLastPart());

            snippetContainer.addStringPart(this.templateString.replace(new RegExp('\\$1', 'g'), snippets[0].lastPartOrPop().emit())
                .replace(new RegExp('\\$2', 'g'), snippets[1].lastPartOrPop().emit()), range);
            return snippetContainer;
        }

        // Not good: we have to evaluate operands in wrong order to get pop() right...
        if (this.templateString.indexOf('$1') < this.templateString.indexOf('$2')) {
            snippetContainer.addParts(snippets[1].allButLastPart());
            snippetContainer.addParts(snippets[0].allButLastPart());
        } else {
            snippetContainer.addParts(snippets[0].allButLastPart());
            snippetContainer.addParts(snippets[1].allButLastPart()); 0
        }

        snippetContainer.addStringPart(this.templateString.replace(new RegExp('\\$1', 'g'), 's.pop()')
            .replace(new RegExp('\\$2', 'g'), 's.pop()'), range);
        return snippetContainer;

    }

}

/**
 * In template "let $2 = $1 + $4" we have three parameters:
 * "$2" has n == 2 and order == 0
 * "$1" has n == 1 and order == 1
 * "$4" has n == 4 and order == 2
 */
type OrderedParameter = { parameter: string, n: number, order: number };


export class ParametersCommaSeparatedTemplate {
    static applyToSnippet(resultType: JavaType, range: IRange, prefix: string, suffix: string,
        ...snippets: CodeSnippet[]): CodeSnippet {
    
            // only pure Terms? => faster variant
            let onlyPureTerms = true;
            for(let snippet of snippets){
                if(!snippet.isPureTerm()){
                    onlyPureTerms = false;
                    break;
                }
            }
    
            if(onlyPureTerms){
                return new StringCodeSnippet(prefix + snippets.map(s => s.emit()).join(", ") + suffix, range, resultType);
            }
    
            let snippetContainer = new CodeSnippetContainer([], range, resultType);
            
            for (let i = snippets.length - 1; i >= 0; i--) {
                snippetContainer.addParts(snippets[i].allButLastPart());
            }

            let term = prefix + snippets.map( s => s.lastPartOrPop().emit()).join(", ") + suffix;

            snippetContainer.addStringPart(term, range, resultType);
    
            return snippetContainer;
    
        }    
}

/**
 * Usage:
 * new SeveralParameterTemplate("MethodCall($1, $4, $2)") or
 * new SeveralParameterTemplate("MethodCall($, $, $)", 3)
 */
export class SeveralParameterTemplate extends CodeTemplate {

    private orderedParameters: OrderedParameter[] = [];
    private maxN: number = -1;

    constructor(private templateString: string) {
        super();
        let parameterStrings = templateString.match(/\$\d*/g);  // is undefined if none where found

        if (parameterStrings) {
            for (let i = 0; i < parameterStrings.length; i++) {
                let parameter = parameterStrings[i];
                let n = Number.parseInt(parameter.substring(1));
                if (n > this.maxN) this.maxN = n;
                this.orderedParameters.push({ parameter: parameterStrings[i], n: n, order: i });
            }
        }
    }

    applyToSnippet(resultType: JavaType, range: IRange, _typestore: JavaTypeStore,
        ...snippets: CodeSnippet[]): CodeSnippet {

        if (snippets.length < this.maxN) {
            console.log("SeveralParameterTemplate.applyToSnippet: too few parameters!");
            return new StringCodeSnippet("Error, see console log.", range);
        }

        let appliedTemplate = this.templateString;

        // only pure Terms? => faster variant
        let onlyPureTerms = true;
        for(let snippet of snippets){
            if(!snippet.isPureTerm()){
                onlyPureTerms = false;
                break;
            }
        }

        if(onlyPureTerms){
            for(let parameter of this.orderedParameters){
                appliedTemplate = appliedTemplate.replace(new RegExp('//' + parameter.parameter, 'g'), snippets[parameter.n - 1].emit());
            }            
            return new StringCodeSnippet(appliedTemplate, range, resultType);
        }

        let snippetContainer = new CodeSnippetContainer([], range, resultType);
        
        /*
        * Some snippets may push values to stack. We have to ensure they do this in reversed parameter order so that
        * values get popped in unreversed order.
        */
        let parametersInDescendingOrder = this.orderedParameters.sort((p1, p2) => p2.order - p1.order);
        for (let i = parametersInDescendingOrder.length - 1; i >= 0; i--) {
            let parameter = parametersInDescendingOrder[i];
            snippetContainer.addParts(snippets[parameter.n - 1].allButLastPart());
            appliedTemplate = appliedTemplate.replace(new RegExp('//' + parameter.parameter, 'g'), snippets[parameter.n - 1].lastPartOrPop().emit());
        }

        snippetContainer.addStringPart(appliedTemplate, range, resultType);

        return snippetContainer;

    }

}


export class UnarySuffixTemplate extends CodeTemplate {
    constructor(private operator: TokenType.plusPlus | TokenType.minusMinus) {
        super();
    }

    applyToSnippet(_resultType: JavaType, _range: IRange, _typestore: JavaTypeStore,
        ...snippets: CodeSnippet[]): CodeSnippet {
        let snippet = snippets[0];
        snippet = Unboxer.doUnboxing(snippet);
        if (!snippet.type) return snippet;

        let primitiveTypeIndex = PrimitiveType.getTypeIndex(snippet.type);
        if (!primitiveTypeIndex || primitiveTypeIndex === 0) return snippet; // boolean

        let operatorString = TokenTypeReadable[this.operator];

        if (primitiveTypeIndex > 1) return SnippetFramer.frame(snippet, '$1' + operatorString);

        // char
        return SnippetFramer.frame(snippet, 'String.fromCharCode(($1 = String.fromCharCode(($1.charCodeAt(0) + 1))).charCodeAt(0) - 1)')

    }
}

export class BinaryOperatorTemplate extends CodeTemplate {

    constructor(private operator: string, private isCommutative: boolean) {
        super();
    }

    applyToSnippet(_resultType: JavaType, _range: IRange, _typestore: JavaTypeStore,
        ...snippets: CodeSnippet[]): CodeSnippet {

        snippets[0] = Unboxer.doUnboxing(snippets[0]);
        snippets[1] = Unboxer.doUnboxing(snippets[1]);

        snippets[0] = CharToNumberConverter.convertCharToNumber(snippets[0], _typestore);
        snippets[1] = CharToNumberConverter.convertCharToNumber(snippets[1], _typestore);

        let snippet0IsPure = snippets[0].isPureTerm();
        let snippet1IsPure = snippets[1].isPureTerm();

        if (snippet0IsPure && snippet1IsPure) {
            return new StringCodeSnippet(snippets[0].getPureTerm() + " " + this.operator + " " + snippets[1].getPureTerm(), _range, _resultType);
        }

        if (this.operator == '&&') return lazyEvaluationAND(_resultType, snippets, _range);
        if (this.operator == '||') return lazyEvaluationOR(_resultType, snippets, _range);

        let snippetContainer = new CodeSnippetContainer([], _range, _resultType);


        if (snippet0IsPure || snippet1IsPure) {
            snippetContainer.addParts(snippets[0].allButLastPart());
            snippetContainer.addParts(snippets[1].allButLastPart());
            snippetContainer.addStringPart(`${snippets[0].lastPartOrPop().emit()} ${this.operator} ${snippets[1].lastPartOrPop().emit()}`)
            snippetContainer.finalValueIsOnStack = false;
            return snippetContainer;
        }

        if (['-', '/', '<', '>', '<=', '>='].indexOf(this.operator) >= 0) {
            snippetContainer.addParts(snippets[0].allButLastPart());
            snippetContainer.addParts(snippets[1].allButLastPart());

            switch (this.operator) {
                case '-': snippetContainer.addStringPart(`-s.pop() + s.pop()`, _range); break;
                case '/': snippetContainer.addStringPart(`1/s.pop() * s.pop()`, _range); break;
                case '<': snippetContainer.addStringPart(`pop() > pop()`, _range); break;
                case '>': snippetContainer.addStringPart(`pop() < pop()`, _range); break;
                case '<=': snippetContainer.addStringPart(`pop() >= pop()`, _range); break;
                case '>=': snippetContainer.addStringPart(`pop() <= pop()`, _range); break;
            }
            snippetContainer.finalValueIsOnStack = false;
            return snippetContainer;
        }

        snippets[0].ensureFinalValueIsOnStack();
        snippets[1].ensureFinalValueIsOnStack();
        snippetContainer.addParts(snippets[1]);
        snippetContainer.addParts(snippets[0]);
        snippetContainer.addStringPart(`pop() ${this.operator} pop()`, _range);

        snippetContainer.finalValueIsOnStack = false;
        return snippetContainer;
    }



}

function lazyEvaluationAND(resultType: JavaType, snippets: CodeSnippet[], range: IRange): CodeSnippetContainer {

    let snippetContainer = new CodeSnippetContainer([], range, resultType);
    snippetContainer.type = resultType;

    snippetContainer.addParts(snippets[0].allButLastPart());

    let label = new LabelCodeSnippet();
    snippetContainer.addStringPart(`if(!s.pop()){s.push(false);`, range);
    snippetContainer.addParts(label.getJumpToSnippet());
    snippetContainer.addStringPart('\n}', range);

    snippetContainer.addNextStepMark();

    snippets[1].ensureFinalValueIsOnStack();
    snippetContainer.addParts(snippets[1]);

    snippetContainer.addParts(label);

    return snippetContainer;
}

function lazyEvaluationOR(resultType: JavaType, snippets: CodeSnippet[], range: IRange): CodeSnippetContainer {

    let snippetContainer = new CodeSnippetContainer([], range, resultType);
    snippetContainer.type = resultType;

    snippetContainer.addParts(snippets[0].allButLastPart());

    let label = new LabelCodeSnippet();
    snippetContainer.addStringPart(`if(s.pop()){s.push(true);`, range);
    snippetContainer.addParts(label.getJumpToSnippet());
    snippetContainer.addStringPart('\n}', range);

    snippetContainer.addNextStepMark();

    snippets[1].ensureFinalValueIsOnStack();
    snippetContainer.addParts(snippets[1]);

    snippetContainer.addParts(label);

    return snippetContainer;
}

