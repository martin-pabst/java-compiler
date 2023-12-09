import { Program } from "../../common/interpreter/Program.ts";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaSymbolTable } from "../codegenerator/JavaSymbolTable.ts";
import { LabelCodeSnippet } from "../codegenerator/LabelManager.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";
import { GenericTypeParameter } from "../types/GenericInformation.ts";
import { JavaClass } from "../types/JavaClass.ts";
import { JavaEnum } from "../types/JavaEnum.ts";
import { JavaInterface } from "../types/JavaInterface.ts";
import { JavaType } from "../types/JavaType.ts";
import { Method } from "../types/Method.ts";
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

export interface ASTDebugProgram extends ASTNode {
    kind: TokenType.astProgram,
    program: Program;
}

export interface TypeScope {
    kind: TokenType.keywordClass | TokenType.keywordInterface | TokenType.keywordEnum | TokenType.global;
    classOrInterfaceOrEnumDefinitions: (ASTClassDefinitionNode | ASTInterfaceDefinitionNode | ASTEnumDefinitionNode)[];
    path: string;
}

export interface ASTGlobalNode extends ASTNode, TypeScope {
    kind: TokenType.global;
    mainProgramNode: ASTProgramNode;

    collectedTypeNodes: ASTTypeNode[];

    program?: Program;  // only for debugging purposes

}

/**
 * Building blocks for nodes...
 */

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
    isDefault: boolean;
}


// e.g. ..., int count, ...
export interface ASTParameterNode extends ASTNode, ASTNodeWithIdentifier {
    kind: TokenType.parameterDeclaration;
    type: ASTTypeNode | undefined;    // lambda functions may have parameters without type declaration
    isEllipsis: boolean;
    isFinal: boolean;
}

export interface AnnotatedNode {
    annotations: ASTAnnotationNode[]
}

export interface TypeDefinition {
    resolvedType: JavaType | undefined;
    path: string;
    parent?: TypeScope;
    module: JavaCompiledModule;
}

export interface TypeDefinitionWithMethods {
    methods: ASTMethodDeclarationNode[]
}

export interface ASTTypeDefinitionWithFields {
    fieldsOrInstanceInitializers: (ASTFieldDeclarationNode | ASTInstanceInitializerNode | ASTStaticInitializerNode)[]
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
    
    parentTypeScope?: TypeScope

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
    method?: Method;
    program?: Program,       // only for debugging purposes
}

export interface ASTLambdaFunctionDeclarationNode extends ASTNode {
    kind: TokenType.lambdaOperator,
    parameters: ASTParameterNode[],
    statement: ASTStatementNode | undefined
}

export interface ASTFieldDeclarationNode extends ASTNodeWithModifiers, ASTNode,
    ASTNodeWithIdentifier, AnnotatedNode {
    kind: TokenType.fieldDeclaration;
    type: ASTTypeNode;
    initialization: ASTTermNode | undefined;
}

export interface ASTInstanceInitializerNode extends ASTStatementNode {
    kind: TokenType.instanceInitializerBlock,
    statements: ASTStatementNode[]
}

export interface ASTStaticInitializerNode extends ASTStatementNode {
    kind: TokenType.staticInitializerBlock,
    statements: ASTStatementNode[]
}

export interface ASTClassDefinitionNode
    extends ASTNode, TypeDefinitionWithMethods, ASTTypeDefinitionWithGenerics, ASTNodeWithModifiers,
    ASTTypeDefinitionWithFields, TypeScope, ASTNodeWithIdentifier, AnnotatedNode, TypeDefinition {
    kind: TokenType.keywordClass;
    extends: ASTTypeNode | undefined,
    implements: ASTTypeNode[],
    resolvedType: JavaClass | undefined;

    staticInitializer?: Program       // only for debugging purposes,
}

export interface ASTInterfaceDefinitionNode
extends ASTNode, TypeDefinitionWithMethods, ASTTypeDefinitionWithGenerics, ASTNodeWithModifiers,
ASTNodeWithIdentifier, AnnotatedNode, ASTTypeDefinitionWithFields, TypeScope, TypeDefinition {
    kind: TokenType.keywordInterface;
    implements: ASTTypeNode[];
    resolvedType: JavaInterface | undefined;

    staticInitializer?: Program       // only for debugging purposes,
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
    AnnotatedNode, TypeDefinition, TypeScope {
    kind: TokenType.keywordEnum;
    valueNodes: ASTEnumValueNode[];
    resolvedType: JavaEnum | undefined;

    staticInitializer?: Program       // only for debugging purposes,
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
    nodeToGetObject: ASTTermNode | undefined;
    attributeIdentifier: string;
}

export interface ASTNewObjectNode extends ASTTermNode {
    kind: TokenType.newObject;
    type: ASTTypeNode;
    parameterValues: ASTTermNode[];
    object?: ASTTermNode;
}

export interface ASTAnonymousClassNode extends ASTTermNode {
    kind: TokenType.anonymousClass;
    newObjectNode: ASTNewObjectNode;
    klass: ASTClassDefinitionNode;
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
    isFinal: boolean;
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

export interface ASTThrowNode extends ASTStatementNode {
    kind: TokenType.keywordThrow;
    exception: ASTTermNode;
}

export interface ASTTryCatchNode extends ASTStatementNode {
    kind: TokenType.keywordTry;
    tryStatement: ASTStatementNode;
    catchCases: ASTCatchNode[];
    finallyStatement?: ASTStatementNode;
}

export interface ASTAnnotationNode extends ASTStatementNode {
    kind: TokenType.annotation;
    identifier: string;
}