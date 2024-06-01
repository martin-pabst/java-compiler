import * as PIXI from 'pixi.js';
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ShapeClass } from './ShapeClass';
import { FilledShapeClass } from './FilledShapeClass';
import { CallbackFunction } from '../../../common/interpreter/StepFunction';
import { JRC } from '../../../../tools/language/JavaRuntimeLibraryComments';

export class RectangleClass extends FilledShapeClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Rectangle extends FilledShape", comment: JRC.rectangleClassComment },

        { type: "method", signature: "Rectangle()", java: RectangleClass.prototype._cj$_constructor_$Rectangle$, comment: JRC.rectangleEmptyConstructorComment },
        { type: "method", signature: "Rectangle(double left, double top, double width, double height)", java: RectangleClass.prototype._cj$_constructor_$Rectangle$double$double$double$double, comment: JRC.rectangleConstructorComment },
        { type: "method", signature: "final void setWidth(double width)", native: RectangleClass.prototype._setWidth, comment: JRC.rectangleSetWidthComment },
        { type: "method", signature: "final void setHeight(double height)", native: RectangleClass.prototype._setHeight, comment: JRC.rectangleSetHeightComment },
        { type: "method", signature: "final double getWidth()", template: '(&1.width*§1.scaleFactor)', comment: JRC.rectangleGetWidthComment },
        { type: "method", signature: "final double getHeight()", template: '(&1.height*&1.scaleFactor)', comment: JRC.rectangleGetHeightComment },
        { type: "method", signature: "final Rectangle copy()", java: RectangleClass.prototype._mj$copy$Rectangle$, comment: JRC.rectangleCopyComment },
        { type: "method", signature: "final void moveTo(double x, double y)", native: RectangleClass.prototype._moveTo, comment: JRC.rectangleMoveToComment },
    ]

    static type: NonPrimitiveType;
    left!: number;
    top!: number;
    width!: number;
    height!: number;

    _cj$_constructor_$Rectangle$(t: Thread, callback: CallbackFunction) {
        this._cj$_constructor_$Rectangle$double$double$double$double(t, callback, 0, 0, 100, 100);
    }

    _cj$_constructor_$Rectangle$double$double$double$double(t: Thread, callback: CallbackFunction,
        left: number, top: number, width: number, height: number
    ) {
        this._cj$_constructor_$FilledShape$(t, () => {
            this.centerXInitial = left + width / 2;
            this.centerYInitial = top + height / 2;
    
            this.left = left;
            this.top = top;
            this.width = width;
            this.height = height;
    
            this.render();
        });   // call base class constructor


    }

    _mj$copy$Rectangle$(t: Thread, callback: CallbackFunction){
        let copy = new RectangleClass();
        copy._cj$_constructor_$Rectangle$double$double$double$double(t, callback, this.left, this.top, this.width, this.height);
        copy.copyFrom(this);
        copy.render();
        t.s.push(copy);
        if(callback) callback();
    }

    render(): void {

        this.hitPolygonInitial = [
            { x: this.left, y: this.top }, { x: this.left, y: this.top + this.height },
            { x: this.left + this.width, y: this.top + this.height }, { x: this.left + this.width, y: this.top }
        ];

        let g: PIXI.Graphics = <any>this.container;

        if (!this.container) {
            g = new PIXI.Graphics();
            this.container = g;
            this.world.app.stage.addChild(g);

        } else {
            g.clear();
        }

        g.rect(this.left, this.top, this.width, this.height);

        if (this.fillColor != null) {
            g.fill(this.fillColor);
            g.alpha = this.fillAlpha;
        }

        if (this.borderColor != null) {
            g.stroke({
                width: this.borderWidth,
                color: this.borderColor,
                alpha: this.borderAlpha,
                alignment: 0.5
            })
        }
        
        g.closePath();

    };

    _setWidth(width: number){
        this.width = width / this.container.scale.x;
        this.centerXInitial = this.left + this.width / 2;

        this.render();
    }

    _setHeight(height: number){
        this.height = height / this.container.scale.y;
        this.centerYInitial = this.top + this.height / 2;

        this.render();
    }

    _moveTo(x: number, y: number){
        this.transformHitPolygon();

        this._move(x - this.hitPolygonTransformed[0].x, y - this.hitPolygonTransformed[0].y);

    }
    

}