import { Error } from "../../../common/Error.ts";
import { Executable } from "../../../common/Executable.ts";
import { IMain } from "../../../common/IMain.ts";
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
import { JavaReplCompiledModule } from "./JavaReplCompiledModule.ts";
import { JavaReplCompiler } from "./JavaReplCompiler.ts";

type ProgramAndModule = { module: JavaReplCompiledModule, program: Program | undefined };

export class JavaRepl {

    /**
     * If REPL-Statements are executed outside a paused program context
     * then use this symbol table an this thread:
     */
    standaloneModule: JavaCompiledModule;
    standaloneSymbolTable: JavaSymbolTable;
    standaloneThread: Thread;
    standaloneExecutable: Executable;
    standaloneModuleManager: JavaModuleManager;

    replCompiler: JavaReplCompiler;

    lastCompiledModule?: JavaCompiledModule;

    constructor(private main: IMain, libraryModuleManager: JavaLibraryModuleManager
    ) {
        let interpreter = this.getInterpreter();
        if(!interpreter){
            console.error("JavaRepl constructor called before interpreter was created.");
        }

        this.standaloneModule = new JavaCompiledModule(new CompilerFile());
        this.standaloneSymbolTable = new JavaSymbolTable(this.standaloneModule, EmptyRange.instance, true);
        this.standaloneThread = interpreter.scheduler.createThread("Java REPL standalone thread");
        this.standaloneModuleManager = new JavaModuleManager();
        this.standaloneModuleManager.addModule(this.standaloneModule);
        this.standaloneExecutable = new Executable(interpreter.scheduler.classObjectRegistry, this.standaloneModuleManager,
            libraryModuleManager, [], new ExceptionTree(libraryModuleManager.typestore, this.standaloneModuleManager.typestore)
        )

        this.replCompiler = new JavaReplCompiler();
    }

    getCurrentModule(): JavaCompiledModule | undefined {
        return this.lastCompiledModule;
    }

    private getInterpreter(): Interpreter {
        let interpreter = this.main.getInterpreter();
        if(!interpreter) console.error("JavaRepl.getInterpreter: Interpreter is missing!");
        return interpreter!;
    }


    compileAndShowErrors(statement: string): ProgramAndModule | undefined {
        let programAndModule: ProgramAndModule | undefined;
        let interpreter = this.getInterpreter();

        if (interpreter.scheduler.state == SchedulerState.paused) {
            // execute in current thread context
            let currentThread = interpreter.scheduler.getCurrentThread();
            if (interpreter.executable && currentThread && currentThread.programStack.length > 0) {

                let programState = currentThread.programStack[currentThread.programStack.length - 1];

                let debuggerCallstackEntry = new DebuggerCallstackEntry(programState);

                let symbolTable = debuggerCallstackEntry.symbolTable as JavaSymbolTable;

                if (symbolTable) {
                    programAndModule = this.replCompiler.compile(statement, symbolTable, interpreter.executable);
                }

            }
        } else {
            // execute in REPL standalone context
            programAndModule = this.replCompiler.compile(statement, this.standaloneSymbolTable, this.standaloneExecutable);
        }

        if (programAndModule) {
            this.showErrors(programAndModule.module.errors);
            this.lastCompiledModule = programAndModule.module;
        }

        return programAndModule;
    }

    executeSynchronously(statement: string): any {

        let interpreter = this.getInterpreter();
        let programAndModule = this.compileAndShowErrors(statement);

        if (!programAndModule) {
            return undefined;
        }

        let thread = this.prepareThread(programAndModule);
        if (!thread) {
            return undefined;
        }

        try {
            interpreter.runREPLSynchronously();
        } catch(ex){
            console.log(ex);
            return "---";
        }

        return thread.replReturnValue;

    }

    async executeAsync(statement: string, withMaxSpeed: boolean): Promise<any> {

        let interpreter = this.getInterpreter();
        let programAndModule = this.compileAndShowErrors(statement);

        if (!programAndModule) {
            return undefined;
        }


        let p = new Promise<any>((resolve, reject) => {
            let callback = (returnValue: any) => {
                if(returnValue && returnValue["value"]) returnValue = returnValue.value;
                resolve(returnValue);
            }

            let thread = this.prepareThread(programAndModule!, callback, withMaxSpeed);
            if (!thread) {
                resolve(undefined);
                return;
            }
            
    
            interpreter.setState(SchedulerState.running);

        })


        return p;

    }



    prepareThread(programAndModule: { module: JavaReplCompiledModule; program: Program | undefined; }, callback?: (returnValue: any) => void,
                   withMaxSpeed: boolean = true): Thread | undefined {

        let interpreter = this.getInterpreter();
        let scheduler = interpreter.scheduler;

        if (programAndModule.module.hasErrors()) {
            return undefined;
        }

        if (!programAndModule.program) {
            return undefined;
        }

        programAndModule.program.compileToJavascriptFunctions();

        let noProgramIsRunning = [SchedulerState.running, SchedulerState.paused].indexOf(scheduler.state) < 0;
        let currentThread = scheduler.getCurrentThread()!;
        if (noProgramIsRunning) {
            scheduler.setAsCurrentThread(this.standaloneThread);
            currentThread = this.standaloneThread;
        }

        scheduler.saveAllThreadsBut(currentThread);

        let saveMaxStepsPerSecond = currentThread.maxStepsPerSecond;
        if(withMaxSpeed){
            currentThread.maxStepsPerSecond = undefined;
        } else {
            currentThread.maxStepsPerSecond = interpreter.isMaxSpeed ? undefined : interpreter.stepsPerSecondGoal;
        }

        currentThread.lastTimeThreadWasRun = performance.now();
        
        let oldState = scheduler.state;
        
        scheduler.callbackAfterReplProgramFinished = () => {
            currentThread.maxStepsPerSecond = saveMaxStepsPerSecond;
            currentThread.state = ThreadState.runnable;
            currentThread.lastTimeThreadWasRun = performance.now();
            interpreter.setState(oldState);
            scheduler.retrieveThreads();
            if(callback) callback(currentThread.replReturnValue);
        }
        currentThread.pushReplProgram(programAndModule.program);

        return currentThread;
    }

    showErrors(errors: Error[]) {
        let editor = this.main.getMainEditor();
        if(!editor) return;
        let monacoModel = editor.getModel();
        if (!monacoModel) return;

        ErrorMarker.markErrors(errors, monacoModel);

    }

}