
import * as THREE from 'three';
import { DOM } from '../../../../../tools/DOM';
import { CallbackParameter } from '../../../../common/interpreter/CallbackParameter';
import { Interpreter } from '../../../../common/interpreter/Interpreter';
import { Thread } from '../../../../common/interpreter/Thread';
import { JRC } from '../../../language/JavaRuntimeLibraryComments';
import { LibraryDeclarations } from '../../../module/libraries/DeclareType';
import { NonPrimitiveType } from '../../../types/NonPrimitiveType';
import { ObjectClass } from '../../system/javalang/ObjectClassStringClass';
import { ActorManager } from '../ActorManager';
import { ActorType, IActor } from '../IActor';
import { MouseManager } from '../MouseManager';
import { IWorld3d } from './IWorld3d';
import { GraphicSystem } from '../../../../common/interpreter/GraphicsManager';


export class World3dClass extends ObjectClass implements IWorld3d, GraphicSystem {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class World3d" },

        { type: "method", signature: "World3d()", java: World3dClass.prototype._cj$_constructor_$World$ },

        { type: "method", signature: "void setBackgroundColor(int colorAsRGBInt)", native: World3dClass.prototype._setBackgroundColor, comment: JRC.worldSetBackgroundColorIntComment },
        { type: "method", signature: "void setBackgroundColor(String colorAsString)", native: World3dClass.prototype._setBackgroundColor, comment: JRC.worldSetBackgroundColorStringComment },

        { type: "method", signature: "void setCursor(string cursor)", native: World3dClass.prototype._setCursor, comment: JRC.worldSetCursorComment },
        { type: "method", signature: "void clear()", native: World3dClass.prototype._clear, comment: JRC.worldClearComment },

        { type: "method", signature: "void addMouseListener(MouseListener mouseListener)", template: `§1.mouseListener.addMouseListener(§2);`, comment: JRC.worldAddMouseListenerComment },




    ]

    static type: NonPrimitiveType;

    interpreter!: Interpreter;

    width: number = 800;
    height: number = 600;

    graphicsDiv?: HTMLDivElement;
    resizeObserver?: ResizeObserver;

    actorManager!: ActorManager;

    mouseManager!: MouseManager;



    _cj$_constructor_$World$(t: Thread, callback: CallbackParameter) {

        let interpreter = t.scheduler.interpreter;

        interpreter.graphicsManager?.registerGraphicSystem(this);

        let existingWorld = <World3dClass>interpreter.retrieveObject("World3dClass");
        if (existingWorld) {
            t.s.push(existingWorld);
            return existingWorld;
        }

        interpreter.storeObject("World3dClass", this);

        this.actorManager = new ActorManager(interpreter);


        let graphicsDivParent = <HTMLDivElement>interpreter.graphicsManager?.graphicsDiv;
        graphicsDivParent.innerHTML = "";

        this.graphicsDiv = DOM.makeDiv(graphicsDivParent, 'world3d');

        this.graphicsDiv.style.overflow = "hidden";
        this.graphicsDiv.innerHTML = "";
        this.graphicsDiv.style.width = graphicsDivParent.clientWidth + "px";
        this.graphicsDiv.style.height = graphicsDivParent.clientHeight + "px";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, this.graphicsDiv.clientWidth / this.graphicsDiv.clientHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.graphicsDiv.clientWidth, this.graphicsDiv.clientHeight);
        this.graphicsDiv.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        function animate() {
            renderer.render(scene, camera);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }
        renderer.setAnimationLoop(animate);

        this.resizeObserver = new ResizeObserver(() => { 
            // this.changeResolution(); 
        });
        this.resizeObserver.observe(this.graphicsDiv!);

        // interpreter.isExternalTimer = true;
        this.addCallbacks(interpreter);

        // this.mouseManager = new MouseManager(this);

        t.s.push(this);

        t.scheduler.interpreter.graphicsManager?.adjustWidthToWorld();

        if (callback) callback();

    }

    tick(elapsedMS: number, interpreter: Interpreter) {
        this.actorManager.callActMethods(33);
        interpreter.timerFunction(33);
    }

    addCallbacks(interpreter: Interpreter) {
        let onResetRuntimeCallback = () => {
            interpreter.deleteObject("World3dClass");
            interpreter.eventManager.off(onResetRuntimeCallback);
            interpreter.eventManager.off(onProgramStoppedCallback);
            this.destroyWorld(interpreter);
        }

        let onProgramStoppedCallback = () => {
            this.onProgramStopped();
            interpreter.eventManager.off(onProgramStoppedCallback);
            // this.mouseManager.unregisterListeners();
        }

        interpreter.eventManager.on("resetRuntime", onResetRuntimeCallback)
        interpreter.eventManager.on("stop", onProgramStoppedCallback)

    }

    destroyWorld(interpreter: Interpreter) {

        this.resizeObserver?.disconnect();
    }

    changeResolution(width: number, height: number) {
        this.width = width;
        this.height = height;

        // prevent graphicsDiv from overflowing
        // this.app!.canvas.style.width = "10px";
        // this.app!.canvas.style.height = "10px";

        // this.app?.renderer.resize(width, height, 1);

        let rect = this.graphicsDiv!.parentElement!.getBoundingClientRect();
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


        // this.app!.canvas.style.width = newCanvasWidth + "px";
        // this.app!.canvas.style.height = newCanvasHeight + "px";

    }

    onProgramStopped() {
        // TODO: Render to bitmap and set bitmap instead of webgl-canvas


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


    _setBackgroundColor(color: string | number) {
        // let renderer = (<PIXI.Renderer>(this.app.renderer));
        // if (typeof color == "string") {
        //     let c = ColorHelper.parseColorToOpenGL(color);
        //     if (!c.color) return;
        //     renderer.background.color.setValue(c.color);
        // } else {
        //     renderer.background.color.setValue(color);
        // }

    }


    _setCursor(cursor: string) {
        // this.app.canvas.style.cursor = cursor;
    }

    _clear() {
        // TODO!
    }

    getIdentifier(): string {
        return "World3d";
    }

}

