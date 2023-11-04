import { PrintManager } from "../compiler/common/interpreter/PrintManager";

export class TestPrintManager implements PrintManager {
    print(text: string | undefined, withNewline: boolean, color: number | undefined): void {
        console.log(text);
    }

}