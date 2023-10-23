import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { Visibility } from "../types/Visibility.ts";

export type ASTNodes = ASTNode[];

export type AssignmentOperator = TokenType.assignment | TokenType.minusAssignment | TokenType.plusAssignment | TokenType.multiplicationAssignment | TokenType.divisionAssignment | TokenType.moduloAssignment;
export type BinaryOperator = TokenType.plus | TokenType.minus | TokenType.multiplication | TokenType.division | 
                             TokenType.shiftLeft | TokenType.shiftRight | TokenType.shiftRightUnsigned | 
                             TokenType.and | TokenType.or | TokenType.XOR | 
                             TokenType.lower | TokenType.greater | TokenType.lowerOrEqual | TokenType.greaterOrEqual | TokenType.notEqual;
export type UnaryOperator = TokenType.negation | TokenType.not;

export interface ASTNode {
    type: TokenType;
    range: IRange;    
}

export interface ASTGlobalNode extends ASTNode {
    type: TokenType.global;
    classOrInterfaceOrEnumDefinitions: ASTClassDefinitionNode[];
    mainProgramNodes: ASTProgramNode[];
}

/**
 * Building blocks for nodes...
 */

export interface ASTWithVisibilityModifier {
    visibility: Visibility
}

// e.g. ..., int count, ...
export interface ASTParameter {
    identifier: string;
    type: ASTTypeNode;
}

export interface TypeDefinitionWithMethods {
    methods: ASTMethodDefinitionNode[]
}

export interface ASTTypeDefinitionWithAttributes {
    attributes: ASTAttributeDefinitionNode[]
}

export interface ASTGenericDefinition {
    identifier: string;
    extends?: ASTTypeNode[];
    super?: ASTTypeNode;
}

// e.g. class List<E extends Comparable<E>>
export interface ASTTypeDefinitionWithGenerics {
    genericDefinitions: ASTGenericDefinition[]
}

export interface ASTIsFinalOrStatic {
    isStatic: boolean;
    isFinal: boolean;
}

/**
 * Nodes for class, interface, enum
 */
// e.g. HashMap<String, Integer>
export interface ASTTypeNode extends ASTNode {
    identifier: string;
    genericParameterAssignments: ASTTypeNode[];
    arrayDimensions: number;
}

// e.g. public int getValue(String key)
export interface ASTMethodDefinitionNode extends ASTWithVisibilityModifier, ASTIsFinalOrStatic {
    identifier: string;
    parameters: ASTParameter[];
    returnParameterType: ASTTypeNode;
    isContructor: boolean;
    isAbstract: boolean;
}                

export interface ASTAttributeDefinitionNode extends ASTWithVisibilityModifier, ASTIsFinalOrStatic {
    identifier: string;
    type: ASTTypeNode;
}            

export interface ASTClassDefinitionNode 
extends ASTNode, TypeDefinitionWithMethods, ASTTypeDefinitionWithGenerics, ASTWithVisibilityModifier,
    ASTTypeDefinitionWithAttributes
{
    type: TokenType.keywordClass;
    identifier: string;
    innerClasses: ASTClassDefinitionNode[]
}

export interface ASTInterfaceDefinitionNode 
extends ASTNode, TypeDefinitionWithMethods, ASTTypeDefinitionWithGenerics, ASTWithVisibilityModifier
{
    type: TokenType.keywordInterface;
    identifier: string;
}

export interface ASTEnumDefinitionNode 
extends ASTNode, TypeDefinitionWithMethods, ASTWithVisibilityModifier,
    ASTTypeDefinitionWithAttributes
{
    type: TokenType.keywordEnum;
    identifier: string;
}


/**
 * Nodes for Program, statements
 */

export interface ASTBlockNode extends ASTNode {
    type: TokenType.block;
    statements: ASTStatementNode[];
}

export interface ASTProgramNode extends ASTNode {
    type: TokenType.program;
    block: ASTBlockNode;
}

export interface ASTStatementNode extends ASTNode {

}

/**
 * Nodes for Terms
 */

export interface ASTAssignmentNode extends ASTStatementNode {
    type: AssignmentOperator;
    leftSide: ASTTermNode;
    rightSide: ASTTermNode;
}

export interface ASTTermNode extends ASTStatementNode {

}

export interface ASTTernaryNode extends ASTTermNode {
    type: TokenType.ternaryOperator;
    condition: ASTTermNode;
    termIfTrue: ASTTermNode;
    termIfFalse: ASTTermNode;
}

export interface ASTBinaryNode extends ASTTermNode {
    type: TokenType.binaryOp;
    operator: BinaryOperator;
    leftSide: ASTTermNode;
    rightSide: ASTTermNode;
}

export interface ASTUnaryNode extends ASTTermNode {
    type: TokenType.unaryOp;
    operator: UnaryOperator;
    rightSide: ASTTermNode;
}

export interface ASTPlusPlusMinusMinusNode extends ASTTermNode {
    type: TokenType.plusPlusMinusMinus;
    operator: TokenType.plusPlus | TokenType.minusMinus;
    term: ASTTermNode;
    prefixOrSuffix: "prefix" | "suffix"
}

export interface ASTMethodCall extends ASTTermNode {
    type: TokenType.callMethod;
    methodIdentifier: string;
    parameterValues: ASTTermNode[];
}

export interface ASTNewObjectNode extends ASTTermNode {
    type: TokenType.newObject;
    classIdentifier: string;
    parameterValues: ASTTermNode;
}

export interface ASTNewArrayNode extends ASTTermNode {
    type: TokenType.newArray;
    arrayType: ASTTypeNode;
    dimensions: ASTTermNode[];

}
/**
 * Structural statements: while, if, for, case, do...while
 */
export interface ASTWhileNode extends ASTStatementNode {
    type: TokenType.keywordWhile;
    condition: ASTTermNode;
    block: ASTBlockNode;
}

export interface ASTDoWhileNode extends ASTStatementNode {
    type: TokenType.keywordDo;
    condition: ASTTermNode;
    block: ASTBlockNode;
}

export interface ASTIfNode extends ASTStatementNode {
    type: TokenType.keywordIf;
    condition: ASTTermNode;
    blockIfTrue: ASTBlockNode;
    blockIfFalse: ASTBlockNode;
}

export interface ASTForLoopNode extends ASTStatementNode {
    type: TokenType.keywordFor;
    firstStatement: ASTStatementNode;
    condition: ASTTermNode;
    lastStatement: ASTStatementNode;
    block: ASTBlockNode;
}







