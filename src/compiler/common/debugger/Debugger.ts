import { Treeview } from "../../../tools/components/treeview/Treeview";
import { TreeviewAccordion } from "../../../tools/components/treeview/TreeviewAccordion";
import { DebM } from "./DebuggerMessages";
import { BaseSymbolTable } from "../BaseSymbolTable";
import { IMain } from "../IMain.ts";
import { Scheduler } from "../interpreter/Scheduler";
import { ProgramState, Thread, ThreadState } from "../interpreter/Thread";
import { ProgramPointerPositionInfo } from "../monacoproviders/ProgramPointerManager";
import { DebuggerCallstackEntry } from "./DebuggerCallstackEntry";
import { DebuggerSymbolEntry } from "./DebuggerSymbolEntry";
import { DebuggerWatchEntry } from "./DebuggerWatchEntry.ts";
import { DebuggerWatchSection } from "./DebuggerWatchSection.ts";
import { SymbolTableSection } from "./SymbolTableSection";
import '/include/css/debugger.css';

export class Debugger {

    treeviewAccordion: TreeviewAccordion;

    currentlyVisibleSymbolTableSections: SymbolTableSection[] = [];
    showVariablesTreeview!: Treeview<DebuggerSymbolEntry>;
    
    callstackTreeview!: Treeview<DebuggerCallstackEntry>;

    threadsTreeview!: Treeview<Thread>;

    watchTreeview!: Treeview<DebuggerWatchEntry>;

    maxCallstackEntries: number = 15;

    lastThread?: Thread;

    watchSection: DebuggerWatchSection;

    constructor(private debuggerDiv: HTMLDivElement, public main: IMain){

        this.treeviewAccordion = new TreeviewAccordion(debuggerDiv);
        this.initShowVariablesTreeview();
        this.initWatchTreeview();
        this.initCallstackTreeview();
        this.initThreadsTreeview();

        this.watchSection = new DebuggerWatchSection(this.watchTreeview, this);
    }

    hide(){
        this.debuggerDiv.style.display = "none";
    }
    
    show(){
        this.debuggerDiv.style.display = "";
    }
    
    initWatchTreeview(){
        this.watchTreeview = new Treeview(this.treeviewAccordion, {
            captionLine: {
                enabled: true,
                text: DebM.watch()
            },
            flexWeight: "1",
            withDeleteButtons: true,
            withDragAndDrop: false,
            buttonAddFolders: false
        });


    }

    initThreadsTreeview(){
        this.threadsTreeview = new Treeview(this.treeviewAccordion, {
            captionLine: {
                enabled: true,
                text: DebM.threads()
            },
            flexWeight: "1",
            withDeleteButtons: false,
            withDragAndDrop: false,
            buttonAddFolders: false,
            buttonAddElements: false
        });

    }

    initCallstackTreeview(){
        this.callstackTreeview = new Treeview(this.treeviewAccordion, {
            captionLine: {
                enabled: true,
                text: DebM.callStack()
            },
            flexWeight: "1",
            withDeleteButtons: false,
            withDragAndDrop: false,
            buttonAddFolders: false,
            buttonAddElements: false
        });

    }

    initShowVariablesTreeview(){
        this.showVariablesTreeview = new Treeview(this.treeviewAccordion, {
            captionLine: {
                enabled: true,
                text: DebM.variables()
            },
            flexWeight: "3",
            withDeleteButtons: false,
            withDragAndDrop: false,
            buttonAddFolders: false,
            buttonAddElements: false
        });

    }

    showThreads(scheduler: Scheduler){
        let currentThread = scheduler.getCurrentThread();
        this.threadsTreeview.clear();

        let threadList = scheduler.runningThreads;
        if(threadList.length == 0 && this.lastThread){
            threadList = [this.lastThread];
        }

        for(let thread of threadList){
            let caption = thread.name;
            let icon = "img_thread-" + ThreadState[thread.state];
            let node = this.threadsTreeview.addNode(false, caption,
                icon, thread, thread, undefined, true
            )
            if(thread == currentThread) node.setSelected(true);
            node.onClickHandler = (t) => {
                this.showCallstack(t);
                this.showVariables(t);
            }
        }
    }

    showCurrentThreadState(){
        this.showThreadState(this.main.getInterpreter().scheduler.getCurrentThread());
    }

    showThreadState(thread: Thread | undefined){

        if(!thread){
            if(this.lastThread) thread = this.lastThread;
        }

        this.lastThread = thread;

        if(!thread) return;

        this.showVariables(thread);
        this.showCallstack(thread);
        this.showThreads(thread.scheduler);
        this.watchSection.update(thread.scheduler.interpreter)
    }

    showCallstack(thread: Thread){
        this.callstackTreeview.clear();
        let programStack = thread.programStack;
        if(programStack.length == 0) return;

        let count = Math.min(programStack.length, this.maxCallstackEntries);
        for(let i = programStack.length - 1; i >= programStack.length - count; i--){
            let programState = programStack[i];
            let entry = new DebuggerCallstackEntry(programState);
            let node = this.callstackTreeview.addNode(false, entry.getCaption(), undefined,
                entry, entry, undefined, true);
            node.onClickHandler = (entry) => {
                this.showVariables(thread, entry.programState);
                this.showProgramPosition(thread, entry);
            }
            if(i == programStack.length - 1){
                node.setSelected(true);
            }
        }

        if(count < programStack.length){
            //@ts-ignore
            this.callstackTreeview.addNode(false, `${programStack.length - count} ${DebM.more()}`, undefined, "x", undefined, undefined, true);
        }
    }

    showProgramPosition(thread: Thread, entry: DebuggerCallstackEntry) {
        if(!entry.range) return;

        let position: ProgramPointerPositionInfo = {
            programOrmoduleOrMonacoModel: entry.program,
            range: entry.range            
        }
        
        thread.scheduler.interpreter.programPointerManager?.show(position, {
            key: "callstackEntry",
            isWholeLine: true,
            className: "jo_revealCallstackEntry",
            minimapColor: "#3067ce",
            rulerColor: "#3067ce",
            beforeContentClassName: "jo_revealCallstackEntryBefore"
        })
    }

    showVariables(thread: Thread, programState?: ProgramState){
        if(!programState){
            if(thread.programStack.length > 0) programState = thread.programStack[thread.programStack.length - 1];
        }

        if(!programState){
            this.showVariablesTreeview.clear();
            this.currentlyVisibleSymbolTableSections = [];
            return;
        } 
        
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
            }
        }

        while(remainingSymbolTableSections.length < symbolTablesToShow.length){
            let index = remainingSymbolTableSections.length;
            remainingSymbolTableSections.push(new SymbolTableSection(this.showVariablesTreeview, symbolTablesToShow[index], this));
        }
        
        this.currentlyVisibleSymbolTableSections = remainingSymbolTableSections;


        for(let sts of this.currentlyVisibleSymbolTableSections){
            sts.attachNodesToTreeview();
            sts.renewValues(thread.s, programState.stackBase);
        }

    }




}