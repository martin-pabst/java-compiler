import { Program } from "../../common/interpreter/Program.ts";
import { Klass } from "../../common/interpreter/StepFunction.ts";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { JavaType } from "./JavaType";
import { Method } from "./Method";

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

    runtimeClass?: Klass;


    constructor(identifier: string, identifierRange: IRange, module: JavaBaseModule){
        super(identifier, identifierRange, module);
        this.isPrimitive = false;
    }

    getDefaultValue() {
        return null;
    }

    initRuntimeClass(baseClass: Klass) {
        this.runtimeClass = class extends baseClass { };
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
                if (type["getExtends"]) type = type.getExtends();
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