import { Error } from "../../../common/Error.ts";
import { Executable } from "../../../common/Executable.ts";
import { DebuggerCallstackEntry } from "../../../common/debugger/DebuggerCallstackEntry.ts";
import { Interpreter } from "../../../common/interpreter/Interpreter.ts";
import { Program } from "../../../common/interpreter/Program.ts";
import { SchedulerState } from "../../../common/interpreter/Scheduler.ts";
import { Thread } from "../../../common/interpreter/Thread.ts";
import { File } from "../../../common/module/File.ts";
import { EmptyRange } from "../../../common/range/Range.ts";
import { ExceptionTree } from "../../codegenerator/ExceptionTree.ts";
import { JavaSymbolTable } from "../../codegenerator/JavaSymbolTable.ts";
import { JavaCompiledModule } from "../../module/JavaCompiledModule.ts";
import { JavaModuleManager } from "../../module/JavaModuleManager.ts";
import { JavaLibraryModuleManager } from "../../module/libraries/JavaLibraryModuleManager.ts";
import { ReplCompiledModule } from "./ReplCompiledModule.ts";
import { ReplCompiler } from "./ReplCompiler.ts";


export class Repl {

    /**
     * If REPL-Statements are executed outside a paused program context
     * then use this symbol table an this thread:
     */
    standaloneModule: JavaCompiledModule;
    standaloneSymbolTable: JavaSymbolTable;
    standaloneThread: Thread;
    standaloneExecutable: Executable;
    standaloneModuleManager: JavaModuleManager;

    replCompiler: ReplCompiler;

    constructor(private interpreter: Interpreter, libraryModuleManager: JavaLibraryModuleManager,
        private editor?: monaco.editor.IStandaloneCodeEditor
    ){
        this.standaloneModule = new JavaCompiledModule(new File());
        this.standaloneSymbolTable = new JavaSymbolTable(this.standaloneModule, EmptyRange.instance, true);
        this.standaloneThread = interpreter.scheduler.createThread("REPL standalone thread");  
        this.standaloneModuleManager = new JavaModuleManager();
        this.standaloneModuleManager.addModule(this.standaloneModule);
        this.standaloneExecutable = new Executable(this.interpreter.scheduler.classObjectRegistry, this.standaloneModuleManager,
            libraryModuleManager, [], new ExceptionTree(libraryModuleManager.typestore, this.standaloneModuleManager.typestore)  
        )
        
        this.replCompiler = new ReplCompiler();
    }

    execute(statement: string):any {
        let programAndModule: {module: ReplCompiledModule, program: Program | undefined} | undefined;

        if(this.interpreter.scheduler.state == SchedulerState.paused){
            // execute in current thread context
            let currentThread = this.interpreter.scheduler.getCurrentThread();
            if(this.interpreter.executable && currentThread && currentThread.programStack.length > 0){
                
                let programState = currentThread.programStack[currentThread.programStack.length - 1];
                
                let debuggerCallstackEntry = new DebuggerCallstackEntry(programState);
                
                let symbolTable = debuggerCallstackEntry.symbolTable as JavaSymbolTable;
                
                if(symbolTable){
                    programAndModule = this.replCompiler.compile(statement, symbolTable, this.interpreter.executable);
                }

            }
        } else {
            // execute in REPL standalone context
            programAndModule = this.replCompiler.compile(statement, this.standaloneSymbolTable, this.standaloneExecutable);
        }
        
        if(programAndModule){
            return this.startProgram(programAndModule);
        } else {
            return undefined;
        }

    }

    startProgram(programAndModule: { module: ReplCompiledModule; program: Program | undefined; }): any {
        
        if(programAndModule.module.hasErrors()){
            if(this.editor) this.showErrors(this.editor, programAndModule.module.errors);
            return undefined;
        }

        if(!programAndModule.program){
            return undefined;
        }

        let currentThread = this.interpreter.scheduler.getCurrentThread();
        if(!currentThread){
            this.interpreter.scheduler.setAsCurrentThread(this.standaloneThread);
            currentThread = this.standaloneThread;
        }

        currentThread.callbackAfterTerminated = () => {
            this.interpreter.setState(SchedulerState.paused);
        }


        this.interpreter.runMainProgramSynchronously();

        return currentThread.replReturnValue;
    }

    showErrors(editor: monaco.editor.IStandaloneCodeEditor, errors: Error[]) {
        throw new Error("Method not implemented.");
    }

}