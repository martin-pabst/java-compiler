import { Program, Step } from "./Program";
import { Semaphor } from "./Semaphor";
import { Scheduler } from "./Scheduler";

type ExceptionInfo = {
    types: string[],
    stepIndex: number,
    stackSize: number
}

type ProgramState = {
    program: Program;
    currentStepList: Step[];   // Link to program.stepSingle or program.stepMultiple
    stepIndex: number;
    stackBase: number;
    callbackAfterFinished?: (value: any) => void;
    exceptionInfoList: ExceptionInfo[];
}

type ThreadStateInfoAfterRun = {
    state: ThreadState,
    stepsExecuted: number;
}

export enum ThreadState { beforeRunning, running, paused, waiting, exited, exitedWithException }

interface Exception {
    identifier: string;
    allExtendedImplementedTypes: string[];
    message: string;
}

export class Thread {
    stack: any[] = [];
    programStack: ProgramState[] = [];

    currentProgramState!: ProgramState;  // also lies on top of programStack

    currentlyHeldSemaphors: Semaphor[] = [];

    state: ThreadState = ThreadState.beforeRunning;

    exception?: Exception;
    stackTrace?: ProgramState[];

    stepEndsWhenProgramstackLengthLowerOrEqual: number = -1;
    stepEndsWhenStepIndexGreater: number = Number.MAX_SAFE_INTEGER;

    stepCallback!: () => void;

    lastDepositedCallback: (() => void) | undefined = undefined;

    constructor(public scheduler: Scheduler, initialStack: any[]) {
        this.stack = initialStack;
    }

    /**
     * returns true if Thread exits
     */
    run(maxNumberOfSteps: number): ThreadStateInfoAfterRun {
        let numberOfSteps = 0;
        let stack = this.stack; // for performance reasons
        this.state = ThreadState.running;

        try {
            //@ts-ignore
            while (numberOfSteps < maxNumberOfSteps && this.state != ThreadState.exited) {
                // For performance reasons: store all necessary data in local variables
                let currentProgramState = this.currentProgramState;
                let stepIndex = currentProgramState.stepIndex;
                let currentStepList = currentProgramState.currentStepList;
                let stackBase = currentProgramState.stackBase;

                let helperObject = this.scheduler.helperObject;

                if (this.stepEndsWhenProgramstackLengthLowerOrEqual >= 0) {
                    // singlestep-mode (slower...)
                    while (numberOfSteps < maxNumberOfSteps &&
                        this.state == ThreadState.running && !this.isSingleStepCompleted()) {
                        let step = currentStepList[stepIndex];

                        /**
                         * Behold, hier the steps run!
                         */
                        stepIndex = step.run!(this, stack, stackBase, helperObject);
                        
                        this.currentProgramState.stepIndex = stepIndex;
                        numberOfSteps++;
                    }
                    if (this.isSingleStepCompleted()) {
                        this.stepCallback();
                        this.state = ThreadState.paused;
                    }
                } else {
                    // not in singlestep-mode (faster!)
                    while (numberOfSteps < maxNumberOfSteps && this.state == ThreadState.running) {
                        let step = currentStepList[stepIndex];
                        /**
                         * Behold, hier the steps run!
                         * parameter identifers inside function: 
                         *                    t, s, sb, h
                         */
                        stepIndex = step.run!(this, stack, stackBase, helperObject);

                        numberOfSteps++;
                    }
                }


                currentProgramState.stepIndex = stepIndex;
                // this.currentProgram might by now not be the same as before this inner while-loop
                // because callMethod or returnFromMethod may have been called since from within 
                // step.run
            }
        } catch (exception) {

            let exceptionObject: Exception = {
                identifier: "RuntimeException",
                allExtendedImplementedTypes: ["Throwable", "Exception"],
                message: "Runtime-Exception:" + exception
            };
            console.log(exception);
            // this.throwException(exceptionObject);
            this.state = ThreadState.exitedWithException; // TODO
        }

        return { state: this.state, stepsExecuted: numberOfSteps }
    }


    isSingleStepCompleted() {
        return this.programStack.length < this.stepEndsWhenProgramstackLengthLowerOrEqual ||
            this.programStack.length == this.stepEndsWhenProgramstackLengthLowerOrEqual &&
            this.currentProgramState.stepIndex > this.stepEndsWhenStepIndexGreater;
    }

