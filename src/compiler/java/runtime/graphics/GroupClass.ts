import * as PIXI from 'pixi.js';
import { CallbackFunction } from '../../../common/interpreter/StepFunction';
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { RuntimeExceptionClass } from '../system/javalang/RuntimeException';
import { ShapeClass } from './ShapeClass';
import { JRC } from '../../language/JavaRuntimeLibraryComments';

export class GroupClass extends ShapeClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Group<T extends Shape> extends Shape", comment: JRC.groupClassComment },

        { type: "method", signature: "Group()", java: GroupClass.prototype._cj$_constructor_$Group$, comment: JRC.groupConstructorComment },
        { type: "method", signature: "Group(T... shapes)", java: GroupClass.prototype._cj$_constructor_$Group$T, comment: JRC.groupConstructorComment },
        { type: "method", signature: "final void add(T shape)", native: GroupClass.prototype.add, comment: JRC.groupAddComment },
        { type: "method", signature: "final void add(T... shapes)", native: GroupClass.prototype.addMultiple, comment: JRC.groupAddComment },
        { type: "method", signature: "final void remove(T shape)", native: GroupClass.prototype.remove, comment: JRC.groupRemoveComment },
        { type: "method", signature: "final void remove(int index)", native: GroupClass.prototype.removeWithIndex, comment: JRC.groupRemoveWithIndexComment },
        { type: "method", signature: "final T get(int index)", native: GroupClass.prototype.get, comment: JRC.groupGetComment },
        { type: "method", signature: "final int indexOf(T shape)", native: GroupClass.prototype.indexOf, comment: JRC.groupIndexOfComment },
        { type: "method", signature: "final int size()", template: `&1.shapes.length`, comment: JRC.groupSizeComment },
        { type: "method", signature: "final void empty()", native: GroupClass.prototype.removeAllChildren, comment: JRC.groupEmptyComment },
        { type: "method", signature: "final void destroyAllChildren()", native: GroupClass.prototype.destroyAllChildren, comment: JRC.groupDestroyAllChildrenComment },
        // { type: "method", signature: "Rectangle(double left, double top, double width, double height)", java: GroupClass.prototype._cj$_constructor_$Rectangle$double$double$double$double },

        { type: "method", signature: "final boolean collidesWith(Shape otherShape)", native: GroupClass.prototype._collidesWith, comment: JRC.shapeCollidesWithComment },

    ]

    static type: NonPrimitiveType;

    shapes: ShapeClass[] = [];      // If you change this identifier then you have to change corresponding declaration in class ShapeClass

    _cj$_constructor_$Group$(t: Thread, callback: CallbackFunction) {
        this._cj$_constructor_$Shape$(t, () => {
            this.container = new PIXI.Container();
            this.world.app.stage.addChild(this.container);
            if (callback) callback();
        });
    }

    _cj$_constructor_$Group$T(t: Thread, callback: CallbackFunction, shapes: ShapeClass[]) {
        this._cj$_constructor_$Group$(t, () => {
            if (!shapes) return;
            for (let shape of shapes) {
                this.add(shape);
            }
            if (callback) callback();
        });
    }

    render() {

    }

    _collidesWith(otherShape: ShapeClass): boolean {
        if(!this.hasOverlappingBoundingBoxWith(otherShape)) return false;

        for(let shape of this.shapes){
            if(shape._collidesWith(otherShape)) return true;
        }

        return false;
    }

    indexOf(shape: ShapeClass): number {
        return this.shapes.indexOf(shape);
    }

    checkIndex(index: number) {
        if (index < 0) throw new RuntimeExceptionClass("Der Index ist kleiner als 0.");
        if (index >= this.shapes.length) throw new RuntimeExceptionClass("Zugriff auf das Shape mit Index " + index + " einer Gruppe mit " + this.shapes.length + " Elementen.");
    }

    removeWithIndex(index: number): void {
        this.checkIndex(index);
        this.remove(this.shapes[index]);
    }

    get(index: number): ShapeClass {
        this.checkIndex(index);
        return this.shapes[index];
    }


    addMultiple(shapes: ShapeClass[]) {
        for (let shape of shapes) {
            this.add(shape);
        }
    }

    add(shape: ShapeClass) {

        if (shape == null) return;
        
        if (shape.isDestroyed) {
            throw new RuntimeExceptionClass("Ein schon zerstörtes Objekt kann keiner Gruppe hinzugefügt werden.");
        }
        
        if (shape instanceof GroupClass && shape.containsRecursively(this)) {
            throw new RuntimeExceptionClass("Es wurde versucht, eine Gruppe A zu einer Gruppe B hinzuzufügen, wobei B die Gruppe A bereits enthielt. Dies führt zu einem unzulässigen Zirkelbezug.")
        }
        
        shape.getWorldTransform();
        if (shape.belongsToGroup != null) {
            shape.belongsToGroup.remove(shape);
        } else {
            let index = this.world.shapesWhichBelongToNoGroup.indexOf(shape);
            if(index >= 0){
                this.world.shapesWhichBelongToNoGroup.splice(index, 1);
            }
        }
        
        this.shapes.push(shape);
        
        shape.belongsToGroup = this;


        // console.log(shape.container.worldTransform);
        let inverse = new PIXI.Matrix().copyFrom(this.getWorldTransform()).invert();
        inverse.append(shape.getWorldTransform());   // A.append(B)   is B * A
        // shape.container.localTransform.copyFrom(inverse);
        // console.log("before:" + shape.container.localTransform);
        // console.log("inverse:" + shape.container.localTransform);
        shape.container.setFromMatrix(inverse);
        shape.container.updateLocalTransform();
        shape.worldTransformDirty = true;
        // console.log("after:" + shape.container.localTransform);
        this.container.addChild(shape.container);

        let count = this.shapes.length;
        // old center of group in world coordinates:
        let p0: PIXI.Point = this.getWorldTransform().apply(new PIXI.Point(this.centerXInitial, this.centerYInitial));

        let centerOfAddedShape = shape.getCenter();

        let x: number = (p0.x * (count - 1) + centerOfAddedShape.x) / count;
        let y: number = (p0.y * (count - 1) + centerOfAddedShape.y) / count;

        let p1: PIXI.Point = this.getWorldTransform().applyInverse(new PIXI.Point(x, y));

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

    public destroyAllChildren() {
        while (this.shapes.length > 0) {
            this.shapes.pop()!.destroy();
        }
    }

    public removeAllChildren() {
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


        shape.getWorldTransform();
        this.container.removeChild(shape.container);
        this.world.app.stage.addChild(shape.container);

        let inverseStageTransform = new PIXI.Matrix().copyFrom(this.world.app.stage.localTransform).invert();
        inverseStageTransform.append(shape.getWorldTransform());
        // shape.container.localTransform.copyFrom(inverseStageTransform);
        shape.container.setFromMatrix(inverseStageTransform);
        shape.container.updateLocalTransform();
        shape.worldTransformDirty = true;


        shape.belongsToGroup = undefined;

        let count = this.shapes.length;
        // old center of group in world coordinates:
        let p0: PIXI.Point = this.getWorldTransform().apply(new PIXI.Point(this.centerXInitial, this.centerYInitial));

        let centerOfRemovedShape = shape.getCenter();

        let x: number = (p0.x * (count + 1) - centerOfRemovedShape.x) / (count);
        let y: number = (p0.y * (count + 1) - centerOfRemovedShape.y) / (count);

        let p1: PIXI.Point = this.getWorldTransform().applyInverse(new PIXI.Point(x, y));

        this.centerXInitial = p1.x;
        this.centerYInitial = p1.y;

    }

    setChildIndex(sh: ShapeClass, index: number) {
        this.container.setChildIndex(sh.container, index);

        let oldIndex = this.shapes.indexOf(sh);
        this.shapes.splice(oldIndex, 1);
        this.shapes.splice(index, 0, sh);
    }

    public destroy(): void {
        for (let shape of this.shapes) {
            shape.destroy();
        }
        super.destroy();
    }

    setWorldTransformAndHitPolygonDirty(): void {
        this.worldTransformDirty = true;
        for (let shape of this.shapes) shape.setWorldTransformAndHitPolygonDirty();
    }



}