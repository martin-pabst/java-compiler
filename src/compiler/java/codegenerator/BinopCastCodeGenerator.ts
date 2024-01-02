import { ErrorLevel, QuickFix } from "../../common/Error";
import { Helpers, StepParams } from "../../common/interpreter/StepFunction";
import { EmptyRange, IRange } from "../../common/range/Range";
import { TokenType, TokenTypeReadable } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTAnonymousClassNode, ASTLambdaFunctionDeclarationNode, ASTNode, AssignmentOperator, BinaryOperator, ConstantType, LogicOperator } from "../parser/AST";
import { PrimitiveStringClass } from "../runtime/system/javalang/PrimitiveStringClass";
import { ArrayType } from "../types/ArrayType";
import { JavaClass } from "../types/JavaClass";
import { JavaInterface } from "../types/JavaInterface";
import { JavaType } from "../types/JavaType";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { CodeSnippet, ConstantValue, StringCodeSnippet } from "./CodeSnippet";
import { CodeSnippetContainer } from "./CodeSnippetKinds";
import { SnippetFramer } from "./CodeSnippetTools";
import { BinaryOperatorTemplate, OneParameterTemplate, TwoParameterTemplate } from "./CodeTemplate";
import { LabelCodeSnippet } from "./LabelManager";

var nOtherClass = 0, nVoid = 1, nBoolean = 2, nChar = 3, nByte = 4, nShort = 5, nInteger = 6, nLong = 7, nFloat = 8, nDouble = 9, nString = 10;
var primitiveTypeIdentifiers: string[] = ["", "void", "boolean", "char", "byte", "short", "int", "long", "float", "double", "string"];
var boxedTypeIdentifiers: string[] = ["", "", "Boolean", "Character", "Byte", "Short", "Integer", "Long", "Float", "Double", "String"];

var boxedTypesMap: { [identifier: string]: number | undefined } = {
    "Boolean": nBoolean,
    "Character": nChar,
    "Byte": nByte,
    "Short": nShort,
    "Integer": nInteger,
    "Long": nLong,
    "Float": nFloat,
    "Double": nDouble,
    "String": nString,
}

var primitiveTypeMap: { [identifier: string]: number | undefined } = {
    "void": nVoid,
    "boolean": nBoolean,
    "char": nChar,
    "byte": nByte,
    "short": nShort,
    "int": nInteger,
    "long": nLong,
    "float": nFloat,
    "double": nDouble,
    "string": nString
}

var assignmentOperators: TokenType[] = [TokenType.assignment, TokenType.plusAssignment, TokenType.minusAssignment, TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment];
var logicOperators: TokenType[] = [TokenType.and, TokenType.or, TokenType.XOR];
var shiftOperators: TokenType[] = [TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned];
var logicOperators: TokenType[] = [TokenType.and, TokenType.or, TokenType.XOR];
var plusMinusMultDivAssignmentOperators: TokenType[] = [TokenType.plusAssignment, TokenType.minusAssignment, TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment, TokenType.assignment];
var comparisonOperators: TokenType[] = [TokenType.lower, TokenType.greater, TokenType.lowerOrEqual, TokenType.greaterOrEqual, TokenType.notEqual, TokenType.equal];


export abstract class BinopCastCodeGenerator {

    voidType: JavaType;
    charType: JavaType;
    intType: JavaType;
    booleanType: JavaType;
    stringType: JavaType;
    throwableType: JavaType;
    objectType: JavaClass;
    assertionsType: JavaClass;
    stringNonPrimitiveType: JavaClass;
    iterableType: JavaInterface;
    iteratorType: JavaInterface;

    primitiveStringClass = PrimitiveStringClass;

    primitiveTypes: JavaType[] = [];


