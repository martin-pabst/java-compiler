import { Program } from "../../common/interpreter/Program.ts";
import { Klass } from "../../common/interpreter/StepFunction.ts";
import { IRange } from "../../common/range/Range.ts";
import { JavaBaseModule } from "../module/JavaBaseModule.ts";
import { NonPrimitiveType } from "./NonPrimitiveType.ts";

export abstract class JavaClassOrEnum extends NonPrimitiveType {

    fieldConstructor?: Program;
    
    staticFieldConstructor?: Program;
    staticConstructor?: Program;

    staticConstructorsDependOn: Map<JavaClassOrEnum, boolean> = new Map();


    constructor(identifier: string, identifierRange: IRange, module: JavaBaseModule) {

        super(identifier, identifierRange, module);

    }


}