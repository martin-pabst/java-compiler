import { Range } from "../../common/range/Range.ts";
import { Token } from "../lexer/Token.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";
import { TokenType } from "../TokenType";
import {
    ASTAnnotationNode,
    ASTClassDefinitionNode,
    ASTEnumDefinitionNode,
    ASTEnumValueNode,
    ASTGenericParameterDeclarationNode,
    ASTInterfaceDefinitionNode, ASTMethodDeclarationNode,
    ASTNodeWithModifiers, ASTTypeNode, TypeScope
} from "./AST.ts";
import { StatementParser } from "./StatementParser.ts";

export class Parser extends StatementParser {


    static forwardToInsideClass = [TokenType.keywordPublic, TokenType.keywordPrivate, TokenType.keywordProtected, TokenType.keywordVoid,
    TokenType.identifier, TokenType.rightCurlyBracket, TokenType.keywordStatic, TokenType.keywordAbstract,
    TokenType.keywordClass, TokenType.keywordEnum, TokenType.keywordInterface];

    static visibilityModifiers = [TokenType.keywordPrivate, TokenType.keywordProtected, TokenType.keywordPublic];
    static classOrInterfaceOrEnum = [TokenType.keywordClass, TokenType.keywordEnum, TokenType.keywordInterface];

    static visibilityModifiersOrTopLevelTypeDeclaration = Parser.visibilityModifiers.concat(Parser.classOrInterfaceOrEnum);

    collectedAnnotations: ASTAnnotationNode[] = [];

    constructor(module: JavaCompiledModule) {
        super(module);
        this.initializeAST();
    }

    initializeAST() {
        this.module.ast = {
            kind: TokenType.global,
            range: {
                startLineNumber: 0, startColumn: 0,
                endLineNumber: this.endToken.range.endLineNumber, endColumn: this.endToken.range.endColumn
            },
            classOrInterfaceOrEnumDefinitions: [],
            mainProgramNode: this.nodeFactory.buildMainProgramNode(this.cct),
            collectedTypeNodes: []
        }

    }

    parse() {


        while (!this.isEnd()) {
            let pos = this.pos;

            if (this.comesToken(Parser.visibilityModifiersOrTopLevelTypeDeclaration, false)) {
                this.parseClassOrInterfaceOrEnum(this.module.ast!);
                this.currentClassOrInterface = undefined;
            } else if (this.tt == TokenType.at) {
                this.parseAnnotation();
            } else {
                this.parseMainProgramFragment();
            }

            if (pos == this.pos) {
                this.pushError("Mit dem Token " + this.cct.value + " kann der Compiler nichts anfangen.", "warning");
                this.nextToken();   // last safety net to prevent getting stuck in an endless loop
            }
        }

    }

    parseClassOrInterfaceOrEnum(parent: TypeScope, modifiers?: ASTNodeWithModifiers) {
        if (modifiers == null) modifiers = this.parseModifiers();

        let tt = this.tt; // preserve "class", "interface", "enum" for switch-case below

        if (this.expect(Parser.classOrInterfaceOrEnum, true)) {

            let identifier = this.expectAndSkipIdentifierAsToken();

            if (identifier.value != "") {
                switch (tt) {
                    case TokenType.keywordClass:
                        this.parseClassDeclaration(modifiers, identifier, parent);
                        break;
                    case TokenType.keywordEnum:
                        this.parseEnumDeclaration(modifiers, identifier, parent);
                        break;
                    case TokenType.keywordInterface:
                        this.parseInterfaceDeclaration(modifiers, identifier, parent);
                        break;
                }
            }
        }

    }

