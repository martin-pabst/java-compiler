import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";

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

export interface ASTClassDefinitionNode extends ASTNode {
    type: TokenType.keywordClass;
}

export interface ASTMainProgramNode extends ASTNode {
    type: TokenType.mainProgram;

}



