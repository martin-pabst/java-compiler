import { JCM } from "../../../../tools/language/JavaCompilerMessages.ts";
import { TokenType } from "../../TokenType.ts";
import { JavaCompiledModule } from "../../module/JavaCompiledModule.ts";
import { ASTAnonymousClassNode, ASTClassDefinitionNode, ASTEnumDefinitionNode, ASTInterfaceDefinitionNode, ASTNewObjectNode, ASTNodeWithModifiers, ASTProgramNode } from "../AST.ts";
import { JavaCompileData } from "../JavaCompileData.ts";
import { StatementParser } from "../StatementParser.ts";


export class ReplParser extends StatementParser {


    constructor(compileData: JavaCompileData) {
        super(compileData);
        this.initializeAST();
    }

    initializeAST() {
        let globalRange = {
            startLineNumber: 0, startColumn: 0,
            endLineNumber: this.endToken.range.endLineNumber, endColumn: this.endToken.range.endColumn
        };

        this.compileData.ast!.range = globalRange;
    }

    parse() {

        while (!this.isEnd()) {
            let pos = this.pos;

            this.parseStatementOrExpression(false);

            if (pos == this.pos) {
                this.pushError(JCM.unexpectedToken("" + this.cct.value), "warning");
                this.nextToken();   // last safety net to prevent getting stuck in an endless loop
            }
        }

    }


    parseFieldOrMethodDeclaration(classASTNode: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode, modifiers: ASTNodeWithModifiers): void {
        throw new Error("Method not implemented.");
    }
    parseAnonymousInnerClassBody(newObjectNode: ASTNewObjectNode): ASTAnonymousClassNode | undefined {
        throw new Error("Method not implemented.");
    }


}

