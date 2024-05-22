
import * as PIXI from 'pixi.js';
import { CallbackFunction } from "../../../common/interpreter/StepFunction";
import { Thread, ThreadState } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass";
import { Interpreter } from '../../../common/interpreter/Interpreter.ts';
import { ActorType, IActor, IWorld } from './IWorld.ts';
import { ActorManager } from './ActorManager.ts';


export class WorldClass extends ObjectClass implements IWorld {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class World" },

        { type: "method", signature: "World()", java: WorldClass.prototype._cj$_constructor_$World$ },
        { type: "method", signature: "World(int width, int height)", java: WorldClass.prototype.cj$_constructor_$World$int$int },

    ]

    static type: NonPrimitiveType;

    width: number = 0;
    height: number = 0;

    app?: PIXI.Application;

    graphicsDiv?: HTMLDivElement;
    resizeObserver?: ResizeObserver;

    actorManager: ActorManager = new ActorManager();

    tickerFunction?: (ticker: PIXI.Ticker) => void;


    _cj$_constructor_$World$(t: Thread, callback: any): WorldClass {
        return this.cj$_constructor_$World$int$int(t, undefined, 800, 600);
    }

    cj$_constructor_$World$int$int(t: Thread, callback: any, width: number, height: number): WorldClass {

        let interpreter = t.scheduler.interpreter;
        let existingWorld = <WorldClass>interpreter.objectStore["World"];
        if (existingWorld) {
            t.s.push(existingWorld);
            existingWorld.changeResolution(width, height);
            return existingWorld;
        }

        interpreter.objectStore["World"] = this;

        this.graphicsDiv = <HTMLDivElement>interpreter.graphicsManager?.graphicsDiv;
        this.graphicsDiv.style.overflow = "hidden";

        t.state = ThreadState.waiting;
        this.app = new PIXI.Application();
        this.app.init({ background: '#000000', width: width, height: height, resizeTo: undefined }).then(() => {

            this.app!.canvas.style.width = "10px";
            this.app!.canvas.style.height = "10px";
            this.graphicsDiv?.appendChild(this.app!.canvas);

            this.resizeObserver = new ResizeObserver(() => {this.changeResolution(this.width, this.height);});
            this.resizeObserver.observe(this.graphicsDiv!);

            this.app!.stage.setFromMatrix(new PIXI.Matrix(1, 0, 0, 1, 0, 0));

            const graphics = new PIXI.Graphics();

            // Rectangle
            graphics.rect(50, 50, 1000, 500);
            graphics.fill(0xde3249);

            this.app!.stage.addChild(graphics);

            this.changeResolution(width, height);

            this.addCallbacks(interpreter);

            this.tickerFunction = (ticker: PIXI.Ticker) => {
                this.tick(PIXI.Ticker.shared.elapsedMS, interpreter);
            };    

            this.app!.ticker.add(this.tickerFunction);
            this.app!.ticker.maxFPS = 30;
            this.app!.ticker.minFPS = 30;
    
            interpreter.isExternalTimer = true;
    

            t.state = ThreadState.runnable;
        })

        return this;
    }

    tick(elapsedMS: number, interpreter: Interpreter) {
        this.actorManager.callActMethods(interpreter, elapsedMS);
        interpreter.timerFunction(elapsedMS);
    }

    addCallbacks(interpreter: Interpreter) {
        let onResetRuntimeCallback = () => {
            delete interpreter.objectStore["World"];
            interpreter.eventManager.off(onResetRuntimeCallback);
            interpreter.eventManager.off(onProgramStoppedCallback);
            this.destroyWorld(interpreter);
        }
        
        let onProgramStoppedCallback = () => {
            this.onProgramStopped();
            interpreter.eventManager.off(onProgramStoppedCallback);
        }
        
        interpreter.eventManager.on("resetRuntime", onResetRuntimeCallback)
        interpreter.eventManager.on("stop", onProgramStoppedCallback)
        
    }
    
    destroyWorld(interpreter: Interpreter){
        this.actorManager.clear();
        this.app?.ticker.remove(this.tickerFunction!);
        interpreter.isExternalTimer = false;
        this.app?.destroy({ removeView: true }, {});
        this.app = undefined;
        this.resizeObserver?.disconnect();    
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
            this.app!.stage.setFromMatrix(new PIXI.Matrix());
            this.app?.stage.addChild(sprite);
        }, 500)

    }

    registerActor(actor: IActor, type: ActorType): void {
        this.actorManager.registerActor(actor, type);
    }

    unregisterActor(actor: IActor): void {
        this.actorManager.unregisterActor(actor);
    }

    hasActors(): boolean {
        return this.actorManager.hasActors();
    }

}

