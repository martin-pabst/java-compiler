import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { Token } from "../lexer/Token.ts";
import { ASTAnnotationNode, ASTAttributeDeclarationNode, ASTAttributeDereferencingNode, ASTBlockNode, ASTBreakNode, ASTCaseNode, ASTCastNode, ASTCatchNode, ASTClassDefinitionNode, ASTLiteralNode, ASTContinueNode, ASTDoWhileNode, ASTEnumDefinitionNode, ASTEnumValueNode, ASTForLoopNode, ASTIfNode, ASTInterfaceDefinitionNode, ASTLambdaFunctionDeclarationNode, ASTLocalVariableDeclaration, ASTMethodCallNode, ASTMethodDeclarationNode, ASTNewObjectNode, ASTNodeWithModifiers, ASTParameterNode, ASTPlusPlusMinusMinusSuffixNode, ASTPrintStatementNode, ASTProgramNode, ASTReturnNode, ASTSelectArrayElementNode, ASTSimpifiedForLoopNode, ASTStatementNode, ASTSuperNode, ASTSwitchCaseNode, ASTTermNode, ASTThisNode, ASTTryCatchNode, ASTTypeNode, ASTUnaryPrefixNode, ASTSymbolNode, ASTWhileNode, TypeScope, ASTNewArrayNode } from "./AST";
import { TermParser } from "./TermParser.ts";

export class ASTNodeFactory {

    constructor(private parser: TermParser) {

    }

    buildTypeNode(enclosingClassOrInterface: ASTClassDefinitionNode | ASTInterfaceDefinitionNode | undefined, startRange?: IRange): ASTTypeNode {

        if (!startRange) startRange = this.parser.cct.range;

        return {
            kind: TokenType.type,
            range: startRange,
            identifier: "",
            arrayDimensions: 0,
            genericParameterInvocations: [],
            isVoidType: false,
            isVarKeyword: false,
            enclosingClassOrInterface: enclosingClassOrInterface
        }

    }

    buildClassNode(modifiers: ASTNodeWithModifiers, identifier: Token, 
        parent: TypeScope, annotations: ASTAnnotationNode[]): ASTClassDefinitionNode {

        let node: ASTClassDefinitionNode = {
            kind: TokenType.keywordClass,
            range: modifiers.range,
            parent: parent,
            extends: undefined,
            implements: [],
            identifier: <string>identifier.value,
            identifierRange: identifier.range,
            visibility: modifiers.visibility,
            isFinal: modifiers.isFinal,
            isStatic: modifiers.isStatic,
            isAbstract: modifiers.isAbstract,
            genericParameterDefinitions: [],
            attributes: [],
            methods: [],
            innerClasses: [],
            classOrInterfaceOrEnumDefinitions: [],
            annotations: []
        }

        if(annotations.length > 0){
            node.annotations = annotations.slice();
            annotations.splice(0, annotations.length);
        }

        parent.classOrInterfaceOrEnumDefinitions.push(node);
        return node;

    }

    buildEnumNode(modifiers: ASTNodeWithModifiers, identifier: Token , 
        parent: TypeScope, annotations: ASTAnnotationNode[]): ASTEnumDefinitionNode {

        let node: ASTEnumDefinitionNode = {
            kind: TokenType.keywordEnum,
            range: modifiers.range,
            parent: parent,
            identifier: <string>identifier.value,
            identifierRange: identifier.range,
            visibility: modifiers.visibility,
            attributes: [],
            methods: [],
            annotations: [],
            valueNodes: [],
            isAbstract: false,
            isFinal: false,
            isStatic: false
        }

        if(annotations.length > 0){
            node.annotations = annotations.slice();
            annotations.splice(0, annotations.length);
        }

        parent.classOrInterfaceOrEnumDefinitions.push(node);
        return node;

    }

    buildEnumValueNode(identifier: Token): ASTEnumValueNode {
        return {
            kind: TokenType.initializeEnumValue,
            range: identifier.range,
            identifier: <string> identifier.value,
            identifierRange: identifier.range,
            parameterValues: []
        }
    }