    parseClassDeclaration(modifiers: ASTNodeWithModifiers, identifier: Token, parent: TypeScope) {
        let classASTNode = this.nodeFactory.buildClassNode(modifiers, identifier, parent, this.collectedAnnotations);
        this.currentClassOrInterface = classASTNode;

        classASTNode.genericParameterDefinitions = this.parseGenericParameterDefinition();


        while (this.comesToken([TokenType.keywordExtends, TokenType.keywordImplements], false)) {
            switch (this.tt) {
                case TokenType.keywordImplements: this.nextToken(); this.parseImplements(classASTNode); break;
                case TokenType.keywordExtends: this.parseExtends(classASTNode); break;
            }
        }

        if (this.expect(TokenType.leftCurlyBracket, true)) {
            while (!this.comesToken([TokenType.rightCurlyBracket, TokenType.endofSourcecode], false)) {

                let modifiers = this.parseModifiers();

                switch (this.tt) {
                    case TokenType.identifier:
                    case TokenType.keywordVoid:
                        this.parseAttributeOrMethodDeclaration(classASTNode, modifiers);
                        break;
                    case TokenType.keywordClass:
                    case TokenType.keywordEnum:
                    case TokenType.keywordInterface:
                        this.pushError("Private classes/enums/interfaces kann dieser Compiler leider nicht verarbeiten.");
                        // this.parseClassOrInterfaceOrEnum(classASTNode, modifiers);
                        break;
                    case TokenType.at:
                        this.parseAnnotation();
                        break;
                    case TokenType.leftCurlyBracket:
                        this.parseInstanceInitializer(classASTNode);
                        break;
                    case TokenType.keywordStatic:
                        this.parseStaticInitializer(classASTNode);
                        break;
                    default: this.pushErrorAndSkipToken();
                }

            }
            this.expect(TokenType.rightCurlyBracket, true);
        }

        this.setEndOfRange(classASTNode);
    }

    parseInstanceInitializer(classASTNode: ASTClassDefinitionNode| ASTEnumDefinitionNode) {
        let blockNode = this.nodeFactory.buildInstanceInitializerNode(this.cct);
        this.nextToken(); // skip {

        while (!this.isEnd() && this.tt != TokenType.rightCurlyBracket) {
            let statement = this.parseStatementOrExpression();
            if (statement) blockNode.statements.push(statement);
        }

        this.expect(TokenType.rightCurlyBracket, true);

        classASTNode.fieldsOrInstanceInitializers.push(blockNode);

    }

    parseStaticInitializer(classASTNode: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode) {
        let blockNode = this.nodeFactory.buildStaticInitializerNode(this.cct);
        this.nextToken(); // skip {

        while (!this.isEnd() && this.tt != TokenType.rightCurlyBracket) {
            let statement = this.parseStatementOrExpression();
            if (statement) blockNode.statements.push(statement);
        }

        this.expect(TokenType.rightCurlyBracket, true);

        classASTNode.fieldsOrInstanceInitializers.push(blockNode);

    }

    parseAttributeOrMethodDeclaration(classASTNode: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode, modifiers: ASTNodeWithModifiers) {
        /**
         * Problem:
         * class Test { Test a; Test(); Test getValue()}
         */

        if (this.comesIdentifier(classASTNode.identifier) && this.lookahead(1).tt == TokenType.leftBracket) {
            this.parseMethodDeclaration(classASTNode, modifiers, true);
        } else {
            let type = this.parseType();
            if (this.lookahead(1).tt == TokenType.leftBracket) {
                this.parseMethodDeclaration(classASTNode, modifiers, false, type);
            } else {
                    this.parseFieldDeclaration(classASTNode, modifiers, type);
            }
        }


    }

    parseMethodDeclaration(classASTNode: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode, modifiers: ASTNodeWithModifiers, isContructor: boolean, returnType?: ASTTypeNode) {
        let rangeStart = modifiers.range;
        let identifier = this.expectAndSkipIdentifierAsToken();
        let methodNode = this.nodeFactory.buildMethodNode(returnType, isContructor, modifiers, identifier,
            rangeStart, this.collectedAnnotations);
        classASTNode.methods.push(methodNode);

        if (this.expect(TokenType.leftBracket, true)) {
            if (this.comesToken([TokenType.identifier, TokenType.keywordFinal], false)) {
                do {
                    this.parseParameter(methodNode);
                } while(this.comesToken(TokenType.comma, true));
            }
            this.expect(TokenType.rightBracket, true);
        }

        if (this.comesToken(TokenType.leftCurlyBracket, false)) {
            let statement = this.parseStatementOrExpression();
            methodNode.statement = statement;
        } else {
            this.expectSemicolon(true, true);
        }

        this.setEndOfRange(methodNode);
    }

