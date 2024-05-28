import { Exception } from "./ExceptionInfo";

export interface PrintManager {
    print(text: string | undefined, withNewline: boolean, color: number | undefined): void;
    clear(): void;
}

export class DummyPrintManager implements PrintManager {
    print(text: string | undefined, withNewline: boolean, color: number | undefined): void {
    }
    clear(): void {
    }

}