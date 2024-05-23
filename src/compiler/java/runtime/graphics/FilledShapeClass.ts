import * as PIXI from 'pixi.js';
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ShapeClass } from './ShapeClass';
import { CallbackFunction } from '../../../common/interpreter/StepFunction';
import { FilledShapeDefaults } from './FilledShapeDefaults';

export class FilledShapeClass extends ShapeClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "abstract class FilledShape extends Shape" },

        { type: "method", signature: "FilledShape()", java: FilledShapeClass.prototype._cj$_constructor_$FilledShape$ },
        // { type: "method", signature: "final boolean isKeyUp(string key)", java: ActorClass.prototype._mj$isKeyUp$boolean$string },
        
    ]

    static type: NonPrimitiveType;

    fillColor: number = FilledShapeDefaults.defaultFillColor;
    fillAlpha: number = FilledShapeDefaults.defaultFillAlpha;

    borderColor?: number = FilledShapeDefaults.defaultBorderColor;
    borderAlpha: number = FilledShapeDefaults.defaultBorderAlpha;
    borderWidth: number = FilledShapeDefaults.defaultBorderWidth;


    _cj$_constructor_$FilledShape$(t: Thread, callback: CallbackFunction){
        this._cj$_constructor_$Shape$(t, callback);   // call base class constructor

        

    }

    copyFrom(otherFilledShape: FilledShapeClass){
        super.copyFrom(otherFilledShape);
        this.fillColor = otherFilledShape.fillColor;
        this.fillAlpha = otherFilledShape.fillAlpha;
        this.borderColor = otherFilledShape.borderColor;
        this.borderAlpha = otherFilledShape.borderAlpha;
        this.borderWidth = otherFilledShape.borderWidth;
    }

}