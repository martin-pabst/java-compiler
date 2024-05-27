import * as PIXI from 'pixi.js';
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ShapeClass } from './ShapeClass';
import { FilledShapeClass } from './FilledShapeClass';
import { CallbackFunction } from '../../../common/interpreter/StepFunction';
import { JRC } from '../../JavaRuntimeLibraryComments';
import { ObjectClass } from '../system/javalang/ObjectClassStringClass';
import { EnumClass } from '../system/javalang/EnumClass';

export enum RepeatType {once, loop, backAndForth}

export class RepeatTypeEnum extends EnumClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "enum RepeatType", comment: JRC.repeatTypeEnumComment },

    ]

    static type: NonPrimitiveType;

    static values = [
        new RepeatTypeEnum("once", RepeatType.once),
        new RepeatTypeEnum("loop", RepeatType.loop),
        new RepeatTypeEnum("backAndForth", RepeatType.backAndForth)
    ]

    
}