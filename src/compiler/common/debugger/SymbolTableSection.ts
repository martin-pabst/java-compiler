import { Treeview } from "../../../tools/components/treeview/Treeview";
import { JavaSymbolTable } from "../../java/codegenerator/JavaSymbolTable";
import { BaseSymbol, BaseSymbolTable } from "../BaseSymbolTable";
import { Debugger } from "./Debugger";
import { DebuggerEntry, StackElementDebuggerEntry } from "./DebuggerEntry";

export class SymbolTableSection {

    treeview: Treeview<DebuggerEntry>;
    children: StackElementDebuggerEntry[] = [];

    constructor(divToRenderInto: HTMLDivElement, 
        public symbolTable: BaseSymbolTable) {
        
        this.treeview = new Treeview(divToRenderInto, {
            minHeight: 0,
            captionLine: {
                enabled: false
            },
            flexWeight: "0"
        });
        // divToRenderInto.prepend(this.treeview.outerDiv);

        let symbols = symbolTable.getSymbolsForDebugger();
        for (let symbol of symbols) {
            if(symbol.hiddenWhenDebugging) continue;
            this.children.push(new StackElementDebuggerEntry(
                this, symbol
            ));
        }
    }

    renewValues(stack: any[], stackBase: number) {

        this.children.forEach(c => c.fetchValueFromStackAndRender(stack, stackBase));

    }

    hide(){
        this.treeview.outerDiv.style.display = "none";
    }

    show(){
        this.treeview.outerDiv.style.display = "flex";
    }

}