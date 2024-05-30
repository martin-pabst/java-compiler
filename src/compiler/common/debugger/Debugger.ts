import { Treeview } from "../../../tools/components/treeview/Treeview";
import { TreeviewAccordion } from "../../../tools/components/treeview/TreeviewAccordion";
import { BaseSymbolTable } from "../BaseSymbolTable";
import { Scheduler } from "../interpreter/Scheduler";
import { ProgramState, Thread } from "../interpreter/Thread";
import { DebuggerCallstackEntry } from "./DebuggerCallstackEntry";
import { DebuggerSymbolEntry } from "./DebuggerSymbolEntry";
import { SymbolTableSection } from "./SymbolTableSection";

export class Debugger {

    treeviewAccordion: TreeviewAccordion;

    currentlyVisibleSymbolTableSections: SymbolTableSection[] = [];
    showVariablesTreeview!: Treeview<DebuggerSymbolEntry>;
    
    callstackTreeview!: Treeview<DebuggerCallstackEntry>;

    threadsTreeview!: Treeview<Thread>;

    maxCallstackEntries: number = 15;

    constructor(debuggerDiv: HTMLDivElement){

        this.treeviewAccordion = new TreeviewAccordion(debuggerDiv);
        this.initShowVariablesTreeview();
        this.initCallstackTreeview();
        this.initThreadsTreeview();
    }
    
    initThreadsTreeview(){
        this.threadsTreeview = new Treeview(this.treeviewAccordion, {
            captionLine: {
                enabled: true,
                text: "threads"
            },
            flexWeight: "1",
            withDeleteButtons: false,
            withDragAndDrop: false
        });

    }

    initCallstackTreeview(){
        this.callstackTreeview = new Treeview(this.treeviewAccordion, {
            captionLine: {
                enabled: true,
                text: "call stack"
            },
            flexWeight: "1",
            withDeleteButtons: false,
            withDragAndDrop: false
        });

    }

    initShowVariablesTreeview(){
        this.showVariablesTreeview = new Treeview(this.treeviewAccordion, {
            captionLine: {
                enabled: true,
                text: "variables"
            },
            flexWeight: "3",
            withDeleteButtons: false,
            withDragAndDrop: false
        });

    }

    showThreads(scheduler: Scheduler){
        let currentThread = scheduler.getCurrentThread();
        this.threadsTreeview.clear();
        for(let thread of scheduler.runningThreads){
            let caption = thread.name;
            let node = this.threadsTreeview.addNode(false, caption,
                undefined, thread, thread, undefined, true
            )
            if(thread == currentThread) node.setSelected(true);
            node.onClickHandler = (t) => {
                this.showCallstack(t);
                this.showVariables(t);
            }
        }
    }

    showThreadState(thread: Thread | undefined){

        if(!thread || thread.programStack.length == 0){
            return;
        }

        this.showVariables(thread);
        this.showCallstack(thread);
        this.showThreads(thread.scheduler);
    }

    showCallstack(thread: Thread){
        this.callstackTreeview.clear();
        let programStack = thread.programStack;
        let count = Math.min(programStack.length, this.maxCallstackEntries);
        for(let i = programStack.length - 1; i >= programStack.length - count; i--){
            let programState = programStack[i];
            let entry = new DebuggerCallstackEntry(programState);
            let node = this.callstackTreeview.addNode(false, entry.getCaption(), undefined,
                entry, entry, undefined, true);
            node.onClickHandler = (entry) => {
                this.showVariables(thread, entry.programState);
            }
            if(i == programStack.length - 1){
                node.setSelected(true);
            }
        }

        if(count < programStack.length){
            //@ts-ignore
            this.callstackTreeview.addNode(false, `${programStack.length - count} weitere ...`, undefined, "x", undefined, undefined, true);
        }
    }

    showVariables(thread: Thread, programState?: ProgramState){
        if(!programState){
            programState = thread.programStack[thread.programStack.length - 1];
        }

        if(!programState) return;
        
        let callstackEntry = new DebuggerCallstackEntry(programState);
                
        if(!callstackEntry.symbolTable) return;

        let symbolTablesToShow: BaseSymbolTable[] = [];
        let st1: BaseSymbolTable | undefined = callstackEntry.symbolTable;
        while(st1){
            if(!st1.hiddenWhenDebugging){
                symbolTablesToShow.unshift(st1);
            }
            st1 = st1.parent;
        }

        let remainingSymbolTableSections: SymbolTableSection[] = [];

        this.showVariablesTreeview.detachAllNodes();
        let firstNonFittingFound = false;
        for(let i = 0; i < this.currentlyVisibleSymbolTableSections.length; i++){
            let sts = this.currentlyVisibleSymbolTableSections[i];
            if(i > symbolTablesToShow.length || sts.symbolTable != symbolTablesToShow[i] || firstNonFittingFound){
                firstNonFittingFound = true;
            } else {
                remainingSymbolTableSections.push(sts);
                sts.attachNodesToTreeview();
            }
        }

        while(remainingSymbolTableSections.length < symbolTablesToShow.length){
            let index = remainingSymbolTableSections.length;
            remainingSymbolTableSections.push(new SymbolTableSection(this.showVariablesTreeview, symbolTablesToShow[index]));
        }
        
        this.currentlyVisibleSymbolTableSections = remainingSymbolTableSections;


        for(let sts of this.currentlyVisibleSymbolTableSections){
            sts.attachNodesToTreeview();
            sts.renewValues(thread.s, programState.stackBase);
        }

    }




}