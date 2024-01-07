import { ObjectClass } from "../../java/runtime/system/javalang/ObjectClassStringClass";

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
}
