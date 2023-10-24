import { Module } from "../../common/module/module.ts";
import { TokenType } from "../TokenType.ts";
import { ASTTermNode, ASTTypeNode } from "./AST.ts";
import { ASTNodeFactory } from "./ASTNodeFactory.ts";
import { TokenIterator } from "./TokenIterator.ts";

export class TermParser extends TokenIterator {
    static assignmentOperators = [TokenType.assignment, TokenType.plusAssignment, TokenType.minusAssignment,
    TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment,
    TokenType.ANDAssigment, TokenType.XORAssigment, TokenType.ORAssigment,
    TokenType.shiftLeftAssigment, TokenType.shiftRightAssigment, TokenType.shiftRightUnsignedAssigment];

    static operatorPrecedence: TokenType[][] = [
    TermParser.assignmentOperators,
    [TokenType.ternaryOperator], [TokenType.colon],

    [TokenType.or], [TokenType.and], [TokenType.OR], [TokenType.XOR], [TokenType.ampersand],
    [TokenType.equal, TokenType.notEqual],
    [TokenType.keywordInstanceof, TokenType.lower, TokenType.lowerOrEqual, TokenType.greater, TokenType.greaterOrEqual],
    [TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned],

    [TokenType.plus, TokenType.minus], [TokenType.multiplication, TokenType.division, TokenType.modulo]
    ];

    nodeFactory: ASTNodeFactory;

    constructor(protected module: Module) {
        super(module.tokens!, 7);
        this.nodeFactory = new ASTNodeFactory(this);
    }

    /**
     * Grammar:
     * https://docs.oracle.com/javase/specs/jls/se7/html/jls-18.html
     * @returns 
     */

    parseTerm(): ASTTermNode {

        return parseLambda();

    }

    parseLambda(): ASTTermNode {
        let left = parseAssignment();
        if(this.tt == TokenType.lamdaOperator){

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