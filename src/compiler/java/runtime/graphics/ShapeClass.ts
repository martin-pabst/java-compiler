import * as PIXI from 'pixi.js';
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ActorClass } from "./ActorClass";
import { Punkt } from '../../../../tools/MatheTools';
import { CallbackFunction } from '../../../common/interpreter/StepFunction';
import { FilledShapeDefaults } from './FilledShapeDefaults';
import { ColorHelper } from '../../lexer/ColorHelper';
import { GroupClass } from './GroupClass';
import { updateWorldTransformRecursively } from './PixiHelper';

export class ShapeClass extends ActorClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "abstract class Shape extends Actor" },

        { type: "method", signature: "Shape()", java: ShapeClass.prototype._cj$_constructor_$Shape$ },
        // { type: "method", signature: "final boolean isKeyUp(string key)", java: ActorClass.prototype._mj$isKeyUp$boolean$string },
        { type: "method", signature: "final void move(double dx, double dy)", native: ShapeClass.prototype._move },
        { type: "method", signature: "final void rotate(double angleInDeg, double centerX, double centerY)", native: ShapeClass.prototype._rotate },
        { type: "method", signature: "final void rotate(double angleInDeg)", native: ShapeClass.prototype._rotate },
        { type: "method", signature: "final void scale(double factor, double centerX, double centerY)", native: ShapeClass.prototype._scale },
        { type: "method", signature: "final void scale(double factor)", native: ShapeClass.prototype._scale },
        { type: "method", signature: "final void mirrorX()", template: "§1._mirrorXY(-1, 1)" },
        { type: "method", signature: "final void mirrorY()", template: "§1._mirrorXY(1, -1)" },
        { type: "method", signature: "final void defineDirection(double angleInDeg)", native: ShapeClass.prototype._defineDirection },
        { type: "method", signature: "final void forward(double distance)", native: ShapeClass.prototype._forward },
        { type: "method", signature: "final boolean isOutsideView()", native: ShapeClass.prototype._isOutsideView },

    ]

    static type: NonPrimitiveType;

    container!: PIXI.Container;

    belongsToGroup?: GroupClass;

    // belongsToGroup: GroupHelper;

    centerXInitial: number = 0;
    centerYInitial: number = 0;

    angle: number = 0;

    hitPolygonInitial: Punkt[] = [];
    hitPolygonTransformed: Punkt[] = [];
    hitPolygonDirty = true;

    reactToMouseEventsWhenInvisible: boolean = false;

    mouseLastSeenInsideObject: boolean = false;

    trackMouseMove: boolean = false;

    scaleFactor: number = 1.0;

    directionRad: number = 0;

    lastMoveDx: number = 0;
    lastMoveDy: number = 0;

    copyFrom(otherShape: ShapeClass) {
        super.copyFrom(otherShape);
        this.centerXInitial = otherShape.centerXInitial;
        this.centerYInitial = otherShape.centerYInitial;
        this.angle = otherShape.angle;
        this.hitPolygonInitial = otherShape.hitPolygonInitial.slice();
        this.hitPolygonTransformed = otherShape.hitPolygonTransformed.slice();
        this.hitPolygonDirty = otherShape.hitPolygonDirty;
        this.reactToMouseEventsWhenInvisible = otherShape.reactToMouseEventsWhenInvisible;
        this.mouseLastSeenInsideObject = otherShape.mouseLastSeenInsideObject;
        this.trackMouseMove = otherShape.trackMouseMove;
        this.scaleFactor = otherShape.scaleFactor;
        this.directionRad = otherShape.directionRad;
        this.lastMoveDx = otherShape.lastMoveDx;
        this.lastMoveDy = otherShape.lastMoveDy;

        this.container.localTransform.copyFrom(otherShape.container.localTransform);
        this.container.setFromMatrix(otherShape.container.localTransform);
        updateWorldTransformRecursively(otherShape.container, false);
    }

    render(): void { };

    _cj$_constructor_$Shape$(t: Thread, callback: CallbackFunction) {
        this._cj$_constructor_$Actor$(t);   // call base class constructor

        if (!this.world.defaultGroup) {
            this.world.shapesWhichBelongToNoGroup.push(this);
        }

    }

    _isOutsideView() {
        let bounds = this.container.getBounds(true);
        let wh = this.world;
        return bounds.right < wh.
            currentLeft || bounds.left > wh.currentLeft + wh.currentWidth
            || bounds.bottom < wh.currentTop || bounds.top > wh.currentTop + wh.currentHeight;
    }



    _move(dx: number, dy: number) {
        if (dx != 0 || dy != 0) {
            this.lastMoveDx = dx;
            this.lastMoveDy = dy;
        }

        this.container.setFromMatrix(this.container.localTransform.translate(dx, dy));
        this.container.updateLocalTransform();
        updateWorldTransformRecursively(this.container, true);
        this.hitPolygonDirty = true;
    }

    _rotate(angleInDeg: number, cX?: number, cY?: number) {
        if (typeof cX == "undefined") {
            let p = new PIXI.Point(this.centerXInitial, this.centerYInitial);
            this.container.localTransform.apply(p, p);
            cX = p.x;
            cY = p.y;
        } else {
            let p = new PIXI.Point(cX, cY);
            this.container.worldTransform.applyInverse(p, p);
            this.container.localTransform.apply(p, p);
            cX = p.x;
            cY = p.y;
        }

        this.container.localTransform.translate(-cX, -cY);
        this.container.localTransform.rotate(-angleInDeg / 180 * Math.PI);
        this.container.localTransform.translate(cX, cY);

        this.container.setFromMatrix(this.container.localTransform);
        this.container.updateLocalTransform();
        updateWorldTransformRecursively(this.container, true);

        this.hitPolygonDirty = true;

        this.angle += angleInDeg;
        this.directionRad += angleInDeg / 180 * Math.PI;

    }

    _scale(factor: number, cX?: number, cY?: number) {
        if (typeof cX == "undefined") {
            let p = new PIXI.Point(this.centerXInitial, this.centerYInitial);
            this.container.localTransform.apply(p, p);
            cX = p.x;
            cY = p.y;
        } else {
            let p = new PIXI.Point(cX, cY);
            this.container.worldTransform.applyInverse(p, p);
            this.container.localTransform.apply(p, p);
            cX = p.x;
            cY = p.y;
        }

        this.container.localTransform.translate(-cX, -cY);
        this.container.localTransform.scale(factor, factor);
        this.container.localTransform.translate(cX, cY);

        this.container.setFromMatrix(this.container.localTransform);
        this.container.updateLocalTransform();
        updateWorldTransformRecursively(this.container, true);

        this.hitPolygonDirty = true;

        this.scaleFactor *= factor;

    }

    _mirrorXY(scaleX: number, scaleY: number) {
        let cX: number, cY: number;

        let p = new PIXI.Point(this.centerXInitial, this.centerYInitial);
        this.container.localTransform.apply(p, p);
        cX = p.x;
        cY = p.y;

        this.container.localTransform.translate(-cX, -cY);
        this.container.localTransform.scale(scaleX, scaleY);
        this.container.localTransform.translate(cX, cY);

        this.container.setFromMatrix(this.container.localTransform);
        this.container.updateLocalTransform();
        updateWorldTransformRecursively(this.container, true);

        this.hitPolygonDirty = true;

    }

    _forward(distance: number) {
        let dx = distance * Math.cos(this.directionRad);
        let dy = -distance * Math.sin(this.directionRad);
        this._move(dx, dy);
    }

    _defineDirection(angleInDeg: number) {
        this.directionRad = angleInDeg / 180 * Math.PI;
    }

    /**
     * For Graphics and Games library
     */
    bringOnePlaneFurtherToFront() {
        let container: PIXI.Container = <PIXI.Container>this.container.parent;
        let highestIndex = container.children.length - 1;
        let index = container.getChildIndex(this.container);
        if (index < highestIndex) {
            container.setChildIndex(this.container, index + 1);
        }
    }

    /**
     * For Graphics and Games library
     */
    bringOnePlaneFurtherToBack() {
        let container: PIXI.Container = <PIXI.Container>this.container.parent;
        let index = container.getChildIndex(this.container);
        if (index > 0) {
            container.setChildIndex(this.container, index - 1);
        }
    }

    bringToFront() {
        let container: PIXI.Container = <PIXI.Container>this.container.parent;
        let highestIndex = container.children.length - 1;

        if (this.belongsToGroup) {
            this.belongsToGroup.setChildIndex(this, highestIndex);
        } else {
            container.setChildIndex(this.container, highestIndex);
        }
    }

    sendToBack() {
        if (this.belongsToGroup) {
            this.belongsToGroup.setChildIndex(this, 0);
        } else {
            let container: PIXI.Container = <PIXI.Container>this.container.parent;
            container.setChildIndex(this.container, 0);
        }
    }

    addToDefaultGroupAndSetDefaultVisibility() {

        this.container.visible = FilledShapeDefaults.defaultVisibility;

        if (this.world.defaultGroup) {
            this.world.defaultGroup.add(this);
        }
    }

    tint(color: string | number) {
        let c: number | undefined;
        if (typeof color == 'string') {
            c = ColorHelper.parseColorToOpenGL(color).color || 0x303030;
        } else {
            c = color;
        }

        if (this.container.tint) {
            this.container.tint = c;
        }

    }

    public getCenterX(): number {
        let p = new PIXI.Point(this.centerXInitial, this.centerYInitial);
        this.container.worldTransform.apply(p, p);
        return p.x;
    }

    public getCenterY(): number {
        let p = new PIXI.Point(this.centerXInitial, this.centerYInitial);
        this.container.worldTransform.apply(p, p);
        return p.y;
    }


    public getCenter(): PIXI.Point {
        let p = new PIXI.Point(this.centerXInitial, this.centerYInitial);
        return this.container.worldTransform.apply(p, p);
    }

    public destroy() {
        if (this.isDestroyed) return;
        if (this.belongsToGroup) {
            this.belongsToGroup.shapes.splice(this.belongsToGroup.indexOf(this), 1);
            this.belongsToGroup.container.removeChildAt(this.belongsToGroup.container.getChildIndex(this.container))
        }
        this.container.destroy();
        super.destroy();
    }

}