    constructor(protected module: JavaCompiledModule,
        protected libraryTypestore: JavaTypeStore,
        protected compiledTypesTypestore: JavaTypeStore) {

        this.voidType = this.libraryTypestore.getType("void")!;
        this.charType = this.libraryTypestore.getType("char")!;
        this.intType = this.libraryTypestore.getType("int")!;
        this.booleanType = this.libraryTypestore.getType("boolean")!;
        this.stringType = this.libraryTypestore.getType("string")!;
        this.throwableType = this.libraryTypestore.getType("Throwable")!;
        this.objectType = <JavaClass>this.libraryTypestore.getType("Object")!;
        this.stringNonPrimitiveType = <JavaClass>this.libraryTypestore.getType("String")!;
        this.assertionsType = <JavaClass>this.libraryTypestore.getType("Assertions")!;
        this.iterableType = <JavaInterface>this.libraryTypestore.getType("Iterable")!;
        this.iteratorType = <JavaInterface>this.libraryTypestore.getType("Iterator")!;

        this.primitiveTypes.push(this.voidType);  // dummy for "otherClass"
        for (let i = 1; i < primitiveTypeIdentifiers.length; i++) this.primitiveTypes.push(this.libraryTypestore.getType(primitiveTypeIdentifiers[i])!);

    }

    compileBinaryOperation(leftSnippet: CodeSnippet, rightSnippet: CodeSnippet, operator: BinaryOperator | AssignmentOperator, operatorRange: IRange, wholeRange: IRange): CodeSnippet | undefined {
        if (!leftSnippet || !rightSnippet) return leftSnippet; // there had been an error before...

        if (!leftSnippet.type) {
            this.pushError("Der Typ des linken Operanden kann nicht bestimmt werden.", "error", leftSnippet.range!);
            return undefined;
        }

        if (!rightSnippet.type) {
            this.pushError("Der Typ des rechten Operanden kann nicht bestimmt werden.", "error", rightSnippet.range!);
            return undefined;
        }

        let leftType: JavaType = leftSnippet.type;
        let rightType: JavaType = rightSnippet.type;

        let lIdentifier = leftType.identifier;
        let rIdentifier = rightType.identifier;
        let lWrapperIndex = boxedTypesMap[lIdentifier];
        let rWrapperIndex = boxedTypesMap[rIdentifier];
        let lTypeIndex: number = lWrapperIndex || primitiveTypeMap[lIdentifier] || nOtherClass;
        let rTypeIndex: number = rWrapperIndex || primitiveTypeMap[rIdentifier] || nOtherClass;

        let operatorIdentifier = TokenTypeReadable[operator];

        if (this.anyOperandHasVoidType(lTypeIndex, rTypeIndex, operator, operatorRange)) return undefined;

        if (assignmentOperators.indexOf(operator) >= 0) return this.compileAssignment(leftSnippet, rightSnippet, lTypeIndex, rTypeIndex, lIdentifier, rIdentifier, <AssignmentOperator>operator, operatorRange, wholeRange);

        // unbox if necessary
        if (lWrapperIndex) leftSnippet = this.unbox(leftSnippet);
        if (rWrapperIndex) rightSnippet = this.unbox(rightSnippet);

        if (operator == TokenType.equal || operator == TokenType.notEqual) {
            return new BinaryOperatorTemplate(operatorIdentifier, true).applyToSnippet(this.booleanType, wholeRange, leftSnippet, rightSnippet);
        }

        // both operators are unboxed and operation is not in [==, !=]
        if (lTypeIndex == nString || rTypeIndex == nString) return this.compileBinaryOperationWithStrings(leftSnippet, rightSnippet, lTypeIndex, rTypeIndex, lIdentifier, rIdentifier, <LogicOperator>operator, operatorRange, wholeRange);
        if (lTypeIndex == nOtherClass || rTypeIndex == nOtherClass) {
            this.pushError("Der Operator " + operatorIdentifier + " ist für die Typen " + lIdentifier + " und " + rIdentifier + " nicht geeignet.", "error", operatorRange);
        }

        // now both types are in [boolean, char, byte, short, int, long, float, double]
        if (logicOperators.indexOf(operator) >= 0) return this.compileLogicOperation(leftSnippet, rightSnippet, lTypeIndex, rTypeIndex, lIdentifier, rIdentifier, <LogicOperator>operator, operatorRange, wholeRange)
        if (lTypeIndex == nBoolean || rTypeIndex == nBoolean) {
            this.pushError("Der Operator " + operatorIdentifier + " ist für die Typen " + lIdentifier + " und " + rIdentifier + " nicht geeignet.", "error", operatorRange);
        }

        // now both types are in [char, byte, short, int, long, float, double] 
        // operators are +, -, *, /, %, ShiftOperations and ComparisonOperations but not == or !=

        // char +*/% integer => integer
        if (lTypeIndex == nChar) {
            leftSnippet = this.convertCharToNumber(leftSnippet);
            lTypeIndex = nInteger;
        }
        if (rTypeIndex == nChar) {
            rightSnippet = this.convertCharToNumber(rightSnippet);
            rTypeIndex = nInteger;
        }

        // now both types are in [byte, short, int, long, float, double] 
        if (comparisonOperators.indexOf(operator) >= 0) return new BinaryOperatorTemplate(operatorIdentifier, false).applyToSnippet(this.booleanType, wholeRange, leftSnippet, rightSnippet);


        // now both types are in [byte, short, int, long, float, double] 
        // operators are +, -, *, /, %, ShiftOperations 
        if (shiftOperators.indexOf(operator) >= 0) {
            if (lTypeIndex >= nFloat || rTypeIndex >= nFloat) {
                this.pushError("Der Operator " + operatorIdentifier + " ist für die Typen " + lIdentifier + " und " + rIdentifier + " nicht geeignet.", "error", operatorRange);
                return undefined;
            }
            return new BinaryOperatorTemplate(operatorIdentifier, false).applyToSnippet(leftType, wholeRange, leftSnippet, rightSnippet);
        }

        // now both types are in [byte, short, int, long, float, double] 
        // operators are +, -, *, /, %
        let resultType = this.primitiveTypes[Math.max(lTypeIndex, rTypeIndex)];
        return new BinaryOperatorTemplate(operatorIdentifier, false).applyToSnippet(resultType, wholeRange, leftSnippet, rightSnippet);

    }