    buildInterfaceNode(modifiers: ASTNodeWithModifiers, identifier: Token, 
        parent: TypeScope, annotations: ASTAnnotationNode[]): ASTInterfaceDefinitionNode {

        let node: ASTInterfaceDefinitionNode = {
            kind: TokenType.keywordInterface,
            range: modifiers.range,
            parent: parent,
            implements: [],
            identifier: <string>identifier.value,
            identifierRange: identifier.range,
            visibility: modifiers.visibility,
            isFinal: modifiers.isFinal,
            isStatic: modifiers.isStatic,
            isAbstract: modifiers.isAbstract,
            genericParameterDefinitions: [],
            methods: [],
            annotations: []
        }

        if(annotations.length > 0){
            node.annotations = annotations.slice();
            annotations.splice(0, annotations.length);
        }

        parent.classOrInterfaceOrEnumDefinitions.push(node);
        return node;

    }

    buildMethodNode(returnParameterType: ASTTypeNode | undefined, isContructor: boolean, modifiers: ASTNodeWithModifiers,
        identifier: Token, rangeStart: IRange, annotations: ASTAnnotationNode[]): ASTMethodDeclarationNode {

        let node: ASTMethodDeclarationNode = {
            kind: TokenType.methodDeclaration,
            range: rangeStart,
            identifier: <string>identifier.value,
            identifierRange: identifier.range,
            visibility: modifiers.visibility,
            isFinal: modifiers.isFinal,
            isStatic: modifiers.isStatic,
            isAbstract: modifiers.isAbstract,
            isContructor: isContructor,
            parameters: [],
            returnParameterType: returnParameterType,
            statement: undefined,
            annotations: []
        }

        if(annotations.length > 0){
            node.annotations = annotations.slice();
            annotations.splice(0, annotations.length);
        }

        return node;

    }

    buildAttributeNode(rangeStart: IRange, identifier: Token, type: ASTTypeNode, 
        initialization: ASTTermNode | undefined, modifiers: ASTNodeWithModifiers,
        annotations: ASTAnnotationNode[]): ASTAttributeDeclarationNode {

        let node: ASTAttributeDeclarationNode = {
            kind: TokenType.attributeDeclaration,
            range: rangeStart,
            identifier: <string>identifier.value,
            identifierRange: identifier.range,
            type: type,
            initialization: initialization,
            visibility: modifiers.visibility,
            isFinal: modifiers.isFinal,
            isStatic: modifiers.isStatic,
            isAbstract: modifiers.isAbstract,
            annotations: []
        }

        if(annotations.length > 0){
            node.annotations = annotations.slice();
            annotations.splice(0, annotations.length);
        }

        return node;
    }


    buildNodeWithModifiers(startRange: IRange): ASTNodeWithModifiers {
        return {
            range: startRange,
            visibility: TokenType.keywordPublic,
            isFinal: false,
            isStatic: false,
            isAbstract: false
        }
    }

    buildParameterNode(startRange: IRange, identifier: Token, type: ASTTypeNode | undefined, isEllipsis: boolean): ASTParameterNode {
        return {
            kind: TokenType.parameterDeclaration,
            range: startRange,
            identifier: <string>identifier.value,
            identifierRange: identifier.range,
            type: type,
            isEllipsis: isEllipsis
        }
    }

    buildPlusPlusMinusMinusSuffixNode(operator: Token, childNode: ASTTermNode): ASTPlusPlusMinusMinusSuffixNode {
        return {
            kind: TokenType.plusPlusMinusMinusSuffix,
            range: { startLineNumber: childNode.range.startLineNumber, startColumn: childNode.range.startColumn, endLineNumber: operator.range.endLineNumber, endColumn: operator.range.endColumn },
            operator: <any>operator.tt,
            term: childNode
        }
    }

    buildUnaryPrefixNode(operator: Token, childNode: ASTTermNode): ASTUnaryPrefixNode {
        return {
            kind: TokenType.unaryPrefixOp,
            range: { startLineNumber: operator.range.startLineNumber, startColumn: operator.range.startColumn, endLineNumber: childNode.range.endLineNumber, endColumn: childNode.range.endColumn },
            operator: <any>operator.tt,
            term: childNode
        }
    }

    buildAttributeDereferencingNode(identifier: Token): ASTAttributeDereferencingNode {
        return {
            kind: TokenType.dereferenceAttribute,
            range: identifier.range,
            attributeIdentifier: <string>identifier.value
        }
    }

    buildMethodCallNode(identifier: Token, nodeToGetObject: ASTTermNode | undefined): ASTMethodCallNode {
        return {
            kind: TokenType.callMethod,
            identifier: <string>identifier.value,
            identifierRange: identifier.range,
            range: identifier.range,
            nodeToGetObject: nodeToGetObject,
            parameterValues: []
        }
    }

