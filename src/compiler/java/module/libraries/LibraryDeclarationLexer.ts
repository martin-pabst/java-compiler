import { TokenType } from "../../TokenType";

export type LdToken = {
    tt: TokenType,
    value: string
}



export class LibraryDeclarationLexer {


    static keywordToTokenTypeMap: Map<string, TokenType> = 
    new Map(
        [
            ["class", TokenType.keywordClass],
            ["enum", TokenType.keywordEnum],
            ["interface", TokenType.keywordInterface],
            ["extends", TokenType.keywordExtends],
            ["super", TokenType.keywordSuper],
            ["implements", TokenType.keywordImplements],
            ["public", TokenType.keywordPublic],
            ["protected", TokenType.keywordProtected],
            ["private", TokenType.keywordPrivate],
            ["static", TokenType.keywordStatic],
            ["abstract", TokenType.keywordAbstract],
            ["default", TokenType.keywordDefault],
            ["final", TokenType.keywordFinal],
        ]

    );

    static specialTokenMap: { [character: string]: TokenType } = {
        "(": TokenType.leftBracket,
        ")": TokenType.rightBracket,
        "[": TokenType.leftSquareBracket,
        "]": TokenType.rightSquareBracket,
        "<": TokenType.lower,
        ">": TokenType.greater,
        ",": TokenType.comma,
        "&": TokenType.ampersand,
        ":": TokenType.colon,
        " ": TokenType.space,
        "\n": TokenType.space,
        "\r": TokenType.space,
        ".": TokenType.dot
    }

    constructor() {
    }

    lex(declaration: string): LdToken[] {
        let tokens: LdToken[] = [];
        let cpos: number = 0;

        let currentIdentifier: string = '';
        while (cpos < declaration.length) {
            let c = declaration.charAt(cpos);
            let tt = LibraryDeclarationLexer.specialTokenMap[c];
            if (tt) {
                if (currentIdentifier != '') {
                    this.pushIdentifierOrKeyword(currentIdentifier, tokens);
                    currentIdentifier = '';
                }
                switch(tt){
                    case TokenType.space:
                        break;
                    case TokenType.dot:
                        if(this.safeCharAt(declaration, cpos + 1) == "." && this.safeCharAt(declaration, cpos + 2) == "."){
                            cpos += 2;
                            tokens.push({tt: TokenType.ellipsis, value: "..."});
                        } else {
                            tokens.push({ tt: tt, value: c });
                        }
                        break;
                    default:
                        tokens.push({ tt: tt, value: c });
                }
            } else {
                currentIdentifier += c;
            }
            cpos++;
        }

        if (currentIdentifier != '') {
            this.pushIdentifierOrKeyword(currentIdentifier, tokens);
        }

        return tokens;
    }

    safeCharAt(s: string, index: number): string {
        if(index >= 0 && index < s.length) return s.charAt(index);
        return "";
    }

    pushIdentifierOrKeyword(id: string, tokens: LdToken[]) {
        let tt = LibraryDeclarationLexer.keywordToTokenTypeMap.get(id);
        if (tt) {
            tokens.push({ tt: tt, value: id });
        } else {
            tokens.push({ tt: TokenType.identifier, value: id });
        }
    }

}