    /**
     * now both types are in [boolean, char, byte, short, int, long, float, double]
     * operation is in &&, ||, ^ ( means: XOR)
     */
    compileLogicOperation(leftSnippet: CodeSnippet, rightSnippet: CodeSnippet, lTypeIndex: number, rTypeIndex: number, lIdentifier: string, rIdentifier: string, operator: LogicOperator, operatorRange: IRange, wholeRange: IRange): CodeSnippet | undefined {
        if (lTypeIndex != nBoolean || rTypeIndex != nBoolean) {
            this.pushError("Der Operator " + TokenTypeReadable[operator] + " ist für die Typen " + lIdentifier + " und " + rIdentifier + " nicht geeignet.", "error", operatorRange);
            return undefined;
        }

        let bothSnippetsAreConstant = leftSnippet.isConstant() && rightSnippet.isConstant();

        if (operator == TokenType.XOR || bothSnippetsAreConstant) return new BinaryOperatorTemplate("^", false).applyToSnippet(this.booleanType, wholeRange, leftSnippet, rightSnippet);

        /*
        * lazy and/or
        */
        // pure Term without pop => javascript interpreter does lazy evaluation for us:
        if (leftSnippet.isPureTermWithoutPop() && rightSnippet.isPureTermWithoutPop()) return new BinaryOperatorTemplate(TokenTypeReadable[operator], false).applyToSnippet(this.booleanType, wholeRange, leftSnippet, rightSnippet);

        let snippetContainer = new CodeSnippetContainer([], wholeRange, this.booleanType);

        snippetContainer.addParts(leftSnippet.allButLastPart());

        let label = new LabelCodeSnippet();
        if (operator == TokenType.and) {
            snippetContainer.addStringPart(`if(!${StepParams.stack}.pop()){s.push(false);`, EmptyRange.instance);
        } else {
            snippetContainer.addStringPart(`if(${StepParams.stack}.pop()){s.push(true);`, EmptyRange.instance);
        }

        snippetContainer.addParts(label.getJumpToSnippet());
        snippetContainer.addStringPart('\n}', EmptyRange.instance);

        snippetContainer.addNextStepMark();

        rightSnippet.ensureFinalValueIsOnStack();
        snippetContainer.addParts(rightSnippet);

        snippetContainer.addParts(label);

        return snippetContainer;


    }

