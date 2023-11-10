import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaSymbolTable } from "../codegenerator/JavaSymbolTable.ts";
import { GenericTypeParameter } from "../types/GenericInformation.ts";
import { JavaType } from "../types/JavaType.ts";
import { NonPrimitiveType } from "../types/NonPrimitiveType.ts";
import { Visibility } from "../types/Visibility.ts";

export type ASTNodes = ASTNode[];

export type AssignmentOperator = TokenType.assignment | TokenType.minusAssignment | TokenType.plusAssignment | TokenType.multiplicationAssignment | TokenType.divisionAssignment | TokenType.moduloAssignment;

export type LogicOperator = TokenType.and | TokenType.or | TokenType.XOR;

export type ShiftOperator = TokenType.shiftLeft | TokenType.shiftRight | TokenType.shiftRightUnsigned;

export type ComparisonOperator = TokenType.lower | TokenType.greater | TokenType.lowerOrEqual | TokenType.greaterOrEqual | TokenType.notEqual | TokenType.equal;

export type BinaryOperator = AssignmentOperator |
    TokenType.plus | TokenType.minus | TokenType.multiplication | TokenType.division | TokenType.modulo |
    ShiftOperator | LogicOperator | ComparisonOperator;

export type UnaryPrefixOperator = TokenType.negation | TokenType.not | TokenType.tilde | TokenType.plus | TokenType.plusPlus | TokenType.minusMinus;

export type ConstantType = TokenType.shortConstant | TokenType.integerConstant | TokenType.longConstant | TokenType.charConstant | TokenType.stringConstant | TokenType.booleanConstant;

export interface ASTNode {
    kind: TokenType;
    range: IRange;
    symbolTable?: JavaSymbolTable;
}

export interface TypeScope {
    classOrInterfaceOrEnumDefinitions: (ASTClassDefinitionNode | ASTInterfaceDefinitionNode | ASTEnumDefinitionNode)[];
}

export interface ASTGlobalNode extends ASTNode, TypeScope {
    kind: TokenType.global;
    mainProgramNode: ASTProgramNode;

    collectedTypeNodes: ASTTypeNode[];
}

/**
 * Building blocks for nodes...
 */

export interface ASTTypeDefiningNode {
    resolvedType?: NonPrimitiveType;
}

export interface ASTNodeWithIdentifier {
    identifier: string;
    identifierRange: IRange;
}

export interface ASTNodeWithModifiers {
    range: IRange,
    visibility: Visibility;
    isFinal: boolean;
    isStatic: boolean;
    isAbstract: boolean;
}


// e.g. ..., int count, ...
export interface ASTParameterNode extends ASTNode, ASTNodeWithIdentifier {
    kind: TokenType.parameterDeclaration;
    type: ASTTypeNode | undefined;    // lambda functions may have parameters without type declaration
    isEllipsis: boolean;
}

export interface AnnotatedNode {
    annotations: ASTAnnotationNode[]
}

export interface TypeDefinitionWithMethods {
    methods: ASTMethodDeclarationNode[]
}

export interface ASTTypeDefinitionWithFields {
    fields: ASTFieldDeclarationNode[]
}

export interface ASTGenericParameterDeclarationNode extends ASTNodeWithIdentifier, ASTNode {
    kind: TokenType.genericParameterDefinition;
    extends?: ASTTypeNode[];
    super?: ASTTypeNode;
    resolvedType?: GenericTypeParameter;
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
    kind: TokenType.type,
    identifier: string;
    genericParameterInvocations: ASTTypeNode[];
    arrayDimensions: number;
    isVoidType: boolean;
    isVarKeyword: boolean;  // type inference...
    enclosingClassOrInterface?: ASTClassDefinitionNode | ASTInterfaceDefinitionNode

    resolvedType?: JavaType;
}

