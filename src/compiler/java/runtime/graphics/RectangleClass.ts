import * as PIXI from 'pixi.js';
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ShapeClass } from './ShapeClass';
import { FilledShapeClass } from './FilledShapeClass';
import { CallbackFunction } from '../../../common/interpreter/StepFunction';

export class RectangleClass extends FilledShapeClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Rectangle extends FilledShape" },

        { type: "method", signature: "Rectangle()", java: RectangleClass.prototype._cj$_constructor_$Rectangle$ },
        { type: "method", signature: "Rectangle(double left, double top, double width, double height)", java: RectangleClass.prototype._cj$_constructor_$Rectangle$double$double$double$double },
        // { type: "method", signature: "final boolean isKeyUp(string key)", java: ActorClass.prototype._mj$isKeyUp$boolean$string },

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
        this._cj$_constructor_$FilledShape$(t, callback);   // call base class constructor

        this.centerXInitial = left + width / 2;
        this.centerYInitial = top + height / 2;

        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;

        this.render();

    }

    getCopy(t: Thread, callback: CallbackFunction): RectangleClass {
        let copy = new RectangleClass();
        copy._cj$_constructor_$Rectangle$double$double$double$double(t, callback, this.left, this.top, this.width, this.height);
        copy.copyFrom(this);
        this.render();
        return this;
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
            g.setStrokeStyle({
                width: this.borderWidth,
                color: this.borderColor,
                alpha: this.borderAlpha,
                alignment: 0.5
            })
        }
        
        g.closePath();

    };


}