import { Helpers, StepParams } from "../../common/interpreter/StepFunction";
import { TokenType } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTBlockNode, ASTDoWhileNode, ASTForLoopNode, ASTIfNode, ASTLocalVariableDeclaration, ASTMethodCallNode, ASTNode, ASTPrintStatementNode, ASTReturnNode, ASTStatementNode, ASTThrowNode, ASTTryCatchNode, ASTWhileNode } from "../parser/AST";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { JavaType } from "../types/JavaType.ts";
import { CodeSnippetContainer, EmptyPart } from "./CodeSnippetKinds.ts";
import { CodeSnippet as CodeSnippet, StringCodeSnippet } from "./CodeSnippet.ts";
import { BinaryOperatorTemplate, OneParameterTemplate, TwoParameterTemplate } from "./CodeTemplate";
import { JavaLocalVariable } from "./JavaLocalVariable";
import { JumpToLabelCodeSnippet, LabelCodeSnippet } from "./LabelManager.ts";
import { SnippetFramer } from "./CodeSnippetTools.ts";
import { TermCodeGenerator } from "./TermCodeGenerator";
import { Method } from "../types/Method.ts";
import { NonPrimitiveType } from "../types/NonPrimitiveType.ts";
import { CatchBlockInfo } from "../../common/interpreter/ExceptionInfo.ts";

export class StatementCodeGenerator extends TermCodeGenerator {


    constructor(module: JavaCompiledModule, libraryTypestore: JavaTypeStore, compiledTypesTypestore: JavaTypeStore) {
        super(module, libraryTypestore, compiledTypesTypestore);
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
            case TokenType.keywordFor:
                snippet = this.compileForStatement(<ASTForLoopNode>ast); break;
            case TokenType.keywordReturn:
                snippet = this.compileReturnStatement(<ASTReturnNode>ast); break;
            case TokenType.keywordTry:
                snippet = this.compileTryCatchStatement(<ASTTryCatchNode>ast); break;
            case TokenType.keywordThrow:
                snippet = this.compileThrowStatement(<ASTThrowNode>ast); break;


            default:
                snippet = this.compileTerm(ast);
                if (snippet) {
                    if(!snippet.endsWith(";\n")) snippet = new CodeSnippetContainer(SnippetFramer.frame(snippet, '§1;\n'));
                }
        }

        // enforce new step before snippet
        if (snippet) {
            if (!(snippet instanceof CodeSnippetContainer)) {
                snippet = new CodeSnippetContainer(snippet, snippet.range, snippet.type);
            }

            (<CodeSnippetContainer>snippet).enforceNewStepBeforeSnippet();
        }



