import { EmptyRange, Range } from "../../common/range/Range.ts";
import { JCM } from "../language/JavaCompilerMessages.ts";
import { Token } from "../lexer/Token.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";
import { TokenType } from "../TokenType.ts";
import { ASTDoWhileNode, ASTForLoopNode, ASTIfNode, ASTLocalVariableDeclarations, ASTReturnNode, ASTEnhancedForLoopNode, ASTStatementNode, ASTSwitchCaseNode, ASTTermNode, ASTThrowNode, ASTTryCatchNode, ASTTypeNode, ASTWhileNode, ASTClassDefinitionNode, ASTEnumDefinitionNode, ASTInterfaceDefinitionNode, ASTNodeWithModifiers, ASTSynchronizedBlockNode } from "./AST.ts";
import { TermParser } from "./TermParser.ts";

export abstract class StatementParser extends TermParser {

    protected isCodeOutsideClassdeclarations: boolean = false;

    constructor(module: JavaCompiledModule) {
        super(module);
    }

    parseStatementOrExpression(expectSemicolonAfterStatement: boolean = true): ASTStatementNode | undefined {

        switch (this.tt) {
            case TokenType.keywordWhile:
                return this.parseWhile();
            case TokenType.keywordDo:
                return this.parseDo();
            case TokenType.keywordIf:
                return this.parseIf();
            case TokenType.leftCurlyBracket:
                return this.parseBlock();
            case TokenType.keywordFor:
                return this.parseFor();
            case TokenType.keywordSwitch:
                return this.parseSwitch();
            case TokenType.keywordBreak:
                return this.nodeFactory.buildBreakNode(this.getAndSkipTokenWithSemicolon());
            case TokenType.keywordContinue:
                return this.nodeFactory.buildContinueNode(this.getAndSkipTokenWithSemicolon());
            case TokenType.keywordTry:
                return this.parseTryCatch();
            case TokenType.keywordThrow:
                return this.parseThrow();
            case TokenType.keywordReturn:
                return this.parseReturn();
            case TokenType.semicolon:
                this.nextToken();
                return undefined;
            case TokenType.keywordSynchronized:
                return this.parseSynchronizedBlock();
            default:
                let statement = this.parseVariableDeclarationOrMethodDeclarationTerm(expectSemicolonAfterStatement);

                return statement;
        }

    }

    parseSynchronizedBlock(): ASTSynchronizedBlockNode | undefined {
        let synchronizedToken = this.getAndSkipToken();
        if (!this.expect(TokenType.leftBracket, true)) return undefined;
        let lockObject = this.parseTermUnary();
        this.expect(TokenType.rightBracket, true);
        if (this.expect(TokenType.leftCurlyBracket, false)) {
            let block = this.parseBlock();
            if (lockObject && block) return this.nodeFactory.buildSynchronizedBlockNode(synchronizedToken, lockObject, block);
        }

        return undefined;

    }



    parseVariableDeclarationOrMethodDeclarationTerm(expectSemicolonAfterStatement: boolean): ASTStatementNode | undefined {
        let type = this.analyzeIfVariableDeclarationOrMethodDeclarationAhead(this.isCodeOutsideClassdeclarations);
        let statement: ASTStatementNode | undefined;
        let line = this.cct.range.endLineNumber;
        switch (type) {
            case "variabledeclaration": statement = this.parseLocalVariableDeclaration();
                break;
            case "statement": statement = this.parseTerm();
                break;
            // Only if this.isCodeOutsideClassdeclarations == true:
            case "methoddeclaration":
                let modifiers = this.nodeFactory.buildNodeWithModifiers(this.cct.range);
                modifiers.isStatic = true;
                this.parseFieldOrMethodDeclaration(this.module.mainClass!, modifiers, undefined);
                return undefined;
        }

        if ((expectSemicolonAfterStatement && !this.expectSemicolon(true, true))
            || !statement) {
            if (this.cct.range.startLineNumber == line) {
                this.skipTillNextTokenAfter([TokenType.semicolon, TokenType.newline, TokenType.rightCurlyBracket]);
            }
        }

        return statement;
    }

    abstract parseFieldOrMethodDeclaration(classASTNode: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode, modifiers: ASTNodeWithModifiers, documentation: string | undefined): void;

