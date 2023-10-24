import { IRange, Range } from "../../common/range/Range";
import { Token } from "../Token.ts";
import { TokenType } from "../TokenType";
import { ASTAttributeDeclarationNode, ASTClassDefinitionNode, ASTMethodDeclarationNode, ASTNode, ASTNodeWithModifiers, ASTParameterNode, ASTTermNode, ASTTypeNode, TypeScope } from "./AST";
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
            block: undefined
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

    buildParameterNode(startRange: IRange, identifier: Token, type: ASTTypeNode, isEllipsis: boolean): ASTParameterNode {
        return {
            kind: TokenType.parameterDeclaration,
            range: startRange,
            identifier: <string>identifier.value,
            identifierRange: identifier.range,
            type: type,
            isEllipsis: isEllipsis
        }
    }

}