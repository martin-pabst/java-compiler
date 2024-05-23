import { CallbackParameter } from "../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass, StringClass } from "../system/javalang/ObjectClassStringClass";
import { IActor } from "./IActor";
import { IWorld } from "./IWorld";

export class ActorClass extends ObjectClass implements IActor {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "abstract class Actor" },

        { type: "method", signature: "Actor()", java: ActorClass.prototype._cj$_constructor_$Actor$ },
        { type: "method", signature: "void act()", java: ActorClass.prototype._mj$act$void$ },
        { type: "method", signature: "void act(double deltaTime)", java: ActorClass.prototype._mj$act$void$double },
        { type: "method", signature: "void onKeyTyped(String key)", java: ActorClass.prototype._mj$onKeyTyped$void$String },
        { type: "method", signature: "void onKeyUp(String key)", java: ActorClass.prototype._mj$onKeyUp$void$String },
        { type: "method", signature: "void onKeyDown(String key, isShift: boolean, isCtrl: boolean, isAlt: boolean)", java: ActorClass.prototype._mj$onKeyDown$void$String$boolean$boolean$boolean },
        { type: "method", signature: "void destroy()", java: ActorClass.prototype._mj$destroy$void$ },
        { type: "method", signature: "final boolean isKeyUp(string key)", java: ActorClass.prototype._mj$isKeyUp$boolean$string },
        { type: "method", signature: "final boolean isKeyDown(string key)", java: ActorClass.prototype._mj$isKeyDown$boolean$string },
        
    ]

    static type: NonPrimitiveType;

    _cj$_constructor_$Actor$(t: Thread){

        let world: IWorld = t.scheduler.interpreter.objectStore["World"];
        if(!world){
            world = new t.classes["World"]()._cj$_constructor_$World$(t);
        }

        if(this._mj$act$void$ != ActorClass.prototype._mj$act$void$){
            world.registerActor(this, "act");
        }

        if(this._mj$act$void$double != ActorClass.prototype._mj$act$void$double){
            world.registerActor(this, "actWithTime");
        }

        if(this._mj$onKeyDown$void$String$boolean$boolean$boolean != ActorClass.prototype._mj$onKeyDown$void$String$boolean$boolean$boolean){
            world.registerActor(this, "keyDown");
        }

        if(this._mj$onKeyTyped$void$String != ActorClass.prototype._mj$onKeyTyped$void$String){
            world.registerActor(this, "keyPressed");
        }

        if(this._mj$onKeyUp$void$String != ActorClass.prototype._mj$onKeyUp$void$String){
            world.registerActor(this, "keyUp");
        }


    }

    _mj$act$void$(t: Thread, callback: () => {}): void{

    }

    _mj$act$void$double(t: Thread, callback: () => {}, dt: number): void{

    }
    
    _mj$onKeyTyped$void$String(t: Thread, callback: CallbackParameter, key: StringClass): void {

    }

    _mj$onKeyUp$void$String(t: Thread, callback: CallbackParameter, key: StringClass): void {

    }

    _mj$onKeyDown$void$String$boolean$boolean$boolean(t: Thread, callback: CallbackParameter, 
        key: StringClass, isShift: boolean, isCtrl: boolean, isAlt: boolean): void {

    }

    _mj$destroy$void$(t: Thread){
        let world: IWorld = t.scheduler.interpreter.objectStore["World"];
        if(world){
            world.unregisterActor(this);
        }
    }
    
    _mj$isKeyUp$boolean$string(t: Thread, callback: CallbackParameter, key: string){
        let keyboardManager = t.scheduler.interpreter.keyboardManager;
        if(!keyboardManager){
            t.s.push(true);
            return;
        }
        t.s.push(!keyboardManager.isPressed(key));
    }

    _mj$isKeyDown$boolean$string(t: Thread, callback: CallbackParameter, key: string){
        let keyboardManager = t.scheduler.interpreter.keyboardManager;
        if(!keyboardManager){
            t.s.push(false);
            return;
        }
        t.s.push(keyboardManager.isPressed(key));
    }

    destroy(world: IWorld){
        world.unregisterActor(this);
    }
}