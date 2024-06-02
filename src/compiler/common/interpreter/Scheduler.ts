import { SpeedControl } from "../../../testgui/SpeedControl.ts";
import { JavaTypeStore } from "../../java/module/JavaTypeStore.ts";
import { JavaClass } from "../../java/types/JavaClass.ts";
import { JavaMethod } from "../../java/types/JavaMethod.ts";
import { Executable } from "../Executable.ts";
import { Module } from "../module/Module";
import { ProgramPointerPositionInfo } from "../monacoproviders/ProgramPointerManager.ts";
import { IRange } from "../range/Range";
import { Interpreter } from "./Interpreter";
import { Program, Step } from "./Program";
import { KlassObjectRegistry, Klass, StepParams, Helpers } from "./StepFunction.ts";
import { Thread, ThreadState, ThreadStateInfoAfterRun } from "./Thread";

export enum SchedulerState { not_initialized, running, paused, stopped, error }



export enum SchedulerExitState { nothingMoreToDo, giveMeAdditionalTime }

export class Scheduler {
    runningThreads: Thread[] = [];
    suspendedThreads: Thread[] = [];

    currentThreadIndex: number = 0;
    state!: SchedulerState;

    keepThread: boolean = false;    // for single step mode

    classObjectRegistry: KlassObjectRegistry = {};

    timeStampProgramStarted: number = 0;
    stepCountSinceStartOfProgram: number = 0;
    libraryTypeStore?: JavaTypeStore;

    lastTimeDebuggeroutputWritten: number = 0;
    updateDebuggerEveryMs: number = 1000;

    // if pause button is pressed when there is no thread 
    // and Program has actors then interpreter sets this callback:
    onStartingNextThreadCallback?: () => void;

    callbackAfterProgramFinished?: () => void;

    constructor(public interpreter: Interpreter) {
        this.setState(SchedulerState.not_initialized);
    }


