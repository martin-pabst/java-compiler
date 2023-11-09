import { TokenType } from "../TokenType.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";
import { ASTBinaryNode, ASTCastNode, ASTClassDefinitionNode, ASTInterfaceDefinitionNode, ASTLambdaFunctionDeclarationNode, ASTNewObjectNode, ASTSelectArrayElementNode, ASTStatementNode, ASTTermNode, ASTTypeNode, ASTSymbolNode, BinaryOperator } from "./AST.ts";
import { ASTNodeFactory } from "./ASTNodeFactory.ts";
import { TokenIterator } from "./TokenIterator.ts";

export abstract class TermParser extends TokenIterator {
    static assignmentOperators = [TokenType.assignment, TokenType.plusAssignment, TokenType.minusAssignment,
    TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment,
    TokenType.ANDAssigment, TokenType.XORAssigment, TokenType.ORAssigment,
    TokenType.shiftLeftAssigment, TokenType.shiftRightAssigment, TokenType.shiftRightUnsignedAssigment];

    static unaryPrefixOperators: TokenType[] = [
        TokenType.plus, TokenType.minus, TokenType.not, TokenType.tilde, TokenType.plusPlus, TokenType.minusMinus
    ];

    static operatorPrecedence: TokenType[][] = [
        // Lambda-Operator: -1
        TermParser.assignmentOperators, // 0
        [TokenType.ternaryOperator],    // 1
        [TokenType.colon],              // 2
        [TokenType.or],                 // 3
        [TokenType.and],                // 4
        [TokenType.OR],                 // 5
        [TokenType.XOR],                // 6
        [TokenType.ampersand],          // 7
        [TokenType.equal, TokenType.notEqual],      // 8
        [TokenType.keywordInstanceof, TokenType.lower, TokenType.lowerOrEqual, TokenType.greater, TokenType.greaterOrEqual],    // 9
        [TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned],  // 10
        [TokenType.plus, TokenType.minus],                                          // 11
        [TokenType.multiplication, TokenType.division, TokenType.modulo]           // 12

        // cast: 20
        // unary (pre): 21
        // unary (post): 22
        // array access: 23
        // member access: 24
    ];


    operatorToPrecedenceMap: { [op: number]: number } = {};

    nodeFactory: ASTNodeFactory;

    currentClassOrInterface?: ASTClassDefinitionNode | ASTInterfaceDefinitionNode;

    constructor(protected module: JavaCompiledModule) {
        super(module.tokens!, module);
        this.nodeFactory = new ASTNodeFactory(this);

        this.initOperatorToPrecedenceMap();

    }

    initOperatorToPrecedenceMap() {
        for (let i = 0; i < TermParser.operatorPrecedence.length; i++) {
            for (let op of TermParser.operatorPrecedence[i]) {
                this.operatorToPrecedenceMap[op] = i;
            }
        }
    }

    abstract parseStatementOrExpression(): ASTStatementNode | undefined;

    /**
     * Grammar:
     * https://docs.oracle.com/javase/specs/jls/se8/html/jls-19.html
     * 
     * Operator precedence:
     * https://introcs.cs.princeton.edu/java/11precedence/
     * 
     */


    parseTerm(): ASTTermNode | undefined {

        return this.parseTermBinary();

    }