// e.g. public int getValue(String key)
export interface ASTMethodDeclarationNode extends ASTNode, ASTNodeWithModifiers,
    ASTNodeWithIdentifier, AnnotatedNode {
    kind: TokenType.methodDeclaration;
    parameters: ASTParameterNode[];
    returnParameterType: ASTTypeNode | undefined;  // undefined in case of constructor
    isContructor: boolean;
    isAbstract: boolean;
    statement: ASTStatementNode | undefined;  // undefined in case of abstract method and methoddeclaration in interface
}

export interface ASTLambdaFunctionDeclarationNode extends ASTNode {
    kind: TokenType.lambda,
    parameters: ASTParameterNode[],
    statement: ASTStatementNode | undefined
}

export interface ASTFieldDeclarationNode extends ASTNodeWithModifiers, ASTNode,
    ASTNodeWithIdentifier, AnnotatedNode {
    kind: TokenType.attributeDeclaration;
    type: ASTTypeNode;
    initialization: ASTTermNode | undefined;
}

export interface ASTClassDefinitionNode
    extends ASTNode, TypeDefinitionWithMethods, ASTTypeDefinitionWithGenerics, ASTNodeWithModifiers,
    ASTTypeDefinitionWithFields, TypeScope, ASTNodeWithIdentifier, AnnotatedNode,
    ASTTypeDefiningNode {
    kind: TokenType.keywordClass;
    parent: TypeScope;
    innerClasses: ASTClassDefinitionNode[],
    extends: ASTTypeNode | undefined,
    implements: ASTTypeNode[]
}

export interface ASTInterfaceDefinitionNode
    extends ASTNode, TypeDefinitionWithMethods, ASTTypeDefinitionWithGenerics, ASTNodeWithModifiers,
    ASTNodeWithIdentifier, AnnotatedNode, ASTTypeDefiningNode {
    kind: TokenType.keywordInterface;
    parent: TypeScope;
    implements: ASTTypeNode[];
}

export interface ASTEnumValueNode extends ASTNode {
    kind: TokenType.initializeEnumValue;
    identifier: string;
    identifierRange: IRange;
    parameterValues: ASTTermNode[];
}

export interface ASTEnumDefinitionNode
    extends ASTNode, TypeDefinitionWithMethods, ASTNodeWithModifiers,
    ASTTypeDefinitionWithFields, ASTNodeWithIdentifier,
    AnnotatedNode, ASTTypeDefiningNode {
    kind: TokenType.keywordEnum;
    parent: TypeScope;
    valueNodes: ASTEnumValueNode[];
}


/**
 * Nodes for Program, statements
 */

export interface ASTBlockNode extends ASTStatementNode {
    kind: TokenType.block;
    statements: ASTStatementNode[];
}

export interface ASTProgramNode extends ASTNode {
    kind: TokenType.program;
    statements: ASTStatementNode[];
}

export interface ASTStatementNode extends ASTNode {

}

/**
 * Nodes for Terms
 */

export interface ASTTermNode extends ASTStatementNode {
    parenthesisNeeded?: boolean;
}

export interface ASTCastNode extends ASTTermNode {
    kind: TokenType.castValue;
    castType: ASTTypeNode;
    objectToCast: ASTTermNode;
}

export interface ASTSymbolNode extends ASTTermNode {
    kind: TokenType.symbol;
    identifier: string;
}

// export interface ASTAssignmentNode extends ASTTermNode {
//     kind: AssignmentOperator;
//     leftSide: ASTTermNode;
//     rightSide: ASTTermNode;
// }

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
    operatorRange: IRange,
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

export interface ASTMethodCallNode extends ASTNodeWithIdentifier, ASTTermNode {
    kind: TokenType.methodCall;
    nodeToGetObject: ASTTermNode | undefined; // undefined if method is called inside class
    parameterValues: ASTTermNode[];
}

export interface ASTAttributeDereferencingNode extends ASTTermNode {
    kind: TokenType.dereferenceAttribute;
    attributeIdentifier: string;
}

export interface ASTNewObjectNode extends ASTTermNode {
    kind: TokenType.newObject;
    type: ASTTypeNode;
    parameterValues: ASTTermNode[];
}

