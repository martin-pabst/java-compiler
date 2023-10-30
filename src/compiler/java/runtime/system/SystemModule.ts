import { Program } from "../../../common/interpreter/Program";
import { JavaLibraryModule } from "../../module/JavaLibraryModule";
import { ObjectClass } from "./javalang/ObjectClass";
import { StringClass } from "./javalang/StringClass";
import { BooleanPrimitiveType } from "./primitiveTypes/BooleanPrimitiveType";
import { BytePrimitiveType } from "./primitiveTypes/BytePrimitiveType";
import { CharPrimitiveType } from "./primitiveTypes/CharPrimitiveType";
import { DoublePrimitiveType } from "./primitiveTypes/DoublePrimitiveType";
import { FloatPrimitiveType } from "./primitiveTypes/FloatPrimitiveType";
import { IntPrimitiveType } from "./primitiveTypes/IntPrimitiveType";
import { LongPrimitiveType } from "./primitiveTypes/LongPrimitiveType";
import { VoidPrimitiveType } from "./primitiveTypes/VoidPrimitiveType";

export class SystemModule extends JavaLibraryModule {

    constructor(){
        super();
        this.types.push(
            new BooleanPrimitiveType(this),
            new CharPrimitiveType(this),
            new BytePrimitiveType(this),
            new IntPrimitiveType(this),
            new LongPrimitiveType(this),
            new FloatPrimitiveType(this),
            new DoublePrimitiveType(this),
            new VoidPrimitiveType(this)
        )

        this.classes.push(
            ObjectClass, StringClass
        )

        this.compileClassesToTypes();
    }

    getMainProgram(): Program | undefined {
        return undefined;
    }

}