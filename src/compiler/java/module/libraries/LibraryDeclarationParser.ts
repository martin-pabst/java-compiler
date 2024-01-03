import { Helpers, Klass, StepParams } from "../../../common/interpreter/StepFunction";
import { EmptyRange, IRange } from "../../../common/range/Range";
import { TokenType } from "../../TokenType";
import { ArrayType } from "../../types/ArrayType";
import { Field } from "../../types/Field";
import { GenericTypeParameters, GenericTypeParameter } from "../../types/GenericTypeParameter";
import { JavaClass } from "../../types/JavaClass";
import { JavaEnum } from "../../types/JavaEnum";
import { JavaInterface } from "../../types/JavaInterface";
import { JavaType } from "../../types/JavaType";
import { GenericMethod, Method } from "../../types/Method";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { Parameter } from "../../types/Parameter";
import { Visibility } from "../../types/Visibility";
import { JavaBaseModule } from "../JavaBaseModule";
import { JavaTypeStore } from "../JavaTypeStore";
import { LibraryAttributeDeclaration, LibraryMethodDeclaration, LibraryMethodOrAttributeDeclaration } from "./DeclareType";
import { LibraryKlassType, JavaTypeMap } from "./JavaLibraryModule";
import { LdToken, LibraryDeclarationLexer } from "./LibraryDeclarationLexer";

type ModifiersAndType = {
    visibility: Visibility,
    final: boolean,
    static: boolean,
    abstract: boolean,
    default: boolean,
    type: TokenType.keywordClass | TokenType.keywordInterface | TokenType.keywordEnum
}

export class LibraryDeclarationParser extends LibraryDeclarationLexer {

    static endOfSourcecodeToken: LdToken = { tt: TokenType.endofSourcecode, value: "" };
    static visibilityTokens: TokenType[] = [TokenType.keywordPublic, TokenType.keywordProtected, TokenType.keywordPrivate];

    static nullRange: IRange = { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 };

    tokenList: LdToken[] = [];
    pos: number = 0;
    cct: LdToken = LibraryDeclarationParser.endOfSourcecodeToken;
    tt: TokenType = TokenType.endofSourcecode;
    currentDeclaration: string = "";

    currentTypeStore: JavaTypeStore = new JavaTypeStore();
    genericParameterMapStack: Record<string, GenericTypeParameter>[] = [];

    startBracketList: TokenType[] = [TokenType.leftBracket, TokenType.leftCurlyBracket, TokenType.leftSquareBracket, TokenType.lower];
    endBracketList: TokenType[] = [TokenType.rightBracket, TokenType.rightCurlyBracket, TokenType.rightSquareBracket, TokenType.greater];

    constructor() {
        super();
    }

    parseClassOrEnumOrInterfaceDeclarationWithoutGenerics(klass: Klass & LibraryKlassType, module: JavaBaseModule): NonPrimitiveType {

        let javaClassDeclaration = klass.__javaDeclarations?.find(decl => decl.type == "declaration");

        if (!javaClassDeclaration) {
            console.log("Error parsing library class " + klass.name + ": missing java class declaration.");
        }

        let signature = javaClassDeclaration ? javaClassDeclaration.signature : "public class " + klass.name + " extends Object";

        this.initTokens(signature);

        let modifiersAndType = this.parseModifiersAndType(true);

        let identifier: string = "";
        if (this.expect(TokenType.identifier, false)) {
            identifier = this.cct.value;
            this.nextToken();
        }

        let npt: NonPrimitiveType;

        switch (modifiersAndType.type) {
            case TokenType.keywordClass:
                npt = new JavaClass(identifier, LibraryDeclarationParser.nullRange, "", module);
                let npt1 = <JavaClass>npt;
                npt1.isStatic = modifiersAndType.static;
                npt1._isFinal = modifiersAndType.final;
                npt1._isAbstract = modifiersAndType.abstract;
                npt1.runtimeClass = klass;
                npt1.pathAndIdentifier = npt1.identifier;
                break;
            case TokenType.keywordInterface:
                npt = new JavaInterface(identifier, LibraryDeclarationParser.nullRange, "", module);
                npt.pathAndIdentifier = npt.identifier;
                break;
            case TokenType.keywordEnum:
                npt = new JavaEnum(identifier, LibraryDeclarationParser.nullRange, "", module,  Object.getPrototypeOf(Object.getPrototypeOf(klass)).type);
                let npt2 = <JavaEnum>npt;
                npt2.runtimeClass = klass;
                npt2.pathAndIdentifier = npt2.identifier;
                break;
        }

        klass.type = npt;

        return npt;
    }


