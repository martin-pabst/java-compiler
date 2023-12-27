import { BaseSymbol, SymbolKind } from "../../common/BaseSymbolTable";
import { ErrorLevel, QuickFix } from "../../common/Error";
import { Helpers, StepParams } from "../../common/interpreter/StepFunction";
import { EmptyRange, IRange } from "../../common/range/Range";
import { TokenType, TokenTypeReadable } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTBinaryNode, ASTLiteralNode, ASTNode, ASTPlusPlusMinusMinusSuffixNode, ASTTermNode, ASTUnaryPrefixNode, ASTSymbolNode, ASTBlockNode, ASTMethodCallNode, ASTNewArrayNode, ASTSelectArrayElementNode, ASTNewObjectNode, ASTAttributeDereferencingNode, ASTEnumValueNode, ASTAnonymousClassNode, ASTLambdaFunctionDeclarationNode } from "../parser/AST";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { ArrayType } from "../types/ArrayType";
import { Field } from "../types/Field";
import { JavaType } from "../types/JavaType";
import { Parameter } from "../types/Parameter";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";
import { JavaLocalVariable } from "./JavaLocalVariable";
import { JavaSymbolTable } from "./JavaSymbolTable";
import { SnippetFramer } from "./CodeSnippetTools";
import { CodeTemplate, OneParameterTemplate, ParametersJoinedTemplate, SeveralParameterTemplate, TwoParameterTemplate } from "./CodeTemplate";
import { CodeSnippetContainer } from "./CodeSnippetKinds";
import { IJavaClass, JavaClass } from "../types/JavaClass.ts";
import { JavaEnum } from "../types/JavaEnum.ts";
import { BinopCastCodeGenerator } from "./BinopCastCodeGenerator.ts";
import { GenericMethod, Method } from "../types/Method.ts";
import { JavaTypeWithInstanceInitializer } from "../types/JavaTypeWithInstanceInitializer.ts";
import { StaticNonPrimitiveType } from "../types/StaticNonPrimitiveType.ts";
import { NonPrimitiveType } from "../types/NonPrimitiveType.ts";
import { MissingStatementManager } from "./MissingStatementsManager.ts";
import { JavaInterface } from "../types/JavaInterface.ts";
import { UsagePosition } from "../../common/UsagePosition.ts";
import { OuterClassFieldAccessTracker } from "./OuterClassFieldAccessTracker.ts";
import { LabelCodeSnippet } from "./LabelManager.ts";
import { CodeReacedAssertion, CodeReachedAssertions } from "../../common/interpreter/CodeReachedAssertions.ts";

export abstract class TermCodeGenerator extends BinopCastCodeGenerator {

    constantTypeToTypeMap: { [key: number]: JavaType } = {}

    currentSymbolTable!: JavaSymbolTable;

    symbolTableStack: JavaSymbolTable[] = [];

    classOfCurrentlyCompiledStaticInitialization?: NonPrimitiveType;

    missingStatementManager: MissingStatementManager = new MissingStatementManager();

    outerClassFieldAccessTracker: OuterClassFieldAccessTracker = new OuterClassFieldAccessTracker();

    breakStack: LabelCodeSnippet[] = [];

    constructor(module: JavaCompiledModule, libraryTypestore: JavaTypeStore, compiledTypesTypestore: JavaTypeStore) {
        super(module, libraryTypestore, compiledTypesTypestore);

        this.initConstantTypeToTypeMap();

    }

    compileTerm(ast: ASTTermNode | undefined, isWriteAccess: boolean = false): CodeSnippet | undefined {

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
                snippet = this.compileSymbolNode(<ASTSymbolNode>ast, isWriteAccess); break;
            case TokenType.methodCall:
                snippet = this.compileMethodCall(<ASTMethodCallNode>ast); break;
            case TokenType.newArray:
                snippet = this.compileNewArrayNode(<ASTNewArrayNode>ast); break;
            case TokenType.newObject:
                snippet = this.compileNewObjectNode(<ASTNewObjectNode>ast); break;
            case TokenType.selectArrayElement:
                snippet = this.compileSelectArrayElement(<ASTSelectArrayElementNode>ast); break;
            case TokenType.dereferenceAttribute:
                snippet = this.compileDereferenceAttribute(<ASTAttributeDereferencingNode>ast); break;
            case TokenType.anonymousClass:
                snippet = this.compileAnonymousInnerClass(<ASTAnonymousClassNode>ast); break;

        }

