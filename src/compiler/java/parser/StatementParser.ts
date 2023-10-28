import { Module } from "../../common/module/module.ts";
import { Token } from "../Token.ts";
import { TokenType } from "../TokenType.ts";
import { ASTForLoopNode, ASTIfNode, ASTReturnNode, ASTSimpifiedForLoopNode, ASTStatementNode, ASTSwitchCaseNode, ASTTermNode, ASTTryCatchNode, ASTTypeNode, ASTWhileNode } from "./AST.ts";
import { TermParser } from "./TermParser.ts";

export class StatementParser extends TermParser {

    constructor(protected module: Module) {
        super(module);
    }

    parseStatementOrExpression(expectSemicolonAfterStatement: boolean = true): ASTStatementNode | undefined {

        switch (this.tt) {
            case TokenType.keywordWhile:
                return this.parseWhile();
            case TokenType.keywordIf:
                return this.parseIf();
            case TokenType.leftCurlyBracket:
                return this.parseBlock();
            case TokenType.keywordFor:
                return this.parseFor();
            case TokenType.keywordSwitch:
                return this.parseSwitch();
            case TokenType.keywordBreak:
                return this.nodeFactory.buildBreakNode(this.getAndSkipToken());
            case TokenType.keywordContinue:
                return this.nodeFactory.buildContinueNode(this.getAndSkipToken());
            case TokenType.keywordTry:
                return this.parseTryCatch();
            case TokenType.keywordReturn:
                return this.parseReturn();
            default:
                let statement = this.parseVariableDeclarationOrTerm();
                if( (expectSemicolonAfterStatement && !this.expectSemicolon(true, true))
                      || !statement){
                    this.skipTillNextTokenAfter([TokenType.semicolon, TokenType.newline, TokenType.rightCurlyBracket]);
                }
                return statement;
        }

    }

    parseVariableDeclarationOrTerm(): ASTStatementNode | undefined {
        
        if(this.analyzeIfVariableDeclarationAhead()){
            return this.parseLocalVariableDeclaration();
        } else {
            return this.parseTerm();
        }
    }

    parseLocalVariableDeclaration(): ASTStatementNode | undefined {
        let type = this.parseType();
        let identifer = this.expectAndSkipIdentifierAsToken();
        let initialization: ASTTermNode | undefined = undefined;
        if(this.comesToken(TokenType.assignment, true)){
            initialization = this.parseTerm();
        }       

        if(type && identifer){
            return this.nodeFactory.buildLocalVariableDeclaration(type, identifer, initialization);
        }

        return undefined;
    }

    parseWhile(): ASTWhileNode | undefined {

        let whileToken = this.getAndSkipToken();

        if (this.comesToken(TokenType.leftBracket, true)) {
            let condition = this.parseTerm();
            this.expect(TokenType.rightBracket);

            let statementToRepeat = this.parseStatementOrExpression();

            if (condition && statementToRepeat) {

                return this.nodeFactory.buildWhileNode(whileToken,
                    this.cct, condition, statementToRepeat);

            }

        } else {
            this.skipTokensTillEndOfLineOr([TokenType.rightBracket]);
        }

        return undefined;

    }

    parseIf(): ASTIfNode | undefined {

        let ifToken = this.getAndSkipToken();

        if (this.comesToken(TokenType.leftBracket, true)) {
            let condition = this.parseTerm();
            this.expect(TokenType.rightBracket);

            let statementIfTrue = this.parseStatementOrExpression();

            let statementIfFalse: ASTStatementNode | undefined;

            if (this.comesToken(TokenType.keywordElse, true)) {

                statementIfFalse = this.parseStatementOrExpression();
            }

            if (condition && statementIfTrue) {

                return this.nodeFactory.buildIfNode(ifToken,
                    this.cct, condition, statementIfTrue, statementIfFalse);

            }

        } else {
            this.skipTokensTillEndOfLineOr([TokenType.rightBracket]);
        }

        return undefined;

    }

    parseBlock() {
        let blockNode = this.nodeFactory.buildBlockNode(this.cct);
        this.nextToken(); // skip {

        while (!this.isEnd() && this.tt != TokenType.rightCurlyBracket) {
            let statement = this.parseStatementOrExpression();
            if (statement) blockNode.statements.push(statement);
        }

        this.expect(TokenType.rightCurlyBracket, true);

        return blockNode;
    }

