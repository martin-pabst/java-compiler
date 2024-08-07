import { CallbackParameter } from "../../../common/interpreter/CallbackParameter";
import { Thread } from "../../../common/interpreter/Thread";
import { JRC } from "../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass, StringClass } from "../system/javalang/ObjectClassStringClass";
import { IActor } from "./IActor";
import { IWorld } from "./IWorld";

// TODO: Gampad support
/**
 * Base class of all Objects which have a act-method and kan sense keyboard or gamepad
 */
export class ActorClass extends ObjectClass implements IActor {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "abstract class Actor extends Object" },

        { type: "method", signature: "Actor()", java: ActorClass.prototype._cj$_constructor_$Actor$ },
        { type: "method", signature: "void act()", java: ActorClass.prototype._mj$act$void$ , comment: JRC.actorActMethodComment },
        { type: "method", signature: "void act(double deltaTime)", java: ActorClass.prototype._mj$act$void$double , comment: JRC.actorActMethodComment2},
        { type: "method", signature: "void onKeyTyped(String key)", java: ActorClass.prototype._mj$onKeyTyped$void$String , comment: JRC.actorOnKeyTypedComment},
        { type: "method", signature: "void onKeyUp(String key)", java: ActorClass.prototype._mj$onKeyUp$void$String },
        { type: "method", signature: "void onKeyDown(String key, boolean isShift, boolean isCtrl, boolean isAlt)", java: ActorClass.prototype._mj$onKeyDown$void$String$boolean$boolean$boolean },
        { type: "method", signature: "void destroy()", java: ActorClass.prototype._mj$destroy$void$ },
        { type: "method", signature: "final boolean isKeyUp(string key)", java: ActorClass.prototype._mj$isKeyUp$boolean$string , comment: JRC.actorOnKeyUpComment},
        { type: "method", signature: "final boolean isKeyDown(string key)", java: ActorClass.prototype._mj$isKeyDown$boolean$string , comment: JRC.actorOnKeyDownComment},
        { type: "method", signature: "final World getWorld()", java: ActorClass.prototype._mj$getWorld$World , comment: JRC.getWorldComment},
        { type: "method", signature: "final boolean isActing()", native: ActorClass.prototype._isActing , comment: JRC.actorIsActingComment},
        { type: "method", signature: "final boolean isDestroyed()", native: ActorClass.prototype._isDestroyed , comment: JRC.actorIsDestroyedComment},
        { type: "method", signature: "final void stopActing()", native: ActorClass.prototype._stopActing , comment: JRC.actorStopActingComment},
        { type: "method", signature: "final void restartActing()", native: ActorClass.prototype._restartActing , comment: JRC.actorRestartActingComment},
        
    ]

    static type: NonPrimitiveType;

    isActing: boolean = true;

    isDestroyed: boolean = false;

    world!: IWorld;

    copyFrom(otherActor: ActorClass){
        this.isActing = otherActor.isActing;
        this.isDestroyed = otherActor.isDestroyed;
        this.world = otherActor.world;
    }

    constructorHelper(t: Thread){
        if(this._mj$act$void$ != ActorClass.prototype._mj$act$void$){
            this.world.registerActor(this, "act");
        }

        if(this._mj$act$void$double != ActorClass.prototype._mj$act$void$double){
            this.world.registerActor(this, "actWithTime");
        }

        if(this._mj$onKeyDown$void$String$boolean$boolean$boolean != ActorClass.prototype._mj$onKeyDown$void$String$boolean$boolean$boolean){
            this.world.registerActor(this, "keyDown");
        }

        if(this._mj$onKeyTyped$void$String != ActorClass.prototype._mj$onKeyTyped$void$String){
            this.world.registerActor(this, "keyPressed");
        }

        if(this._mj$onKeyUp$void$String != ActorClass.prototype._mj$onKeyUp$void$String){
            this.world.registerActor(this, "keyUp");
        }

        t.s.push(this);

    }

    _cj$_constructor_$Actor$(t: Thread, callback: CallbackParameter){

        this.world = t.scheduler.interpreter.objectStore["World"];
        if(!this.world){
            new t.classes["World"]()._cj$_constructor_$World$(t, () => {
                this.world = t.s.pop();
                this.constructorHelper(t);
                if(callback) callback();
            });
        } else {
            this.constructorHelper(t);
            if(callback) callback();
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
        this.destroy();
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

    _mj$getWorld$World(t: Thread, callback: CallbackParameter){
        t.s.push(t.scheduler.interpreter.objectStore["World"]);
    }

    _isDestroyed(): boolean {
        return this.isDestroyed;
    }

    _isActing(): boolean {
        return this.isActing;
    }

    _stopActing(): void {
        this.isActing = false;
    }

    _restartActing(): void {
        this.isActing = true;
    }

    destroy(){
        this.world.unregisterActor(this);
        this.isDestroyed = true;
    }
}