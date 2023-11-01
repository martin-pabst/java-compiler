import { StepParams } from "../../common/interpreter/StepFunction";
import { TokenType } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTLocalVariableDeclaration, ASTPrintStatementNode, ASTStatementNode } from "../parser/AST";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { CodeSnippet, EmptyPart, StringCodeSnippet } from "./CodeSnippet";
import { BinaryOperatorTemplate, OneParameterOnceTemplate, TwoParameterTemplate } from "./CodeTemplate";
import { JavaLocalVariable } from "./JavaLocalVariable";
import { TermCodeGenerator } from "./TermCodeGenerator";

export class StatementCodeGenerator extends TermCodeGenerator {


    constructor(module: JavaCompiledModule, libraryTypestore: JavaTypeStore) {
        super(module, libraryTypestore);
    }


    compileStatementOrTerm(ast: ASTStatementNode): CodeSnippet | undefined {

        switch (ast.kind) {
            case TokenType.localVariableDeclaration: return this.compileLocaleVariableDeclaration(<ASTLocalVariableDeclaration>ast);
            case TokenType.print: return this.compilePrintStatement(<ASTPrintStatementNode>ast);            
            default: return this.compileTerm(ast);
        }

    }

    compilePrintStatement(node: ASTPrintStatementNode): CodeSnippet | undefined {
        let firstParameter = this.compileTerm(node.firstParameter);
        let secondParameter = this.compileTerm(node.secondParameter);
        if(firstParameter){
            if(secondParameter){
                return new TwoParameterTemplate(`${StepParams.helperObject}.print($1, ${node.isPrintln}, $2)`)
                .applyToSnippets(this.voidType, node.range, this.libraryTypestore, firstParameter, secondParameter)
                .addSemicolon(true);
            }
            return new OneParameterOnceTemplate(`${StepParams.helperObject}.print($1, ${node.isPrintln}, undefined)`)
            .applyToSnippets(this.voidType, node.range, this.libraryTypestore, firstParameter)
            .addSemicolon(true);
        }
        let snippet = new CodeSnippet(node.range, false, false, this.voidType, new StringCodeSnippet(`${StepParams.helperObject}.print(undefined, ${node.isPrintln}, undefined)`, node.range));
        return snippet.addSemicolon(true);
    }

    compileLocaleVariableDeclaration(node: ASTLocalVariableDeclaration): CodeSnippet | undefined {
        let variable = new JavaLocalVariable(node.identifier, node.identifierRange, node.type.resolvedType!);
        this.currentSymbolTable.addSymbol(variable);    // sets stackOffset

        if(!(node.initialization || variable.type.isPrimitive)){
            return new CodeSnippet(node.range, false, false, variable.type, new EmptyPart());
        }

        let accesLocalVariableSnippet = this.compileSymbolOnStackframeAccess(variable, node.identifierRange);
        let initValueSnippet: CodeSnippet | undefined;


        if (node.initialization) {
            initValueSnippet = this.compileTerm(node.initialization);
        } else {
            let defaultValue: string = "" + (<PrimitiveType>variable.type).defaultValue;
            if(typeof defaultValue == "string") defaultValue = '""';
            initValueSnippet = new CodeSnippet(node.range, false, false, variable.type, new StringCodeSnippet(defaultValue, node.range));
        }

        if (initValueSnippet && accesLocalVariableSnippet) {
            return new BinaryOperatorTemplate('=', false)
            .applyToSnippets(variable.type, node.range, this.libraryTypestore, accesLocalVariableSnippet, initValueSnippet)
            .addSemicolon(true);
        }

        return undefined;
    }


}