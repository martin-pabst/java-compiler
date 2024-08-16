import { CompilerFile } from "../module/CompilerFile.ts";
import { IRange } from "../range/Range.ts";
import { Thread } from "./Thread.ts";

export type StacktraceElement = {
    range: IRange | undefined,
    methodIdentifierWithClass: string,
    file: CompilerFile
}

export type Stacktrace = StacktraceElement[];

export interface IThrowable {
    message?: string;
    cause?: IThrowable;
    file?: CompilerFile;
    range?: IRange;
    stacktrace: Stacktrace;
    thread: Thread;
}