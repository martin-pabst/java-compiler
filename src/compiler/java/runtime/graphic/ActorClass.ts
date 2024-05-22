import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass";
import { IActor, IWorld } from "./IWorld";

export class ActorClass extends ObjectClass implements IActor {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Actor" },

        { type: "method", signature: "Actor()", java: ActorClass.prototype._cj$_constructor_$Actor$ },
        { type: "method", signature: "void act()", java: ActorClass.prototype._mj$act$void$ },
        { type: "method", signature: "void act(double deltaTime)", java: ActorClass.prototype._mj$act$void$double },
        { type: "method", signature: "void destroy()", java: ActorClass.prototype._mj$destroy$void$ },
  
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


    }

    _mj$act$void$(t: Thread, callback: () => {}): void{

    }

    _mj$act$void$double(t: Thread, callback: () => {}, dt: number): void{

    }

    _mj$destroy$void$(t: Thread){
        let world: IWorld = t.scheduler.interpreter.objectStore["World"];
        if(world){
            world.unregisterActor(this);
        }
    }
    
    destroy(world: IWorld){
        world.unregisterActor(this);
    }
}