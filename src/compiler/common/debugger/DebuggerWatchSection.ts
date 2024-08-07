import { Treeview } from "../../../tools/components/treeview/Treeview.ts";
import { TreeviewNode } from "../../../tools/components/treeview/TreeviewNode.ts";
import { JavaRepl } from "../../java/parser/repl/JavaRepl.ts";
import { IMain } from "../IMain.ts";
import { Interpreter } from "../interpreter/Interpreter.ts";
import { Debugger } from "./Debugger.ts";
import { DebuggerWatchEntry } from "./DebuggerWatchEntry.ts";
import { ValueRenderer } from "./ValueRenderer.ts";

export class DebuggerWatchSection {

    private lastRepl?: JavaRepl;

    constructor(private treeview: Treeview<DebuggerWatchEntry>, private debugger_: Debugger){

        treeview.newNodeCallback = (text: string, node: TreeviewNode<DebuggerWatchEntry>): DebuggerWatchEntry => {
            let dwe = new DebuggerWatchEntry(text);
            node.renderCaptionAsHtml = true;
            if(this.lastRepl) this.updateNode(node, dwe, this.lastRepl);
            return dwe;
        }

        treeview.deleteCallback = (debuggerWatchEntry: DebuggerWatchEntry | null): void => {

        }

    }

    update(interpreter: Interpreter){
        let repl: JavaRepl | undefined = this.debugger_.main.getRepl();
        if(!repl){
            repl = this.lastRepl;
        } 
        if(!repl) return;
        this.lastRepl = repl;

        for(let node of this.treeview.nodes){
            let we = node.externalObject;
            if(!we) continue;
            this.updateNode(node, we, repl);
        }
    }

    private updateNode(node: TreeviewNode<DebuggerWatchEntry>, debuggerWatchEntry: DebuggerWatchEntry, repl: JavaRepl){

        let valueAsString: string = "---"
        let value = repl.executeSynchronously(debuggerWatchEntry.term);
        if(value && value != '---'){
            valueAsString = ValueRenderer.renderValue(value, 20);
        }

        monaco.editor.colorize(debuggerWatchEntry.term + " = " + valueAsString, 'myJava', { tabSize: 3 }).then((formattedValue) => {
            node.caption = formattedValue;
        })


    }
    
}