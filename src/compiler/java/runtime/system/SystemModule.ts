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
import { PolygonClass } from "../graphics/PolygonClass.ts";
import { TriangleClass } from "../graphics/TriangleClass.ts";
import { LineClass } from "../graphics/LineClass.ts";
import { BitmapClass } from "../graphics/BitmapClass.ts";
import { DirectionEnum } from "../graphics/DirectionEnum.ts";
import { KeyClass } from "./additional/KeyClass.ts";
import { TextClass } from "../graphics/TextClass.ts";
import { AlignmentEnum } from "../graphics/AlignmentEnum.ts";
import { LocalDateTimeClass } from "./javalang/LocalDateTimeClass.ts";
import { DayOfWeekEnum } from "./DayOfWeekEnum.ts";
import { RoundedRectangleClass } from "../graphics/RoundedRectangleClass.ts";
import { TurtleClass } from "../graphics/TurtleClass.ts";
import { PAppletClass } from "../graphics/PAppletClass.ts";
import { PositionClass } from "../graphics/PositionClass.ts";
import { JavaKaraClass, JavaKaraWorldClass } from "../graphics/JavaKaraClass.ts";
import { JavaHamsterClass, JavaHamsterWorldClass } from "../graphics/JavaHamsterClass.ts";
import { BigIntegerClass } from "./javalang/BigIntegerClass.ts";
import { ConsoleClass } from "./additional/ConsoleClass.ts";
import { Vector2Class } from "./additional/Vector2Class.ts";
import { MathToolsClass } from "./additional/MathToolsClass.ts";
import { PrintStreamClass, SystemClass } from "./javalang/SystemClass.ts";
import { GamepadClass } from "./additional/GamepadClass.ts";
import { SystemToolsClass } from "./additional/SystemToolsClass.ts";
import { KeyListenerInterface } from "./additional/KeyListenerInterface.ts";
import { TimerClass } from "./additional/TimerClass.ts";
import { InputClass } from "./additional/InputClass.ts";
import { GNGBaseFigur } from "../graphics/gng/GNGBaseFigur.ts";
import { GNGKreis } from "../graphics/gng/GNGKreis.ts";
import { GNGRechteck } from "../graphics/gng/GNGRechteck.ts";
import { GNGDreieck } from "../graphics/gng/GNGDreieck.ts";
import { GNGText } from "../graphics/gng/GNGText.ts";
import { GNGFigur } from "../graphics/gng/GNGFigur.ts";
import { GNGAktionsempfaenger } from "../graphics/gng/GNGAktionsempfaengerInterface.ts";
import { GNGZeichenfensterClass } from "../graphics/gng/GNGZeichenfenster.ts";
import { GNGTurtle } from "../graphics/gng/GNGTurtle.ts";
import { GuiComponentClass } from "../graphics/gui/GuiComponentClass.ts";
import { GuiTextComponentClass } from "../graphics/gui/GuiTextComponentClass.ts";
import { ChangeListenerInterface } from "../graphics/gui/ChangeListenerInterface.ts";
import { ButtonClass } from "../graphics/gui/ButtonClass.ts";
import { CheckboxClass } from "../graphics/gui/CheckboxClass.ts";
import { RadiobuttonClass } from "../graphics/gui/RadiobuttonClass.ts";
import { TextfieldClass } from "../graphics/gui/TextfieldClass.ts";
import { SoundClass } from "./additional/SoundClass.ts";
import { FilesClass } from "./additional/FilesClass.ts";
import { HttpClientClass } from "../network/HttpClientClass.ts";
import { HttpHeaderClass } from "../network/HttpHeaderClass.ts";
import { HttpRequestClass } from "../network/HttpRequestClass.ts";
import { HttpResponseClass } from "../network/HttpResponseClass.ts";
import { JsonElementClass } from "../network/JsonElementClass.ts";
import { JsonParserClass } from "../network/JsonParserClass.ts";
import { URLEncoder as URLEncoderClass } from "../network/URLEncoderClass.ts";
import { CollectionsClass } from "./collections/CollectionsClass.ts";
import { QueueInterface } from "./collections/QueueInterface.ts";
import { DequeInterface } from "./collections/DequeueInterface.ts";
import { LinkedListClass } from "./collections/LinkedListClass.ts";
import { CharacterClass } from "./primitiveTypes/wrappers/CharacterClass.ts";
import { MapInterface } from "./collections/MapInterface.ts";
import { HashMapClass } from "./collections/HashMapClass.ts";
import { SetInterface } from "./collections/SetInterface.ts";
import { HashSetClass } from "./collections/HashSetClass.ts";
import { EmptyStackExceptionClass } from "./collections/EmptyStackException.ts";
import { VectorClass } from "./collections/VectorClass.ts";
import { StackClass } from "./collections/StackClass.ts";
import { BiConsumerInterface } from "./functional/BiConsumerInterface.ts";

