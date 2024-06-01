import * as PIXI from 'pixi.js';
import { Punkt, polygonBerührtPolygonExakt, polygonEnthältPunkt } from '../../../../tools/MatheTools';
import { JRC } from '../../../../tools/language/JavaRuntimeLibraryComments';
import { CallbackParameter } from '../../../common/interpreter/CallbackParameter';
import { Thread } from "../../../common/interpreter/Thread";
import { ColorHelper } from '../../lexer/ColorHelper';
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ActorClass } from "./ActorClass";
import { FilledShapeDefaults } from './FilledShapeDefaults';
import { GroupClass } from './GroupClass';
import { updateWorldTransformRecursively } from './PixiHelper';

export type MouseEventMethod = (t: Thread, callback: CallbackParameter, x: number, y: number, button: number) => void;

export class ShapeClass extends ActorClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "abstract class Shape extends Actor", comment: JRC.shapeClassComment },

        { type: "field", signature: "private double angle" , comment: JRC.shapeAngleComment },
        { type: "field", signature: "private double centerX" , comment: JRC.shapeCenterXComment },
        { type: "field", signature: "private double centerY" , comment: JRC.shapeCenterYComment },

        { type: "method", signature: "Shape()", java: ShapeClass.prototype._cj$_constructor_$Shape$ },
        { type: "method", signature: "final void move(double dx, double dy)", native: ShapeClass.prototype._move , comment: JRC.shapeMoveComment },
        { type: "method", signature: "final void rotate(double angleInDeg, double centerX, double centerY)", native: ShapeClass.prototype._rotate , comment: JRC.shapeRotateComment1 },
        { type: "method", signature: "final void rotate(double angleInDeg)", native: ShapeClass.prototype._rotate , comment: JRC.shapeRotateComment2},
        { type: "method", signature: "final void scale(double factor, double centerX, double centerY)", native: ShapeClass.prototype._scale , comment: JRC.shapeScaleComment1},
        { type: "method", signature: "final void scale(double factor)", native: ShapeClass.prototype._scale , comment: JRC.shapeScaleComment2},
        { type: "method", signature: "final void mirrorX()", template: "§1._mirrorXY(-1, 1)" , comment: JRC.shapeMirrorXComment},
        { type: "method", signature: "final void mirrorY()", template: "§1._mirrorXY(1, -1)" , comment: JRC.shapeMirrorYComment},
        { type: "method", signature: "final void defineDirection(double angleInDeg)", native: ShapeClass.prototype._defineDirection , comment: JRC.shapeDefineDirectionComment},
        { type: "method", signature: "final void forward(double distance)", native: ShapeClass.prototype._forward , comment: JRC.shapeForwardComment},
        { type: "method", signature: "final boolean isOutsideView()", native: ShapeClass.prototype._isOutsideView , comment: JRC.shapeOutsideViewComment},
        { type: "method", signature: "final double getCenterX()", template: '(§1.centerX)' , comment: JRC.shapeCenterXComment},
        { type: "method", signature: "final double getCenterY()", template: '(§1.centerY)' , comment: JRC.shapeCenterYComment},
        { type: "method", signature: "final double getAngle()", template: '(§1.angle)' , comment: JRC.shapeAngleComment},
        { type: "method", signature: "final boolean containsPoint(double x, double y)", native: ShapeClass.prototype._containsPoint , comment: JRC.shapeContainsPointComment},
        { type: "method", signature: "final void moveTo(double x, double y)", native: ShapeClass.prototype._moveTo , comment: JRC.shapeMoveToComment},
        { type: "method", signature: "final void defineCenter(double x, double y)", native: ShapeClass.prototype._defineCenter , comment: JRC.shapeDefineCenterComment},
        { type: "method", signature: "final void defineCenterRelative(double x, double y)", native: ShapeClass.prototype._defineCenterRelative , comment: JRC.shapeDefineCenterRelativeComment},
        
        { type: "method", signature: "static void setDefaultVisibility(boolean isVisible)", native: ShapeClass._setDefaultVisibility , comment: JRC.shapeSetDefaultVisibilityComment},
        { type: "method", signature: "final void setVisible(boolean isVisible)", native: ShapeClass.prototype._setVisible , comment: JRC.shapeSetVisibleComment},
        { type: "method", signature: "final boolean isVisible()", template: '§1.container.visible' , comment: JRC.shapeSetVisibleComment},
        { type: "method", signature: "final void setStatic(boolean isStatic)", native: ShapeClass.prototype._setStatic , comment: JRC.shapeSetStaticComment},
        
        { type: "method", signature: "void onMouseUp(double x, double y, int button)", java: ShapeClass.prototype._mj$onMouseUp$void$double$double$int , comment: JRC.shapeOnMouseUpComment},
        { type: "method", signature: "void onMouseDown(double x, double y, int button)", java: ShapeClass.prototype._mj$onMouseDown$void$double$double$int , comment: JRC.shapeOnMouseDownComment},
        { type: "method", signature: "void onMouseEnter(double x, double y)", java: ShapeClass.prototype._mj$onMouseEnter$void$double$double , comment: JRC.shapeOnMouseEnterComment},
        { type: "method", signature: "void onMouseLeave(double x, double y)", java: ShapeClass.prototype._mj$onMouseLeave$void$double$double , comment: JRC.shapeOnMouseLeaveComment},
        { type: "method", signature: "void onMouseMove(double x, double y)", java: ShapeClass.prototype._mj$onMouseMove$void$double$double , comment: JRC.shapeOnMouseMoveComment},


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

    mouseEventsImplemented?: {[mouseEvent: string]: MouseEventMethod};

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

    _cj$_constructor_$Shape$(t: Thread, callback: CallbackParameter) {
        this._cj$_constructor_$Actor$(t, () => {
            if (!this.world.defaultGroup) {
                this.world.shapesWhichBelongToNoGroup.push(this);
            }

            let atLeastOneMouseListenerOverridden = false;
            if(this._mj$onMouseDown$void$double$double$int != ShapeClass.prototype._mj$onMouseDown$void$double$double$int){
                atLeastOneMouseListenerOverridden = true;
                if(!this.mouseEventsImplemented) this.mouseEventsImplemented = {};
                this.mouseEventsImplemented["mousedown"] = this._mj$onMouseDown$void$double$double$int;
            }
            if(this._mj$onMouseUp$void$double$double$int != ShapeClass.prototype._mj$onMouseUp$void$double$double$int){
                atLeastOneMouseListenerOverridden = true;
                if(!this.mouseEventsImplemented) this.mouseEventsImplemented = {};
                this.mouseEventsImplemented["mouseup"] = this._mj$onMouseUp$void$double$double$int;
            }
            if(this._mj$onMouseMove$void$double$double != ShapeClass.prototype._mj$onMouseMove$void$double$double){
                atLeastOneMouseListenerOverridden = true;
                if(!this.mouseEventsImplemented) this.mouseEventsImplemented = {};
                this.mouseEventsImplemented["mousemove"] = this._mj$onMouseMove$void$double$double;
            }
            if(this._mj$onMouseEnter$void$double$double != ShapeClass.prototype._mj$onMouseEnter$void$double$double){
                atLeastOneMouseListenerOverridden = true;
                if(!this.mouseEventsImplemented) this.mouseEventsImplemented = {};
                this.mouseEventsImplemented["mouseenter"] = this._mj$onMouseEnter$void$double$double;
            }
            if(this._mj$onMouseLeave$void$double$double != ShapeClass.prototype._mj$onMouseLeave$void$double$double){
                atLeastOneMouseListenerOverridden = true;
                if(!this.mouseEventsImplemented) this.mouseEventsImplemented = {};
                this.mouseEventsImplemented["mouseleave"] = this._mj$onMouseLeave$void$double$double;
            }
            if(atLeastOneMouseListenerOverridden){
                this.world.mouseManager.addShapeWithImplementedMouseMethods(this);
            }

            if(callback) callback();

        });   // call base class constructor


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
        
        //@ts-ignore
        this.container._didLocalTransformChangeId = this.container._didChangeId;
        //this.container.updateLocalTransform();
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
            updateWorldTransformRecursively(this.container, false);
            this.container.worldTransform.applyInverse(p, p);
            this.container.localTransform.apply(p, p);
            cX = p.x;
            cY = p.y;
        }

        this.container.localTransform.translate(-cX, -cY);
        this.container.localTransform.rotate(-angleInDeg / 180 * Math.PI);
        this.container.localTransform.translate(cX, cY);

        this.container.setFromMatrix(this.container.localTransform);
        
        //@ts-ignore
        this.container._didLocalTransformChangeId = this.container._didChangeId;
        //this.container.updateLocalTransform();

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
            updateWorldTransformRecursively(this.container, false);

            this.container.worldTransform.applyInverse(p, p);
            this.container.localTransform.apply(p, p);
            cX = p.x;
            cY = p.y;
        }

        this.container.localTransform.translate(-cX, -cY);
        this.container.localTransform.scale(factor, factor);
        this.container.localTransform.translate(cX, cY);

        
        this.container.setFromMatrix(this.container.localTransform);
        //@ts-ignore
        this.container._didLocalTransformChangeId = this.container._didChangeId;
        //this.container.updateLocalTransform();

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

        
        //@ts-ignore
        this.container._didLocalTransformChangeId = this.container._didChangeId;this.container.setFromMatrix(this.container.localTransform);
        //this.container.updateLocalTransform();

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

    public _getCenterX(): number {
        let p = new PIXI.Point(this.centerXInitial, this.centerYInitial);
        this.container.worldTransform.apply(p, p);
        return p.x;
    }

    public _getCenterY(): number {
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

        if(this.mouseEventsImplemented){
            this.world.mouseManager.removeShapeWithImplementedMouseMethods(this);
        }

        super.destroy();
    }

    transformHitPolygon() {

        this.hitPolygonTransformed = [];
        let m = this.container.worldTransform;
        for (let p of this.hitPolygonInitial) {
            this.hitPolygonTransformed.push({
                x: (m.a * p.x) + (m.c * p.y) + m.tx,
                y: (m.b * p.x) + (m.d * p.y) + m.ty
            });
        }

        this.hitPolygonDirty = false;

    }

    _containsPoint(x: number, y: number) {
        if (!this.container.getBounds().containsPoint(x, y)) return false;

        if (this.hitPolygonInitial == null) return true;

        if (this.hitPolygonDirty) this.transformHitPolygon();
        return polygonEnthältPunkt(this.hitPolygonTransformed, { x: x, y: y });
    }

    


    _moveTo(x: number, y: number){
        this._move(x - this._getCenterX(), y - this._getCenterY())
    }

    _defineCenter(x: number, y: number){
        let p = new PIXI.Point(x, y);
        this.container.worldTransform.applyInverse(p, p);
        this.centerXInitial = p.x;
        this.centerYInitial = p.y;
    }

    _defineCenterRelative(x: number, y: number) {
        let bounds = this.container.getBounds(false);
        this._defineCenter(bounds.left + bounds.width * x, bounds.top + bounds.height * y);
    }

    static _setDefaultVisibility(isVisible: boolean){
        FilledShapeDefaults.setDefaultVisibility(isVisible);
    }

    _setVisible(isVisible: boolean) {
        this.container.visible = isVisible;
    }

    _setStatic(isStatic: boolean) {
        let list = this.world.shapesNotAffectedByWorldTransforms;
        if (isStatic) {
            list.push(this);
        } else {
            let index = list.indexOf(this);
            if (index >= 0) {
                list.splice(index, 1);
            }
        }
    }

    _mj$onMouseUp$void$double$double$int(t: Thread, callback: CallbackParameter, x: number, y: number, button: number){}
    _mj$onMouseDown$void$double$double$int(t: Thread, callback: CallbackParameter, x: number, y: number, button: number){}
    _mj$onMouseEnter$void$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, button: number){}
    _mj$onMouseLeave$void$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, button: number){}
    _mj$onMouseMove$void$double$double(t: Thread, callback: CallbackParameter, x: number, y: number, button: number){}

    collidesWith(otherShape: ShapeClass): boolean {

        // if(!(this instanceof TurtleHelper) && (shapeHelper instanceof TurtleHelper)){
        // if (this["lineElements"] == null && (otherShape["lineElements"] != null)) {
        //     return otherShape.collidesWith(this);
        // }

        //@ts-ignore  check if other shape is group:
        if (otherShape["shapes"]) {
            return otherShape.collidesWith(this);
        }

        if (this.isDestroyed == null || otherShape.isDestroyed == null) return false;

        // uncomment this to remove lag of 1/30 s
        // updateWorldTransformRecursively(this.container, false);
        // updateWorldTransformRecursively(otherShape.container, false);


        let bb = this.container.getBounds();
        let bb1 = otherShape.container.getBounds();

        if (bb.left > bb1.right || bb1.left > bb.right) return false;

        if (bb.top > bb1.bottom || bb1.top > bb.bottom) return false;

        if (this.hitPolygonInitial == null || otherShape.hitPolygonInitial == null) return true;

        // boundig boxes collide, so check further:
        if (this.hitPolygonDirty) this.transformHitPolygon();
        if (otherShape.hitPolygonDirty) otherShape.transformHitPolygon();

        // return polygonBerührtPolygon(this.hitPolygonTransformed, shapeHelper.hitPolygonTransformed);
        return polygonBerührtPolygonExakt(this.hitPolygonTransformed, otherShape.hitPolygonTransformed, true, true);

    }

}