    /**
     * This method is called every tick by LoadController.tick and gets told how many steps it may execute. It distributes 
     * this steps evenly among all running threads and calls their run-method.
     * 
     * This one of three nested main loops:
     * 
     * Outer loop: LoadController.tick
     * Middle loop: this one
     * Inner loop: Thread.run
     * @param numberOfStepsMax 
     * @returns 
     */
    run(numberOfStepsMax: number): SchedulerExitState {

        this.periodicallyUpdateDebugger();

        if (this.state != SchedulerState.running) return SchedulerExitState.nothingMoreToDo;

        // If pause button is pressed while no thread is in state running then noStartinNextThreadCallback is set to wait 
        // for next running thread. This is neccessary because we we want to show program pointer immediately after program is paused.
        if (this.onStartingNextThreadCallback) {
            if (this.getNextStepPosition()) {
                this.onStartingNextThreadCallback();
                this.onStartingNextThreadCallback = undefined;
                return SchedulerExitState.nothingMoreToDo;
            }
        }

        let stepsPerThread = Math.ceil(numberOfStepsMax / this.runningThreads.length);

        let numberOfStepsInThisRun = 0;     // for displaying number of steps after program halt
        if (this.runningThreads.length == 0) return SchedulerExitState.nothingMoreToDo;

        let lastStoredStepsInThisRun = -1;          // watchdog uses this to decide if there's any runnable thread left

        let threadState: ThreadStateInfoAfterRun = {
            state: ThreadState.runnable,
            stepsExecuted: 0
        };

        while (numberOfStepsInThisRun < numberOfStepsMax && this.state == SchedulerState.running) {

            // watchdog: if all threads had beed run once and no one executed a step then exit the loop to avoid endless looping when there's nothing to do: 
            if (this.currentThreadIndex == 0) {
                if (lastStoredStepsInThisRun == numberOfStepsInThisRun || this.runningThreads.length == 0) {
                    break;
                }
                lastStoredStepsInThisRun = numberOfStepsInThisRun;
            }

            // fetch next thread (round robin)
            let currentThread = this.runningThreads[this.currentThreadIndex];
            if (!currentThread) {
                if (this.runningThreads.length > 0) {
                    this.currentThreadIndex = 0;
                    currentThread = this.runningThreads[0];
                    lastStoredStepsInThisRun = -1;
                } else {
                    return SchedulerExitState.nothingMoreToDo;
                }
            }

            // has current thread a speed limit?
            if (currentThread.maxStepsPerSecond) {
                let t = performance.now();
                let msPerStep = 1000 / currentThread.maxStepsPerSecond;
                let elapsedTimeSinceLastThreadRun = t - currentThread.lastTimeThreadWasRun;
                let numberOfSteps = Math.min(elapsedTimeSinceLastThreadRun / msPerStep, stepsPerThread);
                if (numberOfSteps > 0) {

                    // run!
                    threadState = currentThread.run(numberOfSteps);
                    
                    // compute lastTimeThreadWasRun in a way to achieve exact step frequency currentThread.maxStepsPerSecond
                    currentThread.lastTimeThreadWasRun =
                        currentThread.lastTimeThreadWasRun + threadState.stepsExecuted * msPerStep;
                    if (currentThread.maxStepsPerSecond < 20) {
                        this.interpreter.showProgramPointer(this.getNextStepPosition(currentThread));
                        this.interpreter.updateDebugger();
                    } else {
                        if (this.state == SchedulerState.running) this.interpreter.hideProgrampointerPosition();
                    }
                } else {
                    threadState.state = currentThread.state;  // this is crucial as threadState.state would otherwise have a stale value of last running thread
                    threadState.stepsExecuted = 0;
                    if (this.runningThreads.length == 1) {
                        return SchedulerExitState.nothingMoreToDo;
                    }
                }
            } else {
                // run in full speed!
                threadState = currentThread.run(stepsPerThread);
            }

            numberOfStepsInThisRun += threadState.stepsExecuted;  // to avoid endless loop and to keep statistics

            if (threadState.state != ThreadState.runnable) {
                switch (threadState.state) {
                    case ThreadState.terminated:
                    case ThreadState.terminatedWithException:
                        // TODO: Print Exception if present

                        this.runningThreads.splice(this.currentThreadIndex, 1);
                        if (this.currentThreadIndex > this.runningThreads.length - 1) {
                            this.currentThreadIndex = -1;   // it gets incremented by 1 later on
                            this.keepThread = false;
                        }

                        if (this.runningThreads.length == 0 && !this.interpreter.hasActors()
                            || threadState.state == ThreadState.terminatedWithException) {

                            if (currentThread.maxStepsPerSecond) {
                                this.interpreter.hideProgrampointerPosition();
                            }

                            this.stepCountSinceStartOfProgram += numberOfStepsInThisRun;

                            this.interpreter.setState(SchedulerState.stopped);
                            if (threadState.state == ThreadState.terminatedWithException) {
                                this.interpreter.setState(SchedulerState.error);
                            }
                            if(this.callbackAfterProgramFinished){
                                let cb = this.callbackAfterProgramFinished;
                                this.callbackAfterProgramFinished = undefined;
                                cb();
                            }
                            return SchedulerExitState.nothingMoreToDo;
                        }
                        break;
                    case ThreadState.stoppedAtBreakpoint:
                        currentThread.state = ThreadState.runnable;
                        this.interpreter.pause();
                        break;
                }

            }

            // If user pressed stepOver or stepInto button then she/he expects
            // program pointer to stay inside current thread. Therefore keepThread == true is set in this case.
            if (!this.keepThread) {
                this.currentThreadIndex++;
                if (this.currentThreadIndex >= this.runningThreads.length) {
                    this.currentThreadIndex = 0;
                }
            }
        }

        this.stepCountSinceStartOfProgram += numberOfStepsInThisRun;

        return SchedulerExitState.giveMeAdditionalTime;
    }

