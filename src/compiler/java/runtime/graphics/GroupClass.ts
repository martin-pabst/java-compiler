import * as PIXI from 'pixi.js';
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ShapeClass } from './ShapeClass';
import { CallbackFunction } from '../../../common/interpreter/StepFunction';
import { ExceptionClass } from '../system/javalang/ExceptionClass';
import { RuntimeExceptionClass } from '../system/javalang/RuntimeException';
import { updateWorldTransformRecursively } from './PixiHelper';

export class GroupClass extends ShapeClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Group extends Shape" },

        { type: "method", signature: "Group()", java: GroupClass.prototype._cj$_constructor_$Group$ },
        { type: "method", signature: "final void add(Shape shape)", native: GroupClass.prototype.add },
        { type: "method", signature: "final void remove(Shape shape)", native: GroupClass.prototype.remove },
        // { type: "method", signature: "Rectangle(double left, double top, double width, double height)", java: GroupClass.prototype._cj$_constructor_$Rectangle$double$double$double$double },

    ]

    static type: NonPrimitiveType;

    shapes: ShapeClass[] = [];

    _cj$_constructor_$Group$(t: Thread, callback: CallbackFunction) {
        this._cj$_constructor_$Shape$(t, callback);
        this.container = new PIXI.Container();
        this.world.app.stage.addChild(this.container);
    }

    add(shape: ShapeClass) {

        if (shape == null) return;
        
        if (shape.isDestroyed) {
            throw new RuntimeExceptionClass("Ein schon zerstörtes Objekt kann keiner Gruppe hinzugefügt werden.");
        }
        
        if (shape instanceof GroupClass && shape.containsRecursively(this)) {
            throw new RuntimeExceptionClass("Es wurde versucht, eine Gruppe A zu einer Gruppe B hinzuzufügen, wobei B die Gruppe A bereits enthielt. Dies führt zu einem unzulässigen Zirkelbezug.")
        }
        
        if (shape.belongsToGroup != null) {
            shape.belongsToGroup.remove(shape);
        } else {
            let index = this.world.shapesWhichBelongToNoGroup.indexOf(shape);
            this.world.shapesWhichBelongToNoGroup.splice(index, 1);
        }
        
        this.shapes.push(shape);
        
        shape.belongsToGroup = this;


        // console.log(shape.container.worldTransform);
        let inverse = new PIXI.Matrix().copyFrom(this.container.worldTransform).invert();
        inverse.append(shape.container.worldTransform);   // A.append(B)   is B * A
        shape.container.localTransform.copyFrom(inverse);
        shape.container.setFromMatrix(inverse);
        this.container.addChild(shape.container);
        updateWorldTransformRecursively(shape.container, false);

        let count = this.shapes.length;
        // old center of group in world coordinates:
        let p0: PIXI.Point = this.container.worldTransform.apply(new PIXI.Point(this.centerXInitial, this.centerYInitial));

        let centerOfAddedShape = shape.getCenter();

        let x: number = (p0.x * (count - 1) + centerOfAddedShape.x) / count;
        let y: number = (p0.y * (count - 1) + centerOfAddedShape.y) / count;

        let p1: PIXI.Point =  this.container.worldTransform.applyInverse(new PIXI.Point(x, y));

        this.centerXInitial = p1.x;
        this.centerYInitial = p1.y;

    }

    containsRecursively(shape: ShapeClass) {
        for (let shape1 of this.shapes) {
            if (shape1 == shape) return true;
            if (shape1 instanceof GroupClass && shape1.containsRecursively(shape)) return true;
        }
        return false;
    }

    public removeAllChidren() {
        let index: number = 0;
        for (let shape of this.shapes) {
            this.deregister(shape, index++);
        }
        this.shapes = [];
    }

    public remove(shape: ShapeClass) {
        let index = this.shapes.indexOf(shape);
        if (index >= 0) {
            this.shapes.splice(index, 1);
            this.deregister(shape, index);
        }
    }

    private deregister(shape: ShapeClass, index: number) {

        this.container.removeChild(shape.container);
        this.world.app.stage.addChild(shape.container);
        
        let inverseStageTransform = new PIXI.Matrix().copyFrom(this.world.app.stage.localTransform).invert();
        inverseStageTransform.append(shape.container.worldTransform);
        shape.container.localTransform.copyFrom(inverseStageTransform);
        shape.container.setFromMatrix(inverseStageTransform);

        updateWorldTransformRecursively(shape.container, false);

        shape.belongsToGroup = undefined;

        let count = this.shapes.length;
        // old center of group in world coordinates:
        let p0: PIXI.Point = this.container.worldTransform.apply(new PIXI.Point(this.centerXInitial, this.centerYInitial));

        let centerOfRemovedShape = shape.getCenter();

        let x: number = (p0.x * (count + 1) - centerOfRemovedShape.x) / (count - 1);
        let y: number = (p0.y * (count + 1) - centerOfRemovedShape.y) / (count - 1);

        let p1: PIXI.Point =  this.container.worldTransform.applyInverse(new PIXI.Point(x, y));

        this.centerXInitial = p1.x;
        this.centerYInitial = p1.y;


    }

    setChildIndex(sh: ShapeClass, index: number) {
        this.container.setChildIndex(sh.container, index);

        let oldIndex = this.shapes.indexOf(sh);
        this.shapes.splice(oldIndex, 1);
        this.shapes.splice(index, 0, sh);
    }



}