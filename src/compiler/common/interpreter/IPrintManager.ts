import { Exception } from "./ExceptionInfo";

export interface IPrintManager {
    print(text: string | undefined, withNewline: boolean, color: number | undefined): void;
    
    flush(): void;

    clear(): void;

    printHtmlElement(htmlElement: HTMLElement): void;
}

export class DummyPrintManager implements IPrintManager {
    
    printHtmlElement(htmlElement: HTMLElement): void {
        throw new Error("Method not implemented.");
    }

    print(text: string | undefined, withNewline: boolean, color: number | undefined): void {
    }

    flush(): void {
        
    }

    clear(): void {
    }

}