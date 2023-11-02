import { StepParams } from "../../common/interpreter/StepFunction";
import { TokenType } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTBlockNode, ASTDoWhileNode, ASTIfNode, ASTLocalVariableDeclaration, ASTPrintStatementNode, ASTStatementNode, ASTWhileNode } from "../parser/AST";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { CodeSnippet, EmptyPart, StringCodeSnippet } from "./CodeSnippet";
import { BinaryOperatorTemplate, OneParameterOnceTemplate, TwoParameterTemplate } from "./CodeTemplate";
import { JavaLocalVariable } from "./JavaLocalVariable";
import { JumpToLabelCodeSnippet, LabelCodeSnippet } from "./LabelManager.ts";
import { SnippetFramer } from "./SnippetTools.ts";
import { TermCodeGenerator } from "./TermCodeGenerator";

export class StatementCodeGenerator extends TermCodeGenerator {


    constructor(module: JavaCompiledModule, libraryTypestore: JavaTypeStore) {
        super(module, libraryTypestore);
    }


    compileStatementOrTerm(ast: ASTStatementNode | undefined): CodeSnippet | undefined {

        if (!ast) return undefined;

        switch (ast.kind) {
            case TokenType.localVariableDeclaration:
                return this.compileLocaleVariableDeclaration(<ASTLocalVariableDeclaration>ast);
            case TokenType.print:
                return this.compilePrintStatement(<ASTPrintStatementNode>ast);
            case TokenType.keywordIf:
                return this.compileIfStatement(<ASTIfNode>ast);
            case TokenType.block:
                return this.compileBlockNode(<ASTBlockNode>ast); break;
            case TokenType.keywordWhile:
                return this.compileWhileStatement(<ASTWhileNode>ast);
            case TokenType.keywordDo:
                return this.compileDoStatement(<ASTDoWhileNode>ast);


            default: return this.compileTerm(ast);
        }

    }
    compileDoStatement(node: ASTDoWhileNode): CodeSnippet | undefined {
        let condition = this.compileTerm(node.condition);

        let conditionType = condition?.type;
        if(conditionType){
           if(conditionType.identifier != "boolean"){
            this.pushError("Hier wird eine Bedingung erwartet, deren Wert true oder false ergibt.", "error", node.condition);
           }
        }

        let statementToRepeat = this.compileStatementOrTerm(node.statementToRepeat);
        let whileSnippet = new CodeSnippet(node.range, false, false, undefined);

        if (!condition || !statementToRepeat) return undefined;

        let label1 = new LabelCodeSnippet();
        whileSnippet.addPart(label1);
        whileSnippet.addPart(statementToRepeat);
        let sn1 = SnippetFramer.frame(condition, "if($1){\n", this.voidType);
        whileSnippet.addPart(sn1);
        whileSnippet.addPart(new JumpToLabelCodeSnippet(label1));
        whileSnippet.addStringPart("}", undefined);

        return whileSnippet;
    }

    compileBlockNode(node: ASTBlockNode): CodeSnippet | undefined {
        let snippet = new CodeSnippet(node.range, false, false, undefined);
        for (let statementNode of node.statements) {
            let statementSnippet = this.compileStatementOrTerm(statementNode);
            if(statementSnippet) snippet.addPart(statementSnippet);
        }
        return snippet;
    }

    compileWhileStatement(node: ASTWhileNode): CodeSnippet | undefined {
        let condition = this.compileTerm(node.condition);

        let conditionType = condition?.type;
        if(conditionType){
           if(conditionType.identifier != "boolean"){
            this.pushError("Hier wird eine Bedingung erwartet, deren Wert true oder false ergibt.", "error", node.condition);
           }
        }

        let statementToRepeat = this.compileStatementOrTerm(node.statementToRepeat);
        let whileSnippet = new CodeSnippet(node.range, false, false, undefined);

        if (!condition || !statementToRepeat) return undefined;

        let label1 = new LabelCodeSnippet();
        let label2 = new LabelCodeSnippet();
        whileSnippet.addPart(label1);
        let sn1 = SnippetFramer.frame(condition, "if(!($1)){\n", this.voidType);
        whileSnippet.addPart(sn1);
        whileSnippet.addPart(new JumpToLabelCodeSnippet(label2));
        whileSnippet.addStringPart("}", undefined);
        whileSnippet.addPart(statementToRepeat);
        whileSnippet.addPart(new JumpToLabelCodeSnippet(label1));
        whileSnippet.addPart(label2);

        return whileSnippet;
    }



    compileIfStatement(node: ASTIfNode): CodeSnippet | undefined {
        let condition = this.compileTerm(node.condition);

        let conditionType = condition?.type;
        if(conditionType){
           if(conditionType.identifier != "boolean"){
            this.pushError("Hier wird eine Bedingung erwartet, deren Wert true oder false ergibt.", "error", node.condition);
           }
        }

        let statementIfTrue = this.compileStatementOrTerm(node.statementIfTrue);
        let statementIfFalse = this.compileStatementOrTerm(node.statementIfFalse);

        if (!condition || !statementIfTrue) return undefined;

        let ifSnippet = new CodeSnippet(node.range, false, false, undefined);

        let sn1 = SnippetFramer.frame(condition, "if(!($1)){\n", this.voidType);
        let label1 = new LabelCodeSnippet();
        ifSnippet.addPart(sn1);
        let jumpToLabel1 = new JumpToLabelCodeSnippet(label1);
        sn1.addPart(jumpToLabel1);
        sn1.addStringPart("}\n", undefined);
        sn1.endStepAfterSnippet = true;

        
        if (statementIfFalse) {
            let sn2 = new CodeSnippet(node.statementIfTrue.range, false, true, undefined);
            sn2.addPart(statementIfTrue);
            
            let label2 = new LabelCodeSnippet();
            let jumpToLabel2 = new JumpToLabelCodeSnippet(label2);
            
            sn2.addPart(jumpToLabel2);
            ifSnippet.addPart(sn2);
            
            ifSnippet.addPart(label1);
            ifSnippet.addPart(statementIfFalse);
            
            ifSnippet.addPart(label2);
            
        } else {
            ifSnippet.addPart(statementIfTrue);
            // without else case:
            ifSnippet.addPart(label1);
        }

        return ifSnippet;

    }

    compilePrintStatement(node: ASTPrintStatementNode): CodeSnippet | undefined {
        let firstParameter = this.compileTerm(node.firstParameter);
        let secondParameter = this.compileTerm(node.secondParameter);
        if (firstParameter) {
            if (secondParameter) {
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

        if (!(node.initialization || variable.type.isPrimitive)) {
            return new CodeSnippet(node.range, false, false, variable.type, new EmptyPart());
        }

        let accesLocalVariableSnippet = this.compileSymbolOnStackframeAccess(variable, node.identifierRange);
        let initValueSnippet: CodeSnippet | undefined;


        if (node.initialization) {
            initValueSnippet = this.compileTerm(node.initialization);
        } else {
            let defaultValue: string = "" + (<PrimitiveType>variable.type).defaultValue;
            if (typeof defaultValue == "string") defaultValue = '""';
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