export class SystemModule extends JavaLibraryModule {

    public primitiveStringClass: Klass & LibraryKlassType = PrimitiveStringClass;

    constructor() {
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

            //additional system classes
            KeyClass, LocalDateTimeClass, DayOfWeekEnum, PositionClass, BigIntegerClass,
            ConsoleClass, Vector2Class, MathToolsClass, PrintStreamClass, SystemClass,
            GamepadClass, KeyListenerInterface, SystemToolsClass, InputClass, SoundClass, FilesClass,

            // Functional
            ConsumerInterface, BiConsumerInterface, FunctionInterface,

            NumberClass, IntegerClass, LongClass, FloatClass, DoubleClass, ShortClass, BooleanClass, CharacterClass,  // boxed primitive types

            OptionalClass,

            MathClass, RandomClass, DecimalFormatClass,
            ThrowableClass, ExceptionClass, RuntimeExceptionClass, ArithmeticExceptionClass, NullPointerExceptionClass,
            ClassCastExceptionClass, IndexOutOfBoundsExceptionClass, IllegalMonitorStateExceptionClass,
            EmptyStackExceptionClass,

            // Collections
            IteratorInterface, IterableInterface, CollectionInterface, ListInterface, ArrayListClass,

            CollectionsClass,
            QueueInterface, DequeInterface, LinkedListClass,
            SetInterface, MapInterface, HashMapClass, HashSetClass,
            VectorClass, StackClass,

            // Thread
            RunnableInterface, ThreadClass, ThreadStateEnum, SemaphoreClass,

            // Timer
            TimerClass,

            // Assertions
            AssertionsClass,

            // HttpClient
            HttpHeaderClass,
            HttpRequestClass,
            HttpResponseClass,
            HttpClientClass,
            JsonElementClass,
            JsonParserClass,
            URLEncoderClass,


            // Graphics
            ColorClass, DirectionEnum, AlignmentEnum,
            MouseListenerInterface,
            WorldClass, ActorClass, ShapeClass, FilledShapeClass, RectangleClass, GroupClass,
            ScaleModeEnum, RepeatTypeEnum, SpriteLibraryEnum, TileImageClass, SpriteClass, // Sprite
            CircleClass, EllipseClass, ArcClass, SectorClass,
            PolygonClass, TriangleClass, LineClass, BitmapClass, TextClass, RoundedRectangleClass,
            TurtleClass,

            // Processing
            PAppletClass,

            // Java Kara
            JavaKaraWorldClass, JavaKaraClass,

            // Java Hamster
            JavaHamsterWorldClass, JavaHamsterClass,

            // Gui components
            ChangeListenerInterface, GuiComponentClass, GuiTextComponentClass, ButtonClass, CheckboxClass,
            RadiobuttonClass, TextfieldClass,

            // Graphics'n Games (GNG)
            GNGBaseFigur, GNGKreis, GNGRechteck, GNGDreieck, GNGText, GNGFigur,
            GNGAktionsempfaenger, GNGZeichenfensterClass, GNGTurtle
        );


    }

    getMainProgram(): Program | undefined {
        return undefined;
    }

}