import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { Visibility } from "../types/Visibility.ts";

export type ASTNodes = ASTNode[];

export interface ASTNode {
    type: TokenType;
    range: IRange;    
}

export interface ASTGlobalNode extends ASTNode {
    type: TokenType.global;
    classDefinitions: ASTClassDefinitionNode[];
    mainProgramNodes: ASTMainProgramNode[];
}

export interface ASTWithVisibilityModifier {
    visibility: Visibility
}

// e.g. HashMap<String, Integer>
export interface ASTType {
    identifier: string;
    genericParameterAssignments: ASTType[]
}

// e.g. ..., int count, ...
export interface ASTParameter {
    identifier: string;
    type: ASTType;
}

// e.g. public int getValue(String key)
export interface ASTMethodDefinition extends ASTWithVisibilityModifier {
    identifier: string;
    parameters: ASTParameter[];
    returnParameterType: ASTType;
}

export interface TypeDefinitionWithMethods {
    methods: ASTMethodDefinition[]
}

export interface ASTAttributeDefinition extends ASTWithVisibilityModifier {
    identifier: string;
    type: ASTType;
}

export interface ASTTypeDefinitionWithAttributes {
    attributes: ASTAttributeDefinition[]
}

export interface ASTGenericDefinition {
    identifier: string;
    extends?: ASTType;
    super?: ASTType;
}

export interface ASTTypeDefinitionWithGenerics {
    genericDefinitions: ASTGenericDefinition[]
}

export interface ASTClassDefinitionNode 
extends ASTNode, TypeDefinitionWithMethods, ASTTypeDefinitionWithGenerics, ASTWithVisibilityModifier,
    ASTTypeDefinitionWithAttributes
{
    type: TokenType.keywordClass;
    identifier: string;
    innerClasses: ASTClassDefinitionNode[]
}

export interface ASTMainProgramNode extends ASTNode {
    type: TokenType.mainProgram;

}





