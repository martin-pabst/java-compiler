import { Module } from "../../common/module/module";
import { TokenType } from "../TokenType";
import { TokenIterator } from "./TokenIterator";

export class Parser extends TokenIterator {
    static assignmentOperators = [TokenType.assignment, TokenType.plusAssignment, TokenType.minusAssignment,
    TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment,
    TokenType.ANDAssigment, TokenType.XORAssigment, TokenType.ORAssigment,
    TokenType.shiftLeftAssigment, TokenType.shiftRightAssigment, TokenType.shiftRightUnsignedAssigment];

    static operatorPrecedence: TokenType[][] = [Parser.assignmentOperators,
    [TokenType.ternaryOperator], [TokenType.colon],

    [TokenType.or], [TokenType.and], [TokenType.OR], [TokenType.XOR], [TokenType.ampersand],
    [TokenType.equal, TokenType.notEqual],
    [TokenType.keywordInstanceof, TokenType.lower, TokenType.lowerOrEqual, TokenType.greater, TokenType.greaterOrEqual],
    [TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned],

    [TokenType.plus, TokenType.minus], [TokenType.multiplication, TokenType.division, TokenType.modulo]
    ];


    static forwardToInsideClass = [TokenType.keywordPublic, TokenType.keywordPrivate, TokenType.keywordProtected, TokenType.keywordVoid,
    TokenType.identifier, TokenType.rightCurlyBracket, TokenType.keywordStatic, TokenType.keywordAbstract,
    TokenType.keywordClass, TokenType.keywordEnum, TokenType.keywordInterface];


    constructor(private module: Module) {
        super(module.tokens!, 7);
        this.initializeAST();
    }

    initializeAST(){
        this.module.ast = {
            type: TokenType.global,
            range: {startLineNumber: 0, startColumn: 0, 
                endLineNumber: this.endToken.range.endLineNumber, endColumn: this.endToken.range.endColumn},
            classDefinitions: [],
            mainProgramNodes: []
        }
    }

    parse() {

    }



}