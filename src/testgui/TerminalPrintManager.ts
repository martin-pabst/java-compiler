import { PrintManager } from "../compiler/common/interpreter/PrintManager";
import { Terminal } from 'xterm';

export class TerminalPrintManager implements PrintManager {
    terminal : Terminal;
    command: string;
    constructor() {
        this.terminal = new Terminal();
        this.command = "";
        let container = document.getElementById('output');
        if(container) {
            this.terminal.open(container);
        }
        
        
        this.terminal.onLineFeed((a,b) => {
            // console.log(a+","+b)
    });
        this.terminal.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        
            if (ev.code == "Enter") {
              //this.terminal.writeln('');
              this.terminal.clear();
            } else if (ev.code == "Backspace") {
              // Do not delete the prompt
                this.terminal.write('\b \b');
              
            } else if (printable) {
              this.command+= e.key;
              this.terminal.write(e.key);
            }
          });
        
        
    }
    print(text: string | undefined, withNewline: boolean, color: number | undefined): void {
        if(!text){
            text = "";
        }  else {
            text = "" + text;
        }

        if(withNewline){
            this.terminal.writeln(text);
        } else {
            this.terminal.write(text);
        }
    }

    clear(){
        this.terminal.clear();
    }

}