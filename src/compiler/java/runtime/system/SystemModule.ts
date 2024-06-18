import { Program } from "../../../common/interpreter/Program";
import { Klass } from "../../../common/interpreter/StepFunction.ts";
import { JavaLibraryModule, LibraryKlassType } from "../../module/libraries/JavaLibraryModule";
import { AssertionsClass } from "../unittests/AssertionsClass.ts";
import { ArrayListClass } from "./collections/ArrayListClass.ts";
import { CollectionInterface as CollectionInterface } from "./collections/CollectionInterface.ts";
import { ComparatorInterface } from "./collections/ComparatorInterface.ts";
import { ComparableInterface } from "./collections/ComparableInterface.ts";
import { IterableInterface } from "./collections/IterableInterface.ts";
import { IteratorInterface } from "./collections/IteratorInterface.ts";
import { ListInterface } from "./collections/ListInterface.ts";
import { ConsumerInterface } from "./functional/ConsumerInterface.ts";
import { ArithmeticExceptionClass } from "./javalang/ArithmeticExceptionClass.ts";
import { ClassCastExceptionClass } from "./javalang/ClassCastExceptionClass.ts";
import { EnumClass } from "./javalang/EnumClass.ts";
import { ExceptionClass } from "./javalang/ExceptionClass.ts";
import { MathClass } from "./javalang/MathClass.ts";
import { NullPointerExceptionClass } from "./javalang/NullPointerExceptionClass.ts";
import { ObjectClass, StringClass } from "./javalang/ObjectClassStringClass";
import { PrimitiveStringClass } from "./javalang/PrimitiveStringClass.ts";
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
import { BooleanClass } from "./primitiveTypes/wrappers/BooleanClass.ts";
import { DoubleClass } from "./primitiveTypes/wrappers/DoubleClass.ts";
import { FloatClass } from "./primitiveTypes/wrappers/FloatClass.ts";
import { IntegerClass } from "./primitiveTypes/wrappers/IntegerClass";
import { LongClass } from "./primitiveTypes/wrappers/LongClass.ts";
import { NumberClass } from "./primitiveTypes/wrappers/NumberClass";
import { ShortClass } from "./primitiveTypes/wrappers/ShortClass.ts";
import { IndexOutOfBoundsExceptionClass } from "./javalang/IndexOutOfBoundsExceptionClass.ts";
import { ThreadClass, ThreadStateClass as ThreadStateEnum } from "./javalang/ThreadClass.ts";
import { RunnableInterface } from "./javalang/RunnableInterface.ts";
import { IllegalMonitorStateExceptionClass } from "./javalang/IllegalMonitorSateExceptionClass.ts";
import { SemaphoreClass } from "./javalang/SemaphoreClass.ts";
import { RandomClass } from "./javalang/RandomClass.ts";
import { DecimalFormatClass } from "./javalang/DecimalFormatClass.ts";
import { OptionalClass } from "./javalang/OptionalClass.ts";
import { FunctionInterface } from "./functional/FunctionInterface.ts";
import { WorldClass } from "../graphics/WorldClass.ts";
import { ActorClass } from "../graphics/ActorClass.ts";
import { ShapeClass } from "../graphics/ShapeClass.ts";
import { FilledShapeClass } from "../graphics/FilledShapeClass.ts";
import { RectangleClass } from "../graphics/RectangleClass.ts";
import { GroupClass } from "../graphics/GroupClass.ts";
import { ColorClass } from "../graphics/ColorClass.ts";
import { NullType } from "./primitiveTypes/NullType.ts";
import { ScaleModeEnum } from "../graphics/ScaleModeEnum.ts";
import { RepeatTypeEnum } from "../graphics/RepeatTypeEnum.ts";
import { SpriteLibraryEnum } from "../graphics/SpriteLibraryEnum.ts";
import { SpriteClass, TileImageClass } from "../graphics/SpriteClass.ts";
import { MouseListenerInterface } from "../graphics/MouseListenerInterface.ts";
import { CircleClass } from "../graphics/CircleClass.ts";
import { EllipseClass } from "../graphics/EllipseClass.ts";
import { ArcClass } from "../graphics/ArcClass.ts";
import { SectorClass } from "../graphics/SectorClass.ts";

export class SystemModule extends JavaLibraryModule {

    public primitiveStringClass: Klass & LibraryKlassType = PrimitiveStringClass;

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
            new VoidPrimitiveType(this),
            new NullType(this)
        )

        ColorClass._initPredefinedColors();
        
        this.classes.push(
            ComparableInterface, ComparatorInterface,
            
            ObjectClass, StringClass, EnumClass,                  // These two MUST come first!
            

            // Functional
            ConsumerInterface, FunctionInterface,

            NumberClass, IntegerClass, LongClass, FloatClass, DoubleClass, ShortClass, BooleanClass,  // boxed primitive types

            OptionalClass,

            MathClass, RandomClass, DecimalFormatClass,
            ThrowableClass, ExceptionClass, RuntimeExceptionClass, ArithmeticExceptionClass, NullPointerExceptionClass, 
            ClassCastExceptionClass, IndexOutOfBoundsExceptionClass, IllegalMonitorStateExceptionClass,

            // Collections
            IteratorInterface, IterableInterface, CollectionInterface, ListInterface, ArrayListClass,

            // Thread
            RunnableInterface, ThreadClass, ThreadStateEnum, SemaphoreClass,

            // Assertions
            AssertionsClass,

            // Graphics
            ColorClass,
            MouseListenerInterface,
            WorldClass, ActorClass, ShapeClass, FilledShapeClass, RectangleClass, GroupClass,
            ScaleModeEnum, RepeatTypeEnum, SpriteLibraryEnum, TileImageClass, SpriteClass, // Sprite
            CircleClass, EllipseClass, ArcClass, SectorClass
        )

    }

    getMainProgram(): Program | undefined {
        return undefined;
    }

}