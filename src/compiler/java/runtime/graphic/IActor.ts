import { Thread } from "../../../common/interpreter/Thread";
import { StringClass } from "../system/javalang/ObjectClassStringClass";

export const ActorTypes = ["act", "actWithTime", "keyPressed", "keyUp", "keyDown"] as const;
export type ActorType = typeof ActorTypes[number];

export interface IActor {
    isActing: boolean;
    _mj$act$void$(t: Thread, callback?: () => {}): void;
    _mj$act$void$double(t: Thread, callback: (() => {}) | undefined, dt: number): void;
    _mj$onKeyTyped$void$String(t: Thread, callback: (() => {}) | undefined, key: StringClass): void;
    _mj$onKeyUp$void$String(t: Thread, callback: (() => {}) | undefined, key: StringClass): void;
    _mj$onKeyDown$void$String$boolean$boolean$boolean(t: Thread, callback: (() => {}) | undefined, 
        key: StringClass, isShift: boolean, isCtrl: boolean, isAlt: boolean): void;
}
