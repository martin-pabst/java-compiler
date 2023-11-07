import { IRange } from "../range/Range.ts";

export type StacktraceElement = {
    range: IRange,
    class: string,
    method: string
}

export type Stacktrace = StacktraceElement[];

export interface IThrowable {
    message?: string;
    cause?: IThrowable;
    stacktrace: Stacktrace;
}