    setState(newState: SchedulerState) {
        switch (newState) {
            case SchedulerState.running:
                this.timeStampProgramStarted = performance.now();
                this.stepCountSinceStartOfProgram = 0;
                break;
            case SchedulerState.stopped, SchedulerState.error:
                if (this.state == SchedulerState.running) {
                    let dt = performance.now() - this.timeStampProgramStarted;
                    let stepsPerSecond = Math.round(this.stepCountSinceStartOfProgram / dt * 1000);
                    this.interpreter.printManager.print("Duration: " + Math.round(dt * 100) / 100 + " ms, " + this.stepCountSinceStartOfProgram + " steps, " + SpeedControl.printMillions(stepsPerSecond) + " steps/s", true, undefined);
                }
                this.terminateAllThreads();
                break;
        }
        this.state = newState;
    }

    terminateAllThreads() {
        this.runningThreads.forEach(t => t.state = ThreadState.terminated);
        this.suspendedThreads.forEach(t => t.state = ThreadState.terminated);

        this.runningThreads.length = 0;
        this.suspendedThreads.length = 0;
    }

    private ifBreakpointPresentDisableOnce() {
        let currentThread = this.runningThreads[this.currentThreadIndex];
        let programState = currentThread.currentProgramState;
        if (currentThread) {
            let currentStep = programState.currentStepList[programState.stepIndex];
            if (currentStep.isBreakpoint()) {
                currentThread.haltAtNextBreakpoint = false;
            }
        }
    }

    runSingleStepKeepingThread(stepInto: boolean, callback: () => void) {
        this.keepThread = true;

        this.ifBreakpointPresentDisableOnce();

        if (stepInto) {
            if (this.state == SchedulerState.paused) {
                this.setState(SchedulerState.running);
                this.run(1);
                this.setState(SchedulerState.paused);
            }
            callback();
        } else {
            let thread = this.runningThreads[this.currentThreadIndex];
            if (thread == null) return;
            thread.markSingleStepOver(() => {
                callback();
            });
        }
    }

    stepOut(callback: () => void) {
        this.keepThread = true;
        let thread = this.runningThreads[this.currentThreadIndex];
        if (thread == null) return;
        thread.markStepOut(() => {
            callback();
        });
    }

    /**
     * when pause-button is clicked while thread executes a single step then 
     * cancel this single-step execution
     */
    unmarkCurrentlyExecutedSingleStep() {
        let thread = this.runningThreads[this.currentThreadIndex];
        if (thread) thread.unmarkStep();
    }

    createThread(name: string, initialStack: any[] = []): Thread {
        let thread = new Thread(this, name, initialStack);
        this.runningThreads.push(thread);

        if(thread.name != "act method-thread"){
            if(!this.interpreter.isMaxSpeed){
                thread.maxStepsPerSecond = this.interpreter.stepsPerSecondGoal;
            }
        }
        
        return thread;
    }

    removeThread(thread: Thread) {
        this.runningThreads.splice(this.runningThreads.indexOf(thread), 1);
    }

    suspendThread(thread: Thread) {
        let index = this.runningThreads.indexOf(thread);
        if (index >= 0) {
            this.runningThreads.splice(index, 1);
            if (this.currentThreadIndex >= index) {
                this.currentThreadIndex--;
            }
        }
        this.suspendedThreads.push(thread);
    }

    restoreThread(thread: Thread) {
        thread.state = ThreadState.runnable;
        let index = this.suspendedThreads.indexOf(thread);
        if (index >= 0) {
            this.suspendedThreads.splice(index, 1);
        }

        if (thread.state >= ThreadState.terminated) return;

        this.runningThreads.push(thread);
    }



