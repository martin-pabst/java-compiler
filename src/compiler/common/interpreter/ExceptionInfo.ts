import { ObjectClass } from "../../java/runtime/system/javalang/ObjectClassStringClass";
import { CompilerFile } from "../module/CompilerFile";
import { Thread } from "./Thread";

export type CatchBlockInfo = {
    exceptionTypes: Record<string, boolean>,
    catchBlockBeginsWithStepIndex: number
}

export type ExceptionInfo = {
    catchBlockInfos: CatchBlockInfo[],
    stackSize: number,          // stack size when entering try {...} block
    finallyBlockIndex?: number,
    aquiredObjectLocks?: ObjectClass[]
}

export interface Exception {
    getIdentifier(): string;
    getExtendedImplementedIdentifiers(): string[];
    getMessage(): string;
    getThread(): Thread;  // Thread
    getFile(): CompilerFile;    // CompilerFile
}
