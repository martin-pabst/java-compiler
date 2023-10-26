import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { VisibilityType } from "../types/Visibility.ts";

export type ASTNodes = ASTNode[];

export type AssignmentOperator = TokenType.assignment | TokenType.minusAssignment | TokenType.plusAssignment | TokenType.multiplicationAssignment | TokenType.divisionAssignment | TokenType.moduloAssignment;

export type BinaryOperator = TokenType.plus | TokenType.minus | TokenType.multiplication | TokenType.division | 
                             TokenType.shiftLeft | TokenType.shiftRight | TokenType.shiftRightUnsigned | 
                             TokenType.and | TokenType.or | TokenType.XOR | 
                             TokenType.lower | TokenType.greater | TokenType.lowerOrEqual | TokenType.greaterOrEqual | TokenType.notEqual;

export type UnaryPrefixOperator = TokenType.negation | TokenType.not | TokenType.tilde | TokenType.plus | TokenType.plusPlus | TokenType.minusMinus;

export interface ASTNode {
    kind: TokenType;
    range: IRange;    
}

export interface TypeScope {
    classOrInterfaceOrEnumDefinitions: ASTClassDefinitionNode[];
}

export interface ASTGlobalNode extends ASTNode, TypeScope {
    kind: TokenType.global;
    mainProgramNodes: ASTProgramNode[];
}

/**
 * Building blocks for nodes...
 */

export interface ASTDeclarationWithIdentifier {
    identifier: string;
    identifierRange: IRange;
}

export interface ASTNodeWithModifiers {
    range: IRange,
    visibility: VisibilityType;
    isFinal: boolean;
    isStatic: boolean;
    isAbstract: boolean;
}


// e.g. ..., int count, ...
export interface ASTParameterNode extends ASTNode, ASTDeclarationWithIdentifier {
    type: ASTTypeNode;
    isEllipsis: boolean;
}

export interface TypeDefinitionWithMethods {
    methods: ASTMethodDeclarationNode[]
}

export interface ASTTypeDefinitionWithAttributes {
    attributes: ASTAttributeDeclarationNode[]
}

export interface ASTGenericParameterDeclarationNode extends ASTDeclarationWithIdentifier, ASTNode {
    kind: TokenType.genericParameterDefinition;
    extends?: ASTTypeNode[];
    super?: ASTTypeNode;
}

// e.g. class List<E extends Comparable<E>>
export interface ASTTypeDefinitionWithGenerics {
    genericParameterDefinitions: ASTGenericParameterDeclarationNode[]
}


/**
 * Nodes for class, interface, enum
 */
// e.g. HashMap<String, Integer>
export interface ASTTypeNode extends ASTNode {
    identifier: string;
    genericParameterInvocations: ASTTypeNode[];
    arrayDimensions: number;
}

// e.g. public int getValue(String key)
export interface ASTMethodDeclarationNode extends ASTNode, ASTNodeWithModifiers, ASTDeclarationWithIdentifier {
    kind: TokenType.methodDeclaration;
    parameters: ASTParameterNode[];
    returnParameterType: ASTTypeNode | undefined;  // undefined in case of constructor
    isContructor: boolean;
    isAbstract: boolean;
    block: ASTBlockNode | undefined;  // undefined in case of abstract method and methoddeclaration in interface
}                

export interface ASTAttributeDeclarationNode extends ASTNodeWithModifiers, ASTNode, ASTDeclarationWithIdentifier {
    type: ASTTypeNode;
    initialization: ASTTermNode | undefined;
}            

export interface ASTClassDefinitionNode 
extends ASTNode, TypeDefinitionWithMethods, ASTTypeDefinitionWithGenerics, ASTNodeWithModifiers,
    ASTTypeDefinitionWithAttributes, TypeScope, ASTDeclarationWithIdentifier
{
    kind: TokenType.keywordClass;
    parent: TypeScope;
    innerClasses: ASTClassDefinitionNode[]
}

export interface ASTInterfaceDefinitionNode 
extends ASTNode, TypeDefinitionWithMethods, ASTTypeDefinitionWithGenerics, ASTNodeWithModifiers, ASTDeclarationWithIdentifier
{
    kind: TokenType.keywordInterface;
    parent: ASTClassDefinitionNode | null;
}

export interface ASTEnumDefinitionNode 
extends ASTNode, TypeDefinitionWithMethods, ASTNodeWithModifiers,
    ASTTypeDefinitionWithAttributes, ASTDeclarationWithIdentifier
{
    kind: TokenType.keywordEnum;
    parent: ASTClassDefinitionNode | null;
}


/**
 * Nodes for Program, statements
 */

export interface ASTBlockNode extends ASTNode {
    kind: TokenType.block;
    statements: ASTStatementNode[];
}

export interface ASTProgramNode extends ASTNode {
    kind: TokenType.program;
    block: ASTBlockNode;
}

export interface ASTStatementNode extends ASTNode {

}

/**
 * Nodes for Terms
 */

export interface ASTTermNode extends ASTStatementNode {
}

export interface ASTAssignmentNode extends ASTTermNode {
    kind: AssignmentOperator;
    leftSide: ASTTermNode;
    rightSide: ASTTermNode;
}

export interface ASTTernaryNode extends ASTTermNode {
    kind: TokenType.ternaryOperator;
    condition: ASTTermNode;
    termIfTrue: ASTTermNode;
    termIfFalse: ASTTermNode;
}

export interface ASTBinaryNode extends ASTTermNode {
    kind: TokenType.binaryOp;
    precedence?: number;
    operator: BinaryOperator;
    leftSide: ASTTermNode;
    rightSide: ASTTermNode;
}

export interface ASTUnaryPrefixNode extends ASTTermNode {
    kind: TokenType.unaryPrefixOp;
    operator: UnaryPrefixOperator;
    term: ASTTermNode;
}

export interface ASTPlusPlusMinusMinusSuffixNode extends ASTTermNode {
    kind: TokenType.plusPlusMinusMinusSuffix;
    operator: TokenType.plusPlus | TokenType.minusMinus;
    term: ASTTermNode;
}

export interface ASTMethodCallNode extends ASTTermNode {
    kind: TokenType.callMethod;
    methodIdentifier: string;
    parameterValues: ASTTermNode[];
}

export interface ASTAttributeDereferencingNode extends ASTTermNode {
    kind: TokenType.pushAttribute;
    attributeIdentifier: string;
}

export interface ASTNewObjectNode extends ASTTermNode {
    kind: TokenType.newObject;
    classIdentifier: string;
    parameterValues: ASTTermNode;
}

export interface ASTNewArrayNode extends ASTTermNode {
    kind: TokenType.newArray;
    arrayType: ASTTypeNode;
    dimensions: ASTTermNode[];

}
/**
 * Structural statements: while, if, for, case, do...while
 */
export interface ASTWhileNode extends ASTStatementNode {
    kind: TokenType.keywordWhile;
    condition: ASTTermNode;
    block: ASTBlockNode;
}

export interface ASTDoWhileNode extends ASTStatementNode {
    kind: TokenType.keywordDo;
    condition: ASTTermNode;
    block: ASTBlockNode;
}

export interface ASTIfNode extends ASTStatementNode {
    kind: TokenType.keywordIf;
    condition: ASTTermNode;
    blockIfTrue: ASTBlockNode;
    blockIfFalse: ASTBlockNode;
}

export interface ASTForLoopNode extends ASTStatementNode {
    kind: TokenType.keywordFor;
    firstStatement: ASTStatementNode;
    condition: ASTTermNode;
    lastStatement: ASTStatementNode;
    block: ASTBlockNode;
}