    parseFor(): ASTForLoopNode | ASTSimpifiedForLoopNode | undefined {
        let tokenFor = this.getAndSkipToken();  // preserve first token to compute range later on

        if (!this.expect(TokenType.leftBracket, true)) return undefined;

        // We have to differentiate between for(int i = 0; i < 10; i++) and for(<Type> <id>: <Term>)
        // therefore we parse till ) and look for :
        let colonFound = this.lookForTokenTillOtherToken(TokenType.colon, [TokenType.rightBracket, TokenType.leftCurlyBracket, TokenType.rightCurlyBracket]);
        if (colonFound) return this.parseSimplifiedForLoop(tokenFor);

        let firstStatement = this.parseStatementOrExpression(false);
        this.expect(TokenType.semicolon, true);
        let condition = this.parseTerm();
        this.expect(TokenType.semicolon, true);
        let lastStatement = this.parseTerm();
        this.expect(TokenType.rightBracket, true);
        let statementToRepeat = this.parseStatementOrExpression(false);

        if (!statementToRepeat)
        {
            this.pushError("Hier wird eine Anweisung oder ein Anweisungsblock (in geschweiften Klammern) erwartet.");
            return undefined;
        }

        return this.nodeFactory.buildForLoopNode(tokenFor, firstStatement, condition, lastStatement, statementToRepeat);

    }

    parseSimplifiedForLoop(tokenFor: Token): ASTSimpifiedForLoopNode | undefined {
        // for and ( are already parsed
        let elementType = this.parseType();
        let elementIdentifier = this.expectAndSkipIdentifierAsToken();
        this.expect(TokenType.colon, true);
        let collection = this.parseTerm();
        this.expect(TokenType.rightBracket);
        let statementToRepeat = this.parseStatementOrExpression();

        if (!statementToRepeat)
        {
            this.pushError("Hier wird eine Anweisung oder ein Anweisungsblock (in geschweiften Klammern) erwartet.");
            return undefined;
        }

        if (elementType && elementIdentifier && collection && statementToRepeat) {
            return this.nodeFactory.buildSimplifiedForLoop(tokenFor, elementType, elementIdentifier, collection, statementToRepeat);
        }

        return undefined;
    }

    parseSwitch(): ASTSwitchCaseNode | undefined {
        let switchToken = this.getAndSkipToken(); // preserve for later to compute range
        if (!this.expect(TokenType.leftBracket, true)) return;
        let term = this.parseTerm();
        this.expect(TokenType.rightBracket, true);
        if (!this.expect(TokenType.leftCurlyBracket, true) || !term) return undefined;

        let switchNode = this.nodeFactory.buildSwitchCaseNode(switchToken, term);
        while(this.comesToken([TokenType.keywordCase, TokenType.keywordDefault], true)){
            let isCase = this.tt == TokenType.keywordCase;
            let caseDefaultToken = this.cct;
            this.nextToken(); // skip case or default
            let constant = isCase ? this.parseTerm() : undefined;
            this.expect(TokenType.colon, true);
 
            let caseNode = this.nodeFactory.buildCaseNode(caseDefaultToken, constant);
            while(!this.isEnd() && !this.comesToken([TokenType.keywordCase, TokenType.keywordDefault, TokenType.rightCurlyBracket], true)){
                let statement = this.parseStatementOrExpression();
                if(statement) caseNode.statements.push(statement);
            }
            this.setEndOfRange(caseNode);
            if(isCase){
                switchNode.caseNodes.push(caseNode);
            } else {
                switchNode.defaultNode = caseNode;
            }
        }

        this.expect(TokenType.rightCurlyBracket, true);
        this.setEndOfRange(switchNode);
        return switchNode;
    }

    parseTryCatch(): ASTTryCatchNode | undefined {
        let tryToken = this.getAndSkipToken();
        let statement = this.parseStatementOrExpression();
        if(!statement) return undefined;
        let tryNode = this.nodeFactory.buildTryCatchNode(tryToken, statement);

        while(this.comesToken(TokenType.keywordCatch, false)){
            let catchToken = this.getAndSkipToken();
            if(!this.expect(TokenType.leftBracket, true)) continue;
            let exceptionTypes: ASTTypeNode[] = [];
            do {
                let type = this.parseType();
                if(type) exceptionTypes.push(type);
            } while(this.comesToken(TokenType.OR, true))
            let identifier = this.expectAndSkipIdentifierAsToken();
            if(!this.expect(TokenType.rightBracket, true)) continue;
            let statement = this.parseStatementOrExpression();
            if(exceptionTypes.length > 0 && identifier && statement){
                tryNode.catchCases.push(this.nodeFactory.buildCatchNode(catchToken, exceptionTypes, identifier, statement));
            }            
        }

        return tryNode;
    }

    parseReturn(): ASTReturnNode {
        let returnToken = this.getAndSkipToken();
        
        let term = this.tt == TokenType.semicolon ? undefined : this.parseTerm();

        return this.nodeFactory.buildReturnNode(returnToken, term);

    }

}