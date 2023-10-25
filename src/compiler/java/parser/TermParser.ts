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
        TermParser.assignmentOperators,
        [TokenType.ternaryOperator],
        [TokenType.colon],
        [TokenType.or],
        [TokenType.and],
        [TokenType.OR],
        [TokenType.XOR],
        [TokenType.ampersand],
        [TokenType.equal, TokenType.notEqual],
        [TokenType.keywordInstanceof, TokenType.lower, TokenType.lowerOrEqual, TokenType.greater, TokenType.greaterOrEqual],
        [TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned],
        [TokenType.plus, TokenType.minus],
        [TokenType.multiplication, TokenType.division, TokenType.modulo],
        [TokenType.dot]
    ];


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

        return parseTermBinary(0);

    }

    parseTermBinary( ): ASTTermNode {

        let node: ASTTermNode = this.parseTermUnary();
        if (node == null) return node;

        let precedence: number | undefined;
        let rightRidgeHeight = 1;

        while ((precedence = this.operatorToPrecedenceMap[this.tt])) {

            let operator = this.tt;
            this.nextToken();
            let newRightNode: ASTTermNode = this.parseTermUnary();
            if (newRightNode == null) return node;

            let h: number = 1;
            let newLeftNodesParent: ASTBinaryNode | null = null;
            let newLeftNode: ASTTermNode = node;
            while (h < rightRidgeHeight && (<ASTBinaryNode>node).precedence! > precedence) {
                newLeftNodesParent = <ASTBinaryNode>newLeftNode;
                newLeftNode = (<ASTBinaryNode>newLeftNode).rightSide;
                h++;
            }

            let newNode: ASTBinaryNode = {
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


    parseTermUnary(): ASTTermNode {

        let node: ASTTermNode;
        switch (this.tt) {
            case TokenType.leftBracket:
                this.nextToken();
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





        }











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