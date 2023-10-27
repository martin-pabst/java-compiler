import { IRange, Range } from "../../common/range/Range";
import { Token } from "../Token.ts";
import { TokenType } from "../TokenType";
import { ASTAttributeDeclarationNode, ASTAttributeDereferencingNode, ASTBinaryNode, ASTCastNode, ASTClassDefinitionNode, ASTDoWhileNode, ASTForLoopNode, ASTIfNode, ASTLambdaFunctionDeclarationNode, ASTMethodCallNode, ASTMethodDeclarationNode, ASTNewObjectNode, ASTNode, ASTNodeWithModifiers, ASTParameterNode, ASTPlusPlusMinusMinusSuffixNode, ASTSelectArrayElementNode, ASTStatementNode, ASTTermNode, ASTTypeNode, ASTUnaryPrefixNode, ASTVariableNode, ASTWhileNode, TypeScope, UnaryPrefixOperator } from "./AST";
import { TermParser } from "./TermParser.ts";

export class ASTNodeFactory {

    constructor(private parser: TermParser){

    }

    buildTypeNode(startRange?: IRange): ASTTypeNode {

        if(!startRange) startRange = this.parser.cct.range;

        return {
            kind: TokenType.type,
            range: Object.assign({}, startRange),
            identifier: "",
            arrayDimensions: 0,
            genericParameterInvocations: []
        }

    }

    buildClassNode(modifiers: ASTNodeWithModifiers, identifier: Token, parent: TypeScope): ASTClassDefinitionNode {

        let node: ASTClassDefinitionNode = {
            kind: TokenType.keywordClass,
            range: modifiers.range,
            parent: parent,
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
            classOrInterfaceOrEnumDefinitions: []
        }

        parent.classOrInterfaceOrEnumDefinitions.push(node);
        return node;

    }

    buildMethodNode(returnParameterType: ASTTypeNode | undefined, isContructor: boolean, modifiers: ASTNodeWithModifiers, 
        identifier: Token, rangeStart: IRange): ASTMethodDeclarationNode {

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
            statement: undefined
        }

        return node;

    }

    buildAttributeNode(rangeStart: IRange, identifier: Token, type: ASTTypeNode, initialization: ASTTermNode | undefined, modifiers: ASTNodeWithModifiers): ASTAttributeDeclarationNode {
        return {
            kind: TokenType.attributeDeclaration,
            range: rangeStart,
            identifier: <string>identifier.value,
            identifierRange: identifier.range,
            type: type,
            initialization: initialization,
            visibility: modifiers.visibility,
            isFinal: modifiers.isFinal,
            isStatic: modifiers.isStatic,
            isAbstract: modifiers.isAbstract
        }
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

    buildPlusPlusMinusMinusSuffixNode(operator: Token, childNode: ASTTermNode):ASTPlusPlusMinusMinusSuffixNode {
        return {
            kind: TokenType.plusPlusMinusMinusSuffix,
            range: {startLineNumber: operator.range.startLineNumber, startColumn: operator.range.startColumn, endLineNumber: childNode.range.endLineNumber, endColumn: childNode.range.endColumn},
            operator: <any>operator.tt,
            term: childNode
        }
    }

    buildUnaryPrefixNode(operator: Token, childNode: ASTTermNode): ASTUnaryPrefixNode {
        return {
            kind: TokenType.unaryPrefixOp,
            range: {startLineNumber: operator.range.startLineNumber, startColumn: operator.range.startColumn, endLineNumber: childNode.range.endLineNumber, endColumn: childNode.range.endColumn},
            operator: <any>operator.tt,
            term: childNode
        }
    }

    buildAttributeDereferencingNode(identifier: Token): ASTAttributeDereferencingNode {
        return {
            kind: TokenType.pushAttribute,
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

    buildLambdaFunctionDeclarationNode(startToken: Token): ASTLambdaFunctionDeclarationNode{
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

    buildVariableNode(identifier: Token): ASTVariableNode {
        return {
            kind: TokenType.variable,
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

    buildSelectArrayElement(array: ASTTermNode): ASTSelectArrayElementNode {
        return {
            kind: TokenType.selectArrayElement,
            range: array.range,
            array: array,
            indices: []
        };
    }

    buildWhileNode(whileToken: Token, tokenAfterWhileBlock: Token, condition: ASTTermNode, statementToRepeat: ASTStatementNode): ASTWhileNode{
        return {
            kind: TokenType.keywordWhile,
            range: {startLineNumber: whileToken.range.startLineNumber, startColumn: whileToken.range.startColumn, endLineNumber: tokenAfterWhileBlock.range.endLineNumber, endColumn: tokenAfterWhileBlock.range.endColumn},
            condition: condition,
            statementToRepeat: statementToRepeat
        }
    }

    buildDoWhileNode(doToken: Token, tokenAfterDoWhileBlock: Token, condition: ASTTermNode, statementToRepeat: ASTStatementNode): ASTDoWhileNode{
        return {
            kind: TokenType.keywordDo,
            range: {startLineNumber: doToken.range.startLineNumber, startColumn: doToken.range.startColumn, endLineNumber: tokenAfterDoWhileBlock.range.endLineNumber, endColumn: tokenAfterDoWhileBlock.range.endColumn},
            condition: condition,
            statementToRepeat: statementToRepeat
        }
    }

    buildIfNode(ifToken: Token, tokenAfterIfBlock: Token, condition: ASTTermNode, statementIfTrue: ASTStatementNode, statementIfFalse: ASTStatementNode | undefined): ASTIfNode{
        return {
            kind: TokenType.keywordIf,
            range: {startLineNumber: ifToken.range.startLineNumber, startColumn: ifToken.range.startColumn, endLineNumber: tokenAfterIfBlock.range.endLineNumber, endColumn: tokenAfterIfBlock.range.endColumn},
            condition: condition,
            statementIfTrue: statementIfTrue,
            statementIfFalse: statementIfFalse,

        }
    }

    buildForLoopNode(forToken: Token, tokenAfterforBlock: Token, 
        firstStatement: ASTStatementNode, condition: ASTTermNode, 
        lastStatement: ASTStatementNode, 
        statementToRepeat: ASTStatementNode): ASTForLoopNode{
        return {
            kind: TokenType.keywordFor,
            range: {startLineNumber: forToken.range.startLineNumber, startColumn: forToken.range.startColumn, endLineNumber: tokenAfterforBlock.range.endLineNumber, endColumn: tokenAfterforBlock.range.endColumn},
            firstStatement: firstStatement,
            condition: condition,
            lastStatement: lastStatement,
            statementToRepeat: statementToRepeat
        }
    }

}