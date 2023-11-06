import { PrintManager } from "../compiler/common/interpreter/PrintManager";
import { DOM } from "../tools/DOM";

export class TestPrintManager implements PrintManager {
    print(text: string | undefined, withNewline: boolean, color: number | undefined): void {
        if(!text) return;
        let output = document.getElementById('output')!;

        if(withNewline){
            DOM.makeDiv(output, 'output').textContent = text;
        } else {
            DOM.makeSpan(output, 'output').textContent = text;
        }
    }

    clear(){
        let output = document.getElementById('output')!;
        DOM.clear(output);
    }

}