    markSingleStepOver(callbackWhenSingleStepOverEnds: () => void) {

        this.stepEndsWhenProgramstackLengthLowerOrEqual = this.programStack.length - 1;
        this.stepEndsWhenStepIndexGreater = this.currentProgramState.stepIndex;
        this.stepCallback = () => {
            this.stepEndsWhenProgramstackLengthLowerOrEqual = -1;
            callbackWhenSingleStepOverEnds();
        };

    }

    unmarkStep() {
        this.stepEndsWhenProgramstackLengthLowerOrEqual = -1;
    }

    markStepOut(callbackWhenStepOutEnds: () => void) {

        this.stepEndsWhenProgramstackLengthLowerOrEqual = this.programStack.length - 2;
        this.stepEndsWhenStepIndexGreater = -1;
        this.stepCallback = () => {
            this.stepEndsWhenProgramstackLengthLowerOrEqual = -1;
            callbackWhenStepOutEnds();
        };

    }


    throwException(exception: Exception) {
        let classNames = exception.allExtendedImplementedTypes.slice();
        classNames.push(exception.identifier);

        let stackTrace: ProgramState[] = [];
        do {

            let ps = this.programStack[this.programStack.length - 1];
            for (let exInfo of ps.exceptionInfoList) {
                let found = false;
                for (let cn of classNames) {
                    if (exInfo.types.indexOf(cn) >= 0) {
                        found = true;
                        break;
                    }
                }

                if (found) {
                    stackTrace.push(Object.assign(ps));
                    ps.stepIndex = exInfo.stepIndex;
                    this.stack.splice(exInfo.stackSize, this.stack.length - exInfo.stackSize);
                    this.stack.push(exception);
                    break;
                } else {
                    stackTrace.push(ps);
                    this.programStack.pop();
                }
            }

        } while (this.programStack.length > 0)

        if (this.programStack.length == 0) {
            this.stackTrace = stackTrace;
            this.exception = exception;
            this.state = ThreadState.exitedWithException;
        }
    }

    beginCatchExceptions(exceptionInfo: ExceptionInfo) {
        exceptionInfo.stackSize = this.stack.length;
        this.currentProgramState.exceptionInfoList.push(exceptionInfo);
    }

    endCatchExceptions() {
        this.currentProgramState.exceptionInfoList.pop();
    }

    aquireSemaphor(semaphor: Semaphor) {
        if (!semaphor.aquire(this)) {
            this.state = ThreadState.waiting;
        }
    }

    returnFromMethod(returnValue: any) {
        while (this.stack.length > this.currentProgramState.stackBase) {
            this.stack.pop();
        }

        let callback = this.programStack.pop()?.callbackAfterFinished;
        if (callback != null) {
            callback(returnValue);
        } else {
            if (returnValue != null) this.stack.push(returnValue);
        }

        if (this.programStack.length > 0) {
            this.currentProgramState = this.programStack[this.programStack.length - 1];
            // if (this.scheduler.executeMode == ExecuteMode.singleSteps && 
            //     this.currentProgramState.currentStepList == this.currentProgramState.program.stepsMultiple) {
            //     this.switchFromMultipleToSingleStep(this.currentProgramState);
            // }
        } else {
            this.state = ThreadState.exited;
        }
    }

    pushProgram(program: Program) {
        // Object creation is faster than Object.assign, see
        // https://measurethat.net/Benchmarks/Show/18401/0/objectassign-vs-creating-new-objects3
        let state: ProgramState = {
            program: program,
            currentStepList: program.stepsSingle,
            // currentStepList: this.scheduler.executeMode == NExecuteMode.singleSteps ? program.stepsSingle : program.stepsMultiple,
            stackBase: this.stack.length - program.numberOfParameters - program.numberOfThisObjects,  // 1 because of [this, parameter 1, ..., parameter n]
            stepIndex: 0,
            callbackAfterFinished: this.lastDepositedCallback,
            exceptionInfoList: []
        }

        this.lastDepositedCallback = undefined;

        for (let i = 0; i < program.numberOfLocalVariables; i++) {
            this.stack.push(null);
        }

        this.programStack.push(state);
        this.currentProgramState = state;
    }

    pushCallback(callback: () => void){
        this.lastDepositedCallback = callback;
    }



}