        return snippet;

    }

    compileReturnStatement(node: ASTReturnNode): CodeSnippet | undefined {

        this.missingStatementManager.onReturnHappened();

        let snippet = new CodeSnippetContainer([], node.range);

        let method: Method | undefined = this.currentSymbolTable.getMethodContext();
        if(!method){
            this.pushError("Eine return-Anweisung ist nur innerhalb einer Methode sinnvoll.", "error", node.range);
            return undefined;
        }

        if(node.term){

            if(!method.returnParameterType || method.returnParameterType == this.voidType){
                this.pushError("Die Methode erwartet keinen Rückgabewert, hier ist aber einer angegeben.", "error", node.range);
                return undefined;
            }

            let termSnippet = this.compileTerm(node.term);
            if(!termSnippet) return undefined;

            if(!this.canCastTo(termSnippet.type, method.returnParameterType, "implicit")){
                this.pushError("Die Methode erwartet einen Rückgabewert vom Typ " + method.returnParameterType.identifier + ", der Wert des Terms hat aber den Datentyp " + termSnippet.type?.identifier  + ".", "error", node.range);
                return undefined;
            }

            termSnippet = this.compileCast(termSnippet, method.returnParameterType, "implicit");

            snippet.addParts(new OneParameterTemplate(`${Helpers.return}(§1);\n`).applyToSnippet(this.voidType, node.range, termSnippet));

        } else {
            if(method.returnParameterType && method.returnParameterType != this.voidType){
                this.pushError("Die Methode erwartet einen Rückgabewert vom Typ " + method.returnParameterType.identifier + ", hier wird aber keiner übergeben.", "error", node.range);
                return undefined;
            }            
            snippet.addStringPart(`${Helpers.return}();\n`);
        } 

        snippet.addNextStepMark();

        return snippet;
    }


    compileForStatement(node: ASTForLoopNode): CodeSnippet | undefined {

        /*
         * Local variables declared in head of for statement are valid inside whole for statement, 
         * so we need a symbol table that encompasses the whole for statement:
         */
        this.pushAndGetNewSymbolTable(node.range, false);

        let firstStatement = this.compileStatementOrTerm(node.firstStatement);
        let condition = this.compileTerm(node.condition);
        let lastStatement = this.compileStatementOrTerm(node.lastStatement);

        let statementsToRepeat = this.compileStatementOrTerm(node.statementToRepeat);

        if (!(firstStatement && condition && lastStatement && statementsToRepeat)) {
            this.popSymbolTable();
            return undefined;
        }
        let forSnippet = new CodeSnippetContainer([], node.range, this.voidType);

        let label1 = new LabelCodeSnippet();
        let jumpToLabel1 = new JumpToLabelCodeSnippet(label1);

        let label2 = new LabelCodeSnippet();
        let jumpToLabel2 = new JumpToLabelCodeSnippet(label2);


        forSnippet.addParts(firstStatement);
        forSnippet.addNextStepMark();
        forSnippet.addParts(label1);
        forSnippet.addParts(new OneParameterTemplate('if(!(§1)){\n').applyToSnippet(this.voidType, node.condition!.range, condition));
        forSnippet.addParts(jumpToLabel2);
        forSnippet.addStringPart("}\n");
        forSnippet.addNextStepMark();

        forSnippet.addParts(statementsToRepeat);
        forSnippet.addParts(lastStatement);
        forSnippet.addParts(jumpToLabel1);
        forSnippet.addNextStepMark();
        forSnippet.addParts(label2);

        this.popSymbolTable();
        return forSnippet;
    }


    compileDoStatement(node: ASTDoWhileNode): CodeSnippetContainer | undefined {
        let condition = this.compileTerm(node.condition);

        this.printErrorifValueNotBoolean(condition?.type, node.condition);

        let statementToRepeat = this.compileStatementOrTerm(node.statementToRepeat);
        let doWhileSnippet = new CodeSnippetContainer([], node.range);

        if (!condition || !statementToRepeat) return undefined;

        let label1 = new LabelCodeSnippet();
        doWhileSnippet.addParts(label1);
        doWhileSnippet.addParts(statementToRepeat);
        doWhileSnippet.addNextStepMark();
        let sn1 = SnippetFramer.frame(condition, "if(§1){\n", this.voidType);
        doWhileSnippet.addParts(sn1);
        doWhileSnippet.addParts(new JumpToLabelCodeSnippet(label1));
        doWhileSnippet.addStringPart("}", undefined);
        doWhileSnippet.addNextStepMark();

        return doWhileSnippet;
    }

    compileBlockNode(node: ASTBlockNode): CodeSnippetContainer | undefined {
        this.pushAndGetNewSymbolTable(node.range, false);

        let snippet = new CodeSnippetContainer([], node.range);
        for (let statementNode of node.statements) {
            let statementSnippet = this.compileStatementOrTerm(statementNode);
            if (statementSnippet) snippet.addParts(statementSnippet);
        }

        this.popSymbolTable();
        return snippet;
    }

    printErrorifValueNotBoolean(type: JavaType | undefined, node: ASTNode) {
        if (!type) return;
        if (type.identifier != "boolean") {
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
        whileSnippet.addParts(label1);
        let sn1 = SnippetFramer.frame(condition, "if(!(§1)){\n", this.voidType);
        whileSnippet.addParts(sn1);
        whileSnippet.addParts(new JumpToLabelCodeSnippet(label2));
        whileSnippet.addStringPart("}", undefined);
        whileSnippet.addNextStepMark();
        whileSnippet.addParts(statementToRepeat);
        whileSnippet.addParts(new JumpToLabelCodeSnippet(label1));
        whileSnippet.addNextStepMark();
        whileSnippet.addParts(label2);

        return whileSnippet;
    }



    compileIfStatement(node: ASTIfNode): CodeSnippetContainer | undefined {
        let condition = this.compileTerm(node.condition);

        this.printErrorifValueNotBoolean(condition?.type, node.condition);

        this.missingStatementManager.openBranch();
        let statementIfTrue = this.compileStatementOrTerm(node.statementIfTrue);
        this.missingStatementManager.closeBranch(this.module.errors);
        
        this.missingStatementManager.openBranch();
        let statementIfFalse = this.compileStatementOrTerm(node.statementIfFalse);
        this.missingStatementManager.closeBranch(this.module.errors);

        this.missingStatementManager.endBranching();

        if (!condition || !statementIfTrue) return undefined;

        let ifSnippet = new CodeSnippetContainer([], node.range);

        let sn1 = SnippetFramer.frame(condition, "if(!(§1)){\n", this.voidType);
        let label1 = new LabelCodeSnippet();
        ifSnippet.addParts(sn1);
        let jumpToLabel1 = new JumpToLabelCodeSnippet(label1);
        ifSnippet.addParts(jumpToLabel1);
        ifSnippet.addStringPart("}\n");

        ifSnippet.addNextStepMark();

        if (statementIfFalse) {
            let label2 = new LabelCodeSnippet();
            let jumpToLabel2 = new JumpToLabelCodeSnippet(label2);

            ifSnippet.addParts(statementIfTrue);

            ifSnippet.addParts(jumpToLabel2);
            ifSnippet.addNextStepMark();

            ifSnippet.addParts(label1);
            ifSnippet.addParts(statementIfFalse);

            ifSnippet.addNextStepMark();
            ifSnippet.addParts(label2);

        } else {
            ifSnippet.addParts(statementIfTrue);
            ifSnippet.addNextStepMark();
            // without else case:
            ifSnippet.addParts(label1);
        }

        return ifSnippet;

    }

    compilePrintStatement(node: ASTPrintStatementNode): CodeSnippet | undefined {
        let firstParameter = this.compileTerm(node.firstParameter);
        let secondParameter = this.compileTerm(node.secondParameter);

        
        let statement = node.isPrintln ? Helpers.println : Helpers.print;
        
        if (firstParameter) {
            firstParameter = this.compileCast(firstParameter, this.stringType, "implicit");
            if (secondParameter) {
                return new TwoParameterTemplate(`${statement}(§1, §2);\n`)
                    .applyToSnippet(this.voidType, node.range, firstParameter, secondParameter)
            }
            return new OneParameterTemplate(`${statement}(§1, undefined);\n`)
                .applyToSnippet(this.voidType, node.range, firstParameter);
        }
        return new StringCodeSnippet(`${statement}(undefined, undefined);\n`, node.range);
    }

    compileLocaleVariableDeclaration(node: ASTLocalVariableDeclaration): CodeSnippet | undefined {
        let variable = new JavaLocalVariable(node.identifier, node.identifierRange, node.type.resolvedType!);
        variable.isFinal = node.isFinal;
        this.currentSymbolTable.addSymbol(variable);    // sets stackOffset

        this.missingStatementManager.addSymbolDeclaration(variable, node.initialization ? true: false);

        let accesLocalVariableSnippet = this.compileSymbolOnStackframeAccess(variable, node.identifierRange);
        let initValueSnippet: CodeSnippet | undefined;

        if (node.initialization) {
            initValueSnippet = this.compileTerm(node.initialization);

            if (!initValueSnippet?.type) return undefined;

            if (node.type.isVarKeyword) {
                variable.type = initValueSnippet.type;
            } else {
                let type = node.type.resolvedType;
                if(!type) return undefined;

                if (!this.canCastTo(initValueSnippet.type, type, "implicit")) {
                    this.pushError("Der Term auf der rechten Seite des Zuweisungsoperators hat den Datentyp " + initValueSnippet.type.identifier + " und kann daher der Variablen auf der linken Seite (Datentyp " + type.identifier + ") nicht zugewiesen werden.", "error", node);
                    return new EmptyPart();
                }
                
                initValueSnippet = this.compileCast(initValueSnippet, type, "implicit");
            }

        } else {
            let defaultValue: string = variable.type.isPrimitive ? (<PrimitiveType>variable.type).defaultValueAsString : "null";
            initValueSnippet = new StringCodeSnippet(defaultValue, node.range, variable.type);
        }

        if (initValueSnippet && accesLocalVariableSnippet) {
            let snippet = new BinaryOperatorTemplate('=', false)
                .applyToSnippet(variable.type, node.range, accesLocalVariableSnippet, initValueSnippet);
            return SnippetFramer.frame(snippet, '§1;\n');
        }

        return undefined;
    }

    compileThrowStatement(node: ASTThrowNode): CodeSnippet | undefined {
        let exceptionSnippet = this.compileTerm(node.exception);
        if(!exceptionSnippet) return undefined;

        return new OneParameterTemplate(`throw §1;\n`).applyToSnippet(this.voidType, node.range, exceptionSnippet);
    }

    compileTryCatchStatement(node: ASTTryCatchNode): CodeSnippet | undefined {
        let catchCaseLabels: LabelCodeSnippet[] = [];
        let catchBlockInfos: CatchBlockInfo[] = [];
        
        
        for(let i = 0; i < node.catchCases.length; i++){
            let catchCase = node.catchCases[i];
            let label = new LabelCodeSnippet();
            let exceptionTypes: Record<string, boolean> = {};
            
            for(let type of catchCase.exceptionTypes){
                if(type.resolvedType instanceof NonPrimitiveType){
                    Object.assign(exceptionTypes, type.resolvedType.getExtendedImplementedByIdentifiers())
                    exceptionTypes[type.resolvedType.identifier] = true;
                }
            }
            
            let catchBlockInfo: CatchBlockInfo = {
                exceptionTypes: exceptionTypes,
                catchBlockBeginsWithStepIndex: -1
            }
            
            catchCaseLabels[i] = label;
            catchBlockInfos[i] = catchBlockInfo;
            
            label.addIndexingListener((index) => catchBlockInfo.catchBlockBeginsWithStepIndex = index);
        }
        
        let finallyBlockLabel: LabelCodeSnippet | undefined;
        
        // this in context of Step.run-function points to Step-object
        let beginTryBlockSnippet = new StringCodeSnippet(`${Helpers.beginTryBlock}({catchBlockInfos: this.catchBlockInfoList, finallyBlockIndex: this.finallyBlockIndex});\n`, node.range);
        beginTryBlockSnippet.addEmitToStepListener((step) => {
            step.catchBlockInfoList = catchBlockInfos;
            step.finallyBlockIndex = finallyBlockLabel?.stepIndex;
        });
        
        let tryBlockStatements = this.compileStatementOrTerm(node.tryStatement);
        if(!tryBlockStatements) return undefined;
        
        if(tryBlockStatements instanceof CodeSnippetContainer) tryBlockStatements.removeNextStepBeforeSnippetMark();
        
        let endTryBlockSnippet = new StringCodeSnippet(`${Helpers.endTryBlock}();\n`, node.range);
        
        let labelAfterLastCatchBlock = new LabelCodeSnippet();
        let snippetContainer = new CodeSnippetContainer([beginTryBlockSnippet, tryBlockStatements, endTryBlockSnippet, labelAfterLastCatchBlock.getJumpToSnippet()], node.range);
        
        
        for(let i = 0; i < node.catchCases.length; i++){
            let catchCase = node.catchCases[i];
            let exceptionType: JavaType = catchCase.exceptionTypes[0].resolvedType!;
            if(catchCase.exceptionTypes.length > 0) exceptionType = this.throwableType;
            
            // exception lies on top of stack
            let exceptionVariable = new JavaLocalVariable(catchCase.exceptionIdentifier, catchCase.exceptionIdentifierPosition, exceptionType);
            exceptionVariable.isFinal = true;
            this.currentSymbolTable.addSymbol(exceptionVariable);
            
            snippetContainer.addNextStepMark();
            snippetContainer.addParts(catchCaseLabels[i]);
            let storeExceptionVariableStatement = new StringCodeSnippet(`${Helpers.threadStack}[${StepParams.stackBase} + ${exceptionVariable.stackframePosition}] = ${Helpers.getExceptionAndTrimStack}(true);\n`);
            snippetContainer.addParts(storeExceptionVariableStatement);
            
            let statement = this.compileStatementOrTerm(catchCase.statement);
            
            if(statement){
                if(statement instanceof CodeSnippetContainer) statement.removeNextStepBeforeSnippetMark();
                snippetContainer.addParts(statement);
            }  
            
            snippetContainer.addParts(labelAfterLastCatchBlock.getJumpToSnippet());

        }        
        
        finallyBlockLabel = new LabelCodeSnippet();
        snippetContainer.addNextStepMark();
        snippetContainer.addParts(labelAfterLastCatchBlock);
        if(node.finallyStatement){
            snippetContainer.addParts(finallyBlockLabel);
            snippetContainer.addStringPart(`${Helpers.getExceptionAndTrimStack}(false);\n`);
            let finallyStatement = this.compileStatementOrTerm(node.finallyStatement);
            if(finallyStatement instanceof CodeSnippetContainer) finallyStatement.removeNextStepBeforeSnippetMark();
            snippetContainer.addParts(finallyStatement);
            snippetContainer.addStringPart(`if(${Helpers.getExceptionAndTrimStack}(false)){${Helpers.return}(); return;};\n`);
        }

        return snippetContainer;
        
    }



}