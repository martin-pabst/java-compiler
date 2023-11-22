export type CatchBlockInfo = {
    exceptionTypes: Record<string, boolean>,
    catchBlockBeginsWithStepIndex: number
}

export type ExceptionInfo = {
    catchBlockInfos: CatchBlockInfo[],
    stackSize: number,          // stack size when entering try {...} block
    finallyBlockIndex?: number
}

export interface Exception {
    getIdentifier(): string;
    getExtendedImplementedIdentifiers(): string[];
    getMessage(): string;
}