    parseTermBinary(): ASTTermNode | undefined {

        let node: ASTTermNode | undefined = this.parsePraefixSuffix();
        if (!node) return node;

        let precedence: number | undefined;
        let rightRidgeHeight = 1;

        while ((precedence = this.operatorToPrecedenceMap[this.tt]) != null) {

            let operator = this.tt;
            let operatorRange = this.cct.range;
            this.nextToken();
            let newRightNode: ASTTermNode | undefined = this.parsePraefixSuffix();
            if (newRightNode == null) return node;

            let h: number = 1;
            let newLeftNodesParent: ASTBinaryNode | null = null;
            let newLeftNode: ASTTermNode = node;
            while (h < rightRidgeHeight && (<ASTBinaryNode>node).precedence! < precedence) {
                newLeftNodesParent = <ASTBinaryNode>newLeftNode;
                newLeftNode = (<ASTBinaryNode>newLeftNode).rightSide;
                h++;
            }

            let newNode: ASTBinaryNode =
            {
                kind: TokenType.binaryOp,
                range: {
                    startLineNumber: newLeftNode.range.startLineNumber, startColumn: newLeftNode.range.startColumn,
                    endLineNumber: newRightNode.range.endLineNumber, endColumn: newRightNode.range.endColumn
                },
                precedence: precedence,
                operator: <BinaryOperator>operator,
                operatorRange: operatorRange,
                leftSide: newLeftNode,
                rightSide: newRightNode
            }

            if (newLeftNodesParent) {
                newLeftNodesParent.rightSide = newNode;
            } else {
                node = newNode;
            }

            rightRidgeHeight = h + 1;

        }

        return node;

    }

    parsePraefixSuffix(): ASTTermNode | undefined {
        let prefix = TermParser.unaryPrefixOperators.indexOf(this.tt) >= 0 ? this.cct : undefined;
        if (prefix) this.nextToken();

        let term: ASTTermNode | undefined = this.parseTermUnary();

        if (term && prefix) {
            term = this.nodeFactory.buildUnaryPrefixNode(prefix, term);
        }

        let plusPlusMinusMinusSuffix = (this.tt == TokenType.plusPlus || this.tt == TokenType.minusMinus) ? this.cct : undefined;
        if (plusPlusMinusMinusSuffix) {
            this.nextToken();
            if (term) {
                term = this.nodeFactory.buildPlusPlusMinusMinusSuffixNode(plusPlusMinusMinusSuffix, term);
            }
        }

        return term;
    }

    /**
     * 
     */

    parseTermUnary(): ASTTermNode | undefined {

        let node: ASTTermNode | undefined = undefined;


        switch (this.tt) {
            case TokenType.leftBracket:
                let tokenTypeAfterRightBracket = this.findTokenTypeAfterCorrespondingRightBracket();
                switch (tokenTypeAfterRightBracket) {
                    case TokenType.lambda: node = this.parseLambdaFunctionDefinition();
                        break;
                    case TokenType.leftBracket:
                    case TokenType.identifier:
                    case TokenType.keywordThis:
                    case TokenType.keywordSuper:
                        node = this.parseCastedObject();
                        break;
                    default:
                        this.nextToken();
                        node = this.parseTerm();
                        if(node) node.parenthesisNeeded = true;
                        this.expect(TokenType.rightBracket, true);
                }
                break;
            case TokenType.identifier:
                switch (this.lookahead(1).tt) {
                    case TokenType.leftBracket:
                        node = this.parseMethodCall(undefined);
                        break;
                    case TokenType.lambda:
                        node = this.parseLambdaFunctionDefinition();
                        break;
                    default:
                        node = this.parseVariable();

                }
                break;
            case TokenType.keywordNew:
                // parse new ArrayList<String>(), new int[10][20], new ArrayList<Integer>[20], ...
                let leftBracketOrLeftSquareBracket = this.lookForTokenTillOtherToken([TokenType.leftBracket, TokenType.leftSquareBracket], [TokenType.semicolon, TokenType.leftCurlyBracket])
                switch (leftBracketOrLeftSquareBracket) {
                    case TokenType.leftBracket:
                        node = this.parseObjectInstantiation();
                        break;
                    case TokenType.leftSquareBracket:
                        node = this.parseNewArray();
                        break;
                    default:
                        this.pushError("Es wird die Syntax new Klasse(Parameter...) oder new Typ[ArrayLänge]... erwartet.", "error");
                        this.skipTokensTillEndOfLineOr([TokenType.semicolon, TokenType.comma, TokenType.rightBracket], false);
                        break;
                }
                break;
            case TokenType.keywordPrint:
            case TokenType.keywordPrintln:
                node = this.parsePrintStatement();
                break;
            case TokenType.shortConstant:
            case TokenType.integerConstant:
            case TokenType.longConstant:
            case TokenType.charConstant:
            case TokenType.stringConstant:
            case TokenType.booleanConstant:
                node = this.nodeFactory.buildConstantNode(this.getAndSkipToken());
                break;
            case TokenType.keywordThis:
                node = this.nodeFactory.buildThisNode(this.getAndSkipToken());
                break;
            case TokenType.keywordSuper:
                node = this.nodeFactory.buildSuperNode(this.getAndSkipToken());
                break;

        }

        if(node){
            while ([TokenType.dot, TokenType.leftSquareBracket].indexOf(this.tt) >= 0) {
    
                switch (this.tt) {
                    case TokenType.dot:
                        node = this.parseAttributeOrMethodCall(node)
                        break;
                    case TokenType.leftSquareBracket:
                        node = this.parseSelectArrayElement(node);
                        break;
                }
    
            }
        }

        return node;

    }


