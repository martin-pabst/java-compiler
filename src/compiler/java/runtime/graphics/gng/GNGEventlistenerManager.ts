import { Interpreter } from "../../../../common/interpreter/Interpreter.ts";
import { KeyDownListener, KeyUpListener, KeyPressedListener } from "../../../../common/interpreter/KeyboardManager.ts";
import { Thread, ThreadState } from "../../../../common/interpreter/Thread.ts";
import { StringClass } from "../../system/javalang/ObjectClassStringClass.ts";
import { IActor } from "../IActor.ts";
import { InternalMouseListener, MouseEventKind } from "../MouseManager.ts";
import { WorldClass } from "../WorldClass.ts";
import { GNGEventListenerType, GNGEventListenerTypes, IGNGEventListener } from "./IGNGEventListener.ts";

export class GNGEventlistenerManager implements InternalMouseListener {

    listeners: Record<GNGEventListenerType, IGNGEventListener[]> = {
        "aktionAusführen": [],
        "tasteGedrückt": [],
        "sondertasteGedrückt": [],
        "mausGeklickt": [],
        "ausführen": [],
        "taste": [],
        "sondertaste": [],
        "geklickt": [],
        "taktImpulsAusführen": []
    };

    // see https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/
    keyToKeyCodeMap: { [key: string]: number } = {
        "Enter": 13,
        "ArrowLeft": 37,
        "ArrowRight": 39,
        "ArrowUp": 38,
        "ArrowDown": 40,
        "F1": 112,
        "F2": 113,
        "F3": 114,
        "F4": 115,
        "F5": 116,
        "F6": 117,
        "F7": 118,
        "F8": 119,
        "F9": 120,
        "F10": 121,
        "F11": 122,
        "F12": 123,
        "PageUp": 33,
        "PageDown": 34,
        "Insert": 155
    }

    timerRunning: boolean = false;
    taktdauer: number = 300;
    remainingTime: number = 0;


    keyDownListener: KeyDownListener = (key: string, isShift: boolean, isCtrl: boolean, isAlt: boolean) => {
        this.onKeyDown(key, isShift, isCtrl, isAlt);
    }

    keyUpListener: KeyUpListener = (key: string) => {
        this.onKeyUp(key);
    }

    keyTypedListener: KeyPressedListener = (key: string) => {
        this.onKeyPressed(key);
    }

    constructor(private interpreter: Interpreter, private world: WorldClass) {
        this.clear();
        if (interpreter.keyboardManager) {
            interpreter.keyboardManager.addKeyDownListener(this.keyDownListener);
            interpreter.keyboardManager.addKeyUpListener(this.keyUpListener);
            interpreter.keyboardManager.addKeyPressedListener(this.keyTypedListener);
        }

        world.mouseManager.internalMouseListeners.push(this);

    }

    onMouseEvent(kind: MouseEventKind, x: number, y: number): void {
        if (kind == "mouseup") {
            if (this.listeners["mausGeklickt"].length == 0) return;
            let t = this.interpreter.scheduler.createThread("GNG MausGeklickt event thread");

            for (let actor of this.listeners["mausGeklickt"]) {
                actor._mj$MausGeklickt$void$int$int$int(t, undefined, Math.round(x), Math.round(y), 1);
            }
            t.state = ThreadState.runnable;
        }
    }

    destroy() {
        if (this.interpreter.keyboardManager) {
            this.interpreter.keyboardManager.removeKeyDownListener(this.keyDownListener);
            this.interpreter.keyboardManager.removeKeyUpListener(this.keyUpListener);
            this.interpreter.keyboardManager.removeKeyPressedListener(this.keyTypedListener);
        }
    }

    registerEventlistener(eventListener: IGNGEventListener, type: GNGEventListenerType): void {
        let list = this.listeners[type];
        list.push(eventListener);
    }

    removeEventlistener(eventListener: IGNGEventListener, type: GNGEventListenerType): void {
        let list = this.listeners[type];
        let index = list.indexOf(eventListener);
        if(index >= 0) list.splice(index, 1);
    }