    /**
     * one of the operands is of type string 
     * both operators are unboxed and operation is not in [==, !=]
     */
    compileBinaryOperationWithStrings(leftSnippet: CodeSnippet, rightSnippet: CodeSnippet, lTypeIndex: number, rTypeIndex: number, lIdentifier: string, rIdentifier: string, operator: BinaryOperator, operatorRange: IRange, wholeRange: IRange): CodeSnippet | undefined {
        if (operator != TokenType.plus && comparisonOperators.indexOf(operator) < 0) {
            this.pushError("Der Operator " + TokenTypeReadable[operator] + " ist für die Typen " + lIdentifier + " und " + rIdentifier + " nicht geeignet.", "error", operatorRange);
            return undefined;
        }

        if (lTypeIndex == nOtherClass) leftSnippet = this.wrapWithToStringCall(leftSnippet, "string");
        if (rTypeIndex == nOtherClass) rightSnippet = this.wrapWithToStringCall(rightSnippet, "string");

        let returnType: JavaType = operator == TokenType.plus ? this.stringType : this.booleanType;

        return new BinaryOperatorTemplate(TokenTypeReadable[operator], false).applyToSnippet(returnType, wholeRange, leftSnippet, rightSnippet);

    }

    wrapWithToStringCall(leftSnippet: CodeSnippet, primitiveOrClassNeeded: "string" | "String"): CodeSnippet {
        if (leftSnippet.type?.identifier == "String") {
            if (primitiveOrClassNeeded == "string") {
                return SnippetFramer.frame(leftSnippet, `${Helpers.nullstringIfNull}(§1)`, this.stringType);
            } else {
                return leftSnippet;
            }
        }

        if (leftSnippet.type?.identifier == "string") {
            if (primitiveOrClassNeeded == "String") {
                return SnippetFramer.frame(leftSnippet, `new ${Helpers.classes}["String"](§1)`, this.stringType);
            } else {
                return leftSnippet;
            }
        }

        let newSnippet1 = SnippetFramer.frame(leftSnippet, `${Helpers.checkNPE('§1', leftSnippet.range!)}._mj$toString$String$(__t, undefined);\n`, this.stringNonPrimitiveType);
        newSnippet1.finalValueIsOnStack = true;
        let newSnippet2 = new CodeSnippetContainer(newSnippet1);
        newSnippet2.addNextStepMark();

        if (primitiveOrClassNeeded == "string") {
            let newSnippet3 = SnippetFramer.frame(newSnippet2, `${Helpers.nullstringIfNull}(§1)`, this.stringType);
            return newSnippet3;
        } else {
            return newSnippet2;
        }

    }



    /**
     * No operand is void type;
     * operator is any assignment operator (=, +=, -=, /=, *=, %=)
     */
    compileAssignment(leftSnippet: CodeSnippet, rightSnippet: CodeSnippet, lTypeIndex: number, rTypeIndex: number, lIdentifier: string, rIdentifier: string, operator: BinaryOperator, operatorRange: IRange, wholeRange: IRange): CodeSnippet | undefined {

        if (!leftSnippet.isLefty) {
            this.pushError("Dem Term auf der linken Seite des Zuweisungsoperators kann nichts zugewiesen werden.", "error", operatorRange);
            return;
        }

        let operatorAsString = TokenTypeReadable[operator];

        if (operator == TokenType.assignment) {
            rightSnippet = this.compileCast(rightSnippet, leftSnippet.type!, "implicit");
            return new BinaryOperatorTemplate(operatorAsString, false).applyToSnippet(leftSnippet.type!, wholeRange, leftSnippet, rightSnippet);
        }

        if (!leftSnippet.type!.isPrimitive) {
            if (leftSnippet.type == this.stringNonPrimitiveType && operator == TokenType.plusAssignment) {
                if (!this.canCastTo(rightSnippet.type, this.stringType, "implicit")) {
                    this.pushError("Der Term auf der rechten Seite des Zuweisungsoperators kann nicht in den Typ String umgewandelt werden.", "error", rightSnippet.range!);
                    return undefined;
                }
                rightSnippet = this.compileCast(rightSnippet, this.stringType, "implicit");
                return new TwoParameterTemplate(`§1 = ${Helpers.checkNPE('§1', leftSnippet.range!)}.add(§2)`).applyToSnippet(leftSnippet.type, wholeRange, leftSnippet, rightSnippet);
            }

            this.pushError("Mit dem Attribut/der Variablen auf der linken Seite des Zuweisungsoperators kann die Berechnung " + operatorAsString + " nicht durchgeführt werden.", "error", operatorRange);
            return leftSnippet;
        }

        let leftTypeIndex = primitiveTypeMap[leftSnippet.type!.identifier]!;

        rightSnippet = this.unbox(rightSnippet);
        let rightTypeIndex = primitiveTypeMap[rightSnippet.type!.identifier];

        if (leftTypeIndex == nString) {
            if (!rightSnippet.type?.isPrimitive) {
                rightSnippet = this.wrapWithToStringCall(rightSnippet, "string");
            }
            return new BinaryOperatorTemplate(operatorAsString, false).applyToSnippet(leftSnippet.type!, wholeRange, leftSnippet, rightSnippet);
        }

        if (!rightTypeIndex) {
            this.pushError("Mit dem Attribut/der Variablen auf der rechten Seite des Zuweisungsoperators kann die Berechnung " + operatorAsString + " nicht durchgeführt werden.", "error", operatorRange);
            return leftSnippet;
        }

        if (leftTypeIndex < nByte || leftTypeIndex > nDouble) {
            this.pushError("Mit dem Attribut/der Variablen auf der linken Seite des Zuweisungsoperators kann die Berechnung " + operatorAsString + " nicht durchgeführt werden.", "error", operatorRange);
            return leftSnippet;
        }

        if (rightTypeIndex == nChar) rightSnippet = this.convertCharToNumber(rightSnippet);

        if (leftTypeIndex < rightTypeIndex) {
            this.pushError("Der Wert des Datentyps auf der rechten Seite des Operators " + operatorAsString + " kann mit der Variablen/dem Attribut auf der linken Seite nicht verrechnet werden.", "error", operatorRange);
            return leftSnippet;
        }

        return new BinaryOperatorTemplate(operatorAsString, false).applyToSnippet(leftSnippet.type!, wholeRange, leftSnippet, rightSnippet);

    }

