
import * as PIXI from 'pixi.js';
import { CallbackParameter } from '../../../common/interpreter/CallbackParameter.ts';
import { Interpreter } from '../../../common/interpreter/Interpreter.ts';
import { Thread, ThreadState } from "../../../common/interpreter/Thread.ts";
import { ColorHelper } from '../../lexer/ColorHelper.ts';
import { LibraryDeclarations } from "../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../types/NonPrimitiveType.ts";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass.ts";
import { ActorManager } from './ActorManager.ts';
import { GroupClass } from './GroupClass.ts';
import { ActorType, IActor } from './IActor.ts';
import { IWorld } from './IWorld.ts';
import { MouseManager } from './MouseManager.ts';
import { ShapeClass } from './ShapeClass.ts';
import { GNGEventListenerType, IGNGEventListener } from './gng/IGNGEventListener.ts';
import { GNGEventlistenerManager } from './gng/GNGEventlistenerManager.ts';
import { JRC } from '../../language/JavaRuntimeLibraryComments.ts';


export class WorldClass extends ObjectClass implements IWorld {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class World" },

        { type: "method", signature: "World()", java: WorldClass.prototype._cj$_constructor_$World$ },
        { type: "method", signature: "World(int width, int height)", java: WorldClass.prototype.cj$_constructor_$World$int$int },

        { type: "method", signature: "void setBackgroundColor(int colorAsRGBInt)", native: WorldClass.prototype._setBackgroundColor, comment: JRC.worldSetBackgroundColorIntComment },
        { type: "method", signature: "void setBackgroundColor(String colorAsString)", native: WorldClass.prototype._setBackgroundColor, comment: JRC.worldSetBackgroundColorStringComment },

        { type: "method", signature: "void move(double dx, double dy)", native: WorldClass.prototype._move, comment: JRC.worldMoveComment },
        { type: "method", signature: "void rotate(double angleInDeg, double centerX, double centerY)", native: WorldClass.prototype._rotate, comment: JRC.worldRotateComment },
        { type: "method", signature: "void setCoordinateSystem(double left, double top, double width, double height)", native: WorldClass.prototype._setCoordinateSystem, comment: JRC.worldSetCoordinateSystemComment },
        { type: "method", signature: "void setCursor(string cursor)", native: WorldClass.prototype._setCursor, comment: JRC.worldSetCursorComment },
        { type: "method", signature: "void clear()", native: WorldClass.prototype._clear, comment: JRC.worldClearComment },
        
        { type: "method", signature: "double getWidth()", template: `Math.round(§1.currentWidth)`, comment: JRC.worldGetWidthComment },
        { type: "method", signature: "double getHeight()", template: `Math.round(§1.currentHeight)`, comment: JRC.worldGetHeightComment },
        { type: "method", signature: "double getTop()", template: `Math.round(§1.currentTop)`, comment: JRC.worldGetTopComment },
        { type: "method", signature: "double getLeft()", template: `Math.round(§1.currentLeft)`, comment: JRC.worldGetLeftComment },
        
        { type: "method", signature: "Group getDefaultGroup()", template: `§1.defaultGroup`, comment: JRC.worldGetDefaultGroupComment },
        { type: "method", signature: "void setDefaultGroup(Group defaultGroup)", template: `§1.defaultGroup = §2;`, comment: JRC.worldSetDefaultGroupComment },
        