    parseAttributeOrMethodCall(node: ASTTermNode | undefined): ASTTermNode | undefined {
        this.nextToken(); // skip .
        if (!node) {
            this.pushError("Der Punkt-Operator kann nur nach einem Bezeichner (identifier) kommen.", "error");
            return undefined;
        } else {
            if (this.lookahead(1).tt == TokenType.leftBracket) {
                return this.parseMethodCall(node);
            } else {
                let identifier = this.expectAndSkipIdentifierAsToken();
                if (identifier.value == "") return node;
                return this.nodeFactory.buildAttributeDereferencingNode(identifier);
            }
        }
    }

    parseMethodCall(nodeToGetObject: ASTTermNode | undefined): ASTTermNode | undefined {
        let identifier = this.expectAndSkipIdentifierAsToken();
        if (identifier.value == "") return nodeToGetObject;

        this.expect(TokenType.leftBracket, true);
        let methodCallNode = this.nodeFactory.buildMethodCallNode(identifier, nodeToGetObject);

        if (this.tt != TokenType.rightBracket) {
            do {
                let termNode = this.parseTerm();
                if (termNode) methodCallNode.parameterValues.push(termNode);
            } while (this.comesToken(TokenType.comma, true));
        }

        this.expect(TokenType.rightBracket, true);
        this.setEndOfRange(methodCallNode);
        return methodCallNode;
    }

    parseLambdaFunctionDefinition(): ASTLambdaFunctionDeclarationNode {

        let lambdaNode = this.nodeFactory.buildLambdaFunctionDeclarationNode(this.cct);

        // form (int x, y) -> ... or 
        if (this.tt == TokenType.leftBracket) {
            this.nextToken();
            //@ts-ignore
            if (this.tt != TokenType.rightBracket) {
                do {
                    let startRange = this.cct.range;
                    let withoutType = [TokenType.comma, TokenType.rightBracket].indexOf(this.lookahead(1).tt) >= 0;

                    let type: ASTTypeNode | undefined;

                    if (!withoutType) {
                        type = this.parseType();
                    }

                    let identifier = this.expectAndSkipIdentifierAsToken();
                    if (identifier.value != "") {
                        lambdaNode.parameters.push(this.nodeFactory.buildParameterNode(startRange, identifier, type, false));
                    }

                } while (this.comesToken(TokenType.comma, true));
            }

            this.expect(TokenType.rightBracket, true);
        }

        this.expect(TokenType.lambda, true);

        lambdaNode.statement = this.parseStatementOrExpression();

        this.setEndOfRange(lambdaNode);

        return lambdaNode;
    }

