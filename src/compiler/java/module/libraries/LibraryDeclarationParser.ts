import { Klass } from "../../../common/interpreter/ThreadPool";
import { EmptyRange, IRange } from "../../../common/range/Range";
import { TokenType } from "../../TokenType";
import { ArrayType } from "../../types/ArrayType";
import { Field } from "../../types/Field";
import { GenericTypeParameter } from "../../types/GenericInformation";
import { JavaClass } from "../../types/JavaClass";
import { JavaEnum } from "../../types/JavaEnum";
import { JavaInterface } from "../../types/JavaInterface";
import { JavaType } from "../../types/JavaType";
import { Method } from "../../types/Method";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { Parameter } from "../../types/Parameter";
import { Visibility } from "../../types/Visibility";
import { JavaBaseModule } from "../JavaBaseModule";
import { LibraryKlassType, JavaTypeMap } from "./JavaLibraryModule";
import { LdToken, LibraryDeclarationLexer } from "./LibraryDeclarationLexer";

type ModifiersAndType = {
    visibility: Visibility,
    final: boolean,
    static: boolean,
    abstract: boolean,
    type: TokenType.keywordClass | TokenType.keywordInterface | TokenType.keywordEnum
}

export class LibraryDeclarationParser extends LibraryDeclarationLexer {

    static endOfSourcecodeToken: LdToken = {tt: TokenType.endofSourcecode, value: ""};
    static visibilityTokens: TokenType[] = [TokenType.keywordPublic, TokenType.keywordProtected, TokenType.keywordPrivate];

    static nullRange: IRange = {startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0};

    tokenList: LdToken[] = [];
    pos: number = 0;
    cct: LdToken = LibraryDeclarationParser.endOfSourcecodeToken;
    tt: TokenType = TokenType.endofSourcecode;
    currentDeclaration: string = "";

    currentTypeMap: JavaTypeMap = {}; 
    currentGenericParameterMap: JavaTypeMap = {};

    constructor(){
        super();
    }

    parseClassOrEnumOrInterfaceDeclarationWithoutGenerics(klass: Klass & LibraryKlassType, module: JavaBaseModule): NonPrimitiveType {
        this.tokenList = this.lex(klass.__declareType()[0]);

        let modifiersAndType = this.parseModifiersAndType(true);

        let identifier: string = "";
        if(this.expect(TokenType.identifier, false)){
            identifier = this.cct.value;
            this.nextToken();
        } 
        
        let npt: NonPrimitiveType;

        switch(modifiersAndType.type){
            case TokenType.keywordClass:
                npt = new JavaClass(identifier, module, LibraryDeclarationParser.nullRange);
                let npt1 = <JavaClass>npt;
                npt1.isStatic = modifiersAndType.static;
                npt1.isFinal = modifiersAndType.final;
                npt1.isAbstract = modifiersAndType.abstract;
                break;
            case TokenType.keywordInterface:
                npt = new JavaInterface(identifier, module, LibraryDeclarationParser.nullRange);
                break;
            case TokenType.keywordEnum:
                npt = new JavaEnum(identifier, module, LibraryDeclarationParser.nullRange);
                break;
        }
        
        klass.type = npt;

        return npt;
    }


    parseClassOrInterfaceDeclarationGenericsAndExtendsImplements(klass: Klass & LibraryKlassType, nptMap: JavaTypeMap, module: JavaBaseModule){

        this.currentGenericParameterMap = {};
        this.currentTypeMap = nptMap;        

        this.initTokens(klass.__declareType()[0]);
        this.skipTill([TokenType.lower, TokenType.keywordExtends, TokenType.keywordImplements], false);

        let npt = klass.type;

        if(this.comesToken(TokenType.lower, true)){
            if(npt instanceof JavaEnum){
                this.pushError("Ein enum-Typ kann nicht generisch sein.");
                this.skipTill([TokenType.keywordExtends, TokenType.keywordImplements], false);
            } else {
                this.parseGenericParameters(<any>npt, module);
            }
        }

        while(this.comesToken([TokenType.keywordExtends, TokenType.keywordImplements], false)){
            if(npt instanceof JavaEnum){
                this.pushError("Ein enum-Typ kann nicht generisch sein.");
                this.skipTill([TokenType.keywordExtends, TokenType.keywordImplements], false);
            } else {
                let npt1: JavaClass | JavaInterface = <any>npt;
                let tt = this.tt;
                this.nextToken();
                switch(tt){
                    case TokenType.keywordExtends:
                        let types = this.parseCommaSeparatedTypeList(module);
                        if(types.length > 0){
                            if(npt1 instanceof JavaClass){
                                npt1.setExtends(<any>types[0])
                            } else {
                                npt1.addExtends(<any>types);
                            }
                        }
                        break;
                    case TokenType.keywordImplements:
                        let types1 = this.parseCommaSeparatedTypeList(module)
                        if(types1.length > 0){
                            if(npt1 instanceof JavaClass){
                                npt1.addImplements(<any>types1);
                            }
                        }
                    break;
                }
            }
            
        }

    }

