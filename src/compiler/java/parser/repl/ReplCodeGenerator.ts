import { Program } from "../../../common/interpreter/Program.ts";
import { CodeSnippet } from "../../codegenerator/CodeSnippet.ts";
import { ExceptionTree } from "../../codegenerator/ExceptionTree.ts";
import { JavaSymbolTable } from "../../codegenerator/JavaSymbolTable.ts";
import { StatementCodeGenerator } from "../../codegenerator/StatementCodeGenerator.ts";
import { JavaCompiledModule } from "../../module/JavaCompiledModule.ts";
import { JavaTypeStore } from "../../module/JavaTypeStore.ts";
import { JavaType } from "../../types/JavaType.ts";
import { ASTAnonymousClassNode, ASTLambdaFunctionDeclarationNode } from "../AST.ts";


export class ReplCodeGenerator extends StatementCodeGenerator {

    constructor(module: JavaCompiledModule, libraryTypestore: JavaTypeStore, compiledTypesTypestore: JavaTypeStore,
        exceptionTree: ExceptionTree) {
        super(module, libraryTypestore, compiledTypesTypestore, exceptionTree);

    }

    start(baseSymbolTable: JavaSymbolTable){
        let symbolTable = new JavaSymbolTable(this.module, this.module.ast!.range, true, baseSymbolTable);
        this.symbolTableStack.push(symbolTable)

        this.module.programsToCompileToFunctions = [];

        for(let statement of this.module.ast!.mainProgramNode.statements){
            let snippet = this.compileStatementOrTerm(statement);
        }

    }


    compileAnonymousInnerClass(node: ASTAnonymousClassNode): CodeSnippet | undefined {
        throw new Error("Method not implemented.");
    }

    compileLambdaFunction(node: ASTLambdaFunctionDeclarationNode, expectedType: JavaType | undefined): CodeSnippet | undefined {
        throw new Error("Method not implemented.");
    }

}