        if (snippet && ast.parenthesisNeeded) {
            snippet = SnippetFramer.frame(snippet, '(§1)');
        }

        return snippet;
    }

    compileNewObjectNode(node: ASTNewObjectNode, newObjectSnippet?: CodeSnippet): CodeSnippet | undefined {
        // new t.classes[<identifier>]().<constructorIdentifier>(param1, ..., paramN)
        // constructor has to return this or push it to stack!

        let parameterValues: (CodeSnippet | undefined)[] = [];

        for (let parameterValueNode of node.parameterValues) {
            if (parameterValueNode.kind == TokenType.lambdaOperator) {
                parameterValues.push(undefined);
            } else {
                let snippet = this.compileTerm(parameterValueNode);
                if (!snippet || !snippet.type) return undefined;
                parameterValues.push(snippet);
            }
        }

        let klassType = <IJavaClass>node.type.resolvedType;

        let method = this.searchMethod(klassType.identifier, klassType, parameterValues.map(p => p?.type), true, false, true, node.range);

        if (!method) {
            this.pushError("Es konnte kein passender Konstruktor mit dieser Signatur gefunden werden.", "error", node.range);
            return undefined;
        }

        for (let i = 0; i < node.parameterValues.length; i++) {
            let pv = node.parameterValues[i];
            if (pv.kind == TokenType.lambdaOperator) {
                let snippet = this.compileLambdaFunction(<ASTLambdaFunctionDeclarationNode>pv, method.parameters[i].type);
                if (!snippet) return undefined;
                parameterValues[i] = snippet;
            }
        }


        // cast parameter values
        let snippet = this.invokeConstructor(<CodeSnippet[]>parameterValues, method, klassType, node, newObjectSnippet);

        return snippet;

    }

    protected invokeConstructor(parameterValues: CodeSnippet[], method: Method, klassType: IJavaClass | JavaEnum,
        node: ASTNewObjectNode | ASTEnumValueNode, newObjectSnippet: CodeSnippet | undefined,
        enumValueIdentifier?: string, enumValueIndex?: number) {
        for (let i = 0; i < parameterValues.length; i++) {
            let destinationType = method.parameters[i].type;
            parameterValues[i] = this.compileCast(parameterValues[i]!, destinationType, "implicit");
        }

        let classHasOuterType: boolean = (klassType.outerType && !klassType.isStatic) ? true : false;

        let callingConvention: CallingConvention = method.hasImplementationWithNativeCallingConvention && !classHasOuterType ? "native" : "java";

        if (!newObjectSnippet) {
            newObjectSnippet = new StringCodeSnippet(`new ${Helpers.classes}["${klassType.identifier}"](${enumValueIdentifier ? '"' + enumValueIdentifier + '", ' + enumValueIndex : ""})`);
        }

        // call javascript constructor and directly thereafter call java constructor
        let template: string = `§1.${method.getInternalName(callingConvention)}(`;

        // instantiation of non-static inner class-object?
        // we can't rely on method.hasOuterClassParameter because this object instantiation
        // could be before standard constructor methods have been built.
        if (classHasOuterType) {
            let objectNode: ASTTermNode | undefined = (<ASTNewObjectNode>node).object;
            if (objectNode) {
                let objectSnippet = this.compileTerm(objectNode);
                if (objectSnippet) {
                    parameterValues.unshift(objectSnippet);
                }
            } else {
                parameterValues.unshift(new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}`));
            }
        }

        if (callingConvention == "java") {
            template += `${StepParams.thread}` + (parameterValues.length > 0 ? ", " : "");
        }

        let i = 2;
        template += parameterValues.map(_p => "§" + (i++)).join(", ") + ")";

        let snippet = new SeveralParameterTemplate(template).applyToSnippet(klassType, node.range, newObjectSnippet, ...parameterValues);

        if (callingConvention == "java") {
            snippet = new CodeSnippetContainer(SnippetFramer.frame(snippet, '§1;\n'));
            (<CodeSnippetContainer>snippet).addNextStepMark();
            snippet.finalValueIsOnStack = true;
        }
        return snippet;
    }

    pushAndGetNewSymbolTable(range: IRange, withStackframe: boolean, classContext?: JavaClass | JavaEnum | JavaInterface | undefined, methodContext?: Method): JavaSymbolTable {
        let newSymbolTable = new JavaSymbolTable(this.module, range, withStackframe, classContext, methodContext);
        if (this.currentSymbolTable) {
            this.currentSymbolTable.addChildTable(newSymbolTable);
            if (!classContext) newSymbolTable.classContext = this.currentSymbolTable.classContext;
        }
        this.symbolTableStack.push(newSymbolTable);
        this.currentSymbolTable = newSymbolTable;
        return newSymbolTable;
    }

    popSymbolTable() {
        this.symbolTableStack.pop();
        this.currentSymbolTable = this.symbolTableStack[this.symbolTableStack.length - 1];
    }

    compileSelectArrayElement(node: ASTSelectArrayElementNode): CodeSnippet | undefined {
        let arraySnippet = this.compileTerm(node.array);
        let arrayType = arraySnippet?.type;
        if (!arraySnippet || !arrayType || !(arrayType instanceof ArrayType)) {
            let t = arrayType ? "Dieser Term hat aber den Typ " + arrayType.identifier + "." : "";
            this.pushError("Vor [ muss ein Array stehen." + t, "error", node.array);
            return undefined;
        }

        if (arrayType.dimension < node.indices.length) {
            this.pushError("Das Array hat die Dimension " + arrayType.dimension + ", hier stehen aber " + node.indices.length + " [...].", "error", node);
            return undefined;
        }

        let remainingDimensions = arrayType.dimension - node.indices.length;
        let remainingType = remainingDimensions > 0 ? (new ArrayType(arrayType.elementType, remainingDimensions, arrayType.module, EmptyRange.instance))
            : arrayType.elementType;

        let indexSnippets: CodeSnippet[] = [];
        for (let index of node.indices) {
            let indsnip = this.compileTerm(index);

            if (!(indsnip?.type?.isUsableAsIndex())) {
                if (indsnip) this.pushError("Als Array-Index wird ein ganzzahliger Wert erwartet.", "error", index);
                indsnip = new StringCodeSnippet('0', index.range, this.intType);
            }

            indexSnippets.push(indsnip);

        }

        let squareBracketSnippet = ParametersJoinedTemplate.applyToSnippet(this.voidType, node.range, '[', '][', ']', ...indexSnippets);

        let returnSnippet = new TwoParameterTemplate("§1§2").applyToSnippet(remainingType, node.range, arraySnippet, squareBracketSnippet);


        if (node.parenthesisNeeded) {
            returnSnippet = SnippetFramer.frame(returnSnippet, '($)');
        }

        returnSnippet.isLefty = true;

        return returnSnippet;
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

        let unboxedDimesionTerm = this.unbox(dimensionTerm!);       // type != undefined => dimensionTerm != undefined
        if (unboxedDimesionTerm.type?.isPrimitive) {
            if (unboxedDimesionTerm.type.isUsableAsIndex()) {
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

        let defaultValue = elementType.isPrimitive ? (<PrimitiveType>elementType).defaultValueAsString : "null";

        let maybeUndefinedDimensionTerms: (CodeSnippet | undefined)[] = node.dimensions.map(d => this.compileDimension(d));

        if (maybeUndefinedDimensionTerms.includes(undefined)) return undefined;

        //@ts-ignore
        let dimensionTerms: CodeSnippet[] = maybeUndefinedDimensionTerms;

        let arrayType = new ArrayType(elementType, dimensionTerms.length, this.module, node.range);


        let prefix = `${Helpers.newArray}(${defaultValue}, `;
        let suffix = ")";

        return ParametersJoinedTemplate.applyToSnippet(arrayType, node.range, prefix, ', ', suffix, ...dimensionTerms);

    }


    compileSymbolNode(node: ASTSymbolNode, isWriteAccess: boolean): CodeSnippet | undefined {

        // first try: symbol table (parameters, local variables, fields)
        let symbolInformation = this.currentSymbolTable.findSymbol(node.identifier);

        if (symbolInformation) {
            let symbol = symbolInformation.symbol;

            if (symbolInformation.outerClassLevel > 0) this.outerClassFieldAccessTracker.onAccessHappened();

            symbol.usagePositions.push({ file: this.module.file, range: node.range });

            if (symbol.onStackframe()) {
                if (symbolInformation.outerClassLevel == 0) {
                    this.missingStatementManager.onSymbolAccess(symbol, node.range, this.module.errors, isWriteAccess);
                    return this.compileSymbolOnStackframeAccess(symbol, node.range);
                } else {
                    return this.compileOuterClassLocalVariableAccess(symbol, node.range);
                }
            }
            if (symbol.kind == SymbolKind.field) {
                let field = <Field>symbol;

                if (this.classOfCurrentlyCompiledStaticInitialization && !field.isStatic) {
                    this.pushError("Zum Initialisieren eines statischen Attributs können keine nichtstatischen Attribute benutzt werden.", "error", node);
                }

                return this.compileFieldAccess(symbol, node.range, symbolInformation.outerClassLevel);
            }

            return undefined; // should be unreachable
        }

        // second try: class identifier?
        let type = this.libraryTypestore.getType(node.identifier);
        if (!type) type = this.compiledTypesTypestore.getType(node.identifier);

        if (!type && this.currentSymbolTable.classContext) {
            let classContextDotIdentifier = this.currentSymbolTable.classContext.identifier + "." + node.identifier;
            type = this.libraryTypestore.getType(classContextDotIdentifier);
            if (!type) type = this.compiledTypesTypestore.getType(classContextDotIdentifier);
        }


        if (type != null && type instanceof NonPrimitiveType) {

            let staticType = new StaticNonPrimitiveType(type);
            return new StringCodeSnippet(`${Helpers.classes}["${type.identifier}"]`, node.range, staticType);
        }

        // // does method in inner class access field of outer class?
        // let outerType:  NonPrimitiveType | StaticNonPrimitiveType | undefined =  this.currentSymbolTable.classContext?.outerType;
        // let outerClassLevel: number = 1;
        // while(outerType && outerType instanceof NonPrimitiveType) {
        //     let field = outerType.getField(node.identifier, TokenType.keywordPrivate);
        //     if(field){
        //         return this.compileFieldAccess(field, node.range, outerClassLevel);
        //     }
        //     outerType = outerType.outerType;
        //     outerClassLevel++;
        // }


        // couldn't find symbol => error message

        if (this.currentSymbolTable.classContext) {
            let invisibleField = this.currentSymbolTable.classContext.getField(node.identifier, Number.MAX_SAFE_INTEGER);
            if (invisibleField) {
                this.pushError("Das Attribut " + node.identifier + " hat die Sichtbarkeit " + TokenTypeReadable[invisibleField.visibility] + " und kann daher hier nicht verwendet werden.", "error", node);
                return undefined;
            }
        }

        this.pushError("Der Compiler kennt den Bezeichner " + node.identifier + " an dieser Stelle nicht.", "error", node);
        return undefined;

    }

    compileOuterClassLocalVariableAccess(symbol: JavaLocalVariable, range: IRange) {

        // generate invisible field
        let f: Field = new Field(symbol.identifier, symbol.identifierRange, this.module, symbol.type, TokenType.keywordPrivate);
        f.isInnerClassCopyOfOuterClassLocalVariable = symbol;
        let klass: JavaClass = <JavaClass>this.currentSymbolTable.classContext;
        klass.fields.push(f);

        let snippet: CodeSnippet = new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}.${f.getInternalName()}`, range, symbol.type);
        snippet.isLefty = false;
        return snippet;
    }

    compileSymbolOnStackframeAccess(symbol: BaseSymbol, range: IRange): CodeSnippet | undefined {
        let type = (<JavaLocalVariable | Parameter>symbol).type;
        let snippet = new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(symbol.stackframePosition!)}`, range, type);
        snippet.isLefty = !symbol.isFinal;
        return snippet;
    }

    compileFieldAccess(symbol: BaseSymbol, range: IRange, outerClassLevel: number = 0): CodeSnippet | undefined {
        let field = <Field>symbol;

        if (field.isStatic && this.classOfCurrentlyCompiledStaticInitialization) {
            this.classOfCurrentlyCompiledStaticInitialization.staticConstructorsDependOn.set(field.classEnum, true);
        }

        let type = (field).type;

        if (field.isFinal && field.initialValueIsConstant) {
            let constantValue = field.initialValue!;
            let constantValueAsString = typeof constantValue == "string" ? `"${constantValue}"` : "" + constantValue;
            return new StringCodeSnippet(constantValueAsString, range, type, constantValue);
        }


        let fieldName = (field).getInternalName();

        let snippet: CodeSnippet;

        if (field.isStatic) {
            let classIdentifier = field.classEnum.identifier;
            snippet = new StringCodeSnippet(`${Helpers.classes}["${classIdentifier}"].${fieldName}`, range, type);
        } else {
            let outerClassPraefix: string = "";
            while (outerClassLevel > 0) {
                outerClassPraefix += Helpers.outerClassAttributeIdentifier + ".";
                outerClassLevel--;
            }

            snippet = new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}.${outerClassPraefix}${fieldName}`, range, type);
        }
        snippet.isLefty = !field.isFinal;

        let usagePosition: UsagePosition = { file: this.module.file, range: range };

        if (field.isInnerClassCopyOfOuterClassLocalVariable) {
            field.isInnerClassCopyOfOuterClassLocalVariable.usagePositions.push(usagePosition);
        } else {
            field.usagePositions.push()
        }

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

        let snippet = new StringCodeSnippet(valueAsString, node.range, type, node.value);

        return snippet;
    }

    compileBinaryOperator(ast: ASTBinaryNode): CodeSnippet | undefined {
        let leftOperand = this.compileTerm(ast.leftSide, this.isAssignmentOperator(ast.operator));
        let rightOperand = ast.rightSide?.kind == TokenType.lambdaOperator ? this.compileLambdaFunction(<ASTLambdaFunctionDeclarationNode>ast.rightSide, leftOperand?.type) : this.compileTerm(ast.rightSide);

        if (leftOperand && rightOperand && leftOperand.type && rightOperand.type) {
            return this.compileBinaryOperation(leftOperand, rightOperand, ast.operator, ast.operatorRange, ast.range);
        }

        return undefined;
    }

    compileUnaryPrefixOperator(ast: ASTUnaryPrefixNode): CodeSnippet | undefined {
        let operand = this.compileTerm(ast.term);

        return this.compileUnaryOperator(operand, ast.operator);

    }

    compilePlusPlusMinusMinusSuffixOperator(ast: ASTPlusPlusMinusMinusSuffixNode): CodeSnippet | undefined {
        let operand = this.compileTerm(ast.term);

        if (operand && operand.type) {

            if (!operand.isLefty) {
                this.pushError("Die Operatoren ++ und -- können nur bei Variablen benutzt werden, die veränderbar sind.", "error", ast);
                return undefined;
            }

            if (!this.isNumberPrimitiveType(operand.type)) {
                this.pushError("Die Operatoren ++ und -- können nur bei Variablen mit den Datentypen byte, short, int, long, float und double benutzt werden.", "error", ast);
            }

            let template: CodeTemplate = new OneParameterTemplate("§1++");

            return template.applyToSnippet(operand.type, ast.range, operand);
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
        this.constantTypeToTypeMap[TokenType.stringConstant] = this.libraryTypestore.getType("string")!;
    }

    compileDereferenceAttribute(node: ASTAttributeDereferencingNode): CodeSnippet | undefined {

        let objectSnippet = this.compileTerm(node.nodeToGetObject);
        if (!objectSnippet || !objectSnippet.type) return undefined;
        let range = node.range;

        if (objectSnippet.type instanceof ArrayType) {
            if (node.attributeIdentifier != 'length') {
                this.pushError("Arrays haben nur das Attribut length. Das Attribut " + node.attributeIdentifier + " ist bei Arrays nicht vorhanden.", "error", node);
                return undefined;
            }
            return new OneParameterTemplate(`(§1 || ${Helpers.throwNPE}(${range.startLineNumber}, ${range.startColumn}, ${range.endLineNumber}, ${range.endColumn})).length`)
                .applyToSnippet(this.intType, range);
        }

        let objectType = objectSnippet.type;
        if (!(objectType instanceof NonPrimitiveType || objectType instanceof StaticNonPrimitiveType)) {
            this.pushError('Der Datentyp ' + objectSnippet.type.identifier + " hat keine Attribute.", "error", node);
            return undefined;
        }

        let field = objectType.getField(node.attributeIdentifier, TokenType.keywordPublic);
        if (!field) {
            let invisibleField = objectType.getField(node.attributeIdentifier, Number.MAX_SAFE_INTEGER);

            if (invisibleField) {
                this.pushError("Das Attribut " + node.attributeIdentifier + " hat die Sichtbarkeit " + TokenTypeReadable[invisibleField.visibility] + " und kann daher hier nicht verwendet werden.", "error", node);
            } else {
                this.pushError("Das Objekt hat kein Attribut mit dem Bezeichner " + node.attributeIdentifier, "error", node);
            }

            return undefined;
        }

        field.usagePositions.push({ file: this.module.file, range: node.range });

        if (field.isFinal && field.initialValueIsConstant) {
            let constantValue = field.initialValue!;
            let constantValueAsString = typeof constantValue == "string" ? `"${constantValue}"` : "" + constantValue;
            return new StringCodeSnippet(constantValueAsString, range, field.type, constantValue);
        }


        if (field.isStatic) {
            let classIdentifier = field.classEnum.identifier;
            let snippet = new OneParameterTemplate(`${Helpers.classes}["${classIdentifier}"].${field.getInternalName()}`)
                .applyToSnippet(field.type, range, objectSnippet);
            snippet.isLefty = !field.isFinal;
            return snippet;
        } else {
            let template: string = objectSnippet.type instanceof JavaEnum ? `§1` : `(§1 || ${Helpers.throwNPE}(${range.startLineNumber}, ${range.startColumn}, ${range.endLineNumber}, ${range.endColumn}))`;

            let snippet = new OneParameterTemplate(`${template}.${field.getInternalName()}`)
                .applyToSnippet(field.type, range, objectSnippet);
            snippet.isLefty = !field.isFinal;
            return snippet;
        }


    }

    // TODO: if Method is generic: 
    // a) catch type paramters inside types to get actual types for them
    // b) make sure all catches for one type parameter deliver the same type
    // c) compute actual type for return parameter

    compileMethodCall(node: ASTMethodCallNode): CodeSnippet | undefined {
        let parameterValues: (CodeSnippet | undefined)[] = [];

        for (let parameterValueNode of node.parameterValues) {
            if (parameterValueNode.kind == TokenType.lambdaOperator) {
                parameterValues.push(undefined);
            } else {
                let snippet = this.compileTerm(parameterValueNode);
                if (!snippet || !snippet.type) return undefined;
                parameterValues.push(snippet);
            }
        }

        let objectSnippet: CodeSnippet | undefined;
        if (node.nodeToGetObject) {
            objectSnippet = this.compileTerm(node.nodeToGetObject);
            if (!objectSnippet) return undefined;
            let range = node.nodeToGetObject.range;
            if (!(objectSnippet.type instanceof JavaEnum) && objectSnippet.type != this.stringType && !(objectSnippet.type instanceof StaticNonPrimitiveType)) {
                objectSnippet = SnippetFramer.frame(objectSnippet, `${Helpers.checkNPE('§1', range)}`);
            }
        } else {
            let classContext = this.currentSymbolTable.getClassContext();
            if (!classContext) {

                if (node.identifier.startsWith("assert")) {
                    classContext = this.assertionsType;
                    if (node.identifier == "assertCodeReached") {
                        return this.registerCodeReachedAssertion(node, parameterValues);
                    }
                } else {
                    this.pushError("Außerhalb einer Klasse kann eine Methode nur mit Punktschreibweise (Object.Methode(...)) aufgerufen werden.", "error", node);
                    return undefined;
                }

            }
            objectSnippet = new StringCodeSnippet(`${Helpers.elementRelativeToStackbase(0)}`, EmptyRange.instance, classContext);
        }

        if (!objectSnippet || !objectSnippet.type) {
            return undefined;
        }

        let method = this.searchMethod(node.identifier, objectSnippet.type, parameterValues.map(p => p?.type), false, objectSnippet instanceof StaticNonPrimitiveType, true, node.range);

        if (node.identifier == "assertCodeReached" && (!method || objectSnippet.type.identifier == "Assertions")) {
            return this.registerCodeReachedAssertion(node, parameterValues);
        }

        if (!method && node.identifier.startsWith("assert")) {
            method = this.searchMethod(node.identifier, this.assertionsType, parameterValues.map(p => p?.type), false, objectSnippet instanceof StaticNonPrimitiveType, true, node.range);
        }

        let outerTypeTemplate: string = "";
        // access method of outer type from inner-class method?
        if (!method && !node.nodeToGetObject && this.currentSymbolTable.classContext?.outerType) {
            let outerType: NonPrimitiveType | StaticNonPrimitiveType | undefined = this.currentSymbolTable.classContext?.outerType;
            while (outerType && outerType instanceof NonPrimitiveType) {
                outerTypeTemplate += "." + Helpers.outerClassAttributeIdentifier;
                method = this.searchMethod(node.identifier, objectSnippet.type, parameterValues.map(p => p?.type), false, objectSnippet instanceof StaticNonPrimitiveType, true, node.range);
                if (method) {
                    break;
                }
                outerType = outerType.outerType;
            }
        }

        if (!method) {
            let invisibleMethod = this.searchMethod(node.identifier, objectSnippet.type, parameterValues.map(p => p?.type), false, objectSnippet instanceof StaticNonPrimitiveType, false, node.range);

            if (invisibleMethod) {
                this.pushError("Die Methode " + node.identifier + " hat die Sichtbarkeit " + TokenTypeReadable[invisibleMethod.visibility] + ", daher kann hier nicht auf sie zugegriffen werden.", "error", node);
            } else {
                this.pushError("Es konnte keine passende Methode mit diesem Bezeichner/mit dieser Signatur gefunden werden.", "error", node.range);
            }
            return undefined;
        }

        for (let i = 0; i < node.parameterValues.length; i++) {
            let pv = node.parameterValues[i];
            if (pv.kind == TokenType.lambdaOperator) {
                let snippet = this.compileLambdaFunction(<ASTLambdaFunctionDeclarationNode>pv, method.parameters[i].type);
                if (!snippet) return undefined;
                parameterValues[i] = snippet;
            }
        }

        // cast parameter values
        for (let i = 0; i < parameterValues.length; i++) {
            let destinationType = method.parameters[i].type;
            parameterValues[i] = this.compileCast(parameterValues[i]!, destinationType, "implicit");
        }

        let returnParameter = method.returnParameterType || this.voidType;

        if (method.constantFoldingFunction) {
            let allParametersConstant: boolean = !parameterValues.some(v => !v!.isConstant())
            if (allParametersConstant && (method.isStatic || objectSnippet.isConstant())) {
                let constantValues = parameterValues.map(p => p!.getConstantValue());
                let result = method.isStatic ? method.constantFoldingFunction(...constantValues) : method.constantFoldingFunction(objectSnippet.getConstantValue(), ...constantValues);
                let resultAsString = method.returnParameterType == this.stringType ? `"${result}"` : "" + result;
                return new StringCodeSnippet(resultAsString, node.range, returnParameter, result);
            }
        }

        // For library functions like Math.sin, Math.abs, ... we use templates to compile to nativ javascript functions:
        if (method.template) {
            if (method.isStatic) {
                return new SeveralParameterTemplate(method.template).applyToSnippet(returnParameter, node.range, ...(<CodeSnippet[]>parameterValues));
            } else {
                return new SeveralParameterTemplate(method.template).applyToSnippet(returnParameter, node.range, objectSnippet, ...(<CodeSnippet[]>parameterValues));
            }
        }

        let isFinalOrStatic = (objectSnippet.type instanceof IJavaClass && objectSnippet.type.isFinal()) || method.isFinal || method.isStatic;

        let callingConvention: CallingConvention = method.hasImplementationWithNativeCallingConvention && isFinalOrStatic ? "native" : "java";

        let objectTemplate: string;
        if (objectSnippet.type instanceof StaticNonPrimitiveType) {
            objectTemplate = `§1.${method.getInternalNameWithGenericParameterIdentifiers(callingConvention)}(`
        } else if (method.isStatic) {
            objectTemplate = `§1.constructor.${method.getInternalNameWithGenericParameterIdentifiers(callingConvention)}(`
        } else {
            objectTemplate = `§1${outerTypeTemplate}.${method.getInternalNameWithGenericParameterIdentifiers(callingConvention)}(`
        }

        if (callingConvention == "java") {
            objectTemplate += `${StepParams.thread}` +
                (method.isStatic ? '' : `, undefined`) +     // non-static methods have callback-function as second parameter
                (parameterValues.length > 0 ? ", " : "");
        }

        let i = 2;
        objectTemplate += parameterValues.map(_p => "§" + (i++)).join(", ") + ")";

        parameterValues.unshift(objectSnippet);


        let snippet = new SeveralParameterTemplate(objectTemplate).applyToSnippet(returnParameter, node.range, ...(<CodeSnippet[]>parameterValues));

        if (callingConvention == "java") {
            if (!snippet.endsWith(";\n")) snippet = new CodeSnippetContainer(SnippetFramer.frame(snippet, '§1;\n'));
            (<CodeSnippetContainer>snippet).addNextStepMark();
            if (returnParameter != this.voidType) snippet.finalValueIsOnStack = true;
        }

        return snippet;
    }

    registerCodeReachedAssertion(node: ASTMethodCallNode, parameterValues: (CodeSnippet | undefined)[]): CodeSnippet | undefined {
        if(parameterValues.length != 1 || parameterValues[0]?.type != this.stringType || !parameterValues[0].isConstant()){
            this.pushError("Die Methode assertCodeReached benötigt genau einen konstanten Parameter vom Typ String.", "error", node);
            return undefined;
        }
        let message = <string>parameterValues[0].getConstantValue();
        let codeReachedAssertion = new CodeReacedAssertion(message, this.module, node.range);
        this.module.codeReachedAssertions.registerAssertion(codeReachedAssertion);

        return new StringCodeSnippet(`${Helpers.registerCodeReached}("${codeReachedAssertion.key}")`);
    }

    searchMethod(identifier: string, objectType: JavaType, parameterTypes: (JavaType | undefined)[],
        isConstructor: boolean, hasToBeStatic: boolean, takingVisibilityIntoAccount: boolean,
        methodCallPosition: IRange): Method | undefined {

        if (objectType == this.stringType) objectType = this.primitiveStringClass.type;

        let possibleMethods: Method[];

        if (objectType instanceof StaticNonPrimitiveType) {
            possibleMethods = objectType.getPossibleMethods(identifier, parameterTypes.length, isConstructor, hasToBeStatic);
        } else if (objectType instanceof NonPrimitiveType) {
            possibleMethods = objectType.getPossibleMethods(identifier, parameterTypes.length, isConstructor, hasToBeStatic);
        } else {
            return undefined;
        }

        if (takingVisibilityIntoAccount) {
            possibleMethods = possibleMethods.filter(m => {
                if (m.visibility == TokenType.keywordPublic) return true;
                if (m.visibility == TokenType.keywordPrivate) {
                    let mClassIdentifier = m.classEnumInterface.identifier;
                    if (this.classOfCurrentlyCompiledStaticInitialization) return this.classOfCurrentlyCompiledStaticInitialization.identifier == mClassIdentifier;
                    if (this.currentSymbolTable.classContext) return this.currentSymbolTable.classContext.identifier == mClassIdentifier;
                    return false;
                }
                if (m.visibility == TokenType.keywordProtected) {
                    let mClassIdentifier = m.classEnumInterface.identifier;
                    if (this.classOfCurrentlyCompiledStaticInitialization) return this.classOfCurrentlyCompiledStaticInitialization.identifier == mClassIdentifier;
                    if (this.currentSymbolTable.classContext) return this.currentSymbolTable.classContext.fastExtendsImplements(mClassIdentifier);
                    return false;
                }
            })
        }

        for (let method of possibleMethods) {
            if (method instanceof GenericMethod) method.initCatches();

            let suitable: boolean = true;
            for (let i = 0; i < parameterTypes.length; i++) {
                let fromType = parameterTypes[i];
                let toType = method.parameters[i].type;
                if (fromType && !this.canCastTo(fromType, toType, "implicit")) {
                    suitable = false;
                    break;
                }
            }
            if (suitable) {

                if (!(method instanceof GenericMethod)) {
                    return method;
                }

                let errors = method.checkCatches(methodCallPosition);
                if (errors.length > 0) {
                    this.module.errors.push(...errors);
                    return undefined;
                }

                return method.getCopyWithConcreteTypes();

            }
        }

        return undefined;
    }


}