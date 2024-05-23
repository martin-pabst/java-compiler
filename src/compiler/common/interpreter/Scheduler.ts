import { SpeedControl } from "../../../testgui/SpeedControl.ts";
import { JavaTypeStore } from "../../java/module/JavaTypeStore.ts";
import { Executable } from "../Executable.ts";
import { Module } from "../module/Module";
import { IRange } from "../range/Range";
import { Interpreter } from "./Interpreter";
import { Program, Step } from "./Program";
import { KlassObjectRegistry, Klass } from "./StepFunction.ts";
import { Thread, ThreadState } from "./Thread";

export enum SchedulerState { not_initialized, running, paused, stopped, error }

export type ProgramPointerPositionInfo = {
    module: Module,
    range: IRange, 
    nextStepIndex: number,
    program: Program
}


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


    constructor(public interpreter: Interpreter) {
        this.setState(SchedulerState.not_initialized);
    }


    run(numberOfStepsMax: number) {
        if(this.state != SchedulerState.running) return;

        let stepsPerThread = Math.ceil(numberOfStepsMax / this.runningThreads.length);

        let numberOfStepsInThisRun = 0;
        if (this.runningThreads.length == 0) return;

        let lastStoredStepsInThisRun = -1;          // watchdog uses this to decide if there's any runnable thread left

        while (numberOfStepsInThisRun < numberOfStepsMax && this.state == SchedulerState.running) {

            // watchdog:
            if(this.currentThreadIndex == 0){
                if(lastStoredStepsInThisRun == numberOfStepsInThisRun || this.runningThreads.length == 0){
                    break;
                }
                lastStoredStepsInThisRun = numberOfStepsInThisRun;
            }

            let currentThread = this.runningThreads[this.currentThreadIndex];
            if(!currentThread){
                if(this.runningThreads.length > 0){
                    this.currentThreadIndex = 0;
                    currentThread = this.runningThreads[0];
                    lastStoredStepsInThisRun = -1;
                } else {
                    return;
                }
            }

            /**
             * Let thread run!
             */
            let threadState = currentThread.run(stepsPerThread);

            numberOfStepsInThisRun += threadState.stepsExecuted;  // to avoid endless loop

            if (threadState.state == ThreadState.terminated || threadState.state == ThreadState.terminatedWithException) {

                    // TODO: Print Exception if present

                    this.runningThreads.splice(this.currentThreadIndex, 1);
                    if(this.currentThreadIndex > this.runningThreads.length - 1){
                        this.currentThreadIndex = -1;
                        this.keepThread = false;
                    }

                    if (this.runningThreads.length == 0 && !this.interpreter.hasActors()
                        || threadState.state == ThreadState.terminatedWithException) {
                        this.stepCountSinceStartOfProgram += numberOfStepsInThisRun;
                        this.interpreter.setState(SchedulerState.stopped);
                        if (threadState.state == ThreadState.terminatedWithException) {
                            this.interpreter.setState(SchedulerState.error);
                        }
                        return;
                    }

                    
            }

            if (!this.keepThread) {
                this.currentThreadIndex++;
                if (this.currentThreadIndex >= this.runningThreads.length) {
                    this.currentThreadIndex = 0;
                }
            }
        }

        this.stepCountSinceStartOfProgram += numberOfStepsInThisRun;

    }
    
    setState(newState: SchedulerState) {
        switch(newState){
            case SchedulerState.running: 
            this.timeStampProgramStarted = performance.now();
            this.stepCountSinceStartOfProgram = 0;
            break;
            case SchedulerState.stopped, SchedulerState.error:
                if(this.state == SchedulerState.running){
                    let dt = performance.now() - this.timeStampProgramStarted;
                    let stepsPerSecond = Math.round(this.stepCountSinceStartOfProgram/dt*1000);
                    this.interpreter.printManager.print("Duration: " + Math.round(dt * 100)/100 + " ms, " + this.stepCountSinceStartOfProgram + " steps, " + SpeedControl.printMillions(stepsPerSecond) + " steps/s", true, undefined);
                }
                this.terminateAllThreads();
            }
            this.state = newState;
    }

    terminateAllThreads(){
        this.runningThreads.forEach(t => t.state = ThreadState.terminated);
        this.suspendedThreads.forEach(t => t.state = ThreadState.terminated);

         this.runningThreads.length = 0;
        this.suspendedThreads.length = 0;
    }

    runSingleStepKeepingThread(stepInto: boolean, callback: () => void) {
        this.keepThread = true;
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
        thread.unmarkStep();
    }

    createThread(initialStack: any[] = []): Thread {
        let thread = new Thread(this, initialStack);
        this.runningThreads.push(thread);
        return thread;
    }

    removeThread(thread: Thread){
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

        if(thread.state >= ThreadState.terminated) return;

        this.runningThreads.push(thread);
    }



    /**
     * for displaying next program position in editor
     */
    getNextStepPosition(): ProgramPointerPositionInfo | undefined {
        let currentThread = this.runningThreads[this.currentThreadIndex];
        if(!currentThread) return undefined;
        let programState = currentThread.currentProgramState;
        let step = programState.currentStepList[programState.stepIndex];
        if(!step) return undefined;
        
        return {
            module: programState.program.module,
            //@ts-ignore
            range: step.range,
            nextStepIndex: programState.stepIndex,
            program: programState.program
        }
    }
    
    init(executable: Executable) {
        
        this.classObjectRegistry = executable.classObjectRegistry;
        this.libraryTypeStore = executable.libraryModuleManager.typestore;
        
        this.runningThreads = [];
        this.currentThreadIndex = 0;

        this.keepThread = false;

        let mainThread = this.createThread();

        let mainModule = executable.mainModule;

        if(mainModule){
            if(!mainModule.startMainProgram(mainThread)){
                // TODO: Error "Main program not startable"
            }
        }

        for(let staticInitStep of executable.staticInitializationSequence){
            mainThread.pushProgram(staticInitStep.program);
        }

        mainThread.state = ThreadState.runnable; // this statement actually makes the program run

    }
    
}
