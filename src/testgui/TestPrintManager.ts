import { IPrintManager } from "../compiler/common/interpreter/IPrintManager";
import { DOM } from "../tools/DOM";

export class TestPrintManager implements IPrintManager {
    
    printHtmlElement(htmlElement: HTMLElement): void {
        let output = document.getElementById('output')!;
        output.append(htmlElement);
    }

    print(text: string | undefined, withNewline: boolean, color: number | undefined): void {
        if(!text){
            text = "";
        }  else {
            text = "" + text;
        }
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

    flush(): void {
        
    }

    isTestPrintManager(): boolean {
        return true;
    }


}