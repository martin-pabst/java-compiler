import { Thread } from "../../../common/interpreter/Thread";
import { ActorType, IActor } from "./IActor";


export interface IWorld {
    registerActor(actor: IActor, type: ActorType): void;
    unregisterActor(actor: IActor): void;
    hasActors(): boolean;
}