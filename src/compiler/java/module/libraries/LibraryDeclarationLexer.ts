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
        "<": TokenType.lower,
        ">": TokenType.greater,
        ",": TokenType.comma,
        "&": TokenType.ampersand,
        ":": TokenType.colon,
        " ": TokenType.space,
        "\n": TokenType.space,
        "\r": TokenType.space
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
                if (tt != TokenType.space) {
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

    pushIdentifierOrKeyword(id: string, tokens: LdToken[]) {
        let tt = LibraryDeclarationLexer.keywordToTokenTypeMap.get(id);
        if (tt) {
            tokens.push({ tt: tt, value: id });
        } else {
            tokens.push({ tt: TokenType.identifier, value: id });
        }
    }

}