    compileCast(snippet: CodeSnippet, castTo: JavaType, castType: "explicit" | "implicit") {
        if (!snippet || !snippet.type || !castTo) return snippet;
        let type: JavaType = snippet.type;

        if (snippet.type == castTo) return snippet;

        if (!type.isPrimitive) {
            if (castTo.identifier == "string" || castTo.identifier == "String") {
                snippet = this.wrapWithToStringCall(snippet, castTo.identifier);
                return snippet;
            }
            if (castTo.isPrimitive) {
                let boxedIndex = boxedTypesMap[type.identifier];
                if (boxedIndex) {
                    snippet = this.unbox(snippet);
                    // continue below...
                } else {
                    this.pushError("Der Typ " + type.identifier + " kann nicht in den Typ " + castTo.identifier + " gecastet werden.", "error", snippet.range!);
                    return snippet;
                }
            } else {
                // cast object to object
                if (castType == "explicit" && this.canCastTo(snippet.type, castTo, "explicit") || castType == "implicit" && this.canCastTo(snippet.type, castTo, "implicit")) {
                    return snippet;
                }
                this.pushError("Der Typ " + type.identifier + " kann nicht in den Typ " + castTo.identifier + " gecastet werden.", "error", snippet.range!);
                return snippet;
            }
        }

        if (!castTo.isPrimitive) {
            // snippet has primitive type. boxing?
            // let boxedTypeIndex = boxedTypesMap[castTo.identifier];
            // if (primitiveTypeMap[type.identifier] == boxedTypeIndex) {
            return this.box(snippet);
            // }

            this.pushError("Der Typ " + type.identifier + " kann nicht in den Typ " + castTo.identifier + " gecastet werden.", "error", snippet.range!);
            return snippet;
        }

        // now snippet.type and castTo are primitive.
        // nVoid = 2, nBoolean = 3, nChar = 4, nByte = 5, nShort = 6, nInteger = 7, nLong = 8, nFloat = 9, nDouble = 10, nString = 11
        let snippetTypeIndex = primitiveTypeMap[type.identifier]!;
        let castToTypeIndex = primitiveTypeMap[castTo.identifier]!;
        if (snippetTypeIndex == castToTypeIndex) {
            if (castType == "explicit") this.pushError("Unnötiges Casten", "info", snippet.range!);
            return snippet;
        }

        if (snippetTypeIndex == nChar) {
            if (castToTypeIndex == nString) return snippet;
            if (castToTypeIndex >= nByte && castToTypeIndex <= nDouble) {
                return this.convertCharToNumber(snippet);
            }
            this.pushError("Der Typ " + type.identifier + " kann nicht in den Typ " + castTo.identifier + " gecastet werden.", "error", snippet.range!);
            return snippet;
        }

        if (castToTypeIndex == nChar) {
            if ([nByte, nShort, nInteger, nLong].indexOf(snippetTypeIndex) >= 0) {
                return this.convertNumberToChar(snippet);
            }
            this.pushError("Der Typ " + type.identifier + " kann nicht in den Typ " + castTo.identifier + " gecastet werden.", "error", snippet.range!);
            return snippet;
        }

        if (castToTypeIndex == nString) {
            if (snippet.isConstant()) return new StringCodeSnippet(`"${snippet.getConstantValue()}"`, snippet.range, this.stringType, "" + snippet.getConstantValue);
            return new OneParameterTemplate('("" + §1)').applyToSnippet(this.stringType, snippet.range!, snippet);
        }

        // no cast from string, no cast from/to void, boolean
        if (snippetTypeIndex == nString || snippetTypeIndex == nVoid || castToTypeIndex == nVoid || snippetTypeIndex == nBoolean || castToTypeIndex == nBoolean) {
            this.pushError("Der Typ " + type.identifier + " kann nicht in den Typ " + castTo.identifier + " gecastet werden.", "error", snippet.range!);
            return snippet;
        }


        // now both types are in nByte = 5, nShort = 6, nInteger = 7, nLong = 8, nFloat = 9, nDouble = 10
        if (snippetTypeIndex <= castToTypeIndex) return snippet;

        if (castType == "implicit") {
            this.pushError("Der Typ " + type.identifier + " kann nicht in den Typ " + castTo.identifier + " gecastet werden.", "error", snippet.range!);
            return snippet;
        }


        if (snippet.isConstant()) {
            let value: number = <number>snippet.getConstantValue();
            let result: number;

            switch (castToTypeIndex) {
                case nByte: result = snippetTypeIndex <= nLong ? ((value + 128) % 256 - 128) : ((Math.trunc(value) + 128) % 256 - 128);
                    break;
                case nShort: result = snippetTypeIndex <= nLong ? ((value + 0x8000) % 0x10000 - 0x8000) : ((Math.trunc(value) + 0x8000) % 0x10000 - 0x8000);
                    break;
                case nInteger: result = snippetTypeIndex <= nLong ? ((value + 0x80000000) % 0x100000000 - 0x80000000) : ((Math.trunc(value) + 0x80000000) % 0x100000000 - 0x80000000);
                    break;
                case nLong: result = Math.trunc(value);
                    break;
                case nFloat: result = Math.fround(value);
                    break;
            }

            return new StringCodeSnippet("" + value, snippet.range!, castTo, value);

        } else {
            let template: OneParameterTemplate | undefined;

            switch (castToTypeIndex) {
                case nByte: template = snippetTypeIndex <= nLong ? new OneParameterTemplate('((§1 + 128) % 256 - 128)') : new OneParameterTemplate('((Math.trunc(§1) + 128) % 256 - 128)');
                    break;
                case nShort: template = snippetTypeIndex <= nLong ? new OneParameterTemplate('((§1 + 0x8000) % 0x10000 - 0x8000)') : new OneParameterTemplate('((Math.trunc(§1) + 0x80000000) % 0x100000000 - 0x80000000)');
                    break;
                case nInteger: template = snippetTypeIndex <= nLong ? new OneParameterTemplate('((§1 + 0x80000000) % 0x100000000 - 0x80000000)') : new OneParameterTemplate('((Math.trunc(§1) + 0x80000000) % 0x100000000 - 0x80000000)');
                    break;
                case nLong: template = new OneParameterTemplate('Math.trunc(§1)');
                    break;
                case nFloat: template = new OneParameterTemplate('Math.fround(§1)');
                    break;
            }

            if (template) return template.applyToSnippet(castTo, snippet.range!, snippet);
            return snippet;
        }



    }