    parseParameter(methodNode: ASTMethodDeclarationNode) {
        let startRange = this.cct.range;

        let isFinal = this.comesToken(TokenType.keywordFinal, true);

        let type = this.parseType();

        let identifier = this.expectAndSkipIdentifierAsToken();

        let isEllipsis = this.comesToken(TokenType.ellipsis, true);

        if (type != null && identifier.value != "") {
            let parameterNode = this.nodeFactory.buildParameterNode(startRange, identifier, type, isEllipsis, isFinal);
            this.setEndOfRange(parameterNode);
            methodNode.parameters.push(parameterNode);
        }
    }

    parseFieldDeclaration(classASTNode: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode, modifiers: ASTNodeWithModifiers, type: ASTTypeNode | undefined) {
        let rangeStart = this.cct.range;
        let identifier = this.expectAndSkipIdentifierAsToken();

        let initialization = this.comesToken(TokenType.assignment, true) ? this.parseTerm() : undefined;

        if (identifier.value != "" && type != null) {
            let node = this.nodeFactory.buildFieldDeclarationNode(rangeStart, identifier, type, initialization,
                modifiers, this.collectedAnnotations);
            classASTNode.fieldsOrInstanceInitializers.push(node);
            this.setEndOfRange(node);
        }

        this.expectSemicolon(true, true);


    }

    parseModifiers(): ASTNodeWithModifiers {
        let visibilityModifiers: Token[] = []
        let foundModifier: boolean;
        let astNodeWithModifiers = this.nodeFactory.buildNodeWithModifiers(this.cct.range);
        do {
            foundModifier = true;
            switch (this.tt) {
                case TokenType.keywordPrivate:
                case TokenType.keywordProtected:
                case TokenType.keywordPublic:
                    visibilityModifiers.push(this.cct);
                    astNodeWithModifiers.visibility = this.tt;
                    break;
                case TokenType.keywordStatic:
                    astNodeWithModifiers.isStatic = true;
                    break;
                case TokenType.keywordFinal:
                    astNodeWithModifiers.isFinal = true;
                    break;
                case TokenType.keywordAbstract:
                    astNodeWithModifiers.isAbstract = true;
                    break;
                case TokenType.keywordDefault:
                    astNodeWithModifiers.isDefault = true;
                    break;
                default:
                    foundModifier = false;
            }

            if (foundModifier) this.nextToken();

        } while (foundModifier);

        if (visibilityModifiers.length > 1) {
            this.pushError(`Es ist nicht zulässig, mehrere visibility-modifiers gleichzeitig zu setzen (hier: ${visibilityModifiers.map(vm => vm.value).join(", ")})`, "warning", Range.lift(visibilityModifiers[0].range).plusRange(visibilityModifiers.pop()!.range));
        }

        return astNodeWithModifiers;
    }

    parseEnumDeclaration(modifiers: ASTNodeWithModifiers, identifier: Token, parent: TypeScope) {
        let enumNode = this.nodeFactory.buildEnumNode(modifiers, identifier, parent, this.collectedAnnotations);

        if (this.expect(TokenType.leftCurlyBracket, true)) {

            do {
                let enumValue: ASTEnumValueNode | undefined = this.parseEnumValue();
                if (enumValue) enumNode.valueNodes.push(enumValue);
            } while (this.comesToken(TokenType.comma, true));

            this.comesToken(TokenType.semicolon, true); // skip if present

            while (!this.comesToken([TokenType.rightCurlyBracket, TokenType.endofSourcecode], false)) {

                let modifiers = this.parseModifiers();

                switch (this.tt) {
                    case TokenType.identifier:
                        this.parseAttributeOrMethodDeclaration(enumNode, modifiers);
                        break;
                    case TokenType.at:
                        this.parseAnnotation();
                        break;
                    case TokenType.leftCurlyBracket:
                        this.parseInstanceInitializer(enumNode);
                        break;
                    case TokenType.keywordStatic:
                        this.parseStaticInitializer(enumNode);
                        break;

                    default: this.pushErrorAndSkipToken();
                }

            }
            this.expect(TokenType.rightCurlyBracket, true);
        }

        this.setEndOfRange(enumNode);
    }

