import { Klass } from "../../../common/interpreter/StepFunction";
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
import { JavaTypeStore } from "../JavaTypeStore";
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

    currentTypeStore: JavaTypeStore = new JavaTypeStore(); 
    currentGenericParameterMap: JavaTypeMap = {};

    constructor(){
        super();
    }

    parseClassOrEnumOrInterfaceDeclarationWithoutGenerics(klass: Klass & LibraryKlassType, module: JavaBaseModule): NonPrimitiveType {
        
        let javaClassDeclaration = klass.__javaDeclarations?.find(decl => decl.type == "c");

        if(!javaClassDeclaration){
            console.log("Error parsing library class " + klass.name + ": missing java class declaration.");
        }

        let signature = javaClassDeclaration ? javaClassDeclaration.signature : "public class " + klass.name + " extends Object";

        this.initTokens(signature);

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
                npt1.runtimeClass = klass;
                break;
            case TokenType.keywordInterface:
                npt = new JavaInterface(identifier, module, LibraryDeclarationParser.nullRange);
                break;
            case TokenType.keywordEnum:
                npt = new JavaEnum(identifier, module, LibraryDeclarationParser.nullRange);
                let npt2 = <JavaEnum> npt;
                npt2.runtimeClass = klass;
                break;
        }
        
        klass.type = npt;

        return npt;
    }


    parseClassOrInterfaceDeclarationGenericsAndExtendsImplements(klass: Klass & LibraryKlassType, typestore: JavaTypeStore, module: JavaBaseModule){

        this.currentGenericParameterMap = {};
        this.currentTypeStore = typestore;        

        let javaClassDeclaration = klass.__javaDeclarations?.find(decl => decl.type == "c");

        if(!javaClassDeclaration){
            console.log("Error parsing library class " + klass.name + ": missing java class declaration.");
        }

        let signature = javaClassDeclaration ? javaClassDeclaration.signature : "public class " + klass.name + " extends Object";

        this.initTokens(signature);

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
        if(id == "") return this.currentTypeStore.getType("void")!;

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
                type.dimension++;
            } else {
                type = new ArrayType(type, 1, module, LibraryDeclarationParser.nullRange);
            }
        }

        return type;
    }

    findType(id: string): JavaType {
        let type = this.currentTypeStore.getType(id);
        if(type) return type;
        type = this.currentGenericParameterMap[id];
        if(type) return type;

        this.pushError("Konnte den Typ " + id + " nicht finden.");

        return this.currentTypeStore.getType("void")!;
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
            this.nextToken();
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
        this.pos++;
        if(this.pos >= this.tokenList.length){
            this.cct = LibraryDeclarationParser.endOfSourcecodeToken;
            this.tt = this.cct.tt;
            return;
        }
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
        if(tt == this.tt){
            if(skip) this.nextToken();
            return true;
        }
        this.pushError("Erwartet wird " + TokenType[tt] + ", gefunden wurde: " + this.cct.value);
        return false;

    }

    /**
     * Parse Attributes and Methods
     */

    parseAttributesAndMethods(klass: Klass & LibraryKlassType, typestore: JavaTypeStore, module: JavaBaseModule){

        this.currentGenericParameterMap = {};
        this.currentTypeStore = typestore;        

        let javaClassDeclaration = klass.__javaDeclarations;

        if(!javaClassDeclaration){
            return;
        }

        for(let decl of javaClassDeclaration.filter( cd => cd.type == "a" || cd.type == "m")){
            this.initTokens(decl.signature);
            this.parseAttributeOrMethod(klass, module, decl);
        }

    }

    parseAttributeOrMethod(klass: Klass & LibraryKlassType, module: JavaBaseModule, decl: LibraryMethodOrAttributeDeclaration){
        
        let klassType = <JavaClass>klass.type;
        
        let modifiers = this.parseModifiersAndType(false);

        let type = this.parseType(module);

        let isConstructor: boolean = type == klassType && this.comesToken(TokenType.leftBracket, false);

        let identifier = isConstructor ? klassType.identifier : this.expectIdentifier();

        if(decl.type == "m"){
            this.comesToken(TokenType.leftBracket, true);
            // method
            let m = new Method(identifier, EmptyRange.instance, module, modifiers.visibility);
            m.returnParameter = type;
            m.isConstructor = isConstructor;
            if(!this.comesToken(TokenType.rightBracket, false)){
                do{
                    let isFinal = this.comesToken(TokenType.keywordFinal, true);
                    let type = this.parseType(module);
                    let id = this.expectIdentifier();
                    m.parameters.push(new Parameter(id, EmptyRange.instance, module, type, isFinal));            
                } while(this.comesToken(TokenType.comma, true));
            }

            m.isStatic = modifiers.static;
            m.isFinal = modifiers.final;
            m.isAbstract = modifiers.abstract;
            m.classEnumInterface = klassType;

            this.expect(TokenType.rightBracket, true);
            klassType.methods.push(m);

            let mdecl = <LibraryMethodDeclaration> decl;
            let hasReturnValue: boolean = m.returnParameter?.identifier != 'void';

            if(mdecl.native){
                let realName: string = mdecl.native.name;
                klass[m.getInternalName("native")] = mdecl.native;
                if(!mdecl.java){
                    let parameterNames = m.parameters.map(p => p.identifier);

                    let body: string = `
                        ${hasReturnValue? 'let __returnValue =':''}${realName}(${parameterNames.join(", ")});
                        ${hasReturnValue? '__t.push(__returnValue);':''} 
                    `
                    parameterNames.unshift('__t');
                    parameterNames.push(body);

                    klass[m.getInternalName("java")] = new Function(...parameterNames);
                }
                m.hasImplementationWithNativeCallingConvention = true;
            } 

            if(mdecl.java){
                klass[m.getInternalName("java")] = mdecl.java;
            }

        } else {
            // let adecl = <LibraryAttributeDeclaration> decl;
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