    canCastTo(typeFrom: JavaType | undefined, typeTo: JavaType | undefined, castType: "explicit" | "implicit"): boolean {

        if (!typeFrom || !typeTo) return false;

        let typeFromIndex = primitiveTypeMap[typeFrom.identifier] || boxedTypesMap[typeFrom.identifier];
        let typeToIndex = primitiveTypeMap[typeTo.identifier] || boxedTypesMap[typeTo.identifier];

        if (typeToIndex == nString) return true;

        if ((!typeFrom.isPrimitive || typeFrom == this.stringType) && !typeTo.isPrimitive) {
            if (typeFrom == this.stringType) typeFrom = this.primitiveStringClass.type;

            if (typeFrom instanceof ArrayType || typeTo instanceof ArrayType) {
                if (typeFrom instanceof ArrayType && typeTo instanceof ArrayType) {
                    return typeFrom.dimension == typeTo.dimension && this.canCastTo(typeFrom.elementType, typeTo.elementType, castType);
                }
                return false;
            }
            if (castType == "explicit") {
                return (<NonPrimitiveType>typeFrom).canExplicitlyCastTo(typeTo);
            } else {
                return (<NonPrimitiveType>typeFrom).canImplicitlyCastTo(typeTo);
            }
        }

        if (!typeFromIndex || !typeToIndex) return false;

        if (typeFromIndex == typeToIndex) return true;

        if (typeFromIndex == nBoolean) return false;
        if (typeFromIndex == nChar) {
            return typeToIndex >= nByte && typeToIndex <= nDouble;
        }

        if (castType == "explicit") return true;
        return typeFromIndex <= typeToIndex;
    }