    parseType(): ASTTypeNode | undefined {
        // ArrayList; HashMap<Integer, ArrayList<Boolean>>; int[][], ...
        // general Syntax: <identifier><genericParameterInvocation><ArrayDimension[]>

        let type = this.nodeFactory.buildTypeNode(this.currentClassOrInterface);
        this.module.ast!.collectedTypeNodes.push(type);

        if (this.tt == TokenType.keywordVoid) {
            type.isVoidType = true;
            type.identifier = "void";
            this.nextToken();
            return type;
        }

        if (this.tt == TokenType.keywordVar) {
            type.isVarKeyword = true;
            type.identifier = "var";
            this.nextToken();
            return type;
        }

        type.identifier = this.expectAndSkipIdentifierAsString();
        if (type.identifier == "") return type;  // erroneous type

        if (this.comesToken(TokenType.lower, true)) {     // generic parameter invocation?
            do {
                let genericParameterType = this.parseType();
                if (genericParameterType) type.genericParameterInvocations.push(genericParameterType);
            } while (this.comesToken(TokenType.comma, true))
            this.expect(TokenType.greater, true);
        }

        // [][][] at the end of type
        while (this.comesToken(TokenType.leftRightSquareBracket, true)) type.arrayDimensions++;

        this.setEndOfRange(type);

        return type;
    }

    parseCastedObject(): ASTCastNode | undefined {
        let startToken = this.cct;
        this.nextToken(); // skip (
        let type = this.parseType();
        this.expect(TokenType.rightBracket);
        let term = this.parseTerm();

        if (type && term) {
            let castNode = this.nodeFactory.buildCastNode(startToken, type, term);
            this.setEndOfRange(castNode);
            return castNode;
        }

        return undefined;
    }

    parseVariable(): ASTSymbolNode | undefined {
        let identifier = this.expectAndSkipIdentifierAsToken();
        if (identifier.value != "") {
            return this.nodeFactory.buildVariableNode(identifier);
        }

        return undefined;
    }


    parseNewArray(): ASTTermNode | undefined {
        let startToken = this.cct;
        this.nextToken(); // skip new keyword
        let type = this.parseType();

        if (!type) return undefined;

        let newArrayNode = this.nodeFactory.buildNewArrayNode(startToken, type, []);


        if (this.expect(TokenType.leftSquareBracket), true) {
            do {
                let termNode = this.parseTerm();
                if (termNode) newArrayNode.dimensions.push(termNode);
                this.expect(TokenType.rightSquareBracket);
            } while (this.comesToken(TokenType.leftSquareBracket, true));
            

        }

        this.setEndOfRange(newArrayNode);
        return newArrayNode;
    }

    parseObjectInstantiation(): ASTNewObjectNode | undefined {
        let startToken = this.cct;
        this.nextToken(); // skip new keyword
        let type = this.parseType();

        if (!type) return undefined;

        let newObjectNode = this.nodeFactory.buildNewObjectNode(startToken, type);

        if (this.expect(TokenType.leftBracket), true) {

            if (this.tt != TokenType.rightBracket) {
                do {
                    let termNode = this.parseTerm();
                    if (termNode) newObjectNode.parameterValues.push(termNode);
                } while (this.comesToken(TokenType.comma, true));
            }

            this.expect(TokenType.rightBracket, true);
        }

        this.setEndOfRange(newObjectNode);
        return newObjectNode;
    }

    parseSelectArrayElement(array: ASTTermNode | undefined): ASTSelectArrayElementNode | undefined {
        if (!array) {
            this.skipTokensTillEndOfLineOr([TokenType.rightSquareBracket]);
            return undefined;
        }

        let saeNode = this.nodeFactory.buildSelectArrayElement(array);

        while (this.tt == TokenType.leftSquareBracket) {
            this.nextToken();
            let term = this.parseTerm();
            if (term) saeNode.indices.push(term)
            this.expect(TokenType.rightSquareBracket, true);
        }

        this.setEndOfRange(saeNode);

        return saeNode;

    }

    parsePrintStatement() {
        let printlnStatement = this.nodeFactory.buildPrintStatement(this.cct, this.tt == TokenType.keywordPrintln);

        this.nextToken();


        if (this.expect(TokenType.leftBracket, true)) {
            if (this.tt != TokenType.rightBracket) {
                printlnStatement.firstParameter = this.parseTerm();
            }

            if (this.comesToken(TokenType.comma, true)) {
                printlnStatement.secondParameter = this.parseTerm();
            }

            this.expect(TokenType.rightBracket, true);
        }

        return printlnStatement;
    }
}