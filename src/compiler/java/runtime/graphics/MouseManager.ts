import { IWorld } from "./IWorld";
import * as PIXI from 'pixi.js';
import { MouseEventMethod, ShapeClass } from "./ShapeClass";
import { MouseListenerInterface } from "./MouseListenerInterface";
import { Thread, ThreadState } from "../../../common/interpreter/Thread";

export interface InternalMouseListener {
    onMouseEvent(kind: MouseEventKind, x: number, y: number): void;
}

export type MouseEventKind = "mouseup" | "mousedown" | "mousemove" | "mouseenter" | "mouseleave";


export class MouseManager {

    internalMouseListeners: InternalMouseListener[] = [];

    javaMouseListeners: (MouseListenerInterface)[] = [];

    shapesWithImplementedMouseMethods: ShapeClass[] = [];

    listeners: Map<string, any> = new Map();

    constructor(private world: IWorld) {
        this.registerListeners();
    }

    unregisterListeners(){
        let canvas = this.world.app!.canvas;
        for (let mouseEventKind of ["mouseup", "mousedown", "mousemove", "mouseenter", "mouseleave"]) {
            canvas.removeEventListener(mouseEventKind, this.listeners.get(mouseEventKind));
        }
    }

    registerListeners() {

        let canvas = this.world.app!.canvas;
        let that = this;

        for (let mouseEventKind of ["mouseup", "mousedown", "mousemove", "mouseenter", "mouseleave"]) {

            let eventType = mouseEventKind;
            if (window.PointerEvent) {
                eventType = eventType.replace('mouse', 'pointer');
            }

            let listener: any;
            //@ts-ignore
            canvas.addEventListener(mouseEventKind,  listener = (e: MouseEvent) => {
                let canvasRect = canvas.getBoundingClientRect();
                let x = that.world.width * e.offsetX / canvasRect.width;
                let y = that.world.height * e.offsetY / canvasRect.height;

                let p = new PIXI.Point(x, y);
                that.world.app.stage.localTransform.applyInverse(p, p);
                x = p.x;
                y = p.y;

                that.callShapesWithImplementedMouseMethods(mouseEventKind as MouseEventKind, x, y, e.button);

                for (let internalListener of that.internalMouseListeners) {
                    internalListener.onMouseEvent(<MouseEventKind>mouseEventKind, x, y);
                }

                if (that.javaMouseListeners.length > 0) {
                    let t: Thread = this.world.interpreter.scheduler.createThread("mouse event thread");

                    for (let listener of that.javaMouseListeners) {
                        switch (mouseEventKind) {
                            case "onmousedown": listener._mj$onMouseDown$void$double$double$int(t, undefined, x, y, e.button); break;
                            case "onmouseup": listener._mj$onMouseUp$void$double$double$int(t, undefined, x, y, e.button); break;
                            case "onmouseenter": listener._mj$onMouseEnter$void$double$double(t, undefined, x, y); break;
                            case "onmouseleave": listener._mj$onMouseLeave$void$double$double(t, undefined, x, y); break;
                            case "onmousemove": listener._mj$onMouseMove$void$double$double(t, undefined, x, y); break;
                        }
                    }

                    t.startIfNotEmptyOrDestroy();
                }

                // if (listenerType == "mousedown") {
                //     let gngEreignisbehandlung = this.interpreter.gngEreignisbehandlungHelper;
                //     if (gngEreignisbehandlung != null) {
                //         gngEreignisbehandlung.handleMouseClickedEvent(x, y);
                //     }
                // }

            });

            this.listeners.set(mouseEventKind, listener);

        }

    }

    addMouseListener(mouseListener: MouseListenerInterface) {
        this.javaMouseListeners.push(mouseListener);
    }

    removeMouseListener(mouseListener: MouseListenerInterface) {
        this.javaMouseListeners.splice(this.javaMouseListeners.indexOf(mouseListener));
    }

    addShapeWithImplementedMouseMethods(shape: ShapeClass) {
        this.shapesWithImplementedMouseMethods.push(shape);
    }

