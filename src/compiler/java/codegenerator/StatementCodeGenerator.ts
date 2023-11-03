import { StepParams } from "../../common/interpreter/StepFunction";
import { TokenType } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTBlockNode, ASTDoWhileNode, ASTIfNode, ASTLocalVariableDeclaration, ASTNode, ASTPrintStatementNode, ASTStatementNode, ASTWhileNode } from "../parser/AST";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { JavaType } from "../types/JavaType.ts";
import { CodeSnippetContainer, EmptyPart } from "./CodeSnippetKinds.ts";
import { CodeSnippet as CodeSnippet, StringCodeSnippet } from "./CodeSnippet.ts";
import { BinaryOperatorTemplate, OneParameterOnceTemplate, TwoParameterTemplate } from "./CodeTemplate";
import { JavaLocalVariable } from "./JavaLocalVariable";
import { JumpToLabelCodeSnippet, LabelCodeSnippet } from "./LabelManager.ts";
import { SnippetFramer } from "./CodeSnippetTools.ts";
import { TermCodeGenerator } from "./TermCodeGenerator";

export class StatementCodeGenerator extends TermCodeGenerator {


    constructor(module: JavaCompiledModule, libraryTypestore: JavaTypeStore) {
        super(module, libraryTypestore);
    }


    compileStatementOrTerm(ast: ASTStatementNode | undefined): CodeSnippet | undefined {

        if (!ast) return undefined;

        let snippet: CodeSnippet | undefined;

        switch (ast.kind) {
            case TokenType.localVariableDeclaration:
                snippet = this.compileLocaleVariableDeclaration(<ASTLocalVariableDeclaration>ast); break;
            case TokenType.print:
                snippet = this.compilePrintStatement(<ASTPrintStatementNode>ast); break;
            case TokenType.keywordIf:
                snippet = this.compileIfStatement(<ASTIfNode>ast); break;
            case TokenType.block:
                snippet = this.compileBlockNode(<ASTBlockNode>ast); break;
            case TokenType.keywordWhile:
                snippet = this.compileWhileStatement(<ASTWhileNode>ast); break;
            case TokenType.keywordDo:
                snippet = this.compileDoStatement(<ASTDoWhileNode>ast); break;


            default: snippet = this.compileTerm(ast);
        }

        // enforce new step before snippet
        if(snippet){
            if(!(snippet instanceof CodeSnippetContainer)){
                snippet = new CodeSnippetContainer(snippet, snippet.range, snippet.type);
            } 

            (<CodeSnippetContainer>snippet).enforceNewStepBeforeSnippet();
        } 
        
        

        return snippet;

    }
    compileDoStatement(node: ASTDoWhileNode): CodeSnippetContainer | undefined {
        let condition = this.compileTerm(node.condition);

        this.printErrorifValueNotBoolean(condition?.type, node.condition);

        let statementToRepeat = this.compileStatementOrTerm(node.statementToRepeat);
        let doWhileSnippet = new CodeSnippetContainer([], node.range);

        if (!condition || !statementToRepeat) return undefined;

        let label1 = new LabelCodeSnippet();
        doWhileSnippet.addPart(label1);
        doWhileSnippet.addPart(statementToRepeat);
        doWhileSnippet.addNextStepMark();
        let sn1 = SnippetFramer.frame(condition, "if($1){\n", this.voidType);
        doWhileSnippet.addPart(sn1);
        doWhileSnippet.addPart(new JumpToLabelCodeSnippet(label1));
        doWhileSnippet.addStringPart("}", undefined);
        doWhileSnippet.addNextStepMark();

        return doWhileSnippet;
    }

    compileBlockNode(node: ASTBlockNode): CodeSnippetContainer | undefined {
        let snippet = new CodeSnippetContainer([], node.range);
        for (let statementNode of node.statements) {
            let statementSnippet = this.compileStatementOrTerm(statementNode);
            if(statementSnippet) snippet.addPart(statementSnippet);
        }
        return snippet;
    }

    printErrorifValueNotBoolean(type: JavaType | undefined, node: ASTNode){
        if(!type) return;
        if(type.identifier != "boolean"){
            this.pushError("Hier wird eine Bedingung erwartet, deren Wert true oder false ergibt. Der Datentyp dieses Terms ist " + type.identifier, "error", node);
           }
    }

