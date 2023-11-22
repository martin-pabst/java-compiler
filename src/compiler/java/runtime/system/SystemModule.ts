import { Program } from "../../../common/interpreter/Program";
import { JavaLibraryModule } from "../../module/libraries/JavaLibraryModule";
import { ArithmeticExceptionClass } from "./javalang/ArithmeticExceptionClass.ts";
import { EnumClass } from "./javalang/EnumClass.ts";
import { ExceptionClass } from "./javalang/ExceptionClass.ts";
import { NullPointerExceptionClass } from "./javalang/NullPointerExceptionClass.ts";
import { ObjectClass, StringClass } from "./javalang/ObjectClassStringClass";
import { RuntimeExceptionClass } from "./javalang/RuntimeException.ts";
import { ThrowableClass } from "./javalang/ThrowableClass.ts";
import { BooleanPrimitiveType } from "./primitiveTypes/BooleanPrimitiveType";
import { BytePrimitiveType } from "./primitiveTypes/BytePrimitiveType";
import { CharPrimitiveType } from "./primitiveTypes/CharPrimitiveType";
import { DoublePrimitiveType } from "./primitiveTypes/DoublePrimitiveType";
import { FloatPrimitiveType } from "./primitiveTypes/FloatPrimitiveType";
import { IntPrimitiveType } from "./primitiveTypes/IntPrimitiveType";
import { LongPrimitiveType } from "./primitiveTypes/LongPrimitiveType";
import { ShortPrimitiveType } from "./primitiveTypes/ShortPrimitiveType.ts";
import { StringPrimitiveType } from "./primitiveTypes/StringPrimitiveType.ts";
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
            new StringPrimitiveType(this),
            new VoidPrimitiveType(this)
        )

        this.classes.push(
            ObjectClass, StringClass, NumberClass, IntegerClass, EnumClass, 
            ThrowableClass, ExceptionClass, RuntimeExceptionClass, ArithmeticExceptionClass, NullPointerExceptionClass
        )

    }

    getMainProgram(): Program | undefined {
        return undefined;
    }

}