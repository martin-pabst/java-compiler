import { TokenType } from "../TokenType";

export type LdToken = {
    tt: TokenType,
    value: string
}



export class LibraryDeclarationLexer {


    static keywordToTokenTypeMap: {[keyword: string]: TokenType} = {
        "class": TokenType.keywordClass,
        "enum": TokenType.keywordEnum,
        "interface": TokenType.keywordInterface,
        "extends": TokenType.keywordExtends,
        "implements": TokenType.keywordImplements,
        "public": TokenType.keywordPublic,
        "protected": TokenType.keywordProtected,
        "private": TokenType.keywordPrivate,
        "static": TokenType.keywordStatic            
    }

    
    constructor() {
    }
    
    lex(declaration: string): LdToken[] {
        let tokens: LdToken[] = [];
        let cpos: number = 0;

        let currentIdentifier: string = '';
        while (cpos < declaration.length) {
            let c = declaration.charAt(cpos);
            switch (c) {
                case '(': tokens.push({ tt: TokenType.leftBracket, value: '(' }); break;
                case ')': tokens.push({ tt: TokenType.rightBracket, value: ')' }); break;
                case '<': tokens.push({ tt: TokenType.lower, value: '<' }); break;
                case '>': tokens.push({ tt: TokenType.greater, value: '>' }); break;
                case ',': tokens.push({ tt: TokenType.comma, value: ',' }); break;
                case '&': tokens.push({tt: TokenType.ampersand, value: '&'}); break;
                case ' ':
                case '\n':
                case '\r':
                    if (currentIdentifier != '') {
                        this.pushIdentifierOrKeyword(currentIdentifier, tokens);                        
                        currentIdentifier = '';
                    }
                    break;
                default: currentIdentifier += c;
            }
            
            cpos++;
        }

        if (currentIdentifier != '') {
            this.pushIdentifierOrKeyword(currentIdentifier, tokens);
        }

        return tokens;
    }

    pushIdentifierOrKeyword(id: string, tokens: LdToken[]){
        let tt = LibraryDeclarationLexer.keywordToTokenTypeMap[id];
        if(tt){
            tokens.push({tt: tt, value: id});
        } else {
            tokens.push({tt: TokenType.identifier, value: id});
        }
    }

}