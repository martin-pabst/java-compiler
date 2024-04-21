import { Program } from "../../common/interpreter/Program.ts";
import { Klass } from "../../common/interpreter/StepFunction.ts";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType.ts";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { StaticNonPrimitiveType } from "./StaticNonPrimitiveType.ts";
import { Visibility } from "./Visibility.ts";

/**
 * A NonPrimitiveType 
 *  - may have attributes
 *  - may have fields (de: "Attribute")
 *  - may have methods
 */
export abstract class NonPrimitiveType extends JavaType {

    abstract isGenericVariant(): boolean;
    abstract isGenericTypeParameter(): boolean;

    abstract canExplicitlyCastTo(otherType: JavaType): boolean;  // you can cast long to int or Number to Integer EXPLICITLY, e.g. int c = (int)10L
    abstract canImplicitlyCastTo(otherType: JavaType): boolean; // int gets casted to long implicitly; Integer gets casted to Number implicitly e.g. in: Number n = new Integer(10);

    abstract getFields(): Field[];
    abstract getOwnMethods(): Method[];
    abstract getAllMethods(): Method[];

    abstract getField(identifier: string, uptoVisibility: Visibility, forceStatic?: boolean): Field | undefined;

    abstract getCompletionItems(visibilityUpTo: Visibility, leftBracketAlreadyThere: boolean, identifierAndBracketAfterCursor: string, 
        rangeToReplace: monaco.IRange, methodContext: Method): monaco.languages.CompletionItem[]; 
    
    visibility: Visibility = TokenType.keywordPublic;
    isStatic: boolean = false; // static inner classes behave differently from non-static inner classes
    isFinal: boolean = false;
    
    private _outerType?: NonPrimitiveType | StaticNonPrimitiveType;      // a local class defined inside a static method has a StaticNonPrimitiveType outerType
    
    public isPrimitiveTypeWrapper: boolean = false;

    set outerType(ot: NonPrimitiveType | StaticNonPrimitiveType){
        this._outerType = ot;
        ot.innerTypes.push(this);
    }
    
    get outerType(): NonPrimitiveType | StaticNonPrimitiveType  | undefined {
        return this._outerType;
    }
    
    innerTypes: (NonPrimitiveType | StaticNonPrimitiveType)[] = [];
    
    runtimeClass?: Klass;
    
    isLibraryType: boolean = false;
    
    private extendsImplements: Record<string, boolean> = {};
    
    staticInitializer?: Program;
    
    staticConstructorsDependOn: Map<NonPrimitiveType, boolean> = new Map();
    
    public pathAndIdentifier: string;

    public staticType: StaticNonPrimitiveType;
    
    constructor(identifier: string, identifierRange: IRange, pathAndIdentifier: string, module: JavaBaseModule){
        super(identifier, identifierRange, module);
        this.isPrimitive = false;
        this.pathAndIdentifier = pathAndIdentifier || identifier;
        this.extendsImplements[this.pathAndIdentifier] = true;
        this.staticType = new StaticNonPrimitiveType(this);
    }
    
    getExtendedImplementedIdentifiers(): string[] {
        return Object.getOwnPropertyNames(this.extendsImplements);
    }
    
    fastExtendsImplements(identifier: string){
        return this.extendsImplements[identifier] ? true : false;
    }
    
    registerChildType(childType: NonPrimitiveType){
        childType.extendsImplements[this.pathAndIdentifier] = true;
    }
    
    getDefaultValue() {
        return null;
    }

    initRuntimeClass(baseClass: Klass) {
        let that = this;
        this.runtimeClass = class extends baseClass {
            static type = that;
         };
    }

    getPossibleMethods(identifier: string, numberOfParameters: number, isConstructor: boolean, hasToBeStatic: boolean): Method[] {
        let methods: Method[] = [];

        if (isConstructor) {
            let type: NonPrimitiveType | undefined = this;
            while (type) {
                methods = methods.concat(type.getOwnMethods().filter(m => 
                    m.canTakeNumberOfParameters(numberOfParameters) && m.isConstructor
                ));
                //@ts-ignore
                if (type["getExtends"] && type.getOwnMethods().filter(m => m.isConstructor).length == 0){
                    //@ts-ignore
                    type = type.getExtends();
                } else {
                    break;
                }
            }
        } else {

            methods = this.getOwnMethods().filter(m => 
                m.canTakeNumberOfParameters(numberOfParameters) && !m.isConstructor && m.identifier == identifier
                && (!hasToBeStatic || m.isStatic)
            )

            //@ts-ignore
            let ext = this.getExtends() as NonPrimitiveType | NonPrimitiveType[] | undefined;        // is array if this instanceOf JavaInterface

            if(ext){
                if(!Array.isArray(ext)) ext = [ext];
    
                for(let type of ext){
                    methods = methods.concat(type.getPossibleMethods(identifier, numberOfParameters, isConstructor, hasToBeStatic));
                }
            }

        }

        return methods;
    }

    isVisibleFrom(classContext: NonPrimitiveType | undefined) {
        if(this.visibility == TokenType.keywordPublic || !classContext) return true;
        if(this.outerType == classContext || this.innerTypes.includes(classContext)) return true;
        if(this.visibility == TokenType.keywordProtected){
            if(this.outerType && classContext.extendsImplements[(<NonPrimitiveType>this.outerType).pathAndIdentifier]){
                return true;
            }
        }
        return false;
    }


}