import { Error } from "../../common/Error.ts";
import { TokenList } from "../lexer/Token.ts";
import { JavaMethod } from "../types/JavaMethod.ts";
import { ASTBlockNode, ASTClassDefinitionNode, ASTGlobalNode, ASTNode } from "./AST.ts";

export interface JavaCompileData {
    
    tokens?: TokenList;
    ast?: ASTGlobalNode | ASTBlockNode;    // GlobalNode if Program, BlockNode if Statements (for REPL)
    errors: Error[];

    pushMethodCallPosition(identifierRange: monaco.IRange, commaPositions: monaco.IPosition[],
        possibleMethods: JavaMethod[] | string, rightBracketPosition: monaco.IPosition,
    bestMethod?: JavaMethod): void;

    mainClass?: ASTClassDefinitionNode;

}