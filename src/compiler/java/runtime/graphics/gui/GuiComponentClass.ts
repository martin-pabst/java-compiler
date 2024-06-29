import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { InternalKeyboardListener, KeyDownListener, KeyboardManager } from "../../../../common/interpreter/KeyboardManager.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread, ThreadState } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { StringClass } from "../../system/javalang/ObjectClassStringClass.ts";
import { FilledShapeClass } from "../FilledShapeClass.ts";
import { InternalMouseListener, MouseEventKind, MouseManager } from "../MouseManager.ts";
import { ChangeListenerInterface } from "./ChangeListenerInterface.ts";

export class GuiComponentClass extends FilledShapeClass implements InternalMouseListener, InternalKeyboardListener {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "abstract class GuiComponent extends FilledShape", comment: JRC.GUIComponentClassComment},
        
        {type: "method", signature: "GuiComponent()", java: GuiComponentClass.prototype._cj$_constructor$GuiComponent$ },

        {type: "method", signature: "void addChangeListener(ChangeListener changeListener)", comment: JRC.GUIComponentAddChangeListenerComment},
        {type: "method", signature: "final double getWidth()", template: `§1.width`,  comment: JRC.GUIComponentGetWidthComment},
        {type: "method", signature: "final double getHeight()", template: `§1.height`, comment: JRC.GUIComponentGetHeightComment},
        
        // listener
        {type: "method", signature: "void onChange(String newValue)", java: GuiComponentClass.prototype._mj$onChange$void$String, comment: JRC.GUIComponentOnChangeComment},
    ];

    static type: NonPrimitiveType;

    width: number = 0;
    height: number = 0;

    registerAsMouseListener!: boolean;
    registerAsKeyboardListener!: boolean;

    mouseManager: MouseManager | undefined;
    keyboardManager: KeyboardManager | undefined;

    changeListeners: ChangeListenerInterface[] = [];

    _cj$_constructor$GuiComponent$(t: Thread, callback: CallbackFunction, registerAsMouseListener: boolean, registerAsKeyboardListener: boolean){
        this.registerAsMouseListener = registerAsMouseListener;
        this.registerAsKeyboardListener = registerAsKeyboardListener;
        this.registerAsListener(t);

        this.centerXInitial = 0;
        this.centerYInitial = 0;

        this._cj$_constructor_$FilledShape$(t, callback);

    }

    _mj$onChange$void$String(t: Thread, callback: CallbackFunction, newValue: StringClass){
        // dummy
    }

    onMouseEvent(kind: MouseEventKind, x: number, y: number): void {
        throw new Error("Method not implemented.");
    }

    onKeyDown(key: string, isShift: boolean, isCtrl: boolean, isAlt: boolean): void {
        throw new Error("Method not implemented.");
    }
    looseKeyboardFocus(): void {
        throw new Error("Method not implemented.");
    }

    registerAsListener(t: Thread | undefined){
        if (this.registerAsMouseListener){
            this.mouseManager = this.world.mouseManager;
            this.mouseManager?.internalMouseListeners.push(this);
        }

        if(this.registerAsKeyboardListener){
            this.keyboardManager = this.keyboardManager || t?.scheduler.interpreter.keyboardManager;
            this.keyboardManager?.addInternalKeyboardListener(this);
        }
    }

    unregisterAsListener() {
        if(this.mouseManager){
            let index = this.mouseManager.internalMouseListeners.indexOf(this);
            if(index >= 0) this.mouseManager.internalMouseListeners.splice(index, 1);
        }

        if(this.keyboardManager){
            this.keyboardManager.removeInternalKeyboardListener(this);
        }
    }

    destroy(): void {
        this.unregisterAsListener();
        super.destroy();
    }

    setVisible(visible: boolean) {
        super._setVisible(visible);
        if (visible) {
            this.registerAsListener(undefined);
        } else {
            this.unregisterAsListener();
        }
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    addChangeListener(listener: ChangeListenerInterface) {
        this.changeListeners.push(listener);
    }

    callOnChange(t: Thread, newValue: string){
        if(this._mj$onChange$void$String != GuiComponentClass.prototype._mj$onChange$void$String || this.changeListeners.length > 0){
            let thread = t.scheduler.createThread("onChange-method thread");

            if(this._mj$onChange$void$String != GuiComponentClass.prototype._mj$onChange$void$String){
                this._mj$onChange$void$String(thread, undefined, new StringClass(newValue));
            }

            for(let cl of this.changeListeners){
                cl._mj$onChange$void$Object$String(thread, undefined, this, new StringClass(newValue));
            }

            thread.state = ThreadState.runnable;
        }
    }


}