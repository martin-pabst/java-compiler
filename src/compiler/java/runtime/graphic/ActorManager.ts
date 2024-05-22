import { Interpreter } from "../../../common/interpreter/Interpreter";
import { Thread, ThreadState } from "../../../common/interpreter/Thread";
import { ActorType, ActorTypes, IActor } from "./IWorld";

export class ActorManager {
    
    actors: {[type: string]: IActor[]} = {};
    
    constructor(){
        this.clear();
    }
    
    registerActor(actor: IActor, type: ActorType): void {
        let list = this.actors[type];
        list.push(actor);
    }
    
    callActMethods(interpreter: Interpreter, dt: number){
        if(this.actors["act"].length == 0 && this.actors["actWithTime"].length == 0 ) return;

        let t = interpreter.scheduler.createThread();
        for(let actor of this.actors["act"]){
            actor._mj$act$void$(t, undefined);
        }
        for(let actor of this.actors["actWithTime"]){
            actor._mj$act$void$double(t, undefined, dt);
        }
        t.state = ThreadState.runnable;
    }
    
    clear() {
        ActorTypes.forEach(at => this.actors[at] = []);
    }

    unregisterActor(actor: IActor){
        ActorTypes.forEach(at => {
            let actorList = this.actors[at];
            let index = actorList.indexOf(actor);
            if(index >= 0) actorList.splice(index, 1);
        });

    }

    hasActors():boolean {
        for(let at of ActorTypes){
            if(this.actors[at].length > 0){
                return true;
            }
        }
        return false;
    }
}