import { Error } from "../../../common/Error.ts";
import { EmptyRange } from "../../../common/range/Range.ts";
import { TokenType } from "../../TokenType.ts";
import { Lexer } from "../../lexer/Lexer.ts";
import { TokenList } from "../../lexer/Token.ts";
import { JavaMethod } from "../../types/JavaMethod.ts";
import { ASTGlobalNode, ASTBlockNode, ASTClassDefinitionNode } from "../AST.ts";
import { JavaCompileData } from "../JavaCompileData.ts";

export class ReplStatement implements JavaCompileData {
    tokens: TokenList;
    ast?: ASTGlobalNode | ASTBlockNode;    // GlobalNode if Program, BlockNode if Statements (for REPL)
    errors: Error[] = [];


    mainClass?: ASTClassDefinitionNode = undefined;     // we don't use this

    pushMethodCallPosition(identifierRange: monaco.IRange, commaPositions: monaco.IPosition[],
        possibleMethods: JavaMethod[] | string, rightBracketPosition: monaco.IPosition,
    bestMethod?: JavaMethod): void {
        // do nothing
    }

    constructor(code: string){
        let lexer = new Lexer();
        let lexOutput = lexer.lex(code);

        this.errors = lexOutput.errors;
        this.tokens = lexOutput.tokens;

        this.ast = {
            kind: TokenType.block,
            range: EmptyRange.instance,
            statements: [],
            collectedTypeNodes: []
        }
    }

}