import { IRange } from "../range/Range.ts";

export type StacktraceElement = {
    range: IRange,
    methodIdentifierWithClass: string
}

export type Stacktrace = StacktraceElement[];

export interface IThrowable {
    message?: string;
    cause?: IThrowable;
    range?: IRange;
    stacktrace: Stacktrace;
}