    /**
     * for displaying next program position in editor
     */
    getNextStepPosition(currentThread?: Thread): ProgramPointerPositionInfo | undefined {
        currentThread = currentThread || this.runningThreads[this.currentThreadIndex];
        if (!currentThread) return undefined;
        let programState = currentThread.currentProgramState;
        let step = programState.currentStepList[programState.stepIndex];
        if (!step) return undefined;

        return {
            module: programState.program.module,
            //@ts-ignore
            range: step.range,
            program: programState.program
        }
    }

    private initIntern(executable: Executable){
        this.classObjectRegistry = executable.classObjectRegistry;
        this.libraryTypeStore = executable.libraryModuleManager.typestore;

        this.runningThreads = [];
        this.suspendedThreads = [];
        this.currentThreadIndex = 0;

        this.keepThread = false;
    }

    init(executable: Executable): Thread | undefined {

        this.initIntern(executable);

        let mainThread = this.createThread("main thread");

        let mainModule = executable.mainModule;

        if (mainModule) {
            if (!mainModule.startMainProgram(mainThread)) {
                // TODO: Error "Main program not startable"
                return undefined
            }
        }

        for (let staticInitStep of executable.staticInitializationSequence) {
            mainThread.pushProgram(staticInitStep.program);
        }

        return mainThread;
    }

    initJUnitTestMethodAndReturnMainThread(executable: Executable | undefined, method: JavaMethod, callback: () => void): Thread | undefined {
        if(!executable) return undefined;

        this.initIntern(executable);

        let mainThread = this.createThread("main thread");

        let klass = method.classEnumInterface as JavaClass;
        let program = new Program(klass.module, undefined, klass.identifier + ".testStub_" + method.identifier);

        // Step 1: instantiate object and call it's parameterless constructor
        let parameterlessConstructors = klass.getAllMethods().filter(m => m.isConstructor && m.parameters.length == 0);
        if(parameterlessConstructors.length == 0){
            // this shouldn't happen:
            console.log("Couldn't find parameterless constrructor for class " + klass.identifier + ".");
            return undefined;
        }

        let parameterlessConstructor = parameterlessConstructors[0]!;

        let statement1 = `new ${Helpers.classes}["${klass.identifier}"]().${parameterlessConstructor.getInternalName("java")}(${StepParams.thread}, ${StepParams.stack}, undefined);
                          return 1;\n`;
        program.addStep(statement1);

        // Step 2: call test method
        let statement2 = `${Helpers.elementRelativeToStackbase(0)}.${method.getInternalName("java")}(${StepParams.thread}, undefined);
                          return 2; `;
        program.addStep(statement2);

        // Step 3: return
        let statement3 = `${Helpers.return}(); `;
        program.addStep(statement3);

        if (!program.compileToJavascriptFunctions()) {
            // this error should be impossible:
            console.log("TestManager.executeSingleTest: Error compiling test method stub.");
            return undefined;
        }

        mainThread.pushProgram(program);
        this.callbackAfterProgramFinished = callback;

        for (let staticInitStep of executable.staticInitializationSequence) {
            mainThread.pushProgram(staticInitStep.program);
        }

        return mainThread;

    }

    getCurrentThread(): Thread | undefined {
        return this.runningThreads[this.currentThreadIndex];
    }

    resetLastTimeExecutedTimestamps() {
        this.runningThreads.filter(t => t.maxStepsPerSecond).forEach(t => t.lastTimeThreadWasRun = performance.now());
    }

    periodicallyUpdateDebugger(){
        if(this.state == SchedulerState.running && 
            performance.now() - this.lastTimeDebuggeroutputWritten > this.updateDebuggerEveryMs){
            this.lastTimeDebuggeroutputWritten = performance.now();
            this.interpreter.updateDebugger();
        }
    }


    setMaxSpeed(value: number, isMaxSpeed: boolean) {
        this.runningThreads.filter(t => t.name != 'act method-thread').forEach(t => t.maxStepsPerSecond = isMaxSpeed ? undefined : value);
    }

    removeAllThreads(){
        this.runningThreads = [];
        this.suspendedThreads = [];
    }

}