    parseCommaSeparatedTypeList(module: JavaBaseModule): JavaType[] {
        let types: JavaType[] = [];
        do {
            types.push(this.parseType(module))
        } while(this.comesToken(TokenType.comma, true));
        return types;
    }

    parseGenericParameters(npt: JavaClass | JavaInterface, module: JavaBaseModule) {
        do {
            npt.genericInformation.push(this.parseGenericParameterDeclaration(module))
        } while(this.comesToken(TokenType.comma, true));

        this.expect(TokenType.greater, true);
    }

    parseGenericParameterDeclaration(module: JavaBaseModule): GenericTypeParameter {
        let identifier = this.expectIdentifier();
        let upperBounds: (JavaClass | JavaInterface)[] = [];
        let lowerBound: JavaClass|undefined = undefined;

        while(this.comesToken([TokenType.keywordExtends, TokenType.keywordImplements], false)){
            let tt = this.tt;
            this.nextToken();
            switch(tt){
                case TokenType.keywordExtends:
                    this.nextToken();
                    do {
                        upperBounds.push(<any>this.parseType(module));
                    } while(this.comesToken(TokenType.ampersand, true))
                    break;
                case TokenType.keywordImplements:
                    this.nextToken();
                    lowerBound = <any>this.parseType(module);
                    break;
            }
        }

        let gp = new GenericTypeParameter(identifier, module, LibraryDeclarationParser.nullRange, upperBounds, lowerBound);
        this.currentGenericParameterMap[gp.identifier] = gp;
        return gp;
    }

    /**
     * int, int[][], HashMap<Integer, Boolean>[]
     * 
     */
    parseType(module: JavaBaseModule): JavaType {
        let id = this.expectIdentifier();
        if(id == "") return this.currentTypeMap["void"];

        let type = this.findType(id);

        if(this.comesToken(TokenType.lower, true)){
            if(!type.genericInformation){
                this.pushError("Der Typ " + type.identifier + " ist nicht generisch.");
                this.skipTill(TokenType.greater, true);
            } else {
                let typeMap: Map<GenericTypeParameter, JavaType> = new Map();
                for(let gtp of type.genericInformation){
                    typeMap.set(gtp, this.parseType(module))
                    this.expect(TokenType.comma, true);
                    if(this.comesToken(TokenType.greater, false)) break;
                }
                this.expect(TokenType.greater, true);
                type = type.getCopyWithConcreteType(typeMap);
            }
        }

        while(this.comesToken(TokenType.leftRightSquareBracket, true)){
            if(type instanceof ArrayType){
                type.dimenstion++;
            } else {
                type = new ArrayType(type.identifier, type, 1, module, LibraryDeclarationParser.nullRange);
            }
        }

        return type;
    }

    findType(id: string): JavaType {
        let type = this.currentTypeMap[id];
        if(type) return type;
        type = this.currentGenericParameterMap[id];
        if(type) return type;

        this.pushError("Konnte den Typ " + id + " nicht finden.");

        return this.currentTypeMap["void"];
    }

    expectIdentifier(): string {
        if(this.comesToken(TokenType.identifier, false)){
            let id: string = this.cct.value;
            this.nextToken();
            return id;
        }
        this.pushError("Ein Bezeichner wird erwartet, gefunden wurde " + this.cct.value + ".");
        return "";
    }

