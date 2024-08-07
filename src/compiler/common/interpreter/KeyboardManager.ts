import { IMain } from "../IMain";
import { SchedulerState } from "./Scheduler";


export type KeyPressedListener = (key: string) => void;
export type KeyUpListener = (key: string) => void;
export type KeyDownListener = (key: string, isShift: boolean, isCtrl: boolean, isAlt: boolean) => void;

export interface InternalKeyboardListener {
    onKeyDown(key: string, isShift: boolean, isCtrl: boolean, isAlt: boolean): void;
    looseKeyboardFocus(): void;
}

/**
 * Replaces old KeyboardTool
 */
export class KeyboardManager {

    private pressedKeys: { [key: string]: boolean } = {};

    private keyPressedCallbacks: KeyPressedListener[] = [];
    private keyUpCallbacks: KeyUpListener[] = [];
    private keyDownCallbacks: KeyDownListener[] = [];

    public internalKeyboardListeners: InternalKeyboardListener[] = [];

    constructor(private element: JQuery<any>, private main: IMain) {
        this.registerListeners(element);
    }

    destroy() {
        this.element.off("keydown");
        this.element.off("keyup");
        this.element.off("keypressed");
    }

    private registerListeners(element: JQuery<any>) {
        this.element = element;
        let that = this;
        element.on("keydown", (e) => {
            let key = e.key;
            if (key == null) return true;
            // if(e.shiftKey) key = "shift+" + key;
            // if(e.ctrlKey) key = "ctrl+" + key;
            // if(e.altKey) key = "alt+" + key;
            that.pressedKeys[key.toLowerCase()] = true;

            for (let kpc of that.keyDownCallbacks) {
                kpc(key, e.shiftKey, e.ctrlKey, e.altKey);
            }

            // prevent <html>-Element from scrolling in embedded mode
            if (this.main.isEmbedded() && this.main.getInterpreter().scheduler.state == SchedulerState.running && !this.main.getMainEditor().hasTextFocus()) {
                if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) >= 0)
                    e.preventDefault();
            }

            return true;
        });

        element.on("keyup", (e) => {
            let key = e.key;
            if (key == null) return true;
            if (typeof key == "undefined") return;

            // if(e.shiftKey) key = "shift+" + key;
            // if(e.ctrlKey) key = "ctrl+" + key;
            // if(e.altKey) key = "alt+" + key;
            that.pressedKeys[key.toLowerCase()] = false;

            for (let kpc of that.keyUpCallbacks) {
                kpc(key);
            }

            // in ActionManager.init there is a 
            // if(that.main.isEmbedded && key == " "){
            //     for(let kpc of that.keyPressedCallbacks){
            //         kpc(key);
            //     }    
            // }

            return true;
        });
        element.on("keyup", (e) => {
            let k = e.key;
            if (e.shiftKey && k.length > 1) {
                k = "[shift]+" + k;
            }
            if (e.ctrlKey && k.length > 1) {
                k = "[ctrl]+" + k;
            }
            if (e.altKey && k.length > 1) {
                k = "[alt]+" + k;
            }
            for (let kpc of that.keyPressedCallbacks) {
                kpc(k);
            }
            return true;
        });

        element.on("keydown", (e) => {
            let k = e.key;
            for (let kpc of that.internalKeyboardListeners) {
                kpc.onKeyDown(k, e.shiftKey, e.ctrlKey, e.altKey);
            }
            return true;
        });

    }

    isPressed(key: string) {
        if (key == null) return null;
        return this.pressedKeys[key.toLowerCase()] == true;
    }

    unsubscribeAllListeners() {
        this.keyPressedCallbacks = [];
        this.keyDownCallbacks = [];
        this.keyUpCallbacks = [];
        this.internalKeyboardListeners = [];
    }

    addKeyPressedListener(listener: KeyPressedListener) {
        this.keyPressedCallbacks.push(listener);
    }

    addKeyUpListener(listener: KeyUpListener) {
        this.keyUpCallbacks.push(listener);
    }

    addKeyDownListener(listener: KeyDownListener) {
        this.keyDownCallbacks.push(listener);
    }

    addInternalKeyboardListener(listener: InternalKeyboardListener){
        this.internalKeyboardListeners.push(listener);
    }

    removeInternalKeyboardListener(listener: InternalKeyboardListener){
        let  index = this.internalKeyboardListeners.indexOf(listener);
        if(index >= 0) this.internalKeyboardListeners.splice(index, 1);
    }

    removeKeyPressedListener(listener: KeyPressedListener){
        this.keyPressedCallbacks.splice(this.keyPressedCallbacks.indexOf(listener), 1);
    }

    removeKeyUpListener(listener: KeyUpListener){
        this.keyUpCallbacks.splice(this.keyUpCallbacks.indexOf(listener), 1);
    }

    removeKeyDownListener(listener: KeyDownListener){
        this.keyDownCallbacks.splice(this.keyDownCallbacks.indexOf(listener), 1);
    }

}