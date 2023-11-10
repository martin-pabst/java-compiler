import { Program } from "../../common/interpreter/Program.ts";
import { IRange } from "../../common/range/Range.ts";
import { JavaBaseModule } from "../module/JavaBaseModule.ts";
import { NonPrimitiveType } from "./NonPrimitiveType.ts";

export abstract class JavaClassOrEnum extends NonPrimitiveType {
    
    fieldConstructor: Program;
    staticFieldConstructor: Program;

    runtimeClass?: { new(...args: any[]): any, [index: string]: any };

    constructor(identifier: string, identifierRange: IRange, module: JavaBaseModule){

        super(identifier, identifierRange, module);

        this.fieldConstructor = new Program(module, undefined, identifier + ".fieldConstructor");
        this.staticFieldConstructor = new Program(module, undefined, identifier + ".staticFieldConstructor");

        this.runtimeClass = class { }

    }


}
