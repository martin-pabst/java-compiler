import { Module } from "../module/Module";
import { IRange } from "../range/Range";
import { Interpreter } from "./Interpreter";
import { Program, Step } from "./Program";
import { Semaphor } from "./Semaphor";
import { KlassObjectRegistry, Klass } from "./StepFunction.ts";
import { Thread, ThreadState } from "./Thread";

export enum SchedulerState { not_initialized, running, paused, stopped }

export type TextPositionWithModule = {
    module: Module,
    range: IRange
}


export class Scheduler {
    runningThreads: Thread[] = [];
    currentThreadIndex: number = 0;
    semaphors: Semaphor[] = [];
    state!: SchedulerState;

    keepThread: boolean = false;    // for single step mode

    classObjectRegistry: KlassObjectRegistry = {};

    timeStampProgramStarted: number = 0;
    stepCountSinceStartOfProgram: number = 0;


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

            /**
             * Let thread run!
             */
            let threadState = currentThread.run(stepsPerThread);

            numberOfStepsInThisRun += threadState.stepsExecuted;  // to avoid endless loop

            if (threadState.state == ThreadState.terminated || threadState.state == ThreadState.terminatedWithException) {

                    // TODO: Print Exception if present

                    for (let semaphor of currentThread.currentlyHeldSemaphors) {
                        semaphor.release(currentThread);
                    }

                    this.runningThreads.splice(this.currentThreadIndex, 1);

                    if (this.runningThreads.length == 0) {
                        this.stepCountSinceStartOfProgram += numberOfStepsInThisRun;
                        this.interpreter.setState(SchedulerState.stopped);
                        return;
                    }

                    return;
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
            case SchedulerState.stopped:
                if(this.state == SchedulerState.running){
                    let dt = performance.now() - this.timeStampProgramStarted;
                    let stepsPerSecond = Math.round(this.stepCountSinceStartOfProgram/dt*1000);
                    this.interpreter.printManager.print("Duration: " + Math.round(dt * 100)/100 + " ms, " + this.stepCountSinceStartOfProgram + " Steps, " + stepsPerSecond + " steps/s", true, undefined);
                }
            }
            this.state = newState;
    }

    runSingleStepKeepingThread(stepInto: boolean, callback: () => void) {
        this.keepThread = true;
        if (stepInto) {
            if (this.state <= SchedulerState.paused) {
                this.run(1);
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
    unmarkStep() {
        let thread = this.runningThreads[this.currentThreadIndex];
        thread.unmarkStep();
    }

    createThread(program: Program, initialStack: any[] = [], callbackAfterFinished?: () => void) {

        let thread = new Thread(this, initialStack);
        thread.lastDepositedCallback = callbackAfterFinished;
        thread.pushProgram(program);
    }

    suspendThread(thread: Thread) {
        let index = this.runningThreads.indexOf(thread);
        if (index >= 0) {
            this.runningThreads.splice(index, 1);
            if (this.currentThreadIndex >= index) {
                this.currentThreadIndex--;
            }
        }
    }

    restoreThread(thread: Thread) {
        thread.state = ThreadState.runnable;
        this.runningThreads.push(thread);
    }

    /**
     * for displaying next program position in editor
     */
    getNextStepPosition(): TextPositionWithModule {
        let currentThread = this.runningThreads[this.currentThreadIndex];
        let programState = currentThread.currentProgramState;
        let step = programState.currentStepList[programState.stepIndex];
        return {
            module: programState.program.module,
            //@ts-ignore
            range: step.range
        }
    }

    init(mainModule: Module, runtimeClassObjects: { [identifier: string]: Klass }) {

        this.classObjectRegistry = runtimeClassObjects;

        this.runningThreads = [];
        this.semaphors = [];
        this.currentThreadIndex = 0;
        this.keepThread = false;

        let mainThread = new Thread(this, []);

        let mainProgram = mainModule.getMainProgram();
        if (mainProgram) mainThread.pushProgram(mainProgram);

        // TODO: Initialize static variables for all classes


        // TODO!!

        // Instantiate enum value-objects; initialize static attributes; call static constructors

        // this.programStack.push({
        //     program: this.mainModule.mainProgram,
        //     programPosition: 0,
        //     textPosition: { line: 1, column: 1, length: 0 },
        //     method: "Hauptprogramm",
        //     callbackAfterReturn: null,
        //     isCalledFromOutside: "Hauptprogramm"

        // })

        // for (let m of this.moduleStore.getModules(false)) {
        //     this.initializeEnums(m);
        //     this.initializeClasses(m);
        // }

        // this.popProgram();
        mainThread.state = ThreadState.runnable;

        this.runningThreads.push(mainThread);
        this.currentThreadIndex = 0;
    }
    
}
