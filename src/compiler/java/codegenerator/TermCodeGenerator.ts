import { BaseSymbol, BaseSymbolOnStackframe } from "../../common/BaseSymbolTable";
import { ErrorLevel, QuickFix } from "../../common/Error";
import { StepParams } from "../../common/interpreter/StepFunction";
import { IRange } from "../../common/range/Range";
import { TokenType, TokenTypeReadable } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTBinaryNode, ASTLiteralNode, ASTNode, ASTPlusPlusMinusMinusSuffixNode, ASTTermNode, ASTUnaryPrefixNode, ASTSymbolNode, ASTBlockNode, ASTMethodCallNode, ASTNewArrayNode } from "../parser/AST";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { ArrayType } from "../types/ArrayType";
import { Field } from "../types/Field";
import { JavaType } from "../types/JavaType";
import { Parameter } from "../types/Parameter";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";
import { JavaLocalVariable } from "./JavaLocalVariable";
import { JavaSymbolTable } from "./JavaSymbolTable";
import { SnippetFramer, Unboxer } from "./CodeSnippetTools";
import { ParametersCommaSeparatedTemplate, SeveralParameterTemplate, TwoParameterTemplate } from "./CodeTemplate";
import { CodeSnippetContainer } from "./CodeSnippetKinds";

export class TermCodeGenerator {

    constantTypeToTypeMap: { [key: number]: JavaType } = {}

    voidType: JavaType;
    intType: JavaType;

    currentSymbolTable: JavaSymbolTable;


    constructor(protected module: JavaCompiledModule, protected libraryTypestore: JavaTypeStore) {
        this.initConstantTypeToTypeMap();
        this.currentSymbolTable = new JavaSymbolTable(module, module.ast!.range, true);
        module.ast!.symbolTable = this.currentSymbolTable;

        this.voidType = this.libraryTypestore.getType("void")!;
        this.intType = this.libraryTypestore.getType("int")!;
    }


    compileTerm(ast: ASTTermNode | undefined): CodeSnippet | undefined {

        if (!ast) return undefined;

        let snippet: CodeSnippet | undefined;

        switch (ast.kind) {
            case TokenType.binaryOp:
                snippet = this.compileBinaryOperator(<ASTBinaryNode>ast); break;
            case TokenType.unaryPrefixOp:
                snippet = this.compileUnaryPrefixOperator(<ASTUnaryPrefixNode>ast); break;
            case TokenType.plusPlusMinusMinusSuffix:
                snippet = this.compilePlusPlusMinusMinusSuffixOperator(<ASTPlusPlusMinusMinusSuffixNode>ast); break;
            case TokenType.literal:
                snippet = this.compileLiteralNode(<ASTLiteralNode>ast); break;
            case TokenType.symbol:
                snippet = this.compileVariableNode(<ASTSymbolNode>ast); break;
            case TokenType.methodCall:
                snippet = this.compileMethodCall(<ASTMethodCallNode>ast); break;

            case TokenType.newArray:
                snippet = this.compileNewArrayNode(<ASTNewArrayNode>ast); break;
        }

        if (snippet && ast.parenthesisNeeded) {
            snippet = SnippetFramer.frame(snippet, '($1)');
        }

        return snippet;
    }

    wrapWithCastTo(snippet: CodeSnippet, destinationType: JavaType, nodeToGetErrorRange: ASTNode) {
        // if error occured before, then exit:
        if (!snippet.type || !destinationType) return undefined;
        if (!snippet.type.canExplicitlyCastTo(destinationType)) {
            this.pushError("Der Term vom Datentyp " + snippet.type.identifier + " kann nicht zum Datentyp " + destinationType + " gecastet werden.", "error", nodeToGetErrorRange);
            return snippet;  // good dummy to continue compiling
        }

        let castTemplate =  snippet.type.getCastFunction(destinationType);
        if(!castTemplate) return snippet.type;
        return castTemplate.applyToSnippet(destinationType, nodeToGetErrorRange.range, this.libraryTypestore, snippet);
    }