    runningactThread?: Thread;
    tickHappenedWhenThreadNotEmpty: boolean = false;
    aktionenAusfuehren(dt: number) {
        if (this.runningactThread && this.runningactThread.state == ThreadState.runnable) {
            this.tickHappenedWhenThreadNotEmpty = true;
            return;
        }

        this.tickHappenedWhenThreadNotEmpty = false;

        if (this.listeners["aktionAusführen"].length == 0 && this.listeners["taktImpulsAusführen"].length == 0 && this.listeners["ausführen"].length == 0) return;

        this.runningactThread = this.interpreter.scheduler.createThread("GNG AktionAusführen method-thread");
        for (let actor of this.listeners["aktionAusführen"]) {
            actor._mj$AktionAusführen$void$(this.runningactThread, undefined);
        }

        for(let actor of this.listeners["taktImpulsAusführen"]){
            actor._mj$TaktImpulsAusführen$void$(this.runningactThread, undefined);
        }

        for(let actor of this.listeners["ausführen"]){
            actor._mj$Ausführen$void$(this.runningactThread, undefined);
        }

        if (this.runningactThread.programStack.length > 0) {
            this.runningactThread.state = ThreadState.runnable;
            this.runningactThread.callbackAfterTerminated = () => {
                if (this.tickHappenedWhenThreadNotEmpty) {
                    this.aktionenAusfuehren(dt);
                }
            }
        } else {
            this.interpreter.scheduler.removeThread(this.runningactThread);
            this.runningactThread = undefined;
        }

    }

    startActMethods() {

    }

    clear() {
        this.stopTimer();
        GNGEventListenerTypes.forEach(at => this.listeners[at] = []);
    }

    unregisterListener(actor: IGNGEventListener) {
        GNGEventListenerTypes.forEach(at => {
            let actorList = this.listeners[at];
            let index = actorList.indexOf(actor);
            if (index >= 0) actorList.splice(index, 1);
        });

    }

    hasEventListeners(): boolean {
        for (let at of GNGEventListenerTypes) {
            if (this.listeners[at].length > 0) {
                return true;
            }
        }
        return false;
    }

    onKeyPressed(key: string): void {
        if (this.listeners["tasteGedrückt"].length + this.listeners["taste"].length > 0) {
            let t = this.interpreter.scheduler.createThread("GNG TasteGedrückt event thread");
    
            for (let actor of this.listeners["tasteGedrückt"]) {
                actor._mj$TasteGedrückt$void$char(t, undefined, key);
            }
            for (let actor of this.listeners["taste"]) {
                actor._mj$Taste$void$char(t, undefined, key);
            }
            t.state = ThreadState.runnable;
        }

        let keyCode = this.keyToKeyCodeMap[key];
        if (keyCode) {
            if (this.listeners["sondertasteGedrückt"].length + this.listeners["sondertaste"].length > 0){
                let t = this.interpreter.scheduler.createThread("GNG SondertasteGedrückt event thread");
    
                for (let actor of this.listeners["sondertasteGedrückt"]) {
                    actor._mj$SonderTasteGedrückt$void$int(t, undefined, keyCode);
                }
                for (let actor of this.listeners["sondertaste"]) {
                    actor._mj$SonderTaste$void$int(t, undefined, keyCode);
                }
                t.state = ThreadState.runnable;

            } 
        }
    }

    onKeyUp(key: string): void {
        // if (this.listeners["keyUp"].length == 0) return;
        // let t = this.interpreter.scheduler.createThread("key up event thread");

        // for (let actor of this.listeners["keyUp"]) {
        //     actor._mj$onKeyUp$void$String(t, undefined, new StringClass(key));
        // }
        // t.state = ThreadState.runnable;
    }

    onKeyDown(key: string, isShift: boolean, isCtrl: boolean, isAlt: boolean): void {
        // if (this.listeners["keyDown"].length == 0) return;
        // let t = this.interpreter.scheduler.createThread("key down event thread");

        // for (let actor of this.listeners["keyDown"]) {
        //     actor._mj$onKeyDown$void$String$boolean$boolean$boolean(t, undefined, new StringClass(key), isShift, isCtrl, isAlt);
        // }
        // t.state = ThreadState.runnable;

    }

    stopTimer() {
        this.timerRunning = false;
    }

    startTimer() {

        if (!this.timerRunning) {
            this.timerRunning = true;
            this.processTimerEntries();
        }

    }

    processTimerEntries() {

        if (!this.timerRunning) return;

        let dt = 10;

        this.remainingTime += dt;
        if (this.remainingTime > this.taktdauer) {
            this.remainingTime -= this.taktdauer;

            this.aktionenAusfuehren(this.taktdauer);

        }

        let that = this;
        setTimeout(() => {
            that.processTimerEntries();
        }, dt);

    }

}