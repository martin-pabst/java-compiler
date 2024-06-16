import { Treeview } from "../../../tools/components/treeview/Treeview";
import { JavaSymbolTable } from "../../java/codegenerator/JavaSymbolTable";
import { BaseSymbol, BaseSymbolTable } from "../BaseSymbolTable";
import { Debugger } from "./Debugger";
import { DebuggerSymbolEntry, StackElementDebuggerEntry } from "./DebuggerSymbolEntry";

export class SymbolTableSection {

    children: StackElementDebuggerEntry[] = [];

    constructor(public treeview: Treeview<DebuggerSymbolEntry>, 
        public symbolTable: BaseSymbolTable, public debugger1: Debugger) {
        
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

    attachNodesToTreeview() {
        for(let child of this.children){
            child.treeViewNode.attach();
        }
    }

}