        { type: "method", signature: "void addMouseListener(MouseListener mouseListener)", template: `§1.mouseListener.addMouseListener(§2);`, comment: JRC.worldAddMouseListenerComment },




    ]

    static type: NonPrimitiveType;

    interpreter!: Interpreter;

    width: number = 800;
    height: number = 600;

    currentLeft: number = 0;
    currentTop: number = 0;
    currentWidth: number = 800;
    currentHeight: number = 600;

    app!: PIXI.Application;

    graphicsDiv?: HTMLDivElement;
    resizeObserver?: ResizeObserver;

    actorManager!: ActorManager;
    gngEventlistenerManager!: GNGEventlistenerManager;

    defaultGroup?: GroupClass;

    shapesWhichBelongToNoGroup: ShapeClass[] = [];

    shapesNotAffectedByWorldTransforms: ShapeClass[] = [];

    mouseManager!: MouseManager;

    tickerFunction?: (ticker: PIXI.Ticker) => void;


    _cj$_constructor_$World$(t: Thread, callback: CallbackParameter) {
        this.interpreter = t.scheduler.interpreter;
        this.cj$_constructor_$World$int$int(t, callback, 800, 600);
    }

    cj$_constructor_$World$int$int(t: Thread, callback: CallbackParameter, width: number, height: number) {

        let interpreter = t.scheduler.interpreter;
        let existingWorld = <WorldClass>interpreter.objectStore["World"];
        if (existingWorld) {
            t.s.push(existingWorld);
            existingWorld.changeResolution(width, height);
            return existingWorld;
        }

        this.actorManager = new ActorManager(interpreter);

        interpreter.objectStore["World"] = this;

        this.graphicsDiv = <HTMLDivElement>interpreter.graphicsManager?.graphicsDiv;
        this.graphicsDiv.style.overflow = "hidden";

        t.state = ThreadState.waiting;
        this.app = new PIXI.Application();
        this.app.init({ background: '#000000', width: width, height: height, resizeTo: undefined, antialias: true }).then(() => {

            this.app!.canvas.style.width = "10px";
            this.app!.canvas.style.height = "10px";
            this.graphicsDiv?.appendChild(this.app!.canvas);

            this.resizeObserver = new ResizeObserver(() => { this.changeResolution(this.width, this.height); });
            this.resizeObserver.observe(this.graphicsDiv!);

            this.app!.stage.setFromMatrix(new PIXI.Matrix(1, 0, 0, 1, 0, 0));

            this.changeResolution(width, height);

            this.addCallbacks(interpreter);

            this.tickerFunction = (ticker: PIXI.Ticker) => {
                this.tick(PIXI.Ticker.shared.elapsedMS, interpreter);
            };

            this.app!.ticker.add(this.tickerFunction);
            this.app!.ticker.maxFPS = 30;
            this.app!.ticker.minFPS = 30;

            interpreter.isExternalTimer = true;

            this.mouseManager = new MouseManager(this);

            this.gngEventlistenerManager = new GNGEventlistenerManager(interpreter, this);

            t.state = ThreadState.runnable;

            t.s.push(this);

            if (callback) callback();
        })

    }

    tick(elapsedMS: number, interpreter: Interpreter) {
        this.actorManager.callActMethods(33);
        interpreter.timerFunction(33);
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
            this.mouseManager.unregisterListeners();
        }

        interpreter.eventManager.on("resetRuntime", onResetRuntimeCallback)
        interpreter.eventManager.on("stop", onProgramStoppedCallback)

    }

    destroyWorld(interpreter: Interpreter) {
        
        this.actorManager.clear();
        this.gngEventlistenerManager.clear();
        
        // it doesn't suffice to remove listener of this object because
        // there may be sprites playing animations which are also ticker-listeners
        this.app?.ticker.destroy();     
        interpreter.isExternalTimer = false;
        this.app?.destroy({ removeView: true }, {});

        //@ts-ignore
        this.app = undefined;
        this.resizeObserver?.disconnect();
    }

    changeResolution(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.currentLeft = 0;
        this.currentTop = 0;
        this.currentWidth = width;
        this.currentHeight = height;
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

        const stageSize: PIXI.TextureSourceOptions = {
            width: this.app!.screen.width,
            height: this.app!.screen.height,
            antialias: true
        };

        // Create two render textures... these dynamic textures will be used to draw the scene into itself
        let renderTexture = PIXI.RenderTexture.create(stageSize);
        setTimeout(() => {      // outer timeout is needed for Bitmap-objects to get fully uploaded to gpu (see mandelbrot test...)
            this.app!.renderer.render({
                container: this.app!.stage,
                target: renderTexture,
                clear: false
            });
            setTimeout(() => { // inner timeout is needed to await rendering to texture
                if (!this.app) return;
                let children = this.app!.stage.children.slice();
                this.app!.stage.removeChildren(0, children.length);
                children.forEach(c => c.destroy());
    
                let sprite = new PIXI.Sprite(renderTexture);
                sprite.x = 0;
                sprite.y = 0;
                sprite.anchor = 0;
                this.app!.stage.setFromMatrix(new PIXI.Matrix());
                this.app?.stage.addChild(sprite);
            }, 200)
        }, 200)

    }

    registerActor(actor: IActor, type: ActorType): void {
        this.actorManager.registerActor(actor, type);
    }

    unregisterActor(actor: IActor): void {
        this.actorManager.unregisterActor(actor);
    }

    hasActors(): boolean {
        return this.actorManager.hasActors() || this.gngEventlistenerManager.hasEventListeners();
    }

    registerGNGEventListener(listener: IGNGEventListener, type: GNGEventListenerType): void {
        this.gngEventlistenerManager.registerEventlistener(listener, type);
    }

    _setBackgroundColor(color: string | number) {
        let renderer = (<PIXI.Renderer>(this.app.renderer));
        if (typeof color == "string") {
            let c = ColorHelper.parseColorToOpenGL(color);
            if (!c.color) return;
            renderer.background.color.setValue(c.color);
        } else {
            renderer.background.color.setValue(color);
        }

    }

    _move(dx: number, dy: number) {
        let stage = this.app.stage;
        stage.localTransform.translate(dx, dy);
        stage.setFromMatrix(stage.localTransform);
        //@ts-ignore
        stage._didLocalTransformChangeId = stage._didChangeId;
    }

    _rotate(angleInDeg: number, centerX: number, centerY: number){
        let angleRad = -angleInDeg / 180 * Math.PI;
        let stage = this.app.stage;
        stage.localTransform.translate(-centerX, -centerY);
        stage.localTransform.rotate(angleRad);
        stage.localTransform.translate(centerX, centerY);

        stage.setFromMatrix(stage.localTransform);
        //@ts-ignore
        stage._didLocalTransformChangeId = stage._didChangeId;

        this.computeCurrentWorldBounds();
        this.shapesNotAffectedByWorldTransforms.forEach(
            (shape) => {
                shape._rotate(-angleInDeg, centerX, centerY);
            });

    }

    _translate(factor: number, centerX: number, centerY: number){
        let stage = this.app.stage;
        stage.localTransform.translate(-centerX, -centerY);
        stage.localTransform.scale(factor, factor);
        stage.localTransform.translate(centerX, centerY);

        stage.setFromMatrix(stage.localTransform);
        //@ts-ignore
        stage._didLocalTransformChangeId = stage._didChangeId;

        this.computeCurrentWorldBounds();
        let inverseFactor = 1/factor;
        this.shapesNotAffectedByWorldTransforms.forEach(
            (shape) => {
                shape._scale(inverseFactor, centerX, centerY);
            });

    }

    _setCoordinateSystem(left: number, top: number, width: number, height: number){
        let stage = this.app.stage;

        stage.localTransform.identity();
        stage.localTransform.translate(-left, -top);
        stage.localTransform.scale(this.width / width, this.height / height);

        stage.setFromMatrix(stage.localTransform);
        //@ts-ignore
        stage._didLocalTransformChangeId = stage._didChangeId;

        this.computeCurrentWorldBounds();
        let inverseFactor = width/this.width;
        this.shapesNotAffectedByWorldTransforms.forEach(
            (shape) => {
                shape._scale(inverseFactor, left, top);
                shape._move(left, top);
            });

    }

    computeCurrentWorldBounds() {

        let p1: PIXI.Point = new PIXI.Point(0, 0);
        this.app.stage.localTransform.applyInverse(p1, p1);

        let p2: PIXI.Point = new PIXI.Point(this.width, this.height);
        this.app.stage.localTransform.applyInverse(p2, p2);

        this.currentLeft = p1.x;
        this.currentTop = p1.y;
        this.currentWidth = Math.abs(p2.x - p1.x);
        this.currentHeight = Math.abs(p2.y - p1.y);

    }

    _setCursor(cursor: string) {
        this.app.canvas.style.cursor = cursor;
    }

    _clear(){
        while(this.shapesWhichBelongToNoGroup.length > 0){
            this.shapesWhichBelongToNoGroup.pop()?.destroy();
        }    
    }

}

