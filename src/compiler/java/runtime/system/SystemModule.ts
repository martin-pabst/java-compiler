import { Program } from "../../../common/interpreter/Program";
import { JavaLibraryModule } from "../../module/libraries/JavaLibraryModule";
import { ObjectClass, StringClass } from "./javalang/ObjectClassStringClass";
import { BooleanPrimitiveType } from "./primitiveTypes/BooleanPrimitiveType";
import { BytePrimitiveType } from "./primitiveTypes/BytePrimitiveType";
import { CharPrimitiveType } from "./primitiveTypes/CharPrimitiveType";
import { DoublePrimitiveType } from "./primitiveTypes/DoublePrimitiveType";
import { FloatPrimitiveType } from "./primitiveTypes/FloatPrimitiveType";
import { IntPrimitiveType } from "./primitiveTypes/IntPrimitiveType";
import { LongPrimitiveType } from "./primitiveTypes/LongPrimitiveType";
import { ShortPrimitiveType } from "./primitiveTypes/ShortPrimitiveType.ts";
import { VoidPrimitiveType } from "./primitiveTypes/VoidPrimitiveType";
import { IntegerClass } from "./primitiveTypes/wrappers/IntegerClass";
import { NumberClass } from "./primitiveTypes/wrappers/NumberClass";

export class SystemModule extends JavaLibraryModule {

    constructor(){
        super();
        this.types.push(
            new BooleanPrimitiveType(this),
            new CharPrimitiveType(this),
            new BytePrimitiveType(this),
            new ShortPrimitiveType(this),
            new IntPrimitiveType(this),
            new LongPrimitiveType(this),
            new FloatPrimitiveType(this),
            new DoublePrimitiveType(this),
            new VoidPrimitiveType(this)
        )

        this.classes.push(
            ObjectClass, StringClass, NumberClass, IntegerClass
        )

    }

    getMainProgram(): Program | undefined {
        return undefined;
    }

}