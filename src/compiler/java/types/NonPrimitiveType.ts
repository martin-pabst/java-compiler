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
    
    visibility: Visibility = TokenType.keywordPublic;
    isStatic: boolean = false; // static inner classes behave differently from non-static inner classes

    outerType?: NonPrimitiveType | StaticNonPrimitiveType;      // a local class defined inside a static method has a StaticNonPrimitiveType outerType

    runtimeClass?: Klass;

    private extendsImplements: Record<string, boolean> = {};
    private isExtendedImplementedBy: Record<string, boolean> = {};

    staticInitializer?: Program;

    staticConstructorsDependOn: Map<NonPrimitiveType, boolean> = new Map();

    public pathAndIdentifier: string;

    constructor(identifier: string, identifierRange: IRange, pathAndIdentifier: string, module: JavaBaseModule){
        super(identifier, identifierRange, module);
        this.isPrimitive = false;
        this.pathAndIdentifier = pathAndIdentifier;
    }

    clearUsagePositionsAndInheritanceInformation(){
        super.clearUsagePositionsAndInheritanceInformation();
        this.extendsImplements = {};
        this.isExtendedImplementedBy = {};
    }

    getExtendedImplementedIdentifiers(): string[] {
        return Object.getOwnPropertyNames(this.extendsImplements);
    }

    fastExtendsImplements(identifier: string){
        return this.extendsImplements[identifier] ? true : false;
    }

    getExtendedImplementedByIdentifiers(): Record<string, boolean> {
        return this.isExtendedImplementedBy;
    }

    registerChildType(childType: NonPrimitiveType){
        if(!this.isExtendedImplementedBy[childType.identifier]) this.isExtendedImplementedBy[childType.identifier] = true;
        childType.extendsImplements[this.identifier] = true;
    }

    getDefaultValue() {
        return null;
    }

    initRuntimeClass(baseClass: Klass) {
        let that = this;
        this.runtimeClass = class extends baseClass {
            static type = that;
         };
        this.runtimeClass.__programs = [];
    }

    getPossibleMethods(identifier: string, length: number, isConstructor: boolean, hasToBeStatic: boolean): Method[] {
        let methods: Method[] = [];

        if (isConstructor) {
            let type: NonPrimitiveType | undefined = this;
            while (type) {
                methods = methods.concat(type.getOwnMethods().filter(m => 
                    m.parameters.length == length && m.isConstructor
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
                m.parameters.length == length && !m.isConstructor && m.identifier == identifier
                && (!hasToBeStatic || m.isStatic)
            )

            //@ts-ignore
            let ext = this.getExtends();        // is array if this instanceOf JavaInterface

            if(ext){
                if(!Array.isArray(ext)) ext = [ext];
    
                for(let type of ext){
                    methods = methods.concat(type.getPossibleMethods(identifier, length, isConstructor, hasToBeStatic));
                }
            }

        }

        return methods;
    }


}