import { Error, ErrorLevel, QuickFix } from "../../common/Error";
import { IRange } from "../../common/range/Range";
import { Token, TokenList } from "../Token";
import { TokenType, TokenTypeReadable } from "../TokenType";
import { ASTNode } from "./AST";

export class TokenIterator {
    pos: number = 0;        // current index in tokens

    dummy: Token = {
        range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 },
        tt: TokenType.comment,
        value: ""
    }

    lookahead: Token[] = [];
    lastToken: Token = this.dummy;
    cct: Token = this.dummy;                // current token
    tt: TokenType = TokenType.comment;      // current tokentype
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



    constructor(private tokenList: TokenList, private lookaheadLength: number) {
        this.endToken = tokenList[tokenList.length - 1];
        this.initializeLookahead();
    }

    initializeLookahead() {

        this.lookahead = [];
        this.pos = 0;

        for (let i = 0; i < this.lookaheadLength; i++) {

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

            this.lookahead.push(token);

            if (i < this.lookaheadLength - 1) {
                this.pos++;
            }

        }

        this.cct = this.lookahead[0];
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

        for (let i = 0; i < this.lookaheadLength - 1; i++) {
            this.lookahead[i] = this.lookahead[i + 1];
        }

        this.lookahead[this.lookaheadLength - 1] = token;

        this.cct = this.lookahead[0];
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

    expect(tt: TokenType | TokenType[], skipIfTrue: boolean = true): boolean {

        if (!Array.isArray(tt)){
            if(this.tt == tt){
                if(skipIfTrue) this.nextToken();
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

                        if (invokeSemicolonAngel && this.errorList.length < 3) {
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

    expectAndSkipIdentifierAsString(): string {
        if(this.tt == TokenType.identifier){
            let identifier: string = <string>this.cct.value;
            this.nextToken();
            return identifier;
        }

        this.pushError("Erwartet wird ein Bezeichner (engl.: 'identifier'), d.h. der Name einer Klasse, Variable, ... - Gefunden wurde: " + this.cct.value);
        return "";
    }

    expectAndSkipIdentifierAsToken(): Token {
        if(this.tt == TokenType.identifier){
            return this.lastToken;
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

    comesToken(token: TokenType | TokenType[], skipIfTrue: boolean = false): boolean {

        // comestoken is called very often, so we try to implement this in a performant way:
        if (!Array.isArray(token)) {
            if(!skipIfTrue) return this.tt == token;
            if(this.tt == token){
                this.nextToken();
                return true;
            }            
            return false;
        }

        // token is of type TokenType[]
        if(!skipIfTrue) return token.indexOf(this.tt) >= 0;

        if(token.indexOf(this.tt) >= 0){
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

    comesIdentifier(identifier: string){
        return this.tt == TokenType.identifier && this.cct.value == identifier;
    }


    findTokenTypeAfterCorrespondingRightBracket(): TokenType {
        let p = this.pos + 1; // skip left bracket
        let depth = 1;
        while(p < this.tokenList.length && depth > 0){
            switch(this.tokenList[p++].tt){
                case TokenType.leftBracket: depth++;
                break;
                case TokenType.rightBracket: depth--;
            }
        }

        if(depth == 0 && p < this.tokenList.length){
            return this.tokenList[p].tt;
        }

        return TokenType.endofSourcecode;

    }


}