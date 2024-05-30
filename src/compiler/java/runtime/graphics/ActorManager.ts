import { Interpreter } from "../../../common/interpreter/Interpreter";
import { KeyDownListener, KeyPressedListener, KeyUpListener, KeyboardManager } from "../../../common/interpreter/KeyboardManager";
import { Thread, ThreadState } from "../../../common/interpreter/Thread";
import { StringClass } from "../system/javalang/ObjectClassStringClass";
import { ActorType, ActorTypes, IActor } from "./IActor";

export class ActorManager {

    actors: Record<ActorType, IActor[]> = {
        "act": [],
        "actWithTime": [],
        "keyDown": [],
        "keyUp": [],
        "keyPressed": []
    };

    keyDownListener: KeyDownListener = (key: string, isShift: boolean, isCtrl: boolean, isAlt: boolean) => {
        this.onKeyDown(key, isShift, isCtrl, isAlt);
    }

    keyUpListener: KeyUpListener = (key: string) => {
        this.onKeyUp(key);
    }

    keyTypedListener: KeyPressedListener = (key: string) => {
        this.onKeyPressed(key);
    }

    constructor(private interpreter: Interpreter) {
        this.clear();
        if (interpreter.keyboardManager) {
            interpreter.keyboardManager.addKeyDownListener(this.keyDownListener);
            interpreter.keyboardManager.addKeyUpListener(this.keyUpListener);
            interpreter.keyboardManager.addKeyPressedListener(this.keyTypedListener);
        }
    }

    destroy() {
        if (this.interpreter.keyboardManager) {
            this.interpreter.keyboardManager.removeKeyDownListener(this.keyDownListener);
            this.interpreter.keyboardManager.removeKeyUpListener(this.keyUpListener);
            this.interpreter.keyboardManager.removeKeyPressedListener(this.keyTypedListener);
        }
    }

    registerActor(actor: IActor, type: ActorType): void {
        let list = this.actors[type];
        list.push(actor);
    }

    runningactThread?: Thread;
    tickHappenedWhenThreadNotEmpty: boolean = false;
    callActMethods(dt: number) {
        if (this.runningactThread && this.runningactThread.state == ThreadState.runnable) {
            this.tickHappenedWhenThreadNotEmpty = true;
            return;
        }

        this.tickHappenedWhenThreadNotEmpty = false;

        if (this.actors["act"].length == 0 && this.actors["actWithTime"].length == 0) return;

        this.runningactThread = this.interpreter.scheduler.createThread("act method-thread");
        for (let actor of this.actors["act"]) {
            if (actor.isActing) actor._mj$act$void$(this.runningactThread, undefined);
        }
        for (let actor of this.actors["actWithTime"]) {
            if (actor.isActing) actor._mj$act$void$double(this.runningactThread, undefined, dt);
        }

        if (this.runningactThread.programStack.length > 0) {
            this.runningactThread.state = ThreadState.runnable;
            this.runningactThread.callbackAfterTerminated = () => {
                if(this.tickHappenedWhenThreadNotEmpty){
                    this.callActMethods(dt);
                }
            }
        } else {
            this.interpreter.scheduler.removeThread(this.runningactThread);
            this.runningactThread = undefined;
        }

    }

    startActMethods(){
        
    }

    clear() {
        ActorTypes.forEach(at => this.actors[at] = []);
    }

    unregisterActor(actor: IActor) {
        ActorTypes.forEach(at => {
            let actorList = this.actors[at];
            let index = actorList.indexOf(actor);
            if (index >= 0) actorList.splice(index, 1);
        });

    }

    hasActors(): boolean {
        for (let at of ActorTypes) {
            if (this.actors[at].length > 0) {
                return true;
            }
        }
        return false;
    }

    onKeyPressed(key: string): void {
        if (this.actors["keyPressed"].length == 0) return;
        let t = this.interpreter.scheduler.createThread("key pressed event thread");

        for (let actor of this.actors["keyPressed"]) {
            actor._mj$onKeyTyped$void$String(t, undefined, new StringClass(key));
        }
        t.state = ThreadState.runnable;
    }

    onKeyUp(key: string): void {
        if (this.actors["keyUp"].length == 0) return;
        let t = this.interpreter.scheduler.createThread("key up event thread");

        for (let actor of this.actors["keyUp"]) {
            actor._mj$onKeyUp$void$String(t, undefined, new StringClass(key));
        }
        t.state = ThreadState.runnable;
    }

    onKeyDown(key: string, isShift: boolean, isCtrl: boolean, isAlt: boolean): void {
        if (this.actors["keyDown"].length == 0) return;
        let t = this.interpreter.scheduler.createThread("key down event thread");

        for (let actor of this.actors["keyDown"]) {
            actor._mj$onKeyDown$void$String$boolean$boolean$boolean(t, undefined, new StringClass(key), isShift, isCtrl, isAlt);
        }
        t.state = ThreadState.runnable;

    }
}