    parseClassOrInterfaceDeclarationGenericsAndExtendsImplements(klass: Klass & LibraryKlassType, typestore: JavaTypeStore, module: JavaBaseModule) {

        this.currentTypeStore = typestore;

        let javaClassDeclaration = klass.__javaDeclarations?.find(decl => decl.type == "declaration");

        if (!javaClassDeclaration) {
            console.log("Error parsing library class " + klass.name + ": missing java class declaration.");
        }

        let signature = javaClassDeclaration ? javaClassDeclaration.signature : "public class " + klass.name + " extends Object";

        this.initTokens(signature);

        this.skipTill([TokenType.lower, TokenType.keywordExtends, TokenType.keywordImplements], false);

        let npt = klass.type as JavaClass | JavaInterface | JavaEnum;

        if (this.comesToken(TokenType.lower, false)) {
            if (npt instanceof JavaEnum) {
                this.pushError("Ein enum-Typ kann nicht generisch sein.");
                this.skipTill([TokenType.keywordExtends, TokenType.keywordImplements], false);
            } else {
                npt.genericTypeParameters = this.parseGenericParameters(module);
            }
        }

        while (this.comesToken([TokenType.keywordExtends, TokenType.keywordImplements], false)) {
            if (npt instanceof JavaEnum) {
                this.pushError("Ein enum-Typ kann nicht generisch sein.");
                this.skipTill([TokenType.keywordExtends, TokenType.keywordImplements], false);
            } else {
                let npt1: JavaClass | JavaInterface = <any>npt;
                let tt = this.tt;
                this.nextToken();
                switch (tt) {
                    case TokenType.keywordExtends:
                        let types = this.parseCommaSeparatedTypeList(module);
                        if (types.length > 0) {
                            if (npt1 instanceof JavaClass) {
                                npt1.setExtends(<any>types[0])
                            } else {
                                npt1.addExtends(<any>types);
                            }
                        }
                        break;
                    case TokenType.keywordImplements:
                        let types1 = this.parseCommaSeparatedTypeList(module)
                        if (types1.length > 0) {
                            if (npt1 instanceof JavaClass) {
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
        } while (this.comesToken(TokenType.comma, true));
        return types;
    }

    parseGenericParameters(module: JavaBaseModule): GenericTypeParameters {
        if(!this.comesToken(TokenType.lower, true)) return [];
        let startPos = this.pos;
        if(!this.comesToken(TokenType.identifier, false)){
            this.pushError("Lese Definition eines generischen Parameters. Nach dem < wird ein Bezeichner erwartet.");
            return [];
        } 

        let gi: GenericTypeParameters = [];
        
        let currentGenericParameterMap = this.genericParameterMapStack[this.genericParameterMapStack.length - 1];

        // first step: only collect identifiers because generic parameters can reference each other recursively
        do{

            let identifier = <string>this.cct.value;
            let gp = new GenericTypeParameter(identifier, module, LibraryDeclarationParser.nullRange, [], undefined);
            gi.push(gp);
            currentGenericParameterMap[identifier] = gp;
            this.skipSymmetricBracketsUntil([TokenType.comma, TokenType.greater])

        } while (this.comesToken(TokenType.comma, true))

        this.expect(TokenType.greater, true);

        // second step: parse generic parameters with their upper/lower bounds
        this.pos = startPos - 1;
        this.nextToken();

        do {
            this.parseGenericParameterDeclaration(module)
        } while (this.comesToken(TokenType.comma, true));

        this.expect(TokenType.greater, true);

        return gi;
    }



    skipSymmetricBracketsUntil(tt: TokenType[]){
        let bracketCounter: number = 0;

        while(this.pos < this.tokenList.length && (bracketCounter > 0 || tt.indexOf(this.tt) < 0)){
            if(this.startBracketList.indexOf(this.tt) >= 0){
                bracketCounter++;
            } else if(this.endBracketList.indexOf(this.tt) >= 0){
                bracketCounter--;
            }
            this.nextToken();
        }

    }


    parseGenericParameterDeclaration(module: JavaBaseModule): GenericTypeParameter {
        let identifier = this.expectIdentifier();
        let upperBounds: (JavaClass | JavaInterface)[] = [];
        let lowerBound: JavaClass | undefined = undefined;

        while (this.comesToken([TokenType.keywordExtends, TokenType.keywordImplements], false)) {
            let tt = this.tt;
            this.nextToken();
            switch (tt) {
                case TokenType.keywordExtends:
                    this.nextToken();
                    do {
                        upperBounds.push(<any>this.parseType(module));
                    } while (this.comesToken(TokenType.ampersand, true))
                    break;
                case TokenType.keywordImplements:
                    this.nextToken();
                    lowerBound = <any>this.parseType(module);
                    break;
            }
        }

        let currentGenericParameterMap = this.genericParameterMapStack[this.genericParameterMapStack.length - 1];
        let gp = currentGenericParameterMap[identifier];
        gp.upperBounds = upperBounds;
        gp.lowerBound = lowerBound;

        return gp;
    }

    /**
     * int, int[][], HashMap<Integer, Boolean>[]
     * 
     */
    parseType(module: JavaBaseModule): JavaType {
        let id = this.expectIdentifier();
        if (id == "") return this.currentTypeStore.getType("void")!;

        if(id == "?"){
            let gt = new GenericTypeParameter(id, module, EmptyRange.instance);
            gt.isWildcard = true;
            return gt;
        }

        let type = this.findType(id);

        if (this.comesToken(TokenType.lower, true)) {
            if (!type.genericTypeParameters) {
                this.pushError("Der Typ " + type.identifier + " ist nicht generisch.");
                this.skipTill(TokenType.greater, true);
            } else {
                let typeMap: Map<GenericTypeParameter, JavaType> = new Map();
                for (let gtp of type.genericTypeParameters) {
                    let t = this.parseType(module);

                    if(t instanceof GenericTypeParameter && t.isWildcard){
                        if(this.comesToken(TokenType.keywordExtends, true)){
                            t.upperBounds.push(<any>this.parseType(module));
                        }
                        if(this.comesToken(TokenType.keywordSuper, true)){
                            t.lowerBound = <any>this.parseType(module);
                        }
                    }

                    typeMap.set(gtp, t)
                    if (this.comesToken(TokenType.greater, false)) break;
                    this.expect(TokenType.comma, true);
                }
                this.expect(TokenType.greater, true);
                type = type.getCopyWithConcreteType(typeMap);
            }
        }

        while (this.comesToken(TokenType.leftSquareBracket, true)) {
            if (type instanceof ArrayType) {
                type.dimension++;
            } else {
                type = new ArrayType(type, 1, module, LibraryDeclarationParser.nullRange);
            }
            this.expect(TokenType.rightSquareBracket, true);
        }

        return type;
    }

    findType(id: string): JavaType {

        let type = this.currentTypeStore.getType(id);
        if (type) return type;

        for(let gpm of this.genericParameterMapStack){
            type = gpm[id];
            if(type) break;
        }

        if (type) return type;

        this.pushError("Konnte den Typ " + id + " nicht finden.");

        return this.currentTypeStore.getType("void")!;
    }

    expectIdentifier(): string {
        if (this.comesToken(TokenType.identifier, false)) {
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
            default: false,
            type: TokenType.keywordClass
        }

        let typeMissing: boolean = true;

        while (!this.isEnd()) {
            switch (this.tt) {
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
                case TokenType.keywordDefault:
                    m.default = true;
                    break;
                case TokenType.keywordClass:
                case TokenType.keywordInterface:
                case TokenType.keywordEnum:
                    m.type = this.tt;
                    typeMissing = false;
                    break;
                default:
                    {
                        if (typeMissing && withType) this.pushError("Es fehlt der Typ (class, interface oder enum).")
                        return m;
                    }
            }
            this.nextToken();
        }

        return m;
    }

    initTokens(declaration: string) {
        this.tokenList = this.lex(declaration);
        this.pos = 0;
        this.cct = this.tokenList[0];
        this.tt = this.cct.tt;
        this.currentDeclaration = declaration;
    }

    comesToken(tt: TokenType | TokenType[], skip: boolean) {
        if (!Array.isArray(tt)) tt = [tt];

        if (tt.indexOf(this.tt) >= 0) {
            if (skip) this.nextToken();
            return true;
        }

        return false;
    }

    skipTill(tt: TokenType | TokenType[], skipIfFound: boolean) {
        if (!Array.isArray(tt)) tt = [tt];

        while (!this.isEnd() && tt.indexOf(this.tt) < 0) {
            this.nextToken();
        }

        if (skipIfFound) this.nextToken();

        return;
    }

    nextToken() {
        this.pos++;
        if (this.pos >= this.tokenList.length) {
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

    pushError(error: string) {
        console.log("Error parsing library declaration (" + error + "): " + this.currentDeclaration);
    }

    expect(tt: TokenType, skip: boolean): boolean {
        if (tt == this.tt) {
            if (skip) this.nextToken();
            return true;
        }
        this.pushError("Erwartet wird " + TokenType[tt] + ", gefunden wurde: " + this.cct.value);
        return false;

    }

    /**
     * Parse Attributes and Methods
     */

    parseAttributesAndMethods(klass: Klass & LibraryKlassType, typestore: JavaTypeStore, module: JavaBaseModule) {

        this.currentTypeStore = typestore;

        let javaClassDeclaration = klass.__javaDeclarations;

        if (!javaClassDeclaration) {
            return;
        }

        for (let decl of javaClassDeclaration.filter(cd => cd.type == "field" || cd.type == "method")) {
            this.initTokens(decl.signature);
            this.parseAttributeOrMethod(klass, module, decl);
        }

    }

    parseAttributeOrMethod(klass: Klass & LibraryKlassType, module: JavaBaseModule, decl: LibraryMethodOrAttributeDeclaration) {

        this.genericParameterMapStack.push({});

        let klassType = <JavaClass|JavaInterface|JavaEnum>klass.type;
        
        // example: "public <E> E testMethod(List<? extends E> li, E element)"
        let modifiers = this.parseModifiersAndType(false);

        let genericParameters = this.parseGenericParameters(module);

        let type = this.parseType(module);

        let isConstructor: boolean = type == klassType && this.comesToken(TokenType.leftBracket, false);

        let identifier = isConstructor ? klassType.identifier : this.expectIdentifier();

        if (decl.type == "method") {
            this.comesToken(TokenType.leftBracket, true);
            // method
            let m = genericParameters.length == 0 ? 
                new Method(identifier, EmptyRange.instance, module, modifiers.visibility) :
                new GenericMethod(identifier, EmptyRange.instance, module, modifiers.visibility, genericParameters);
            m.returnParameterType = type;
            m.isConstructor = isConstructor;

            if (!this.comesToken(TokenType.rightBracket, false)) {
                do {
                    let isFinal = this.comesToken(TokenType.keywordFinal, true);
                    let type = this.parseType(module);
                    let isEllipsis = this.comesToken(TokenType.ellipsis, true);
                    if(isEllipsis) type = new ArrayType(type, 1, module, EmptyRange.instance);
                    let id = this.expectIdentifier();
                    m.parameters.push(new Parameter(id, EmptyRange.instance, module, type, isFinal, isEllipsis));
                } while (this.comesToken(TokenType.comma, true));
            }

            m.isStatic = modifiers.static;
            m.isFinal = modifiers.final;
            m.isAbstract = modifiers.abstract;
            m.classEnumInterface = klassType;
            m.isDefault = modifiers.default;

            this.expect(TokenType.rightBracket, true);
            klassType.methods.push(m);

            let mdecl = <LibraryMethodDeclaration>decl;
            let hasReturnValue: boolean = m.returnParameterType?.identifier != 'void';

            if (mdecl.native) {
                let realName: string = mdecl.native.name;
                if(m.isStatic){
                    klass[m.getInternalName("native")] = mdecl.native;
                } else {
                    klass.prototype[m.getInternalName("native")] = mdecl.native;
                }

                if (!mdecl.java) {
                    let parameterNames = m.parameters.map(p => p.identifier);

                    let body: string;
                    if (m.isConstructor) {
                        body = `
                            this.${realName}(${parameterNames.join(", ")});
                            ${Helpers.threadStack}.push(this); 
                        `
                        parameterNames.unshift('__t');
                        parameterNames.push(body);

                        klass.prototype[m.getInternalName("java")] = new Function(...parameterNames);
                    } else if (m.isStatic) {
                        body = `
                            ${hasReturnValue ? 'let __returnValue = ' : ''}this.${realName}(${parameterNames.join(", ")});
                            ${hasReturnValue ? `${Helpers.threadStack}.push(__returnValue);` : ''} 
                        `
                        parameterNames.unshift('__t');
                        parameterNames.push(body);

                        klass[m.getInternalName("java")] = new Function(...parameterNames);
                    } else {
                        body = `
                            ${hasReturnValue ? 'let __returnValue = ' : ''}this.${realName}(${parameterNames.join(", ")});
                            ${hasReturnValue ? `${Helpers.threadStack}.push(__returnValue);` : ''}
                            if(__callback)__callback(); 
                        `
                        parameterNames.unshift('__callback');
                        parameterNames.unshift('__t');
                        parameterNames.push(body);

                        klass.prototype[m.getInternalName("java")] = new Function(...parameterNames);
                    }

                }
                m.hasImplementationWithNativeCallingConvention = true;
            }

            if (mdecl.java) {
                if(klassType instanceof JavaInterface || m.isAbstract){
                    if(mdecl.java.name != m.getInternalName("java")){
                        console.log(`${LibraryDeclarationParser.name}: Method ${mdecl.java.name} should have identifier ${m.getInternalName("java")}.` );
                    }
                } else {
                    klass.prototype[m.getInternalName("java")] = mdecl.java;
                }
            }

            if (mdecl.template) {
                m.template = mdecl.template;
            }

            if (mdecl.constantFoldingFunction) {
                m.constantFoldingFunction = mdecl.constantFoldingFunction;
            }

        } else {
            let adecl = <LibraryAttributeDeclaration>decl;
            // attribute
            let a = new Field(identifier, EmptyRange.instance, module, type, modifiers.visibility);
            a.isStatic = modifiers.static;
            a.isFinal = modifiers.final;
            a.classEnum = klassType;

            a.internalName = adecl.nativeIdentifier || identifier;
            if (typeof adecl.constantValue !== "undefined") {
                a.initialValue = adecl.constantValue;
                a.initialValueIsConstant = true;
            }

            klassType.fields.push(a);

        }

        this.genericParameterMapStack.pop();

    }
}