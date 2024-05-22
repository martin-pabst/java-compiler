import { Thread } from "../../../common/interpreter/Thread";

export const ActorTypes = ["act", "actWithTime", "keyPressed", "keyUp", "keyDown"] as const;
export type ActorType = typeof ActorTypes[number];

export interface IActor {
    _mj$act$void$(t: Thread, callback?: () => {}): void;
    _mj$act$void$double(t: Thread, callback: (() => {}) | undefined, dt: number): void;
}

export interface IWorld {
    registerActor(actor: IActor, type: ActorType): void;
    unregisterActor(actor: IActor): void;
    hasActors(): boolean;
}