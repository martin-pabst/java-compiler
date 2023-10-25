import { Module } from "../../common/module/module.ts";
import { TokenType } from "../TokenType.ts";
import { ASTBinaryNode, ASTTermNode, ASTTypeNode, BinaryOperator } from "./AST.ts";
import { ASTNodeFactory } from "./ASTNodeFactory.ts";
import { TokenIterator } from "./TokenIterator.ts";

export class TermParser extends TokenIterator {
    static assignmentOperators = [TokenType.assignment, TokenType.plusAssignment, TokenType.minusAssignment,
    TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment,
    TokenType.ANDAssigment, TokenType.XORAssigment, TokenType.ORAssigment,
    TokenType.shiftLeftAssigment, TokenType.shiftRightAssigment, TokenType.shiftRightUnsignedAssigment];

    static operatorPrecedence: TokenType[][] = [
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
        [TokenType.multiplication, TokenType.division, TokenType.modulo],           // 12
        [TokenType.plusPlus, TokenType.minusMinus],                                 // 13
        [TokenType.dot]     // 14
    ];

    static plusPlusMinusMinusPrecedence = 13;
    static dotPrecedence = 14;


    operatorToPrecedenceMap: { [op: number]: number } = {};

    nodeFactory: ASTNodeFactory;

    constructor(protected module: Module) {
        super(module.tokens!, 7);
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

    /**
     * Grammar:
     * https://docs.oracle.com/javase/specs/jls/se8/html/jls-19.html
     * @returns 
     */


    parseTerm(): ASTTermNode {

        return this.parseTermBinary(0);

    }

    parseTermBinary(minPrecedence: number): ASTTermNode | undefined {

        let node: ASTTermNode | undefined = this.parseTermUnary();
        if (!node) return node;

        let precedence: number | undefined;
        let rightRidgeHeight = 1;

        while ((precedence = this.operatorToPrecedenceMap[this.tt]) >= minPrecedence) {

            let operator = this.tt;
            let isPlusPlusMinusMinus = precedence == TermParser.plusPlusMinusMinusPrecedence;
            this.nextToken();
            let newRightNode: ASTTermNode | undefined = isPlusPlusMinusMinus ? undefined : this.parseTermUnary();
            if (newRightNode == null) return node;

            let h: number = 1;
            let newLeftNodesParent: ASTBinaryNode | null = null;
            let newLeftNode: ASTTermNode = node;
            while (h < rightRidgeHeight && (<ASTBinaryNode>node).precedence! > precedence) {
                newLeftNodesParent = <ASTBinaryNode>newLeftNode;
                newLeftNode = (<ASTBinaryNode>newLeftNode).rightSide;
                h++;
            }

            let newNode: ASTBinaryNode =
                isPlusPlusMinusMinus ? this.nodeFactory.buildPlusPlusMinusMinusNode(newLeftNode) :
                    {
                        kind: TokenType.binaryOp,
                        range: {
                            startLineNumber: newLeftNode.range.startLineNumber, startColumn: newLeftNode.range.startColumn,
                            endLineNumber: newRightNode.range.endLineNumber, endColumn: newRightNode.range.endColumn
                        },
                        precedence: precedence,
                        operator: <BinaryOperator>operator,
                        leftSide: newLeftNode,
                        rightSide: newRightNode
                    }

            if (newLeftNodesParent) {
                newLeftNodesParent.rightSide = newNode;
            } else {
                node = newNode;
            }

            rightRidgeHeight++;

        }

        return node;

    }


    parseTermUnary(): ASTTermNode | undefined {

        let node: ASTTermNode | undefined = undefined;

        switch (this.tt) {
            case TokenType.leftBracket:
                this.nextToken();
                // TODO: check for casting...
                // TODO: check for lambda function
                node = this.parseTerm();
                this.expect(TokenType.rightBracket, true);
                if (node) node = checkForArrayBrackets(node);
                break;
            case TokenType.identifier:
                // TODO: differentiate between variable and method call
                if (this.lookahead[1].tt == TokenType.leftBracket) {
                    node = this.parseMethodCall();
                } else {
                    node = this.parseVariable();
                }
                if (node) node = checkForArrayBrackets(node);
                break;
            case TokenType.keywordNew:
                node = parseObjectInstantiation();
                if (node) node = checkForArrayBrackets(node);
                break;
            case TokenType.plusPlus:
            case TokenType.minusMinus:
                node = this.parseTermBinary(TermParser.plusPlusMinusMinusPrecedence);
                if (node) {
                    node = this.nodeFactory.buildPlusPlusMinusMinusNode(node);
                }
                break;
            case TokenType.minus:
            case TokenType.plus:
            case TokenType.tilde:
            case TokenType.not:
                node = this.parseTermBinary(TermParser.plusPlusMinusMinusPrecedence);
                if (node) {
                    node = this.nodeFactory.buildUnaryNode(node);
                }
                break;

        }

        return node;

    }


}



















parseType(): ASTTypeNode | undefined {
    // ArrayList; HashMap<Integer, ArrayList<Boolean>>; int[][], ...
    // general Syntax: <identifier><genericParameterInvocation><ArrayDimension[]>

    let type = this.nodeFactory.buildTypeNode();

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
}


}