    parseLocalVariableDeclaration(): ASTStatementNode | undefined {

        let declarations: ASTLocalVariableDeclarations = {
            kind: TokenType.localVariableDeclarations,
            declarations: [],
            range: EmptyRange.instance
        };

        let isFinal = this.comesToken(TokenType.keywordFinal, true);

        let type = this.parseType();
        do {
            let identifer = this.expectAndSkipIdentifierAsToken();

            type = this.increaseArrayDimensionIfLeftRightSquareBracketsToCome(type);

            let initialization: ASTTermNode | undefined = undefined;
            if (this.comesToken(TokenType.assignment, true)) {
                initialization = this.parseTerm();
            }

            if (type && identifer) {
                declarations.declarations.push(this.nodeFactory.buildLocalVariableDeclaration(type, identifer, initialization, isFinal));
            }

        } while (this.comesToken(TokenType.comma, true))

        return declarations;
    }

    increaseArrayDimensionIfLeftRightSquareBracketsToCome(type: ASTTypeNode | undefined): ASTTypeNode | undefined {
        let additionalDimension: number = 0;
        while (this.comesToken(TokenType.leftRightSquareBracket, true)) {
            additionalDimension++;
        }
        if (type && additionalDimension > 0) {
            type = this.nodeFactory.buildArrayTypeNode(type, type.range, additionalDimension);
            this.module.ast?.collectedTypeNodes!.push(type);
        }
        return type;
    }


    parseWhile(): ASTWhileNode | undefined {

        let whileTokenRange = this.getCurrentRangeCopy();

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
            this.module.pushMethodCallPosition(whileTokenRange, [], "while", Range.getStartPosition(this.cct.range));
            this.skipTokensTillEndOfLineOr([TokenType.rightBracket]);
        }

