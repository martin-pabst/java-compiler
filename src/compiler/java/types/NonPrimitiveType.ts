import { Program } from "../../common/interpreter/Program.ts";
import { Klass } from "../../common/interpreter/StepFunction.ts";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
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
    abstract getMethods(): Method[];

    abstract getField(identifier: string, uptoVisibility: Visibility, forceStatic?: boolean): Field | undefined;

    runtimeClass?: Klass;

    private extendsImplements: Record<string, boolean> = {};
    private isExtendedImplementedBy: Record<string, boolean> = {};

    staticInitializer?: Program;

    staticConstructorsDependOn: Map<NonPrimitiveType, boolean> = new Map();


    constructor(identifier: string, identifierRange: IRange, module: JavaBaseModule){
        super(identifier, identifierRange, module);
        this.isPrimitive = false;
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
                methods = methods.concat(type.getMethods().filter(m => 
                    m.parameters.length == length && m.isConstructor
                ));
                //@ts-ignore
                if (type["getExtends"] && type.getMethods().filter(m => m.isConstructor).length == 0){
                    //@ts-ignore
                    type = type.getExtends();
                } else {
                    break;
                }
            }
        } else {
            let type: NonPrimitiveType | undefined = this;
            while (type) {
                methods = methods.concat(type.getMethods().filter(m => 
                    m.parameters.length == length && !m.isConstructor && m.identifier == identifier
                    && (!hasToBeStatic || m.isStatic)
                ));
                //@ts-ignore
                if (type["getExtends"]) type = type.getExtends();
            }
        }

        return methods;
    }


}