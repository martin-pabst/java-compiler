import { Module } from "../module/Module";
import { IRange } from "../range/Range";
import { Interpreter } from "./Interpreter";
import { Program } from "./Program";
import { Semaphor } from "./Semaphor";
import { Thread, ThreadState } from "./Thread";

export enum ThreadPoolLstate { not_initialized, running, paused, stopped }

export type TextPositionWithModule = {
    module: Module,
    range: IRange
}

export type HelperRegistry = {[identifier: string]: any};

export type Klass = {new (...args: any[]): any, [index: string]: any};
export type KlassObjectRegistry = { [identifier: string]: Klass };

export type HelperObject = {
    classes: KlassObjectRegistry,
    helpers: HelperRegistry
}


export class ThreadPool {
        runningThreads: Thread[] = [];
        currentThreadIndex: number = 0;
        semaphors: Semaphor[] = [];
        state!: ThreadPoolLstate;
    
        keepThread: boolean = false;    // for single step mode
    
        classObjectRegistry: KlassObjectRegistry = {};

        helperObject!: HelperObject;
    
        constructor(private interpreter: Interpreter, private helperRegistry: HelperRegistry) {
            this.setState(ThreadPoolLstate.not_initialized);
            this.buildHelperObject();
        }
    
        buildHelperObject(){
            this.helperObject = {
                classes: this.classObjectRegistry,
                helpers: this.helperRegistry
            }
        }

        run(numberOfStepsMax: number) {
            let stepsPerThread = Math.ceil(numberOfStepsMax / this.runningThreads.length);
            let numberOfSteps = 0;
            if (this.runningThreads.length == 0) return;
        
            while (numberOfSteps < numberOfStepsMax) {
                let currentThread = this.runningThreads[this.currentThreadIndex];
    
                /**
                 * Let thread run!
                 */
                let threadState = currentThread.run(stepsPerThread);

                numberOfSteps += stepsPerThread;
    
                switch (threadState) {
                    case ThreadState.exited:
                    case ThreadState.exitedWithException:
                        
                        // TODO: Print Exception if present

                        for (let semaphor of currentThread.currentlyHeldSemaphors) {
                            semaphor.release(currentThread);
                        }
    
                        this.runningThreads.splice(this.currentThreadIndex, 1);
    
                        if (this.runningThreads.length == 0) {
                            this.setState(ThreadPoolLstate.stopped);
                            return;
                        }
    
                        return;
                    case ThreadState.paused:
                        this.setState(ThreadPoolLstate.paused);
                        return;
                }
    
                if (!this.keepThread) {
                    this.currentThreadIndex++;
                    if (this.currentThreadIndex >= this.runningThreads.length) {
                        this.currentThreadIndex = 0;
                    }
                }
            }
    
    
        }
    
        setState(newState: ThreadPoolLstate) {
            this.state = newState;
        }
    
        runSingleStepKeepingThread(stepInto: boolean, callback: () => void) {
            this.keepThread = true;
            if (stepInto) {
                if (this.state <= ThreadPoolLstate.paused) {
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
                range: step.range
            }
        }
    
        init(mainModule: Module, classObjects: { [identifier: string]: Klass }) {
    
            this.classObjectRegistry = classObjects;
            this.buildHelperObject();

            let mainThread = new Thread(this, []);

            let mainProgram = mainModule.getMainProgram();
            if(mainProgram) mainThread.pushProgram(mainProgram);

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
        
    }
    