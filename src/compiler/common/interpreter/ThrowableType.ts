import { IRange } from "../range/Range.ts";

export type StacktraceElement = {
    range: { startLineNumber?: number, startColumn?: number, endLineNumber?: number, endColumn?: number },
    methodIdentifierWithClass: string
}

export type Stacktrace = StacktraceElement[];

export interface IThrowable {
    message?: string;
    cause?: IThrowable;
    range?: IRange;
    stacktrace: Stacktrace;
}