    parseModifiersAndType(withType: boolean): ModifiersAndType {
        let m: ModifiersAndType = {
            visibility: TokenType.keywordPublic,
            static: false,
            final: false,
            abstract: false,
            type: TokenType.keywordClass
        }

        let typeMissing: boolean = true;

        while(!this.isEnd()){
            switch(this.tt){
                case TokenType.keywordPublic:
                case TokenType.keywordProtected:
                case TokenType.keywordPrivate:
                    m.visibility = this.tt;
                    break;
                case TokenType.keywordStatic:
                    m.static = true;
                    break;
                case TokenType.keywordFinal:
                    m.final = true;
                    break;
                case TokenType.keywordAbstract:
                    m.abstract = true;
                    break;
                case TokenType.keywordClass:
                case TokenType.keywordInterface:
                case TokenType.keywordEnum:
                        m.type = this.tt;
                        typeMissing = false;
                        break;
                default: 
                {
                    if(typeMissing && withType) this.pushError("Es fehlt der Typ (class, interface oder enum).")
                    return m;
                }
            }
        }    

        return m;
    }

    initTokens(declaration: string){
        this.tokenList = this.lex(declaration);
        this.pos = 0;
        this.cct = this.tokenList[0];
        this.tt = this.cct.tt;
        this.currentDeclaration = declaration;
    }

    comesToken(tt: TokenType| TokenType[], skip: boolean){
        if(!Array.isArray(tt)) tt = [tt];

        if(tt.indexOf(this.tt) >= 0){
            if(skip) this.nextToken();
            return true;
        }

        return false;
    }

    skipTill(tt: TokenType| TokenType[], skipIfFound: boolean){
        if(!Array.isArray(tt)) tt = [tt];

        while(!this.isEnd() && tt.indexOf(this.tt) <= 0){
            this.nextToken();
        }

        if(skipIfFound) this.nextToken();

        return;
    }

    nextToken(){
        if(this.pos >= this.tokenList.length){
            this.cct = LibraryDeclarationParser.endOfSourcecodeToken;
            this.tt = this.cct.tt;
            return;
        }
        this.pos++;
        this.cct = this.tokenList[this.pos];
        this.tt = this.cct.tt;
    }

    isEnd(): boolean {
        return this.pos >= this.tokenList.length;
    }

    pushError(error: string){   
        console.log("Error parsing library declaration (" + error + "): " + this.currentDeclaration);
    }

    expect(tt: TokenType, skip: boolean): boolean {
        if(tt != this.tt){
            if(skip) this.nextToken();
            return true;
        }
        this.pushError("Erwartet wird " + TokenType[tt] + ", gefunden wurde: " + this.cct.value);
        return false;

    }

    /**
     * Parse Attributes and Methods
     */

    parseAttributesAndMethods(klass: Klass & LibraryKlassType, nptMap: JavaTypeMap, module: JavaBaseModule){

        this.currentGenericParameterMap = {};
        this.currentTypeMap = nptMap;        

        let typeDeclarations = klass.__declareType();
        for(let i = 1; i < typeDeclarations.length; i++){
            let decl = typeDeclarations[i];
            this.initTokens(decl);

            this.parseAttributeOrMethod(klass, module);

        }
    }

    parseAttributeOrMethod(klass: Klass & LibraryKlassType, module: JavaBaseModule){
        
        let klassType = <JavaClass>klass.type;
        
        let modifiers = this.parseModifiersAndType(false);

        let type = this.parseType(module);

        let identifier = this.expectIdentifier();

        if(this.comesToken(TokenType.leftBracket, true)){
            // method
            let m = new Method(identifier, EmptyRange.instance, module, modifiers.visibility);
            m.returnParameter = type;

            do{
                let type = this.parseType(module);
                let id = this.expectIdentifier();
                m.parameters.push(new Parameter(id, EmptyRange.instance, module, type));            
            } while(this.comesToken(TokenType.comma, true));

            m.isStatic = modifiers.static;
            m.isFinal = modifiers.final;
            m.isAbstract = modifiers.abstract;
            m.classEnumInterface = klassType;

            this.expect(TokenType.rightBracket, true);
            klassType.methods.push(m);
            if(this.comesToken(TokenType.colon, true)){
                let realName = this.expectIdentifier();
                klass[m.getInternalName()] = klass[realName];
            }                        
        } else {
            // attribute
            let a = new Field(identifier, EmptyRange.instance, module, type, modifiers.visibility);
            a.isStatic = modifiers.static;
            a.isFinal = modifiers.final;
            a.classEnum = klassType;

            klassType.fields.push(a);
            if(this.comesToken(TokenType.colon, true)){
                let realName = this.expectIdentifier();
                a.internalName = realName;
            }                        
        }

    }
}