import { Error } from "../../../common/Error.ts";
import { Executable } from "../../../common/Executable.ts";
import { DebuggerCallstackEntry } from "../../../common/debugger/DebuggerCallstackEntry.ts";
import { Interpreter } from "../../../common/interpreter/Interpreter.ts";
import { Program } from "../../../common/interpreter/Program.ts";
import { SchedulerState } from "../../../common/interpreter/Scheduler.ts";
import { Thread, ThreadState } from "../../../common/interpreter/Thread.ts";
import { CompilerFile } from "../../../common/module/CompilerFile.ts";
import { ErrorMarker } from "../../../common/monacoproviders/ErrorMarker.ts";
import { EmptyRange } from "../../../common/range/Range.ts";
import { ExceptionTree } from "../../codegenerator/ExceptionTree.ts";
import { JavaSymbolTable } from "../../codegenerator/JavaSymbolTable.ts";
import { JavaCompiledModule } from "../../module/JavaCompiledModule.ts";
import { JavaModuleManager } from "../../module/JavaModuleManager.ts";
import { JavaLibraryModuleManager } from "../../module/libraries/JavaLibraryModuleManager.ts";
import { ReplCompiledModule } from "./ReplCompiledModule.ts";
import { ReplCompiler } from "./ReplCompiler.ts";

type ProgramAndModule = { module: ReplCompiledModule, program: Program | undefined };

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

    lastCompiledModule?: JavaCompiledModule;

    constructor(private interpreter: Interpreter, libraryModuleManager: JavaLibraryModuleManager,
        private editor?: monaco.editor.IStandaloneCodeEditor
    ) {
        this.standaloneModule = new JavaCompiledModule(new CompilerFile());
        this.standaloneSymbolTable = new JavaSymbolTable(this.standaloneModule, EmptyRange.instance, true);
        this.standaloneThread = interpreter.scheduler.createThread("REPL standalone thread");
        this.standaloneModuleManager = new JavaModuleManager();
        this.standaloneModuleManager.addModule(this.standaloneModule);
        this.standaloneExecutable = new Executable(this.interpreter.scheduler.classObjectRegistry, this.standaloneModuleManager,
            libraryModuleManager, [], new ExceptionTree(libraryModuleManager.typestore, this.standaloneModuleManager.typestore)
        )

        this.replCompiler = new ReplCompiler();
    }

    getCurrentModule(): JavaCompiledModule | undefined {
        return this.lastCompiledModule;
    }


    compileAndShowErrors(statement: string): ProgramAndModule | undefined {
        let programAndModule: ProgramAndModule | undefined;

        if (this.interpreter.scheduler.state == SchedulerState.paused) {
            // execute in current thread context
            let currentThread = this.interpreter.scheduler.getCurrentThread();
            if (this.interpreter.executable && currentThread && currentThread.programStack.length > 0) {

                let programState = currentThread.programStack[currentThread.programStack.length - 1];

                let debuggerCallstackEntry = new DebuggerCallstackEntry(programState);

                let symbolTable = debuggerCallstackEntry.symbolTable as JavaSymbolTable;

                if (symbolTable) {
                    programAndModule = this.replCompiler.compile(statement, symbolTable, this.interpreter.executable);
                }

            }
        } else {
            // execute in REPL standalone context
            programAndModule = this.replCompiler.compile(statement, this.standaloneSymbolTable, this.standaloneExecutable);
        }

        if (programAndModule) {
            if (this.editor) this.showErrors(programAndModule.module.errors);
            this.lastCompiledModule = programAndModule.module;
        }

        return programAndModule;
    }

    executeSynchronously(statement: string): any {

        let programAndModule = this.compileAndShowErrors(statement);

        if (!programAndModule) {
            return undefined;
        }

        let thread = this.prepareThread(programAndModule);
        if (!thread) {
            return undefined;
        }

        try {
            this.interpreter.runREPLSynchronously();
        } catch(ex){
            console.log(ex);
            return "---";
        }

        return thread.replReturnValue;

    }

    async executeAsync(statement: string, withMaxSpeed: boolean): Promise<any> {

        let programAndModule = this.compileAndShowErrors(statement);

        if (!programAndModule) {
            return undefined;
        }


        let p = new Promise<any>((resolve, reject) => {
            let callback = (returnValue: any) => {
                resolve(returnValue);
            }

            let thread = this.prepareThread(programAndModule!, callback, withMaxSpeed);
            if (!thread) {
                resolve(undefined);
                return;
            }
            
    
            this.interpreter.setState(SchedulerState.running);

        })


        return p;

    }



    prepareThread(programAndModule: { module: ReplCompiledModule; program: Program | undefined; }, callback?: (returnValue: any) => void,
                   withMaxSpeed: boolean = true): Thread | undefined {

        if (programAndModule.module.hasErrors()) {
            return undefined;
        }

        if (!programAndModule.program) {
            return undefined;
        }

        programAndModule.program.compileToJavascriptFunctions();

        let noProgramIsRunning = [SchedulerState.running, SchedulerState.paused].indexOf(this.interpreter.scheduler.state) < 0;
        let currentThread = this.interpreter.scheduler.getCurrentThread()!;
        if (noProgramIsRunning) {
            this.interpreter.scheduler.setAsCurrentThread(this.standaloneThread);
            currentThread = this.standaloneThread;
        }

        this.interpreter.scheduler.saveAllThreadsBut(currentThread);

        let saveMaxStepsPerSecond = currentThread.maxStepsPerSecond;
        if(withMaxSpeed){
            currentThread.maxStepsPerSecond = undefined;
        } else {
            currentThread.maxStepsPerSecond = this.interpreter.isMaxSpeed ? undefined : this.interpreter.stepsPerSecondGoal;
        }

        currentThread.lastTimeThreadWasRun = performance.now();
        
        let oldState = this.interpreter.scheduler.state;
        
        this.interpreter.scheduler.callbackAfterReplProgramFinished = () => {
            currentThread.maxStepsPerSecond = saveMaxStepsPerSecond;
            currentThread.state = ThreadState.runnable;
            currentThread.lastTimeThreadWasRun = performance.now();
            this.interpreter.setState(oldState);
            this.interpreter.scheduler.retrieveThreads();
            if(callback) callback(currentThread.replReturnValue);
        }
        currentThread.pushReplProgram(programAndModule.program);

        return currentThread;
    }

    showErrors(errors: Error[]) {
        if (!this.editor) return;
        let monacoModel = this.editor.getModel();
        if (!monacoModel) return;

        ErrorMarker.markErrors(errors, monacoModel);

    }

}