    buildLambdaFunctionDeclarationNode(startToken: Token): ASTLambdaFunctionDeclarationNode {
        return {
            kind: TokenType.lambda,
            range: startToken.range,
            parameters: [],
            statement: undefined
        }
    }

    buildCastNode(startToken: Token, castType: ASTTypeNode, objectToCast: ASTTermNode): ASTCastNode {
        return {
            range: startToken.range,
            kind: TokenType.castValue,
            castType: castType,
            objectToCast: objectToCast
        }
    }

    buildVariableNode(identifier: Token): ASTSymbolNode {
        return {
            kind: TokenType.symbol,
            range: identifier.range,
            identifier: <string>identifier.value
        }
    }

    buildNewObjectNode(startToken: Token, type: ASTTypeNode): ASTNewObjectNode {
        return {
            kind: TokenType.newObject,
            range: startToken.range,
            parameterValues: [],
            type: type
        }
    }

    buildNewArrayNode(startToken: Token, arrayType: ASTTypeNode, dimensions: ASTTermNode[]): ASTNewArrayNode {
        return {
            kind: TokenType.newArray,
            range: startToken.range,
            arrayType: arrayType,
            dimensions: dimensions
        }
    }

    buildSelectArrayElement(array: ASTTermNode): ASTSelectArrayElementNode {
        return {
            kind: TokenType.selectArrayElement,
            range: array.range,
            array: array,
            indices: []
        };
    }

    buildWhileNode(whileToken: Token, tokenAfterWhileBlock: Token, condition: ASTTermNode, statementToRepeat: ASTStatementNode): ASTWhileNode {
        return {
            kind: TokenType.keywordWhile,
            range: { startLineNumber: whileToken.range.startLineNumber, startColumn: whileToken.range.startColumn, endLineNumber: tokenAfterWhileBlock.range.endLineNumber, endColumn: tokenAfterWhileBlock.range.endColumn },
            condition: condition,
            statementToRepeat: statementToRepeat
        }
    }

    buildDoWhileNode(doToken: Token, tokenAfterDoWhileBlock: Token, condition: ASTTermNode, statementToRepeat: ASTStatementNode): ASTDoWhileNode {
        return {
            kind: TokenType.keywordDo,
            range: { startLineNumber: doToken.range.startLineNumber, startColumn: doToken.range.startColumn, endLineNumber: tokenAfterDoWhileBlock.range.endLineNumber, endColumn: tokenAfterDoWhileBlock.range.endColumn },
            condition: condition,
            statementToRepeat: statementToRepeat
        }
    }

    buildIfNode(ifToken: Token, tokenAfterIfBlock: Token, condition: ASTTermNode, statementIfTrue: ASTStatementNode, statementIfFalse: ASTStatementNode | undefined): ASTIfNode {
        return {
            kind: TokenType.keywordIf,
            range: { startLineNumber: ifToken.range.startLineNumber, startColumn: ifToken.range.startColumn, endLineNumber: tokenAfterIfBlock.range.endLineNumber, endColumn: tokenAfterIfBlock.range.endColumn },
            condition: condition,
            statementIfTrue: statementIfTrue,
            statementIfFalse: statementIfFalse,

        }
    }

    buildForLoopNode(forToken: Token, firstStatement: ASTStatementNode | undefined, condition: ASTTermNode | undefined,
        lastStatement: ASTStatementNode | undefined,
        statementToRepeat: ASTStatementNode): ASTForLoopNode {
        return {
            kind: TokenType.keywordFor,
            range: { startLineNumber: forToken.range.startLineNumber, startColumn: forToken.range.startColumn, endLineNumber: statementToRepeat.range.endLineNumber, endColumn: statementToRepeat.range.endColumn },
            firstStatement: firstStatement,
            condition: condition,
            lastStatement: lastStatement,
            statementToRepeat: statementToRepeat
        }
    }

    buildMainProgramNode(beginToken: Token): ASTProgramNode {
        return {
            kind: TokenType.program,
            range: beginToken.range,
            statements: []
        }

    }

    buildPrintStatement(beginToken: Token, isPrintln: boolean): ASTPrintStatementNode {
        return {
            kind: TokenType.print,
            range: beginToken.range,
            isPrintln: isPrintln,
            firstParameter: undefined,
            secondParameter: undefined
        }
    }

