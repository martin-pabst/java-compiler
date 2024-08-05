import { JCM } from "../../../tools/language/JavaCompilerMessages.ts";
import { EmptyRange, Range } from "../../common/range/Range.ts";
import { Token } from "../lexer/Token.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";
import { TokenType } from "../TokenType";
import { JavaType } from "../types/JavaType.ts";
import {
    ASTAnnotationNode,
    ASTAnonymousClassNode,
    ASTBaseTypeNode,
    ASTBlockNode,
    ASTClassDefinitionNode,
    ASTEnumDefinitionNode,
    ASTEnumValueNode,
    ASTGenericParameterDeclarationNode,
    ASTInterfaceDefinitionNode, ASTMethodDeclarationNode,
    ASTNewObjectNode,
    ASTNodeWithModifiers, ASTStatementNode, ASTTypeNode, TypeScope
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

    mainMethodStatements: ASTStatementNode[] = [];

    constructor(private javaCompiledModule: JavaCompiledModule) {
        super(javaCompiledModule);
        this.initializeAST();
    }

    initializeAST() {
        let globalRange = {
            startLineNumber: 0, startColumn: 0,
            endLineNumber: this.endToken.range.endLineNumber + 1, endColumn: this.endToken.range.endColumn + 1
        };

        this.javaCompiledModule.ast = {
            kind: TokenType.global,
            range: globalRange,
            innerTypes: [],
            mainProgramNode: this.nodeFactory.buildMainProgramNode(this.cct),
            collectedTypeNodes: [],
            path: ""
        }

        this.javaCompiledModule.mainClass = this.nodeFactory.buildClassNode(this.nodeFactory.buildNodeWithModifiers(EmptyRange.instance),
            undefined, this.javaCompiledModule.ast!, [], this.javaCompiledModule);
        this.javaCompiledModule.mainClass.range = globalRange;

        let mainMethod = this.nodeFactory.buildMethodNode(undefined, false, this.nodeFactory.buildNodeWithModifiers(EmptyRange.instance),
            { tt: TokenType.identifier, value: "main", range: EmptyRange.instance }, globalRange, [], this.javaCompiledModule.mainClass);

        mainMethod.isStatic = true;

        let mainStatement: ASTBlockNode = {
            kind: TokenType.block,
            range: globalRange,
            statements: []
        }

        mainMethod.statement = mainStatement;
        this.mainMethodStatements = mainStatement.statements;


        let stringArrayType = this.nodeFactory.buildArrayTypeNode(this.buildBaseType("String"));
        this.javaCompiledModule.ast?.collectedTypeNodes.push(stringArrayType);
        let parameter = this.nodeFactory.buildParameterNode(EmptyRange.instance, { tt: TokenType.identifier, value: "args", range: EmptyRange.instance }, stringArrayType, false, true);
        parameter.trackMissingReadAccess = false;

        mainMethod.parameters.push(parameter);
        mainMethod.returnParameterType = this.buildBaseType("void");

        this.javaCompiledModule.mainClass.methods.push(mainMethod);
    }

    parse() {

        while (!this.isEnd()) {
            let pos = this.pos;

            if (this.comesToken(Parser.visibilityModifiersOrTopLevelTypeDeclaration, false)) {
                this.parseClassOrInterfaceOrEnum(this.javaCompiledModule.ast!, undefined);
                this.currentClassOrInterface = undefined;
            } else if (this.tt == TokenType.at) {
                this.maybeParseAndSkipAnnotation();
            } else {
                this.parseMainProgramFragment();
            }

            if (pos == this.pos) {
                this.pushError(JCM.unexpectedToken("" + this.cct.value), "warning");
                this.nextToken();   // last safety net to prevent getting stuck in an endless loop
            }
        }

    }

    parseMainProgramFragment() {

        /**
         * Map<String, Integer> test(ArrayList<String> list){...} // -> static method
         * 
         * others: statements of main method
         */

        this.isCodeOutsideClassdeclarations = true;
        while (!this.isEnd() && Parser.visibilityModifiersOrTopLevelTypeDeclaration.indexOf(this.tt) < 0) {
            let pos = this.pos;
            let statement = this.parseStatementOrExpression();

            if (statement) {
                this.mainMethodStatements.push(statement);
            }

            if (pos == this.pos) this.nextToken(); // prevent endless loop
        }
        this.isCodeOutsideClassdeclarations = false;

    }

    parseClassOrInterfaceOrEnum(parent: TypeScope, documentation1: string | undefined, modifiers?: ASTNodeWithModifiers) {

        let documentation = documentation1 || <string>this.cct.commentBefore?.value;
        if (modifiers == null) modifiers = this.parseModifiers();

        let tt = this.tt; // preserve "class", "interface", "enum" for switch-case below

        if (this.expect(Parser.classOrInterfaceOrEnum, true)) {

            //let annotation = this.maybeParseAndSkipAnnotation();

            let identifier = this.expectAndSkipIdentifierAsToken();

            // back up current class before entering child class
            let currentClassOrInterface = this.currentClassOrInterface;

            if (identifier.value != "") {
                switch (tt) {
                    case TokenType.keywordClass:
                        this.parseClassDeclaration(modifiers, identifier, parent, this.collectedAnnotations, documentation);
                        break;
                    case TokenType.keywordEnum:
                        this.parseEnumDeclaration(modifiers, identifier, parent, documentation);
                        break;
                    case TokenType.keywordInterface:
                        this.parseInterfaceDeclaration(modifiers, identifier, parent, documentation);
                        break;
                }
            }

            // restore current class after leaving child class
            this.currentClassOrInterface = currentClassOrInterface;
        }

    }


    parseClassDeclaration(modifiers: ASTNodeWithModifiers, identifier: Token, parent: TypeScope, annotation: ASTAnnotationNode[], documentation: string | undefined) {
        let classASTNode = this.nodeFactory.buildClassNode(modifiers, identifier, parent, this.collectedAnnotations, this.javaCompiledModule);
        classASTNode.documentation = documentation;
        this.currentClassOrInterface = classASTNode;

        classASTNode.genericParameterDeclarations = this.parseGenericParameterDefinition();


        while (this.comesToken([TokenType.keywordExtends, TokenType.keywordImplements], false)) {
            switch (this.tt) {
                case TokenType.keywordImplements: this.nextToken(); this.parseImplements(classASTNode); break;
                case TokenType.keywordExtends: this.parseExtends(classASTNode); break;
            }
        }

        this.parseClassBody(classASTNode);
    }

    private parseClassBody(classASTNode: ASTClassDefinitionNode) {
        if (this.expect(TokenType.leftCurlyBracket, true)) {
            let documentation: string | undefined;
            while (!this.comesToken([TokenType.rightCurlyBracket, TokenType.endofSourcecode], false)) {

                documentation = <string>this.cct.commentBefore?.value;
                let modifiers = this.parseModifiers();

                switch (this.tt) {
                    case TokenType.identifier:
                    case TokenType.keywordVoid:
                    case TokenType.lower:
                        this.parseFieldOrMethodDeclaration(classASTNode, modifiers, documentation);
                        documentation = undefined;
                        break;
                    case TokenType.keywordClass:
                    case TokenType.keywordEnum:
                    case TokenType.keywordInterface:
                        this.parseClassOrInterfaceOrEnum(classASTNode, documentation, modifiers);
                        documentation = undefined;
                        break;
                    case TokenType.at:
                        this.maybeParseAndSkipAnnotation();
                        break;
                    case TokenType.leftCurlyBracket:
                        this.parseInstanceInitializer(classASTNode);
                        documentation = undefined;
                        break;
                    case TokenType.keywordStatic:
                        this.parseStaticInitializer(classASTNode);
                        documentation = undefined;
                        break;
                    default: this.pushErrorAndSkipToken();
                }

            }
            this.expect(TokenType.rightCurlyBracket, true);
        }

        this.setEndOfRange(classASTNode);
    }

    parseInstanceInitializer(classASTNode: ASTClassDefinitionNode | ASTEnumDefinitionNode) {
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

    parseFieldOrMethodDeclaration(classASTNode: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode, modifiers: ASTNodeWithModifiers, documentation: string | undefined) {
        /**
         * Problem:
         * class Test { Test a; Test(); Test getValue(); <E> Test<E> genericMethod()}
         */

        if (this.comesIdentifier(classASTNode.identifier) && this.lookahead(1).tt == TokenType.leftBracket) {
            this.parseMethodDeclaration(classASTNode, modifiers, true, undefined, [], documentation);     // Constructor
        } else {
            let genericParameters = this.parseGenericParameterDefinition();

            let type = this.parseType();

            if (this.lookahead(1).tt == TokenType.leftBracket) {
                this.parseMethodDeclaration(classASTNode, modifiers, false, type, genericParameters, documentation);
            } else {
                if (genericParameters.length > 0) {
                    this.pushError(JCM.fieldDefinitionDoesntStartWithGenericParamter(), "error", genericParameters[0].range);
                }
                do {
                    this.parseFieldDeclaration(classASTNode, modifiers, type, documentation);
                } while (this.comesToken(TokenType.comma, true));

                this.expectSemicolon(true, true);

            }
        }


    }

    parseMethodDeclaration(parentNode: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode, modifiers: ASTNodeWithModifiers,
        isContructor: boolean, returnType: ASTTypeNode | undefined, genericParameters: ASTGenericParameterDeclarationNode[], documentation: string | undefined) {
        let rangeStart = modifiers.range;
        let identifier = this.expectAndSkipIdentifierAsToken();
        let methodNode = this.nodeFactory.buildMethodNode(returnType, isContructor, modifiers, identifier,
            rangeStart, this.collectedAnnotations, parentNode);
        methodNode.documentation = documentation;

        this.currentMethod = methodNode;
        if (returnType) {
            returnType.parentTypeScope = methodNode;
        }

        methodNode.genericParameterDeclarations = genericParameters;

        parentNode.methods.push(methodNode);

        if (this.expect(TokenType.leftBracket, true)) {
            if (this.comesToken([TokenType.identifier, TokenType.keywordFinal], false)) {
                do {
                    this.parseParameter(methodNode);
                } while (this.comesToken(TokenType.comma, true));
            }
            this.expect(TokenType.rightBracket, true);
        }

        if (this.comesToken(TokenType.leftCurlyBracket, false)) {
            let statement = this.parseStatementOrExpression();
            methodNode.statement = statement;
        } else {
            this.expectSemicolon(true, true);
        }

        this.currentMethod = undefined;

        this.setEndOfRange(methodNode);
    }

    parseParameter(methodNode: ASTMethodDeclarationNode) {
        let startRange = this.cct.range;

        let isFinal = this.comesToken(TokenType.keywordFinal, true);

        let type = this.parseType();

        let isEllipsis = this.comesToken(TokenType.ellipsis, true);

        let identifier = this.expectAndSkipIdentifierAsToken();

        if (type != null && identifier.value != "") {
            let parameterNode = this.nodeFactory.buildParameterNode(startRange, identifier, type, isEllipsis, isFinal);
            this.setEndOfRange(parameterNode);
            methodNode.parameters.push(parameterNode);
        }
    }

    parseFieldDeclaration(classASTNode: ASTClassDefinitionNode | ASTEnumDefinitionNode | ASTInterfaceDefinitionNode, modifiers: ASTNodeWithModifiers, type: ASTTypeNode | undefined, documentation: string | undefined) {
        let rangeStart = this.cct.range;
        let identifier = this.expectAndSkipIdentifierAsToken();

        type = this.increaseArrayDimensionIfLeftRightSquareBracketsToCome(type);

        let initialization = this.comesToken(TokenType.assignment, true) ? this.parseTerm() : undefined;

        if (identifier.value != "" && type != null) {
            let node = this.nodeFactory.buildFieldDeclarationNode(rangeStart, identifier, type, initialization,
                modifiers, this.collectedAnnotations);
            node.documentation = documentation;
            classASTNode.fieldsOrInstanceInitializers.push(node);
            this.setEndOfRange(node);
        }

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
                case TokenType.keywordSynchronized:
                    astNodeWithModifiers.isSynchronized = true;
                    break;
                default:
                    foundModifier = false;
            }

            if (foundModifier) this.nextToken();

        } while (foundModifier);

        if (visibilityModifiers.length > 1) {
            this.pushError(JCM.multipleVisibilityModifiers(visibilityModifiers.map(vm => vm.value).join(", ")), "warning", Range.lift(visibilityModifiers[0].range).plusRange(visibilityModifiers.pop()!.range));
        }

        return astNodeWithModifiers;
    }

    parseEnumDeclaration(modifiers: ASTNodeWithModifiers, identifier: Token, parent: TypeScope, documentation: string | undefined) {
        let enumNode = this.nodeFactory.buildEnumNode(modifiers, identifier, parent, this.collectedAnnotations, this.javaCompiledModule);
        enumNode.documentation = documentation;

        if (this.expect(TokenType.leftCurlyBracket, true)) {

            do {
                let enumValue: ASTEnumValueNode | undefined = this.parseEnumValue(<string>this.cct.commentBefore?.value);
                if (enumValue) enumNode.valueNodes.push(enumValue);
            } while (this.comesToken(TokenType.comma, true));

            this.comesToken(TokenType.semicolon, true); // skip if present

            let documentation1: string | undefined;
            while (!this.comesToken([TokenType.rightCurlyBracket, TokenType.endofSourcecode], false)) {

                documentation1 = <string>this.cct.commentBefore?.value;
                let modifiers = this.parseModifiers();

                switch (this.tt) {
                    case TokenType.keywordClass:
                    case TokenType.keywordEnum:
                    case TokenType.keywordInterface:
                        this.parseClassOrInterfaceOrEnum(enumNode, documentation, modifiers);
                        documentation = undefined;
                        break;
                    case TokenType.identifier:
                    case TokenType.keywordVoid:
                    case TokenType.lower:
                        this.parseFieldOrMethodDeclaration(enumNode, modifiers, documentation);
                        documentation = undefined;
                        break;
                    case TokenType.at:
                        this.maybeParseAndSkipAnnotation();
                        break;
                    case TokenType.leftCurlyBracket:
                        this.parseInstanceInitializer(enumNode);
                        documentation = undefined;
                        break;
                    case TokenType.keywordStatic:
                        this.parseStaticInitializer(enumNode);
                        documentation = undefined;
                        break;

                    default: this.pushErrorAndSkipToken();
                }

            }
            this.expect(TokenType.rightCurlyBracket, true);
        }

        this.setEndOfRange(enumNode);
    }

    parseEnumValue(documentation: string | undefined): ASTEnumValueNode | undefined {
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

    parseInterfaceDeclaration(modifiers: ASTNodeWithModifiers, identifier: Token, parent: TypeScope, documentation: string | undefined) {
        let interfaceNode = this.nodeFactory.buildInterfaceNode(modifiers, identifier, parent, this.collectedAnnotations, this.javaCompiledModule);
        interfaceNode.documentation = documentation;

        this.currentClassOrInterface = interfaceNode;

        interfaceNode.genericParameterDeclarations = this.parseGenericParameterDefinition();

        if (this.comesToken(TokenType.keywordExtends, true)) this.parseImplements(interfaceNode);

        if (this.expect(TokenType.leftCurlyBracket, true)) {
            let documentation1: string | undefined;
            while (!this.comesToken([TokenType.rightCurlyBracket, TokenType.endofSourcecode], false)) {

                documentation1 = <string>this.cct.commentBefore?.value;
                let modifiers = this.parseModifiers();

                switch (this.tt) {
                    case TokenType.keywordClass:
                    case TokenType.keywordEnum:
                    case TokenType.keywordInterface:
                        this.parseClassOrInterfaceOrEnum(interfaceNode, documentation1, modifiers);
                        documentation1 = undefined;
                        break;
                    case TokenType.identifier:
                    case TokenType.keywordVoid:
                    case TokenType.lower:
                        this.parseFieldOrMethodDeclaration(interfaceNode, modifiers, documentation1);
                        documentation1 = undefined;
                        // let returnType = this.parseType();
                        // if (returnType) this.parseMethodDeclaration(interfaceNode, modifiers, false, returnType);
                        break;
                    case TokenType.at:
                        this.maybeParseAndSkipAnnotation();
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

    maybeParseAndSkipAnnotation() {
        this.nextToken(); // skip @
        let identifier = this.expectAndSkipIdentifierAsToken();
        if (identifier) {
            this.collectedAnnotations.push(this.nodeFactory.buildAnnotationNode(identifier));
            return identifier;
        }
    }

    parseAnonymousInnerClassBody(newObjectNode: ASTNewObjectNode): ASTAnonymousClassNode | undefined {

        let parent: TypeScope = this.currentClassOrInterface || this.javaCompiledModule.ast!;

        let classNode = this.nodeFactory.buildClassNode(this.nodeFactory.buildNodeWithModifiers(this.cct.range), undefined, parent, [], this.javaCompiledModule);
        classNode.isAnonymousInnerType = true;

        this.parseClassBody(classNode);
        classNode.extends = newObjectNode.type;     // type maybe interface... we correct this later on in TypeResolver

        if (newObjectNode && classNode) {
            return this.nodeFactory.buildAnonymousInnerClassNode(newObjectNode, classNode);
        } else {
            return undefined;
        }

    }

}

