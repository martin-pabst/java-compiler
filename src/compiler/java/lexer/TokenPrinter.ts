import { DOM } from "../../../tools/DOM";
import { TokenType } from "../TokenType";
import { TokenList } from "./Token";

import '/include/css/tokenprinter.css';

export class TokenPrinter {

    static typesWithContent: TokenType[] = [
        TokenType.identifier, TokenType.stringLiteral,
        TokenType.floatLiteral, TokenType.integerLiteral,
        TokenType.charLiteral
    ]

    public static print(tokens: TokenList, parentDiv: HTMLElement){

        DOM.clear(parentDiv);
        if(tokens.length == 0) return;


        let tokenDiv = DOM.makeDiv(parentDiv, 'jo_tokenprinter_tokendiv')
        
        let lineDiv = DOM.makeDiv(tokenDiv, 'jo_tokenprinter_tokenline');
        let linenumberDiv = DOM.makeDiv(lineDiv, 'jo_tokenprinter_linenumber');

        let lineNumber: number = tokens[0].range.startLineNumber;
        linenumberDiv.textContent = "" + lineNumber;

        for(let t of tokens){
            if(t.range.startLineNumber != lineNumber){
                lineDiv = DOM.makeDiv(tokenDiv, 'jo_tokenprinter_tokenline');
                linenumberDiv = DOM.makeDiv(lineDiv, 'jo_tokenprinter_linenumber');
                lineNumber = t.range.startLineNumber;
                linenumberDiv.textContent = "" + lineNumber;
            }
            
            let tokend = DOM.makeDiv(lineDiv, 'jo_tokenprinter_token');

            let withContent = TokenPrinter.typesWithContent.indexOf(t.tt) >= 0;

            let ttSpan = DOM.makeSpan(tokend, 'jo_tokenprinter_tokentype');
            ttSpan.textContent = "[" + TokenType[t.tt] + (withContent ? "" : "]");

            if(TokenPrinter.typesWithContent.indexOf(t.tt) >= 0){
                let contentSpan = DOM.makeSpan(tokend, 'jo_tokenprinter_text');
                contentSpan.innerHTML = (" " + t.value).replace(/ /g, '&nbsp;').replace(/</g,'&lt;');    

                DOM.makeSpan(tokend, 'jo_tokenprinter_tokentype').textContent = ']';                                

            }

        }


    }


}