    /*
     * Helper function for compileNewArrayNode
     *
     */
    private compileDimension(dimensionNode: ASTTermNode): CodeSnippet | undefined {
        let dimensionTerm = this.compileTerm(dimensionNode);

        // if compileTerm failed: insert plausible dummy value to enable further compilation
        let type = dimensionTerm?.type;
        if (!type) return new StringCodeSnippet('1', dimensionNode.range, this.intType);

        let unboxedDimesionTerm = Unboxer.unbox(dimensionTerm!, this.libraryTypestore);       // type != undefined => dimensionTerm != undefined
        if(unboxedDimesionTerm.type?.isPrimitive){
            if(unboxedDimesionTerm.type.isUsableAsIndex()){
                return unboxedDimesionTerm;
            }
        }

        this.pushError("Hier wird eine Ganzzahl erwartet (Datentypen byte, short, int, long). Gefunden wurde " + dimensionTerm?.type?.identifier, "error", dimensionNode);
        return new StringCodeSnippet('1', dimensionNode.range, this.intType);   // return plausible dummy to get on compiling...

    }

    compileNewArrayNode(node: ASTNewArrayNode): CodeSnippet | undefined {
        let elementType = node.arrayType.resolvedType;
        if (elementType == undefined) {
            return undefined;
        }

        let defaultValue = elementType.isPrimitive ? (<PrimitiveType>elementType).defaultValue : "null";

        let maybeUndefinedDimensionTerms: (CodeSnippet | undefined)[] = node.dimensions.map(d => this.compileDimension(d));

        if (maybeUndefinedDimensionTerms.includes(undefined)) return undefined;

        //@ts-ignore
        let dimensionTerms: CodeSnippet[] = maybeUndefinedDimensionTerms;

        let arrayType = new ArrayType(elementType, dimensionTerms.length, this.module, node.range);


        let prefix = `ho["newArray"](${defaultValue}, `;
        let suffix = ")";

        return ParametersCommaSeparatedTemplate.applyToSnippet(arrayType, node.range, prefix, suffix, ...dimensionTerms);

    }


    compileVariableNode(node: ASTSymbolNode): CodeSnippet | undefined {
        let symbol = this.currentSymbolTable.findSymbol(node.identifier);

        if (!symbol) {
            this.pushError("Der Compiler kennt den Bezeichner " + node.identifier + " an dieser Stelle nicht.", "error", node);
            return undefined;
        }

        if (symbol instanceof BaseSymbolOnStackframe) return this.compileSymbolOnStackframeAccess(symbol, node.range);
        if (symbol instanceof Field) return this.compileFieldAccess(symbol, node.range);
    }

    compileSymbolOnStackframeAccess(symbol: BaseSymbolOnStackframe, range: IRange): CodeSnippet | undefined {
        let type = (<JavaLocalVariable | Parameter>symbol).type;
        let snippet = new StringCodeSnippet(`${StepParams.stack}[${StepParams.stackBase} + ${symbol.stackframePosition}]`, range, type);
        snippet.isLefty = true;
        return snippet;
    }

    compileFieldAccess(symbol: BaseSymbol, range: IRange): CodeSnippet | undefined {
        let type = (<Field>symbol).type;
        let fieldName = (<Field>symbol).getInternalName();
        let snippet = new StringCodeSnippet(`${StepParams.stack}[${StepParams.stackBase}].${fieldName}`, range, type);
        snippet.isLefty = true;
        return snippet;
    }


    compileLiteralNode(node: ASTLiteralNode): CodeSnippet | undefined {
        let type = this.constantTypeToTypeMap[node.constantType];
        if (!type) return undefined;
        let valueAsString: string;

        switch (node.constantType) {
            case TokenType.charConstant:
            case TokenType.stringConstant:
                valueAsString = JSON.stringify(node.value);
                break;
            default: valueAsString = "" + node.value;
        }

        let snippet = new StringCodeSnippet(valueAsString, node.range);
        snippet.type = type;

        return snippet;
    }