    buildConstantNode(token: Token): ASTLiteralNode {
        return {
            kind: TokenType.literal,
            range: token.range,
            constantType: token.tt,
            value: token.value
        }
    }

    buildThisNode(token: Token): ASTThisNode {
        return {
            kind: TokenType.keywordThis,
            range: token.range
        }
    }

    buildSuperNode(token: Token): ASTSuperNode {
        return {
            kind: TokenType.keywordSuper,
            range: token.range
        }
    }

    buildBlockNode(leftCurlyBrace: Token): ASTBlockNode {
        return {
            kind: TokenType.block,
            range: leftCurlyBrace.range,
            statements: []
        }
    }

    buildSimplifiedForLoop(tokenFor: Token, elementType: ASTTypeNode, elementIdentifier: Token, collection: ASTTermNode, statementsToRepeat: ASTStatementNode): ASTSimpifiedForLoopNode{
        return {
            kind: TokenType.forLoopOverCollection,
            range: { startLineNumber: tokenFor.range.startLineNumber, startColumn: tokenFor.range.startColumn, endLineNumber: statementsToRepeat.range.endLineNumber, endColumn: statementsToRepeat.range.endColumn },
            elementType: elementType,
            elementIdentifier: <string>elementIdentifier.value,
            elementIdentifierPosition: elementIdentifier.range,
            collection: collection,
            statementToRepeat: statementsToRepeat                  
        }
    }

    buildSwitchCaseNode(tokenSwitch: Token, term: ASTTermNode): ASTSwitchCaseNode {
        return {
            kind: TokenType.keywordSwitch,
            range: tokenSwitch.range,
            term: term,
            caseNodes: [],
            defaultNode: undefined
        }
    }

    buildCaseNode(caseToken: Token, constant: ASTTermNode | undefined): ASTCaseNode {
        return {
            kind: TokenType.keywordCase,
            range: caseToken.range,
            constant: constant,
            statements: []
        }
    }

    buildContinueNode(continueToken: Token): ASTContinueNode {
        return {
            kind: TokenType.keywordContinue,
            range: continueToken.range
        }
    }

    buildBreakNode(breakToken: Token): ASTBreakNode {
        return {
            kind: TokenType.keywordBreak,
            range: breakToken.range
        }
    }

    buildReturnNode(returnToken: Token, term: ASTTermNode | undefined): ASTReturnNode {
        return {
            kind: TokenType.keywordReturn,
            range: term ? {startLineNumber: returnToken.range.startLineNumber, startColumn: returnToken.range.startColumn, endLineNumber: term.range.endLineNumber, endColumn: term.range.endColumn} : returnToken.range,
            term: term
        }
    }

    buildTryCatchNode(tryToken: Token, statement: ASTStatementNode): ASTTryCatchNode {
        return {
            kind: TokenType.keywordTry,
            range: {startLineNumber: tryToken.range.startLineNumber, startColumn: tryToken.range.startColumn, endLineNumber: statement.range.endLineNumber, endColumn: statement.range.endColumn},
            statement: statement,
            catchCases: []
        }
    }

    buildCatchNode(catchToken: Token, exceptionTypes: ASTTypeNode[], exceptionIdentifier: Token, statement: ASTStatementNode): ASTCatchNode{
        return {
            kind: TokenType.keywordCatch,
            range: {startLineNumber: catchToken.range.startLineNumber, startColumn: catchToken.range.startColumn, endLineNumber: statement.range.endLineNumber, endColumn: statement.range.endColumn},
            exceptionTypes: exceptionTypes,
            exceptionIdentifier: <string>exceptionIdentifier.value,
            exceptionIdentifierPosition: exceptionIdentifier.range,
            statement: statement
        }
    }

    buildAnnotationNode(identifer: Token): ASTAnnotationNode{
        return {
            kind: TokenType.annotation,
            range: identifer.range,
            identifier: <string>identifer.value
        }
    }

    buildLocalVariableDeclaration(type: ASTTypeNode, identifer: Token, initialization: ASTTermNode | undefined): ASTLocalVariableDeclaration | undefined {
        let end = initialization? initialization : identifer;

        return {
            kind: TokenType.localVariableDeclaration,
            identifier: <string>identifer.value,
            identifierRange: identifer.range,
            range: {startLineNumber: type.range.startLineNumber, startColumn: type.range.startColumn, endLineNumber: end.range.endLineNumber, endColumn: end.range.endColumn},
            type: type,
            initialization: initialization
        }
    }
}