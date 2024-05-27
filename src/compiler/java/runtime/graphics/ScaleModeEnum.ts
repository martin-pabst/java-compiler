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

export enum ScaleMode {linear, nearest_neighbour};

export class ScaleModeEnum extends EnumClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "enum ScaleMode", comment: JRC.scaleModeEnumComment },

    ]

    static type: NonPrimitiveType;

    static values = [
        new ScaleModeEnum("linear", ScaleMode.linear),
        new ScaleModeEnum("nearest_neighbour", ScaleMode.nearest_neighbour)
    ]

}