        return undefined;

    }

    parseDo(): ASTDoWhileNode | undefined {

        let doToken = this.getAndSkipToken();

        let statementToRepeat = this.parseStatementOrExpression();
        this.expect(TokenType.keywordWhile, true);

        if (this.comesToken(TokenType.leftBracket, true)) {
            let condition = this.parseTerm();
            this.expect(TokenType.rightBracket, true);


            if (condition && statementToRepeat) {

                return this.nodeFactory.buildDoWhileNode(doToken,
                    this.cct, condition, statementToRepeat);

            }

        } else {
            this.skipTokensTillEndOfLineOr([TokenType.rightBracket]);
        }

        return undefined;

    }

    parseIf(): ASTIfNode | undefined {

        let ifTokenRange = this.getCurrentRangeCopy();

        let ifToken = this.getAndSkipToken();

        if (this.comesToken(TokenType.leftBracket, true)) {
            let condition = this.parseTerm();

            this.module.pushMethodCallPosition(ifTokenRange, [], "if", Range.getStartPosition(this.cct.range));

            this.expect(TokenType.rightBracket);

            if(this.comesToken(TokenType.rightCurlyBracket, false)){
                this.pushError(JCM.statementOrBlockExpected());
                return undefined;
            }

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

        let posLastSeen: number = -1;   // watchdog!
        while (!this.isEnd() && this.tt != TokenType.rightCurlyBracket
            && posLastSeen != this.pos) {
            posLastSeen = this.pos;
            let statement = this.parseStatementOrExpression();
            if (statement) blockNode.statements.push(statement);
        }

        this.expect(TokenType.rightCurlyBracket, true);
        this.setEndOfRange(blockNode);

        return blockNode;
    }

    parseFor(): ASTForLoopNode | ASTEnhancedForLoopNode | undefined {

        let forTokenRange = this.getCurrentRangeCopy();
        let semicolonPositions: monaco.IPosition[] = [];

        let tokenFor = this.getAndSkipToken();  // preserve first token to compute range later on

        if (!this.expect(TokenType.leftBracket, true)) return undefined;

        // We have to differentiate between for(int i = 0; i < 10; i++) and for(<Type> <id>: <Term>)
        // therefore we parse till ) and look for :
        let colonFound = this.lookForTokenTillOtherToken(TokenType.colon, [TokenType.rightBracket, TokenType.leftCurlyBracket, TokenType.rightCurlyBracket]);
        if (colonFound) return this.parseEnhancedForLoop(tokenFor);

        let firstStatement = this.parseStatementOrExpression(false);
        semicolonPositions.push(Range.getStartPosition(this.cct.range));
        this.expect(TokenType.semicolon, true);
        let condition = this.parseTerm();
        if (!condition) this.skipTokensTillEndOfLineOr(TokenType.semicolon)
        semicolonPositions.push(Range.getStartPosition(this.cct.range));
        this.expect(TokenType.semicolon, true);
        let lastStatement = this.parseTerm();
        let rightBracketPosition = Range.getStartPosition(this.cct.range);
        this.expect(TokenType.rightBracket, true);

        this.module.pushMethodCallPosition(forTokenRange, semicolonPositions, "for", rightBracketPosition);

        let statementToRepeat = this.parseStatementOrExpression(false);

        if (!statementToRepeat) {
            this.pushError(JCM.statementOrBlockExpected());
            return undefined;
        }

        return this.nodeFactory.buildForLoopNode(tokenFor, firstStatement, condition, lastStatement, statementToRepeat);

    }

    parseEnhancedForLoop(tokenFor: Token): ASTEnhancedForLoopNode | undefined {
        // for and ( are already parsed
        let elementType = this.parseType();
        let elementIdentifier = this.expectAndSkipIdentifierAsToken();
        this.expect(TokenType.colon, true);
        let collection = this.parseTerm();
        this.expect(TokenType.rightBracket);
        let statementToRepeat = this.parseStatementOrExpression();

        if (!statementToRepeat) {
            this.pushError(JCM.statementOrBlockExpected());
            return undefined;
        }

        if (elementType && elementIdentifier && collection && statementToRepeat) {
            return this.nodeFactory.buildEnhancedForLoop(tokenFor, elementType, elementIdentifier, collection, statementToRepeat);
        }

        return undefined;
    }

    parseSwitch(): ASTSwitchCaseNode | undefined {

        let switchTokenRange = this.getCurrentRangeCopy();

        let switchToken = this.getAndSkipToken(); // preserve for later to compute range
        if (!this.expect(TokenType.leftBracket, true)) return;
        let term = this.parseTerm();

        this.module.pushMethodCallPosition(switchTokenRange, [], "switch", Range.getStartPosition(this.cct.range));

        this.expect(TokenType.rightBracket, true);
        if (!this.expect(TokenType.leftCurlyBracket, true) || !term) return undefined;

        let switchNode = this.nodeFactory.buildSwitchCaseNode(switchToken, term);
        while (this.comesToken([TokenType.keywordCase, TokenType.keywordDefault], false)) {
            let isCase = this.tt == TokenType.keywordCase;
            let caseDefaultToken = this.cct;
            this.nextToken(); // skip case or default
            let constant = isCase ? this.parseTermUnary() : undefined;
            this.expect(TokenType.colon, true);

            let caseNode = this.nodeFactory.buildCaseNode(caseDefaultToken, constant);
            while (!this.isEnd() && !this.comesToken([TokenType.keywordCase, TokenType.keywordDefault, TokenType.rightCurlyBracket], false)) {
                let statement = this.parseStatementOrExpression();
                if (statement) caseNode.statements.push(statement);
            }
            this.setEndOfRange(caseNode);
            if (isCase) {
                switchNode.caseNodes.push(caseNode);
            } else {
                switchNode.defaultNode = caseNode;
            }
        }

        this.expect(TokenType.rightCurlyBracket, true);
        this.setEndOfRange(switchNode);
        return switchNode;
    }

    parseThrow(): ASTThrowNode | undefined {
        let throwToken = this.getAndSkipToken();
        let exception = this.parseTerm();
        this.expectSemicolon(true, true);

        if (!exception) return undefined;

        return {
            kind: TokenType.keywordThrow,
            exception: exception,
            range: throwToken.range
        }
    }

    parseTryCatch(): ASTTryCatchNode | undefined {
        let tryToken = this.getAndSkipToken();
        let statement = this.parseStatementOrExpression();
        if (!statement) return undefined;
        let tryNode = this.nodeFactory.buildTryCatchNode(tryToken, statement);

        while (this.comesToken(TokenType.keywordCatch, false)) {
            let catchToken = this.getAndSkipToken();
            if (!this.expect(TokenType.leftBracket, true)) continue;
            let exceptionTypes: ASTTypeNode[] = [];
            do {
                let type = this.parseType();
                if (type) exceptionTypes.push(type);
            } while (this.comesToken(TokenType.OR, true))
            let identifier = this.expectAndSkipIdentifierAsToken();
            if (!this.expect(TokenType.rightBracket, true)) continue;
            let statement = this.parseStatementOrExpression();
            if (exceptionTypes.length > 0 && identifier && statement) {
                tryNode.catchCases.push(this.nodeFactory.buildCatchNode(catchToken, exceptionTypes, identifier, statement));
            }
        }

        if (this.comesToken(TokenType.keywordFinally, true)) {
            tryNode.finallyStatement = this.parseStatementOrExpression(true);
        }

        return tryNode;
    }

    parseReturn(): ASTReturnNode {
        let returnToken = this.getAndSkipToken();

        let term = this.tt == TokenType.semicolon ? undefined : this.parseTerm();

        while (this.comesToken(TokenType.semicolon, true)) { }

        return this.nodeFactory.buildReturnNode(returnToken, term);

    }

}