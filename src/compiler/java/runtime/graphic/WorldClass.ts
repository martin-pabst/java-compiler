
import * as PIXI from 'pixi.js';
import { CallbackFunction } from "../../../common/interpreter/StepFunction";
import { Thread, ThreadState } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass";
import { Interpreter } from '../../../common/interpreter/Interpreter.ts';


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

    width: number = 0;
    height: number = 0;

    app?: PIXI.Application;

    graphicsDiv?: HTMLDivElement;

    _constructor1(t: Thread) {
        this._constructor2(t, 800, 600)
    }

    _constructor2(t: Thread, width: number, height: number) {

        let interpreter = t.scheduler.interpreter;
        let existingWorld = <WorldClass>interpreter.objectStore["World"];
        if (existingWorld) {
            t.s.push(existingWorld);
            existingWorld.changeResolution(width, height);
            return;
        }

        interpreter.objectStore["World"] = this;

        this.graphicsDiv = <HTMLDivElement>interpreter.graphicsManager?.graphicsDiv;
        this.graphicsDiv.style.minWidth = "0";
        this.graphicsDiv.style.minHeight = "0";
        this.graphicsDiv.style.overflow = "hidden";

        t.state = ThreadState.waiting;
        this.app = new PIXI.Application();
        this.app.init({ background: '#000000', width: width, height: height, resizeTo: undefined }).then(() => {

            this.app!.canvas.style.width = "10px";
            this.app!.canvas.style.height = "10px";
            this.graphicsDiv?.appendChild(this.app!.canvas);

            window.onresize = () => {
                this.changeResolution(this.width, this.height);
            }

            this.app!.stage.setFromMatrix(new PIXI.Matrix(1, 0, 0, 1, 0, 0));

            const graphics = new PIXI.Graphics();

            // Rectangle
            graphics.rect(50, 50, 1000, 500);
            graphics.fill(0xde3249);

            this.app!.stage.addChild(graphics);

            this.changeResolution(width, height);

            this.addCallbacks(interpreter);

            t.state = ThreadState.runnable;
        })
    }

    addCallbacks(interpreter: Interpreter) {
        let onResetRuntimeCallback = () => {
            this.app?.destroy({ removeView: true }, {});
            this.app = undefined;
            delete interpreter.objectStore["World"];
            interpreter.eventManager.off(onResetRuntimeCallback);
            interpreter.eventManager.off(onProgramStoppedCallback);
        }

        let onProgramStoppedCallback = () => {
            this.onProgramStopped();
            interpreter.eventManager.off(onProgramStoppedCallback);
        }

        interpreter.eventManager.on("resetRuntime", onResetRuntimeCallback)
        interpreter.eventManager.on("stop", onProgramStoppedCallback)

    }

    changeResolution(width: number, height: number) {
        this.width = width;
        this.height = height;
        // prevent graphicsDiv from overflowing
        this.app!.canvas.style.width = "10px";
        this.app!.canvas.style.height = "10px";

        this.app?.renderer.resize(width, height, 1);

        let rect = this.graphicsDiv!.getBoundingClientRect();
        if (rect.width == 0 || rect.height == 0) rect = this.graphicsDiv!.parentElement!.getBoundingClientRect();

        let newCanvasWidth: number;
        let newCanvasHeight: number;
        if (width / height > rect.width / rect.height) {
            newCanvasWidth = rect.width;
            newCanvasHeight = rect.width / width * height;
        } else {
            newCanvasHeight = rect.height;
            newCanvasWidth = rect.height / height * width;
        }

        newCanvasHeight = Math.min(newCanvasHeight, rect.height);
        newCanvasWidth = Math.min(newCanvasWidth, rect.width);


        this.app!.canvas.style.width = newCanvasWidth + "px";
        this.app!.canvas.style.height = newCanvasHeight + "px";

    }

    onProgramStopped() {

        const stageSize = {
            width: this.app!.screen.width,
            height: this.app!.screen.height,
        };

        // Create two render textures... these dynamic textures will be used to draw the scene into itself
        let renderTexture = PIXI.RenderTexture.create(stageSize);
        this.app!.renderer.render({
            container: this.app!.stage,
            target: renderTexture,
            clear: false,
        });
        setTimeout(() => {
            let children = this.app!.stage.children.slice();
            this.app!.stage.removeChildren(0, children.length);
            children.forEach(c => c.destroy());

            let sprite = new PIXI.Sprite(renderTexture);
            sprite.x = 0;
            sprite.y = 0;
            sprite.anchor = 0;
            this.app?.stage.addChild(sprite);
        }, 500)

    }




}