    anyOperandHasVoidType(lTypeIndex: number, rTypeIndex: number, operator: TokenType, operatorRange: IRange): boolean {
        if (lTypeIndex == nVoid) {
            this.pushError("Der Term auf der linken Seite des '" + TokenTypeReadable[operator] + "' - Operators hat keinen Datentyp. ", "error", operatorRange);
            return true;
        }
        if (rTypeIndex == nVoid) {
            this.pushError("Der Term auf der rechten Seite des '" + TokenTypeReadable[operator] + "' - Operators hat keinen Datentyp. ", "error", operatorRange);
            return true;
        }
        return false;
    }

    pushError(message: string, errorLevel: ErrorLevel = "error", nodeOrRange: ASTNode | IRange, quickFix?: QuickFix) {

        //@ts-ignore
        let range: IRange = nodeOrRange["kind"] ? nodeOrRange.range : nodeOrRange;

        this.module.errors.push({
            message: message,
            range: range,
            quickFix: quickFix,
            level: errorLevel
        });
    }


    unbox(snippet: CodeSnippet): CodeSnippet {
        if (!snippet.type) return snippet;
        let boxedTypeIndex: number | undefined = boxedTypesMap[snippet.type.identifier];
        if (!boxedTypeIndex) return snippet;  // type is not boxed

        let unboxedType = this.primitiveTypes[boxedTypeIndex];

        return SnippetFramer.frame(snippet, '(§1).value', unboxedType);
    }

    box(snippet: CodeSnippet): CodeSnippet {
        if (!snippet.type) return snippet;
        let unboxedTypeIndex = primitiveTypeMap[snippet.type.identifier];

        if (!unboxedTypeIndex) return snippet;
        let boxedIdentifier = boxedTypeIdentifiers[unboxedTypeIndex];
        if (!boxedIdentifier || boxedIdentifier.length == 0) return snippet;

        let boxedType = this.libraryTypestore.getType(boxedIdentifier);

        return SnippetFramer.frame(snippet, `new ${Helpers.classes}["${boxedIdentifier}"](§1)`, boxedType);
    }

    convertCharToNumber(snippet: CodeSnippet): CodeSnippet {
        if (!snippet.type) return snippet;
        if (snippet.type.identifier != 'char') return snippet;

        if (snippet.isConstant()) {
            let result = (<string>snippet.getConstantValue()).charCodeAt(0);
            return new StringCodeSnippet(result + "", snippet.range, this.intType, result);
        }

        return SnippetFramer.frame(snippet, '§1.charCodeAt(0)', this.intType);
    }

    convertNumberToChar(snippet: CodeSnippet): CodeSnippet {
        if (!snippet.type) return snippet;

        if (snippet.isConstant()) {
            let result = String.fromCharCode(<number>snippet.getConstantValue());
            return new StringCodeSnippet(`"${result}"`, snippet.range, this.charType, result);
        }

        return SnippetFramer.frame(snippet, 'String.fromCharCode(§1)', this.charType);
    }

