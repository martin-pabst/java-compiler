import * as PIXI from 'pixi.js';
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ShapeClass } from './ShapeClass';
import { FilledShapeClass } from './FilledShapeClass';
import { CallbackFunction } from '../../../common/interpreter/StepFunction';
import { JRC } from '../../../../tools/language/JavaRuntimeLibraryComments';
import { CallbackParameter } from '../../../common/interpreter/CallbackParameter';
import { StringClass } from '../system/javalang/ObjectClassStringClass';
import { convexhull } from '../../../../tools/ConvexHull.ts';
import { GroupClass } from './GroupClass.ts';

export class PolygonClass extends FilledShapeClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Polygon extends FilledShape", comment: JRC.PolygonClassComment },

        { type: "method", signature: "Polygon()", java: PolygonClass.prototype._cj$_constructor_$Polygon$, comment: JRC.PolygonEmptyConstructorComment },
        { type: "method", signature: "Polygon(boolean closeAndFill)", java: PolygonClass.prototype._cj$_constructor_$Polygon$boolean$double_I, comment: JRC.PolygonEmptyConstructorComment },
        { type: "method", signature: "Polygon(boolean closeAndFill, double... coordinates)", java: PolygonClass.prototype._cj$_constructor_$Polygon$boolean$double_I, comment: JRC.PolygonConstructor2Comment },
        { type: "method", signature: "Polygon(boolean closeAndFill, double[] coordinates)", java: PolygonClass.prototype._cj$_constructor_$Polygon$boolean$double_I, comment: JRC.PolygonConstructor1Comment },
        { type: "method", signature: "Polygon(Shape shape)", java: PolygonClass.prototype._cj$_constructor_$Polygon$Shape, comment: JRC.PolygonConstructorShapeComment },
        
        { type: "method", signature: "addPoint(double x, double y)", native: PolygonClass.prototype._addPoint, comment: JRC.PolygonAddPointComment },



        { type: "method", signature: "final Polygon copy()", java: PolygonClass.prototype._mj$copy$Polygon$, comment: JRC.PolygonCopyComment },

        { type: "method", signature: "String toString()", java: PolygonClass.prototype._mj$toString$String$, comment: JRC.objectToStringComment },

    ]

    static type: NonPrimitiveType;
    isClosed: boolean = false;
    closeAndFill: boolean = false;

    _cj$_constructor_$Polygon$Shape(t: Thread, callback: CallbackFunction, shape: ShapeClass) {

        let points: convexhull.Point[] = [];
        points = this.extractPoints(shape, points);
        points = convexhull.makeHull(points);


        let pointsNumber: number[] = [];
        for (let p of points) {
            pointsNumber.push(p.x);
            pointsNumber.push(p.y);
        }

        if (pointsNumber.length > 0) {
            pointsNumber = pointsNumber.concat(pointsNumber.slice(0, 2))
        }

        this._cj$_constructor_$Polygon$boolean$double_I(t, callback, false, pointsNumber);

    }

    extractPoints(shape: ShapeClass, points: convexhull.Point[]): convexhull.Point[] {
        if (shape instanceof GroupClass) {
            let points1: convexhull.Point[] = [];
            for (let sh of shape.shapes) {
                points1 = this.extractPoints(sh, points1);
            }
            return points.concat(points1);
        } else {
            if (shape.hitPolygonDirty) shape.transformHitPolygon();
            return points.concat(shape.hitPolygonTransformed.map(function (punkt) { return { x: punkt.x, y: punkt.y } }));
        }
    }


    _cj$_constructor_$Polygon$(t: Thread, callback: CallbackFunction) {

        let pointsNumber: number[] = [];
        for (let i: number = 0; i < 6; i++) {
            let angle: number = Math.PI / 3 * i;
            let x: number = 100 + 50 * Math.cos(angle);
            let y: number = 100 - 50 * Math.sin(angle);
            pointsNumber.push(x, y);
        }

        this._cj$_constructor_$Polygon$boolean$double_I(t, callback, true, pointsNumber);
    }

    _cj$_constructor_$Polygon$boolean$double_I(t: Thread, callback: CallbackFunction, closeAndFill: boolean, points?: number[], isClosed: boolean = false) {

        this._cj$_constructor_$FilledShape$(t, () => {

            this.closeAndFill = closeAndFill;
            this.isClosed = isClosed;

            let xSum = 0; let ySum = 0;
            this.hitPolygonInitial = [];

            if (points) {
                for (let i = 0; i < points.length;) {
                    let x = points[i++];
                    let y = points[i++];
                    xSum += x;
                    ySum += y;
                    this.hitPolygonInitial.push({ x: x, y: y });
                }

                if (points.length > 1) {
                    this.centerXInitial = xSum / this.hitPolygonInitial.length;
                    this.centerYInitial = ySum / this.hitPolygonInitial.length;
                }
            }

            if (!closeAndFill) {
                this.borderColor = 0x0000ff;
            }


            this.render();
        });   // call base class constructor



    }

    _mj$copy$Polygon$(t: Thread, callback: CallbackFunction) {
        let copy = new PolygonClass();
        copy._cj$_constructor_$Polygon$boolean$double_I(t, callback, this.closeAndFill, [], this.isClosed);
        copy.copyFrom(this);
        copy.render();
        t.s.push(copy);
        if (callback) callback();
    }

    render(): void {

        let g: PIXI.Graphics = <any>this.container;

        if (!this.container) {
            g = new PIXI.Graphics();
            this.container = g;
            this.world.app.stage.addChild(g);

        } else {
            g.clear();
        }

        if (this.hitPolygonInitial.length > 0) {
            g.moveTo(this.hitPolygonInitial[0].x, this.hitPolygonInitial[0].y);
            for (let i = 1; i < this.hitPolygonInitial.length; i++) {
                g.lineTo(this.hitPolygonInitial[i].x, this.hitPolygonInitial[i].y);
            }
        }

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

        if (this.closeAndFill || this.isClosed) {
            g.closePath();
        }



    };


    _mj$toString$String$(t: Thread, callback: CallbackParameter) {

        t.s.push(new StringClass(this._debugOutput()));

        if (callback) callback();

        return;
    }

    _debugOutput() {
        this.transformHitPolygon();
        let points = this.hitPolygonTransformed.map((p) => "(" + p.x + ", " + p.y + ")").join(", ");
        let s = `{points: [${points}] }`;
        return s;
    }



}