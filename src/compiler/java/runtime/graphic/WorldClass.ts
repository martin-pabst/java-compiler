
import * as PIXI from 'pixi.js';
import { CallbackFunction } from "../../../common/interpreter/StepFunction";
import { Thread, ThreadState } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass";


export class WorldClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class World" },

        { type: "method", signature: "World()", java: WorldClass.prototype._constructor1 },
        { type: "method", signature: "World(int width, int height)", java: WorldClass.prototype._constructor2 },

        // // from IterableInterface
        // { type: "method", signature: "Iterator<E> iterator()", native: ArrayListClass.prototype._iterator },
        // { type: "method", signature: "void forEach(Consumer<? super E> action)", java: ArrayListClass.prototype._mj$forEach$void$Consumer },

        // // from CollectionInterface
        // { type: "method", signature: "Object[] toArray()", native: ArrayListClass.prototype._toArray, template: "§1.elements.slice()" },
        // { type: "method", signature: "<T> T[] toArray(T[] a)", native: ArrayListClass.prototype._toArray, template: "§1.elements.slice()" },
        // { type: "method", signature: "boolean add(E e)", native: ArrayListClass.prototype._add, template: "(§1.elements.push(§2) >= 0)" },
        // { type: "method", signature: "boolean addAll(Collection<? extends E> c)", java: ArrayListClass.prototype._addAll },
        // { type: "method", signature: "void clear()", native: ArrayListClass.prototype._clear, template: "§1.elements.length = 0" },
        // { type: "method", signature: "boolean contains(Object o)", native: ArrayListClass.prototype._contains, template: "(§1.elements.indexOf(§2) >= 0)" },
        // { type: "method", signature: "boolean containsAll(Collection<?> c)", java: ArrayListClass.prototype._containsAll },
        // { type: "method", signature: "boolean isEmpty()", native: ArrayListClass.prototype._isEmpty, template: "(§1.elements.length == 0)" },
        // { type: "method", signature: "boolean remove(Object o)", native: ArrayListClass.prototype._remove },
        // { type: "method", signature: "boolean removeAll(Collection<?> c)", java: ArrayListClass.prototype._removeAll },
        // { type: "method", signature: "int size()", native: ArrayListClass.prototype._size, template: "§1.elements.length" },

        // // from ListInterface
        // { type: "method", signature: "boolean add(int index, E element)", native: ArrayListClass.prototype._addWithIndex },
        // { type: "method", signature: "boolean addAll(int index, Collection<? extends E> c)", java: ArrayListClass.prototype._addAllWithIndex },
        // { type: "method", signature: "E get (int index)", native: ArrayListClass.prototype._getWithIndex },
        // { type: "method", signature: "int indexOf (Object o)", native: ArrayListClass.prototype._indexOf },
        // { type: "method", signature: "E remove (int index)", native: ArrayListClass.prototype._removeWithIndex },
        // { type: "method", signature: "E set (int index, E Element)", native: ArrayListClass.prototype._setWithIndex },
        // { type: "method", signature: "void sort(Comparator<? super E> comparator)", java: ArrayListClass.prototype._mj$sort$void$Comparator },

        // 
    ]

    static type: NonPrimitiveType;

    width: number = 800;
    height: number = 600;

    app?: PIXI.Application;

    _constructor1(t: Thread, callback: CallbackFunction) {
        this._constructor2(t, callback, 800, 600)
    }

    _constructor2(t: Thread, callback: CallbackFunction, width: number, height: number) {
        
        let interpreter = t.scheduler.interpreter;
        let existingWorld = <WorldClass>interpreter.objectStore["World"];
        if(existingWorld){
            t.s.push(existingWorld);
            existingWorld.changeResolution(width, height);
            if(callback) callback();
        }

        interpreter.objectStore["World"] = this;

        interpreter.eventManager.on("resetRuntime", () => {
            this.app?.destroy({removeView: true}, {});
            delete interpreter.objectStore["World"];
        })

        let graphicsDiv = interpreter.graphicsManager?.graphicsDiv;

        t.state = ThreadState.waiting;
        this.app = new PIXI.Application();
        this.app.init({background: '#000000', resizeTo: graphicsDiv!}).then(() => {

            graphicsDiv?.appendChild(this.app!.canvas);
            this.app!.stage.setFromMatrix(new PIXI.Matrix(0.5, 0, 0, 1, 0, 0));
            

            const graphics = new PIXI.Graphics();

            // Rectangle
            graphics.rect(50, 50, 100, 100);
            graphics.fill(0xde3249);

            this.app!.stage.addChild(graphics);

            t.state = ThreadState.runnable;
            if(callback) callback();
        })
    }


    changeResolution(width: number, height: number){
        if(this.width == width && this.height == height) return;
        // TODO
    }

}

