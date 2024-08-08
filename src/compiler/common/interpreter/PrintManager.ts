import { Exception } from "./ExceptionInfo";

export interface IPrintManager {
    print(text: string | undefined, withNewline: boolean, color: number | undefined): void;
    
    flush(): void;

    clear(): void;
}

export class DummyPrintManager implements IPrintManager {
    print(text: string | undefined, withNewline: boolean, color: number | undefined): void {
    }

    flush(): void {
        
    }

    clear(): void {
    }

}