    removeShapeWithImplementedMouseMethods(shape: ShapeClass) {
        this.shapesWithImplementedMouseMethods.splice(this.shapesWithImplementedMouseMethods.indexOf(shape), 1);
    }


    callShapesWithImplementedMouseMethods(mouseEventKind: MouseEventKind, x: number, y: number, button: number) {

        if (this.shapesWithImplementedMouseMethods.length == 0) return;

        let t: Thread = this.world.interpreter.scheduler.createThread("mouse event thread");

        switch (mouseEventKind) {
            case "mousedown":
            case "mouseup":
                for (let shape of this.shapesWithImplementedMouseMethods) {
                    if (!shape.reactToMouseEventsWhenInvisible && !shape.container.visible) continue;
                    let mouseEventMethod: MouseEventMethod = shape.mouseEventsImplemented![mouseEventKind];
                    if (mouseEventMethod && (shape.trackMouseMove || shape._containsPoint(x, y))) {
                        mouseEventMethod.call(shape, t, undefined, x, y, button);
                    }
                }
                break;
            case "mouseenter":
                for (let shape of this.shapesWithImplementedMouseMethods) {
                    if (!shape.reactToMouseEventsWhenInvisible && !shape.container.visible) continue;
                    let mouseEventMethod: MouseEventMethod = shape.mouseEventsImplemented![mouseEventKind];
                    if (mouseEventMethod && shape._containsPoint(x, y) && !shape.mouseLastSeenInsideObject) {
                        shape.mouseLastSeenInsideObject = true;
                        mouseEventMethod.call(shape, t, undefined, x, y);
                    }
                }
                break;
            case "mouseleave":
                for (let shape of this.shapesWithImplementedMouseMethods) {
                    if (!shape.reactToMouseEventsWhenInvisible && !shape.container.visible) continue;
                    let mouseEventMethod: MouseEventMethod = shape.mouseEventsImplemented![mouseEventKind];
                    if (mouseEventMethod && shape.mouseLastSeenInsideObject) {
                        shape.mouseLastSeenInsideObject = false;
                        mouseEventMethod.call(shape, t, undefined, x, y);
                    }
                }
                break;
            case "mousemove":
                for (let shape of this.shapesWithImplementedMouseMethods) {
                    if (!shape.reactToMouseEventsWhenInvisible && !shape.container.visible) continue;
                    let mouseMoveEventMethod: MouseEventMethod | undefined = shape.mouseEventsImplemented!["mousemove"];
                    let mouseEnterEventMethod: MouseEventMethod | undefined = shape.mouseEventsImplemented!["mouseenter"];
                    let mouseLeaveEventMethod: MouseEventMethod | undefined = shape.mouseEventsImplemented!["mouseleave"];

                    if(mouseMoveEventMethod != null ||
                        (mouseEnterEventMethod != null && !shape.mouseLastSeenInsideObject) ||
                        (mouseLeaveEventMethod != null && shape.mouseLastSeenInsideObject)
                    ){
                        let containsPoint = shape._containsPoint(x, y);
                        if((shape.trackMouseMove || containsPoint) && mouseMoveEventMethod != null){
                            mouseMoveEventMethod.call(shape, t, undefined, x, y);
                        }
                        if(containsPoint && mouseEnterEventMethod != null && !shape.mouseLastSeenInsideObject){
                            shape.mouseLastSeenInsideObject = true;
                            mouseEnterEventMethod.call(shape, t, undefined, x, y);
                        }
                        if(!containsPoint && mouseLeaveEventMethod != null && shape.mouseLastSeenInsideObject){
                            shape.mouseLastSeenInsideObject = false;
                            mouseLeaveEventMethod.call(shape, t, undefined, x, y);
                        }
                    }
                }
                break;

        }



        t.startIfNotEmptyOrDestroy();
    }

    hasMouseListeners(): boolean {
        return this.shapesWithImplementedMouseMethods.length > 0;
    }


}