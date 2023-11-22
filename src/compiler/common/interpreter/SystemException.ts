import { Exception } from "./ExceptionInfo";
import { IThrowable, Stacktrace } from "./ThrowableType";

export class SystemException implements Exception, IThrowable {

    constructor(public identifier: string, public message: string){

    }
    cause?: IThrowable | undefined;
    stacktrace: Stacktrace = [];

    getIdentifier(): string {
        return this.identifier;
    }
    getExtendedImplementedIdentifiers(): string[] {
        return []; // You can't catch this one...
    }
    getMessage(): string {
        return this.message;
    }

}