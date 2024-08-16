import { CompilerFile } from "../module/CompilerFile";
import { IRange } from "../range/Range";
import { Exception } from "./ExceptionInfo";
import { Thread } from "./Thread";
import { IThrowable, Stacktrace } from "./ThrowableType";

export class SystemException implements Exception, IThrowable {

    cause?: IThrowable | undefined;
    stacktrace: Stacktrace = [];
    file?: CompilerFile;
    range?: IRange;
    thread: Thread;


    constructor(public identifier: string, public message: string){

    }

    getIdentifier(): string {
        return this.identifier;
    }
    getExtendedImplementedIdentifiers(): string[] {
        return []; // You can't catch this one...
    }
    getMessage(): string {
        return this.message;
    }
    getFile(): CompilerFile | undefined {
        return this.file;
    }
    getThread(): Thread | undefined {
        return this.thread;
    }
}