    compileBinaryOperator(ast: ASTBinaryNode): CodeSnippet | undefined {
        let leftOperand = this.compileTerm(ast.leftSide);
        let rightOperand = this.compileTerm(ast.rightSide);

        if (leftOperand && rightOperand && leftOperand.type && rightOperand.type) {
            let valueType = leftOperand.type.getBinaryResultType(rightOperand.type, ast.operator, this.libraryTypestore);
            if (!valueType) {
                this.pushError("Der binäre Operator " + TokenTypeReadable[ast.operator] + " ist für Operanden der Typen " + leftOperand.type.toString() + " und " + rightOperand.type.toString() + " nicht definiert.", "error", ast);
                return undefined;
            }

            let template = leftOperand.type.getBinaryOperation(rightOperand.type, ast.operator)!;

            return template?.applyToSnippet(valueType, ast.range, this.libraryTypestore, leftOperand, rightOperand);
        }

        return undefined;
    }

    compileUnaryPrefixOperator(ast: ASTUnaryPrefixNode): CodeSnippet | undefined {
        let operand = this.compileTerm(ast.term);

        if (operand && operand.type) {
            let valueType = operand.type.getUnaryResultType(ast.operator);
            if (!valueType) {
                this.pushError("Der Unäre Operator " + TokenTypeReadable[ast.operator] + " ist für den Datentyp " + operand.type.toString() + " nicht definiert.", "error", ast);
                return undefined;
            }

            if ([TokenType.plusPlus, TokenType.minusMinus].indexOf(ast.operator) >= 0) {
                if (!operand.isLefty) {
                    this.pushError("Die Operatoren ++ und -- können nur bei Variablen benutzt werden, die veränderbar sind.", "error", ast);
                    return undefined;
                }
            }

            let template = operand.type.getUnaryOperation(ast.operator)!;

            return template?.applyToSnippet(valueType, ast.range, this.libraryTypestore, operand);
        }

        return undefined;
    }

    compilePlusPlusMinusMinusSuffixOperator(ast: ASTPlusPlusMinusMinusSuffixNode): CodeSnippet | undefined {
        let operand = this.compileTerm(ast.term);

        if (operand && operand.type) {

            if (!operand.isLefty) {
                this.pushError("Die Operatoren ++ und -- können nur bei Variablen benutzt werden, die veränderbar sind.", "error", ast);
                return undefined;
            }

            let template = PrimitiveType.getPlusPlusMinusMinusSuffixOperation(operand.type, ast.operator);

            if (!template) {
                this.pushError("Der Unäre Operator " + TokenTypeReadable[ast.operator] + " ist für den Datentyp " + operand.type.toString() + " nicht definiert.", "error", ast);
                return undefined;
            }

            return template?.applyToSnippet(operand.type, ast.range, this.libraryTypestore, operand);
        }

        return undefined;

    }

    initConstantTypeToTypeMap() {
        this.constantTypeToTypeMap[TokenType.booleanConstant] = this.libraryTypestore.getType("boolean")!;
        this.constantTypeToTypeMap[TokenType.charConstant] = this.libraryTypestore.getType("char")!;
        this.constantTypeToTypeMap[TokenType.integerConstant] = this.libraryTypestore.getType("int")!;
        this.constantTypeToTypeMap[TokenType.longConstant] = this.libraryTypestore.getType("long")!;
        this.constantTypeToTypeMap[TokenType.floatConstant] = this.libraryTypestore.getType("float")!;
        this.constantTypeToTypeMap[TokenType.doubleConstant] = this.libraryTypestore.getType("double")!;
        this.constantTypeToTypeMap[TokenType.stringConstant] = this.libraryTypestore.getType("String")!;
    }


    pushError(message: string, errorLevel: ErrorLevel = "error", node: ASTNode, quickFix?: QuickFix) {
        this.module.errors.push({
            message: message,
            range: node.range,
            quickFix: quickFix,
            level: errorLevel
        });
    }


    compileMethodCall(node: ASTMethodCallNode): CodeSnippet | undefined {
        let parameters = node.parameterValues.map(p => this.compileTerm(p));

        let snippet1 = new TwoParameterTemplate("method($1, $2)").applyToSnippet(this.intType, node.range, this.libraryTypestore, parameters[0]!, parameters[1]!);
        snippet1.finalValueIsOnStack = true;

        let snippet = new CodeSnippetContainer(snippet1);
        snippet.addNextStepMark();

        return snippet;
    }


}