import { Module } from "../../common/module/module";
import { TokenType } from "../TokenType";
import { Visibility } from "../types/Visibility.ts";
import { ASTGenericDefinition, ASTTypeNode } from "./AST.ts";
import { ASTNodeFactory } from "./ASTNodeFactory.ts";
import { TokenIterator } from "./TokenIterator";

export class Parser extends TokenIterator {
    static assignmentOperators = [TokenType.assignment, TokenType.plusAssignment, TokenType.minusAssignment,
    TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment,
    TokenType.ANDAssigment, TokenType.XORAssigment, TokenType.ORAssigment,
    TokenType.shiftLeftAssigment, TokenType.shiftRightAssigment, TokenType.shiftRightUnsignedAssigment];

    static operatorPrecedence: TokenType[][] = [Parser.assignmentOperators,
    [TokenType.ternaryOperator], [TokenType.colon],

    [TokenType.or], [TokenType.and], [TokenType.OR], [TokenType.XOR], [TokenType.ampersand],
    [TokenType.equal, TokenType.notEqual],
    [TokenType.keywordInstanceof, TokenType.lower, TokenType.lowerOrEqual, TokenType.greater, TokenType.greaterOrEqual],
    [TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned],

    [TokenType.plus, TokenType.minus], [TokenType.multiplication, TokenType.division, TokenType.modulo]
    ];


    static forwardToInsideClass = [TokenType.keywordPublic, TokenType.keywordPrivate, TokenType.keywordProtected, TokenType.keywordVoid,
    TokenType.identifier, TokenType.rightCurlyBracket, TokenType.keywordStatic, TokenType.keywordAbstract,
    TokenType.keywordClass, TokenType.keywordEnum, TokenType.keywordInterface];

    static visibilityModifiers = [TokenType.keywordPrivate, TokenType.keywordProtected, TokenType.keywordPublic];
    static classOrInterfaceOrEnum = [TokenType.keywordClass, TokenType.keywordEnum, TokenType.keywordInterface];

    static visibilityModifiersOrTopLevelTypeDeclaration = Parser.visibilityModifiers.concat(Parser.classOrInterfaceOrEnum);

    nodeFactory: ASTNodeFactory;

    constructor(private module: Module) {
        super(module.tokens!, 7);
        this.nodeFactory = new ASTNodeFactory(this);
        this.initializeAST();
    }

    initializeAST(){
        this.module.ast = {
            type: TokenType.global,
            range: {startLineNumber: 0, startColumn: 0, 
                endLineNumber: this.endToken.range.endLineNumber, endColumn: this.endToken.range.endColumn},
            classOrInterfaceOrEnumDefinitions: [],
            mainProgramNodes: []
        }
    }

    parse() {

        while(!this.isEnd()){
            let pos = this.pos;

            if(this.comesToken(Parser.visibilityModifiersOrTopLevelTypeDeclaration)){
                this.parseClassOrInterfaceOrEnum();
            } else {
                this.parseMainProgramFragment();
            }

            if(pos == this.pos){
                this.pushError("Mit dem Token " + this.cct.value + " kann der Compiler nichts anfangen.", "warning");
                this.nextToken();   // last safety net to prevent getting stuck in an endless loop
            } 
        }

    }

    parseClassOrInterfaceOrEnum(){
        let visibility = this.parseVisibilityModifierIfPresent();

        let tt = this.tt; // preserve "class", "interface", "enum" for switch-case below

        if(this.expect(Parser.classOrInterfaceOrEnum, true)){

            let identifier = this.expectAndSkipIdentifier();

            if(identifier != ""){
                switch(tt){
                    case TokenType.keywordClass:
                        this.parseClassDeclaration(visibility, identifier);
                        break;
                    case TokenType.keywordEnum:
                        this.parseEnumDeclaration(visibility, identifier);
                        break;
                    case TokenType.keywordInterface:
                        this.parseInterfaceDeclaration(visibility, identifier);
                        break;
                }
            }
        }

    }

    parseClassDeclaration(visibility: Visibility, identifier: string) {
        let genericParameters = this.parseGenericParameterDefinition()
        throw new Error("Function not implemented.");
    }
    parseEnumDeclaration(visibility: Visibility, identifier: string) {
        throw new Error("Function not implemented.");
    }
    
    parseInterfaceDeclaration(visibility: Visibility, identifier: string) {
        let genericParameters = this.parseGenericParameterDefinition()
        throw new Error("Function not implemented.");
    }
    
    parseGenericParameterDefinition(): ASTGenericDefinition[] {
        let genericParameterDefinitions: ASTGenericDefinition[] = [];
        if(this.comesToken(TokenType.lower, true)){
            do {

                let identifier = this.expectAndSkipIdentifier();
                if(identifier != ""){

                    let genericDefinition: ASTGenericDefinition = {
                        identifier: identifier
                    }

                    genericParameterDefinitions.push(genericDefinition);

                    if(this.comesToken(TokenType.keywordExtends, true)){
                        genericDefinition.extends = [];

                        do {
                            let type = this.parseType();
                            if(type != null) genericParameterDefinitions.push(type);
                        } while(this.comesToken(TokenType.comma), true);

                    } else if(this.comesToken(TokenType.keywordSuper, true)){
                        let type = this.parseType();
                        if(type != null) genericDefinition.super = type;
                    }
                }

            } while(this.comesToken(TokenType.comma, true));

            this.expect(TokenType.greater, true);
        } 

        return genericParameterDefinitions;
    }
    
    parseType(): ASTTypeNode | undefined {
        // ArrayList; HashMap<Integer, ArrayList<Boolean>>; int[][], ...
        // general Syntax: <identifier><genericParameterInvocation><ArrayDimension[]>

        let type = this.nodeFactory.buildTypeNode();

        type.identifier = this.expectAndSkipIdentifier();
        if(type.identifier == "") return type;  // erroneous type
    
        if(this.comesToken(TokenType.lower, true)){
             
        }


        this.setEndOfRange(type);
    }
    
    parseMainProgramFragment(){

    }

    parseVisibilityModifierIfPresent(): Visibility {
        if(this.comesToken(Parser.visibilityModifiers)){
            let tt = <TokenType.keywordPrivate| TokenType.keywordProtected| TokenType.keywordPublic> this.tt;
            this.nextToken();
            return <Visibility><any>Visibility[tt];
        }
        return Visibility.public;
    }



}