    isNumberPrimitiveType(type: JavaType): boolean {
        if (!type) return false;
        let index = primitiveTypeMap[type.identifier];
        if (!index) return false;
        return index >= nByte && index <= nDouble;
    }

    compileUnaryOperator(operand: CodeSnippet | undefined, operator: TokenType): CodeSnippet | undefined {
        if (!operand) return undefined;
        if (!operand.type) {
            this.pushError("Der Typ des Terms kann nicht bestimmt werden.", "error", operand.range!);
            return;
        }

        operand = this.unbox(operand);
        let operatorAsString = TokenTypeReadable[operator];

        let primitiveIndex = primitiveTypeMap[operand.type!.identifier];
        if (!primitiveIndex) {
            this.pushError("Der Operator " + operatorAsString + " ist nicht für den Operanden des Typs " + operand.type!.identifier + "geeignet.", "error", operand.range!);
            return;
        }

        if (operator == TokenType.not) {
            if (primitiveIndex == nBoolean) {
                return this.applyUnaryOperatorConsideringConstantFolding("!", this.booleanType, operand.range!, operand);
            }
            this.pushError("Der Operator ! (not) ist nur für boolesche Operanden geeignet, nicht für Operanden des Typs " + operand.type!.identifier + ".", "error", operand.range!);
            return operand;
        }

        if ([TokenType.plusPlus, TokenType.minusMinus].indexOf(operator) >= 0) {
            if (!operand.isLefty) {
                this.pushError("Der Operator " + operatorAsString + " ist nur für Variablen/Attribute geeignet, deren Wert verändert werden kann.", "error", operand.range!);
                return;
            }
            if (primitiveIndex >= nByte && primitiveIndex <= nDouble) {
                return new OneParameterTemplate(operatorAsString + "§1").applyToSnippet(operand.type!, operand.range!, operand);
            }
            this.pushError("Der Operator " + operatorAsString + " ist nicht für den Operanden des Typs " + operand.type!.identifier + "geeignet.", "error", operand.range!);
            return;
        }

        if ([TokenType.negation, TokenType.plus].indexOf(operator) >= 0) {
            if (primitiveIndex >= nByte && primitiveIndex <= nDouble) {
                return this.applyUnaryOperatorConsideringConstantFolding(operatorAsString, operand.type!, operand.range!, operand);
            }
            this.pushError("Der Operator " + operatorAsString + " ist nicht für den Operanden des Typs " + operand.type!.identifier + "geeignet.", "error", operand.range!);
            return;
        }

        // Tilde-Operator
        if (primitiveIndex >= nByte && primitiveIndex <= nLong) {
            return this.applyUnaryOperatorConsideringConstantFolding(operatorAsString, operand.type!, operand.range!, operand);
        }

        this.pushError("Der Operator " + operatorAsString + " ist nicht für den Operanden des Typs " + operand.type!.identifier + "geeignet.", "error", operand.range!);
        return;


    }

    applyUnaryOperatorConsideringConstantFolding(operator: string, resultType: JavaType, range: IRange, snippet: CodeSnippet): CodeSnippet {
        if (snippet.isConstant()) {
            let operand = snippet.getConstantValue()!;
            let result!: ConstantValue;

            switch (operator) {
                case "-": result = -operand; break;
                case "+": return snippet;
                case "~": result = ~operand; break;
                case "!": result = !operand; break;
            }

            return new StringCodeSnippet("" + result, range, resultType, result);

        } else {

            return new OneParameterTemplate(operator + "§1").applyToSnippet(resultType, range, snippet);

        }

    }

    isAssignmentOperator(tt: TokenType): boolean {
        return assignmentOperators.indexOf(tt) >= 0;
    }

    /**
 * 
 *  Compiles expressions like new MyAbstractClass(p1, p2){ attributeDeclarations, instanceInitializers, methodDeclarations }
 * 
 * @param node 
 */
    abstract compileAnonymousInnerClass(node: ASTAnonymousClassNode): CodeSnippet | undefined;

    abstract compileLambdaFunction(node: ASTLambdaFunctionDeclarationNode, expectedType: JavaType | undefined): CodeSnippet | undefined;


}