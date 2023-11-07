import { Module } from "../module/Module";
import { IRange } from "../range/Range";
import { Interpreter } from "./Interpreter";
import { Program } from "./Program";
import { Semaphor } from "./Semaphor";
import { Thread, ThreadState } from "./Thread";

export enum SchedulerState { not_initialized, running, paused, stopped }

export type TextPositionWithModule = {
    module: Module,
    range: IRange
}

export type HelperRegistry = { [identifier: string]: any };

export type Klass = { new(...args: any[]): any, [index: string]: any };
export type KlassObjectRegistry = { [identifier: string]: Klass };

export type HelperObject = {
    classes: KlassObjectRegistry,
    helpers: HelperRegistry,
    newArray : (defaultValue: any, ...dimensions : number []) => Array<any>
    print: (text: string | undefined, printNewline: boolean, color: number | undefined) => void
}


export class Scheduler {
    runningThreads: Thread[] = [];
    currentThreadIndex: number = 0;
    semaphors: Semaphor[] = [];
    state!: SchedulerState;

    keepThread: boolean = false;    // for single step mode

    classObjectRegistry: KlassObjectRegistry = {};

    helperObject!: HelperObject;

    timeStampProgramStarted: number = 0;
    stepCountSinceStartOfProgram: number = 0;


    constructor(public interpreter: Interpreter, private helperRegistry: HelperRegistry) {
        this.setState(SchedulerState.not_initialized);
        this.buildHelperObject();
    }

    buildHelperObject() {
        let that = this;
        this.helperObject = {
            classes: this.classObjectRegistry,
            helpers: this.helperRegistry,
            newArray: Scheduler.newArray,
            print: (text: string | undefined, printNewline: boolean, color: number | undefined) => {
                that.interpreter.printManager.print("" + text, printNewline, color);
            }
        }
    }

    run(numberOfStepsMax: number) {
        let stepsPerThread = Math.ceil(numberOfStepsMax / this.runningThreads.length);
        let numberOfStepsInThisRun = 0;
        if (this.runningThreads.length == 0) return;


        while (numberOfStepsInThisRun < numberOfStepsMax) {
            let currentThread = this.runningThreads[this.currentThreadIndex];

            /**
             * Let thread run!
             */
            let threadState = currentThread.run(stepsPerThread);

            numberOfStepsInThisRun += Math.max(threadState.stepsExecuted, 1);  // to avoid endless loop

            switch (threadState.state) {
                case ThreadState.exited:
                case ThreadState.exitedWithException:

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
                case ThreadState.paused:
                    this.setState(SchedulerState.paused);
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
            this.keepThread = false;
            callback();
        } else {
            let thread = this.runningThreads[this.currentThreadIndex];
            if (thread == null) return;
            thread.markSingleStepOver(() => {
                this.keepThread = false;
                callback();
            });
        }
    }

    stepOut(callback: () => void) {
        this.keepThread = true;
        let thread = this.runningThreads[this.currentThreadIndex];
        if (thread == null) return;
        thread.markStepOut(() => {
            this.keepThread = false;
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
        this.buildHelperObject();

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

        this.runningThreads.push(mainThread);
        this.currentThreadIndex = 0;
    }


    static newArray(defaultValue: any, ...dimensions : number[]) : Array<any> {
        let n0 = dimensions[0];

        if (dimensions.length == 1) {
            return Array(n0).fill(defaultValue);
        }
        else {
            let array = [];
            let subdimensions = dimensions.slice(1);
            // Recursive call
            for(let i = 0; i < n0; i++){
                array.push(this.newArray(defaultValue, ...subdimensions));
            }
            return array;
        }

    }

    
}
