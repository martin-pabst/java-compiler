import { ErrorLevel, QuickFix } from "../../common/Error";
import { IRange } from "../../common/range/Range";
import { Token, TokenList } from "../lexer/Token";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { TokenType, TokenTypeReadable } from "../TokenType";
import { ASTNode } from "./AST";

export class TokenIterator {

    static possibleTokensInsideVariableDeclaration: TokenType[] = [
        TokenType.identifier, TokenType.linefeed, TokenType.newline,
        TokenType.space, TokenType.comment,
        TokenType.lower, TokenType.greater, TokenType.dot,
        TokenType.leftRightSquareBracket, TokenType.comma,
        TokenType.keywordVar, TokenType.ternaryOperator,
        TokenType.keywordExtends, TokenType.keywordSuper
    ]

    static spaceTokenTypes: TokenType[] = [
        TokenType.space, TokenType.comment, TokenType.linefeed, TokenType.newline
    ]


    pos: number = 0;        // current index in tokens

    dummy: Token = {
        range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 },
        tt: TokenType.comment,
        value: ""
    }

    lastToken: Token = this.dummy;
    cct: Token = this.dummy;                // current token
    tt: TokenType = TokenType.comment;      // current tokentype
    lastComment?: Token;

    endToken: Token;

    static operators = [
        TokenType.assignment, TokenType.plusAssignment, TokenType.minusAssignment,
        TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment,
        TokenType.ANDAssigment, TokenType.XORAssigment, TokenType.ORAssigment,
        TokenType.shiftLeftAssigment, TokenType.shiftRightAssigment, TokenType.shiftRightUnsignedAssigment,
        TokenType.ternaryOperator, TokenType.colon,

        TokenType.or, TokenType.and, TokenType.OR, TokenType.XOR, TokenType.ampersand,
        TokenType.equal, TokenType.notEqual,
        TokenType.keywordInstanceof, TokenType.lower, TokenType.lowerOrEqual, TokenType.greater, TokenType.greaterOrEqual,
        TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned,

        TokenType.plus, TokenType.minus, TokenType.multiplication, TokenType.division, TokenType.modulo
    ];



    constructor(private tokenList: TokenList, protected module: JavaBaseModule) {
        this.endToken = tokenList[tokenList.length - 1];
        this.pos = -1;
        this.nextToken(); // fetch first non-space token
    }


    getAndSkipToken(): Token {
        this.nextToken();
        return this.lastToken;
    }

    getRangeAndThenSkipToken(): IRange {
        let range = this.cct.range;
        this.nextToken();
        return range;
    }

    getAndSkipTokenWithSemicolon(): Token {
        let token = this.cct;
        this.nextToken();
        this.expectSemicolon();
        return token;
    }

    nextToken() {

        let token: Token;

        if (this.pos >= this.tokenList.length) return;

        this.lastToken = this.cct;

        while (true) {

            this.pos++;

            if (this.pos >= this.tokenList.length) {
                token = this.endToken;
                break;
            }

            token = this.tokenList[this.pos]
            if (token.tt == TokenType.comment) {
                this.lastComment = token;
            }

            if (token.tt != TokenType.newline && token.tt != TokenType.space && token.tt != TokenType.comment) {
                token.commentBefore = this.lastComment;
                this.lastComment = undefined;
                break;
            }

        }

        this.cct = token;
        this.tt = this.cct.tt;

    }

    /**
     * Looks n tokens ahead, omitting space, comments and newLine
     * n == 0 => return current token
     * @param n 
     */
    lookahead(n: number): Token {
        let k = n;
        let pos = this.pos;
        let token = this.cct;

        while (k > 0 && pos < this.tokenList.length) {
            pos++;
            let t: Token = this.tokenList[pos];
            if (TokenIterator.spaceTokenTypes.indexOf(t.tt) < 0) {
                k--;
                token = t;
            }
        }

        return token;
    }

    pushErrorAndSkipToken() {
        this.pushError("Das Token '" + this.cct.value + "' wird hier nicht erwartet.", "error");
        this.nextToken();
    }

    skipTokensTillEndOfLineOr(skippedTokens: TokenType | TokenType[], skipFoundToken: boolean = true) {
        if (!Array.isArray(skippedTokens)) skippedTokens = [skippedTokens];
        skippedTokens.push(TokenType.linefeed, TokenType.newline);
        while (this.pos < this.tokenList.length && skippedTokens.indexOf(this.tokenList[this.pos].tt) < 0) {
            this.pos++;
        }
        if (this.pos < this.tokenList.length && skipFoundToken) {
            this.nextToken();
        }

    }


    pushError(message: string, errorLevel: ErrorLevel = "error", range?: IRange, quickFix?: QuickFix) {
        if (range == null) range = Object.assign({}, this.cct.range);
        this.module.errors.push({
            message: message,
            range: range,
            quickFix: quickFix,
            level: errorLevel
        });
    }

    expect(tt: TokenType | TokenType[], skipIfTrue: boolean = true): boolean {

        if (!Array.isArray(tt)) {
            if (this.tt == tt) {
                if (skipIfTrue) this.nextToken();
                return true;
            }
            this.pushError("Erwartet wird: " + TokenTypeReadable[tt] + " - Gefunden wurde: " + this.cct.value, "error");
            return false;
        }

        if (tt.indexOf(this.tt) >= 0) {
            if (skipIfTrue) this.nextToken();
            return true;
        }

        let tokenListReadable = tt.map(tt1 => TokenTypeReadable[tt1]).join(", ");

        this.pushError("Erwartet wird eines der Token (" + tokenListReadable + ") - Gefunden wurde: " + TokenTypeReadable[this.tt], "error");
        return false;
    }

    expectSemicolon(skip: boolean = true, invokeSemicolonAngel: boolean = false): boolean {
        if (this.tt == TokenType.semicolon) {
            if (skip) {
                this.nextToken();
            }

            return true;
        }
        else {
            if (this.tt == TokenType.endofSourcecode) {
                return true;
            }

            let quickFix: QuickFix | undefined = undefined;
            let range: IRange = this.cct.range;
            if (this.lastToken != null) {

                if (this.lastToken.range.endLineNumber < this.cct.range.startLineNumber) {
                    range = {
                        startLineNumber: this.lastToken.range.endLineNumber,
                        startColumn: this.lastToken.range.endColumn,
                        endLineNumber: this.lastToken.range.endLineNumber,
                        endColumn: this.lastToken.range.endColumn
                    }

                    if (!this.isOperatorOrDot(this.lastToken.tt)
                    ) {
                        quickFix = {
                            title: 'Strichpunkt hier einfügen',
                            editsProvider: (uri) => {
                                return [{
                                    resource: uri,
                                    textEdit: {
                                        range: {
                                            startLineNumber: range.startLineNumber, startColumn: range.startColumn,
                                            endLineNumber: range.endLineNumber, endColumn: range.endColumn,
                                            message: "",
                                            severity: monaco.MarkerSeverity.Error
                                        },
                                        text: ";"
                                    },
                                    versionId: 1
                                }
                                ];
                            }
                        }

                        if (invokeSemicolonAngel && this.module.errors.length < 3) {
                            //this.module.main.getSemicolonAngel().register(range, this.module);
                        }
                    }

                }


            }



            this.pushError("Erwartet wird ein Strichpunkt (Semicolon). Gefunden wurde: " + TokenTypeReadable[this.tt], "error",
                range, quickFix);
            return false;
        }

    }

    skipTillNextTokenAfter(tt: TokenType[]) {

        while (this.pos < this.tokenList.length - 1) {
            this.pos++;
            let token = this.tokenList[this.pos];
            if (TokenIterator.spaceTokenTypes.indexOf(token.tt) < 0) {
                this.lastToken = this.cct;
                this.cct = token;
            }
            if (tt.indexOf(token.tt) >= 0) {
                this.nextToken();
                return;
            }
        }
    }

    expectAndSkipIdentifierAsString(): string {
        if (this.tt == TokenType.identifier) {
            let identifier: string = <string>this.cct.value;
            this.nextToken();
            return identifier;
        }

        this.pushError("Erwartet wird ein Bezeichner (engl.: 'identifier'), d.h. der Name einer Klasse, Variable, ... - Gefunden wurde: " + this.cct.value);
        return "";
    }

    expectAndSkipIdentifierAsToken(): Token {
        if (this.tt == TokenType.identifier) {
            let t = this.cct;
            this.nextToken();
            return t;
        }

        this.pushError("Erwartet wird ein Bezeichner (engl.: 'identifier'), d.h. der Name einer Klasse, Variable, ... - Gefunden wurde: " + this.cct.value);

        return {
            tt: TokenType.identifier,
            value: "",
            range: this.cct.range
        };
    }

    isOperatorOrDot(tt: TokenType): boolean {
        if (tt == TokenType.dot) return true;
        for (let op of TokenIterator.operators) {
            if (tt == op) return true;
        }
        return false;
    }

    isEnd(): boolean {
        return this.cct == this.endToken;
    }

    comesToken(token: TokenType | TokenType[], skipIfTrue: boolean): boolean {

        // comestoken is called very often, so we try to implement this in a performant way:
        if (!Array.isArray(token)) {
            if (!skipIfTrue) return this.tt == token;
            if (this.tt == token) {
                this.nextToken();
                return true;
            }
            return false;
        }

        // token is of type TokenType[]
        if (!skipIfTrue) return token.indexOf(this.tt) >= 0;

        if (token.indexOf(this.tt) >= 0) {
            this.nextToken();
            return true;
        }

        return false;

    }

    getCurrentRangeCopy(): IRange {
        return Object.assign({}, this.cct.range);
    }

    setEndOfRange(node: ASTNode): ASTNode {
        let r1 = node.range;
        let lastRange = this.lastToken.range;

        node.range = {
            startLineNumber: r1.startLineNumber,
            startColumn: r1.startColumn,
            endLineNumber: lastRange.endLineNumber,
            endColumn: lastRange.endColumn
        }

        return node;
    }

    comesIdentifier(identifier: string) {
        return this.tt == TokenType.identifier && this.cct.value == identifier;
    }


    findTokenTypeAfterCorrespondingRightBracket(): TokenType {
        let p = this.pos + 1; // skip left bracket
        let depth = 1;
        while (p < this.tokenList.length && depth > 0) {
            switch (this.tokenList[p++].tt) {
                case TokenType.leftBracket: depth++;
                    break;
                case TokenType.rightBracket: depth--;
            }
        }

        if (depth == 0) {
            while (p < this.tokenList.length && TokenIterator.spaceTokenTypes.indexOf(this.tokenList[p].tt) >= 0) {
                p++;
            }

            if (p < this.tokenList.length) {
                return this.tokenList[p].tt;
            }
        }

        return TokenType.endofSourcecode;

    }

    lookForTokenTillOtherToken(tokensToLookFor: TokenType | TokenType[], tillToken: TokenType | TokenType[]): TokenType | null {
        if (!Array.isArray(tokensToLookFor)) tokensToLookFor = [tokensToLookFor];
        if (!Array.isArray(tillToken)) tillToken = [tillToken];

        let pos1: number = this.pos;
        while (pos1 < this.tokenList.length) {
            let tt = this.tokenList[pos1].tt;
            if (tokensToLookFor.indexOf(tt) >= 0) return tt;
            if(tillToken.indexOf(tt) >= 0) break;
            pos1++;
        }

        return null;

    }

    analyzeIfVariableDeclarationAhead(): boolean {

        if(this.tt == TokenType.keywordFinal) return true;

        let pos = this.pos;
        let nonSpaceTokenTypesFound: TokenType[] = [];

        while (pos < this.tokenList.length) {
            let token = this.tokenList[pos];
            let tt = token.tt;
            if (tt == TokenType.semicolon || tt == TokenType.assignment) break;
            if (TokenIterator.possibleTokensInsideVariableDeclaration.indexOf(tt) < 0) return false;
            if (TokenIterator.spaceTokenTypes.indexOf(tt) < 0) nonSpaceTokenTypesFound.push(tt);
            pos++;
        }

        let length = nonSpaceTokenTypesFound.length;
        if (length < 2) return false;

        if ([TokenType.identifier, TokenType.leftRightSquareBracket].indexOf(nonSpaceTokenTypesFound[length - 1]) < 0) return false;

        if ([TokenType.identifier, TokenType.greater, TokenType.leftRightSquareBracket, TokenType.keywordVar, TokenType.comma].indexOf(nonSpaceTokenTypesFound[length - 2]) < 0) {
            return false;
        }

        return true;

    }

}