    compileWhileStatement(node: ASTWhileNode): CodeSnippetContainer | undefined {
        let condition = this.compileTerm(node.condition);

        this.printErrorifValueNotBoolean(condition?.type, node.condition);

        let statementToRepeat = this.compileStatementOrTerm(node.statementToRepeat);
        let whileSnippet = new CodeSnippetContainer([], node.range);

        if (!condition || !statementToRepeat) return undefined;

        let label1 = new LabelCodeSnippet();
        let label2 = new LabelCodeSnippet();
        whileSnippet.addPart(label1);
        let sn1 = SnippetFramer.frame(condition, "if(!($1)){\n", this.voidType);
        whileSnippet.addPart(sn1);
        whileSnippet.addPart(new JumpToLabelCodeSnippet(label2));
        whileSnippet.addStringPart("}", undefined);
        whileSnippet.addNextStepMark();
        whileSnippet.addPart(statementToRepeat);
        whileSnippet.addPart(new JumpToLabelCodeSnippet(label1));
        whileSnippet.addNextStepMark();
        whileSnippet.addPart(label2);

        return whileSnippet;
    }



    compileIfStatement(node: ASTIfNode): CodeSnippetContainer | undefined {
        let condition = this.compileTerm(node.condition);

        this.printErrorifValueNotBoolean(condition?.type, node.condition);

        let statementIfTrue = this.compileStatementOrTerm(node.statementIfTrue);
        let statementIfFalse = this.compileStatementOrTerm(node.statementIfFalse);

        if (!condition || !statementIfTrue) return undefined;

        let ifSnippet = new CodeSnippetContainer([], node.range);

        let sn1 = SnippetFramer.frame(condition, "if(!($1)){\n", this.voidType);
        let label1 = new LabelCodeSnippet();
        ifSnippet.addPart(sn1);
        let jumpToLabel1 = new JumpToLabelCodeSnippet(label1);
        ifSnippet.addPart(jumpToLabel1);
        ifSnippet.addStringPart("}\n", undefined);
        
        ifSnippet.addNextStepMark();
        
        if (statementIfFalse) {
            let label2 = new LabelCodeSnippet();
            let jumpToLabel2 = new JumpToLabelCodeSnippet(label2);

            ifSnippet.addPart(statementIfTrue);
            
            ifSnippet.addPart(jumpToLabel2);
            ifSnippet.addNextStepMark();
            
            ifSnippet.addPart(label1);
            ifSnippet.addPart(statementIfFalse);
            
            ifSnippet.addNextStepMark();
            ifSnippet.addPart(label2);
            
        } else {
            ifSnippet.addPart(statementIfTrue);
            ifSnippet.addNextStepMark();
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
                return new TwoParameterTemplate(`${StepParams.helperObject}.print($1, ${node.isPrintln}, $2);\n`)
                    .applyToSnippet(this.voidType, node.range, this.libraryTypestore, firstParameter, secondParameter)
            }
            return new OneParameterOnceTemplate(`${StepParams.helperObject}.print($1, ${node.isPrintln}, undefined);\n`)
                .applyToSnippet(this.voidType, node.range, this.libraryTypestore, firstParameter);
        }
        return new StringCodeSnippet(`${StepParams.helperObject}.print(undefined, ${node.isPrintln}, undefined);\n`, node.range);
    }

    compileLocaleVariableDeclaration(node: ASTLocalVariableDeclaration): CodeSnippet | undefined {
        let variable = new JavaLocalVariable(node.identifier, node.identifierRange, node.type.resolvedType!);
        this.currentSymbolTable.addSymbol(variable);    // sets stackOffset

        if (!(node.initialization || variable.type.isPrimitive)) {
            return new EmptyPart();
        }

        let accesLocalVariableSnippet = this.compileSymbolOnStackframeAccess(variable, node.identifierRange);
        let initValueSnippet: CodeSnippet | undefined;


        if (node.initialization) {
            initValueSnippet = this.compileTerm(node.initialization);
        } else {
            let defaultValue: string = (<PrimitiveType>variable.type).defaultValue;
            if (typeof defaultValue == "string") defaultValue = '""';
            initValueSnippet = new StringCodeSnippet(defaultValue, node.range, variable.type);
        }

        if (initValueSnippet && accesLocalVariableSnippet) {
            let snippet = new BinaryOperatorTemplate('=', false)
                .applyToSnippet(variable.type, node.range, this.libraryTypestore, accesLocalVariableSnippet, initValueSnippet);
            return SnippetFramer.frame(snippet, '$1;');
        }

        return undefined;
    }


}