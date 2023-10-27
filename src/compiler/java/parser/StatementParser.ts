import { Module } from "../../common/module/module.ts";
import { TokenType } from "../TokenType.ts";
import { ASTIfNode, ASTStatementNode, ASTWhileNode } from "./AST.ts";
import { TermParser } from "./TermParser.ts";

export class StatementParser extends TermParser {
    
    constructor(protected module: Module) {
        super(module);
    }
    
    parseStatementOrExpression(): ASTStatementNode | undefined {

        switch(this.tt){
            case TokenType.keywordWhile:
                    return this.parseWhile();
            case TokenType.keywordIf: 
                    return this.parseIf();
            default:
                let statement = this.parseTerm();
                this.expectSemicolon(true, true);
                return statement;
        }

    }

    parseWhile(): ASTWhileNode | undefined {

        let whileToken = this.cct;
        this.nextToken();

        if(this.comesToken(TokenType.leftBracket, true)){
            let condition = this.parseTerm();
            this.expect(TokenType.rightBracket);

            let statementToRepeat = this.parseStatementOrExpression();

            if(condition && statementToRepeat){

                return this.nodeFactory.buildWhileNode(whileToken, 
                    this.cct, condition, statementToRepeat);

            }

        } else {
            this.skipTokensTillEndOfLineOr([TokenType.rightBracket]);
        }

        return undefined;

    }

    parseIf(): ASTIfNode | undefined {

        let ifToken = this.cct;
        this.nextToken();

        if(this.comesToken(TokenType.leftBracket)){
            let condition = this.parseTerm();
            this.expect(TokenType.rightBracket);

            let statementIfTrue = this.parseStatementOrExpression();
            
            let statementIfFalse: ASTStatementNode | undefined;
            
            if(this.comesToken(TokenType.keywordElse), true){
                
                statementIfFalse = this.parseStatementOrExpression();
            }

            if(condition && statementIfTrue){

                return this.nodeFactory.buildIfNode(ifToken, 
                    this.cct, condition, statementIfTrue, statementIfFalse);

            }

        } else {
            this.skipTokensTillEndOfLineOr([TokenType.rightBracket]);
        }

        return undefined;

    }

}