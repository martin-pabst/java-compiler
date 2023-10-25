import { Module } from "../../common/module/module.ts";
import { TokenType } from "../TokenType.ts";
import { ASTBinaryNode, ASTTermNode, ASTTypeNode } from "./AST.ts";
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

    }


    /**
     * Grammar:
     * https://docs.oracle.com/javase/specs/jls/se8/html/jls-19.html
     * @returns 
     */


    parseTerm(): ASTTermNode {

        return parseTermBinary(0);

    }

    parseTermBinary(precedence: number): ASTTermNode {

        let left: ASTTermNode;
        if (precedence < TermParser.operatorPrecedence.length - 1) {
            left = this.parseTermBinary(precedence + 1);
        } else {
            left = this.parsePlusPlusMinusMinus();
        }

        let operators = TermParser.operatorPrecedence[precedence];

        if (left == null || operators.indexOf(this.tt) < 0) {
            return left;
        }

        let first = true;

        while (first || operators.indexOf(this.tt) >= 0) {

            let operator: TokenType = this.tt;

            first = false;
            let position = this.getCurrentPosition();

            this.nextToken();

            for (let opData of [{ op: TokenType.lower, wrong: "=<", right: "<=", correctOp: TokenType.lowerOrEqual },
            { op: TokenType.greater, wrong: "=>", right: ">=", correctOp: TokenType.greaterOrEqual }]) {
                if (operator == TokenType.assignment && this.tt == opData.op) {
                    let position2 = this.getCurrentPosition();
                    this.pushError(`Den Operator ${opData.wrong} gibt es nicht. Du meintest sicher: ${opData.right}`, "error",
                        Object.assign({}, position, { length: 2 }), {
                        title: `${opData.wrong} durch ${opData.right} ersetzen`,
                        editsProvider: (uri) => {
                            return [
                                {
                                    resource: uri,
                                    edit: {
                                        range: { startLineNumber: position.line, startColumn: position.column, endLineNumber: position.line, endColumn: position2.column + position2.length },
                                        text: opData.right
                                    }
                                }
                            ]
                        }
                    });
                    this.nextToken();
                    operator = opData.correctOp;
                }
            }

            let right: TermNode;
            if (precedence < Parser.operatorPrecedence.length - 1) {
                right = this.parseTermBinary(precedence + 1);
            } else {
                right = this.parsePlusPlusMinusMinus();
            }

            if (right != null) {

                let constantFolding = false;
                if (this.isConstant(left) && this.isConstant(right)) {
                    let pcLeft = <ConstantNode>left;
                    let pcRight = <ConstantNode>right;
                    let typeLeft = TokenTypeToDataTypeMap[pcLeft.constantType];
                    let typeRight = TokenTypeToDataTypeMap[pcRight.constantType];
                    let resultType = typeLeft.getResultType(operator, typeRight);
                    if (resultType != null) {
                        constantFolding = true;

                        if (typeLeft == charPrimitiveType && typeRight == intPrimitiveType) {
                            pcLeft.constant = (<string>pcLeft.constant).charCodeAt(0);
                        }
                        if (typeRight == charPrimitiveType && typeLeft == intPrimitiveType) {
                            pcRight.constant = (<string>pcRight.constant).charCodeAt(0);
                        }


                        let result = typeLeft.compute(operator, { type: typeLeft, value: pcLeft.constant },
                            { type: typeRight, value: pcRight.constant });

                        this.considerIntDivisionWarning(operator, typeLeft, pcLeft.constant, typeRight, pcRight.constant, position);

                        pcLeft.constantType = (<PrimitiveType>resultType).toTokenType();
                        pcLeft.constant = result;
                        pcLeft.position.length = pcRight.position.column + pcRight.position.length - pcLeft.position.column;
                    }
                }

                if (!constantFolding)
                    left = {
                        type: TokenType.binaryOp,
                        position: position,
                        operator: operator,
                        firstOperand: left,
                        secondOperand: right
                    };

            }


        }

        return left;

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