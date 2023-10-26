import { Module } from "../../common/module/module.ts";
import { TokenType } from "../TokenType.ts";
import { ASTBinaryNode, ASTPlusPlusMinusMinusSuffixNode, ASTTermNode, ASTTypeNode, BinaryOperator } from "./AST.ts";
import { ASTNodeFactory } from "./ASTNodeFactory.ts";
import { TokenIterator } from "./TokenIterator.ts";

export class TermParser extends TokenIterator {
    static assignmentOperators = [TokenType.assignment, TokenType.plusAssignment, TokenType.minusAssignment,
    TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment,
    TokenType.ANDAssigment, TokenType.XORAssigment, TokenType.ORAssigment,
    TokenType.shiftLeftAssigment, TokenType.shiftRightAssigment, TokenType.shiftRightUnsignedAssigment];

    static unaryPrefixOperators: TokenType[] = [
        TokenType.plus, TokenType.minus, TokenType.not, TokenType.tilde, TokenType.plusPlus, TokenType.minusMinus
    ];

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
        [TokenType.multiplication, TokenType.division, TokenType.modulo]           // 12
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


    parseTerm(): ASTTermNode | undefined {

        return this.parseTermBinary();

    }

    parseTermBinary(): ASTTermNode | undefined {

        let node: ASTTermNode | undefined = this.parsePraefixSuffix();
        if (!node) return node;

        let precedence: number | undefined;
        let rightRidgeHeight = 1;

        while ((precedence = this.operatorToPrecedenceMap[this.tt])) {

            let operator = this.tt;
            this.nextToken();
            let newRightNode: ASTTermNode | undefined = this.parsePraefixSuffix();
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

            rightRidgeHeight = h + 1;

        }

        return node;

    }

    parsePraefixSuffix(): ASTTermNode | undefined {
        let prefix = TermParser.unaryPrefixOperators.indexOf(this.tt) >= 0 ? this.cct : undefined;
        if(prefix) this.nextToken();
        
        let term: ASTTermNode | undefined = this.parseTermUnary();
        
        if(term && prefix){
            term = this.nodeFactory.buildUnaryPrefixNode(prefix, term);
        }

        let plusPlusMinusMinusSuffix = (this.tt == TokenType.plusPlus || this.tt == TokenType.minusMinus) ? this.cct : undefined;
        if(term && plusPlusMinusMinusSuffix){
            term = this.nodeFactory.buildPlusPlusMinusMinusSuffixNode(plusPlusMinusMinusSuffix, term, "suffix");
        }
        
        return term;
    }

    parseTermUnary(): ASTTermNode | undefined {

        let node: ASTTermNode | undefined = undefined;

        let done: boolean = false;

        while(!done){
            done = true;

            switch (this.tt) {
                case TokenType.dot:
                    node = this.parseAttributeOrMethodCall(node)
                    break;
                case TokenType.leftBracket:
                    let tokenTypeAfterRightBracket = this.findTokenTypeAfterCorrespondingRightBracket();
                    switch(tokenTypeAfterRightBracket){
                        case TokenType.lambda: node = this.parseLambdaFunction();
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
                            this.expect(TokenType.rightBracket, true);
                    }
                    break;
                case TokenType.identifier:
                    // TODO: differentiate between variable and method call
                    if (this.lookahead[1].tt == TokenType.leftBracket) {
                        node = this.parseMethodCall(undefined);
                    } else {
                        node = this.parseVariable();
                    }
                    break;
                case TokenType.keywordNew:
                    node = parseObjectInstantiation();
                    break;
                case TokenType.leftSquareBracket:
                    node = this.parseArrayDereferencing(node);
                    break;

                    default: done = false;
    
            }

        }


        return node;

    }


    parseAttributeOrMethodCall(node: ASTTermNode | undefined): ASTTermNode | undefined{
        this.nextToken(); // skip .
        if(!node){
            this.pushError("Der Punkt-Operator kann nur nach einem Bezeichner (identifier) kommen.", "error");
            return undefined;
        } else {
            if(this.lookahead[1].tt == TokenType.leftBracket){
                this.parseMethodCall(node);
            } else {
                let identifier = this.expectAndSkipIdentifierAsToken();
                if(identifier.value == "") return node;
                return this.nodeFactory.buildAttributeDereferencingNode(identifier);
            }
        }
    }

    parseMethodCall(nodeToGetObject: ASTTermNode | undefined): ASTTermNode | undefined {
        let identifier = this.expectAndSkipIdentifierAsToken();
        if(identifier.value == "") return nodeToGetObject;

        this.expect(TokenType.leftBracket, true);
        do {
            
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