    parseEnumValue(): ASTEnumValueNode | undefined {
        let identifier = this.expectAndSkipIdentifierAsToken();
        if (!identifier) return undefined;

        let node = this.nodeFactory.buildEnumValueNode(identifier);
        if (this.comesToken(TokenType.leftBracket, true)) {
            if (!this.comesToken(TokenType.rightBracket, false)) {
                do {
                    let term = this.parseTerm();
                    if (term) node.parameterValues.push(term);
                } while (this.comesToken(TokenType.comma, true))
            }
            this.expect(TokenType.rightBracket, true);
        }

        return node;

    }

    parseInterfaceDeclaration(modifiers: ASTNodeWithModifiers, identifier: Token, parent: TypeScope) {
        let interfaceNode = this.nodeFactory.buildInterfaceNode(modifiers, identifier, parent, this.collectedAnnotations);
        this.currentClassOrInterface = interfaceNode;

        interfaceNode.genericParameterDefinitions = this.parseGenericParameterDefinition();

        if (this.comesToken(TokenType.keywordExtends, true)) this.parseImplements(interfaceNode);

        if (this.expect(TokenType.leftCurlyBracket, true)) {
            while (!this.comesToken([TokenType.rightCurlyBracket, TokenType.endofSourcecode], false)) {

                let modifiers = this.parseModifiers();
                
                switch (this.tt) {
                    case TokenType.identifier:
                    case TokenType.keywordVoid:
                        this.parseAttributeOrMethodDeclaration(interfaceNode, modifiers);
                    // let returnType = this.parseType();
                        // if (returnType) this.parseMethodDeclaration(interfaceNode, modifiers, false, returnType);
                        break;
                    case TokenType.at:
                        this.parseAnnotation();
                        break;
                    default:
                        this.pushErrorAndSkipToken();
                }

            }
            this.expect(TokenType.rightCurlyBracket, true);
        }

        this.setEndOfRange(interfaceNode);
    }

    parseImplements(node: ASTInterfaceDefinitionNode | ASTClassDefinitionNode) {
        do {
            let type = this.parseType();
            if (type) node.implements.push(type);
        } while (this.comesToken(TokenType.comma, true));
    }

    parseExtends(node: ASTClassDefinitionNode) {

        this.nextToken(); // skip "extends"

        let type = this.parseType();
        if (type) node.extends = type;
    }

    parseGenericParameterDefinition(): ASTGenericParameterDeclarationNode[] {
        // e.g. <E extends ArrayList<Integer> & Throwable, F super String> 
        // in example above Definition of E is the first generic parameter definition, definition of F the second one
        let genericParameterDefinitions: ASTGenericParameterDeclarationNode[] = [];
        if (this.comesToken(TokenType.lower, true)) {
            do {

                let identifier = this.expectAndSkipIdentifierAsToken();
                if (identifier.value != "") {

                    let genericParameterDeclaration: ASTGenericParameterDeclarationNode = {
                        kind: TokenType.genericParameterDefinition,
                        range: identifier.range,
                        identifier: <string>identifier.value,
                        identifierRange: identifier.range
                    }

                    genericParameterDefinitions.push(genericParameterDeclaration);

                    if (this.comesToken(TokenType.keywordExtends, true)) {
                        genericParameterDeclaration.extends = [];

                        do {
                            let type = this.parseType();
                            if (type != null) genericParameterDeclaration.extends.push(type);
                        } while (this.comesToken(TokenType.ampersand, true));

                    } else if (this.comesToken(TokenType.keywordSuper, true)) {
                        let type = this.parseType();
                        if (type != null) genericParameterDeclaration.super = type;
                    }

                    this.setEndOfRange(genericParameterDeclaration)
                }

            } while (this.comesToken(TokenType.comma, true));

            this.expect(TokenType.greater, true);
        }

        return genericParameterDefinitions;
    }


    parseMainProgramFragment() {

        while (!this.isEnd() && Parser.visibilityModifiersOrTopLevelTypeDeclaration.indexOf(this.tt) < 0) {
            let pos = this.pos;
            let statement = this.parseStatementOrExpression();

            if (statement) {
                this.module.ast!.mainProgramNode.statements.push(statement);
            }

            if (pos == this.pos) this.nextToken(); // prevent endless loop
        }

    }

    parseAnnotation() {
        this.nextToken(); // skip @
        let identifier = this.expectAndSkipIdentifierAsToken();
        if (identifier) {
            this.collectedAnnotations.push(this.nodeFactory.buildAnnotationNode(identifier));
        }
    }



}

