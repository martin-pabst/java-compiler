import { Thread } from "../../../../common/interpreter/Thread.ts";
import { StringClass } from "../../system/javalang/ObjectClassStringClass.ts";

export const GNGEventListenerTypes = ["aktionAusführen", "tasteGedrückt", "sondertasteGedrückt", 
    "mausGeklickt", "taktImpulsAusführen", "ausführen", "taste", "sondertaste", "geklickt"] as const;
export type GNGEventListenerType = typeof GNGEventListenerTypes[number];

export interface IGNGEventListener {

    _mj$Ausführen$void$(t: Thread, callback: (() => void) | undefined): void;
    _mj$AktionAusführen$void$(t: Thread, callback: (() => void) | undefined): void;
    _mj$TaktImpulsAusführen$void$(t: Thread, callback: (() => void) | undefined): void;
    _mj$TasteGedrückt$void$char(t: Thread, callback: (() => void) | undefined, key: string): void;
    _mj$Taste$void$char(t: Thread, callback: (() => void) | undefined, key: string): void;
    _mj$SondertasteGedrückt$void$int(t: Thread, callback: (() => void) | undefined, key: number): void;
    _mj$SonderTaste$void$int(t: Thread, callback: (() => void) | undefined, key: number): void;
    _mj$MausGeklickt$void$int$int$int(t: Thread, callback: (() => void) | undefined, x: number, y: number, anzahl: number): void;
    _mj$Geklickt$void$int$int$int(t: Thread, callback: (() => void) | undefined, x: number, y: number, anzahl: number): void;

}