// Tobias: new Array
export interface ASTNewArrayNode extends ASTTermNode {
    kind: TokenType.newArray;
    arrayType: ASTTypeNode;
    dimensions: ASTTermNode[];

}

export interface ASTSelectArrayElementNode extends ASTTermNode {
    kind: TokenType.selectArrayElement,
    array: ASTTermNode,
    indices: ASTTermNode[]
}

export interface ASTPrintStatementNode extends ASTTermNode {
    kind: TokenType.print,
    isPrintln: boolean,
    firstParameter: ASTTermNode | undefined,
    secondParameter: ASTTermNode | undefined
}

export interface ASTLiteralNode extends ASTTermNode {
    kind: TokenType.literal,
    constantType: TokenType,
    value: string | boolean | number
}

export interface ASTThisNode extends ASTTermNode {
    kind: TokenType.keywordThis;
}

export interface ASTSuperNode extends ASTTermNode {
    kind: TokenType.keywordSuper;
}

export interface ASTLocalVariableDeclaration extends ASTStatementNode, ASTNodeWithIdentifier {
    kind: TokenType.localVariableDeclaration;
    type: ASTTypeNode;
    initialization: ASTTermNode | undefined;
}

/**
 * Structural statements: while, if, for, case, do...while
 */
export interface ASTWhileNode extends ASTStatementNode {
    kind: TokenType.keywordWhile;
    condition: ASTTermNode;
    statementToRepeat: ASTStatementNode;
}

export interface ASTDoWhileNode extends ASTStatementNode {
    kind: TokenType.keywordDo;
    condition: ASTTermNode;
    statementToRepeat: ASTStatementNode;
}

export interface ASTIfNode extends ASTStatementNode {
    kind: TokenType.keywordIf;
    condition: ASTTermNode;
    statementIfTrue: ASTStatementNode;
    statementIfFalse: ASTStatementNode | undefined;
}

export interface ASTForLoopNode extends ASTStatementNode {
    kind: TokenType.keywordFor;
    firstStatement: ASTStatementNode | undefined;
    condition: ASTTermNode | undefined;
    lastStatement: ASTStatementNode | undefined;
    statementToRepeat: ASTStatementNode;
}

export interface ASTSimpifiedForLoopNode extends ASTStatementNode {
    kind: TokenType.forLoopOverCollection;
    elementType: ASTTypeNode;
    elementIdentifier: string;
    elementIdentifierPosition: IRange;
    collection: ASTTermNode;
    statementToRepeat: ASTStatementNode;
}

export interface ASTCaseNode extends ASTNode {
    kind: TokenType.keywordCase;
    constant: ASTTermNode | undefined;  // undefined in case of default:
    statements: ASTStatementNode[];
}

export interface ASTSwitchCaseNode extends ASTStatementNode {
    kind: TokenType.keywordSwitch;
    term: ASTTermNode;
    caseNodes: ASTCaseNode[];
    defaultNode: ASTCaseNode | undefined;
}

export interface ASTContinueNode extends ASTStatementNode {
    kind: TokenType.keywordContinue;
}

export interface ASTBreakNode extends ASTStatementNode {
    kind: TokenType.keywordBreak;
}

export interface ASTReturnNode extends ASTStatementNode {
    kind: TokenType.keywordReturn;
    term: ASTTermNode | undefined;
}

export interface ASTCatchNode extends ASTStatementNode {
    kind: TokenType.keywordCatch;
    exceptionTypes: ASTTypeNode[],
    exceptionIdentifier: string,
    exceptionIdentifierPosition: IRange,
    statement: ASTStatementNode
}

export interface ASTTryCatchNode extends ASTStatementNode {
    kind: TokenType.keywordTry;
    statement: ASTStatementNode;
    catchCases: ASTCatchNode[]
}

export interface ASTAnnotationNode extends ASTStatementNode {
    kind: TokenType.annotation;
    identifier: string;
}