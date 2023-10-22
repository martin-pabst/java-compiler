import { Error, ErrorLevel, QuickFix } from "../../common/Error";
import { IRange } from "../../common/range/Range";
import { Token, TokenList } from "../Token";
import { TokenType, TokenTypeReadable } from "../TokenType";

export class TokenIterator {
    pos: number = 0;        // current index in tokens

    dummy: Token = {
        range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 },
        tt: TokenType.comment,
        value: ""
    }

    ct: Token[] = [];
    lastToken: Token = this.dummy;
    cct: Token = this.dummy;
    tt: TokenType = TokenType.comment;
    lastComment?: Token;

    endToken: Token;

    errorList: Error[] = [];

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



    constructor(private tokenList: TokenList, private lookahead: number) {
        this.endToken = tokenList[tokenList.length - 1];
        this.initializeLookahead();
    }

    initializeLookahead() {

        this.ct = [];
        this.pos = 0;

        for (let i = 0; i < this.lookahead; i++) {

            let token: Token = this.endToken;

            while (true) {

                if (this.pos >= this.tokenList.length) break;

                let token1 = this.tokenList[this.pos]
                if (token1.tt == TokenType.comment) {
                    this.lastComment = token1;
                }

                if (token1.tt != TokenType.newline && token1.tt != TokenType.space && token1.tt != TokenType.comment) {
                    token = token1;
                    if (this.lastComment != null) {
                        token.commentBefore = this.lastComment;
                        this.lastComment = undefined;
                    }
                    break;
                }

                this.pos++;

            }

            this.ct.push(token);

            if (i < this.lookahead - 1) {
                this.pos++;
            }

        }

        this.cct = this.ct[0];
        this.tt = this.cct.tt;

    }

    nextToken() {

        let token: Token;
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

        for (let i = 0; i < this.lookahead - 1; i++) {
            this.ct[i] = this.ct[i + 1];
        }

        this.ct[this.lookahead - 1] = token;

        this.cct = this.ct[0];
        this.tt = this.cct.tt;

    }


    pushError(message: string, errorLevel: ErrorLevel = "error", range?: IRange, quickFix?: QuickFix) {
        if (range == null) range = Object.assign({}, this.cct.range);
        this.errorList.push({
            message: message,
            range: range,
            quickFix: quickFix,
            level: errorLevel
        });
    }

    expect(tt: TokenType, skip: boolean = true, invokeSemicolonAngel: boolean = false): boolean {
        if (this.tt != tt) {
            if (tt == TokenType.semicolon && this.tt == TokenType.endofSourcecode) {
                return true;
            }

            let quickFix: QuickFix | undefined = undefined;
            let range: IRange = this.cct.range;
            if (tt == TokenType.semicolon && this.lastToken != null) {

                if (this.lastToken.range.endLineNumber < this.cct.range.startLineNumber) {
                    range = {
                        startLineNumber: this.lastToken.range.endLineNumber,
                        startColumn: this.lastToken.range.endColumn,
                        endLineNumber: this.lastToken.range.endLineNumber,
                        endColumn: this.lastToken.range.endColumn
                    }

                    if (tt == TokenType.semicolon && !this.isOperatorOrDot(this.lastToken.tt)
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

                        if (invokeSemicolonAngel && this.errorList.length < 3) {
                            //this.module.main.getSemicolonAngel().register(range, this.module);
                        }
                    }

                }


            }



            this.pushError("Erwartet wird: " + TokenTypeReadable[tt] + " - Gefunden wurde: " + TokenTypeReadable[this.tt], "error",
               range, quickFix);
            return false;
        }

        if (skip) {
            this.nextToken();
        }

        return true;
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

    comesToken(token: TokenType | TokenType[]): boolean {

        if (!Array.isArray(token)) {
            return this.tt == token;
        }

        return token.indexOf(this.tt) >= 0;

    }

    getCurrentRangeCopy(): IRange {
        return Object.assign({}, this.cct.range);
    }



}