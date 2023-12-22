import { Program, Step } from "./Program";
import { Semaphor } from "./Semaphor";
import { Scheduler, SchedulerState } from "./Scheduler";
import { IRange } from "../range/Range.ts";
import { CallbackFunction, KlassObjectRegistry } from "./StepFunction.ts";
import { ExceptionInfo, CatchBlockInfo, Exception } from "./ExceptionInfo.ts";
import { ThrowableClass } from "../../java/runtime/system/javalang/ThrowableClass.ts";
import { SystemException } from "./SystemException.ts";
import { IThrowable } from "./ThrowableType.ts";
import { ArithmeticExceptionClass } from "../../java/runtime/system/javalang/ArithmeticExceptionClass.ts";
import { NullPointerExceptionClass } from "../../java/runtime/system/javalang/NullPointerExceptionClass.ts";


type ProgramState = {
    program: Program;
    currentStepList: Step[];   // Link to program.stepSingle or program.stepMultiple
    stepIndex: number;
    stackBase: number;
    callbackAfterFinished?: (value: any) => void;
    exceptionInfoList: ExceptionInfo[];

    recentlyThrownException?: Exception;
    afterExceptionTrimStackToSize?: number;     // stack size when entering try {...} block
}

type ThreadStateInfoAfterRun = {
    state: ThreadState,
    stepsExecuted: number;
}

/**
 * @link https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.State.html
 */
export enum ThreadState { new,          // A thread that has not yet started is in this state.
                          runnable,     // A thread executing in the Java virtual machine is in this state.
                          blocked,      // A thread that is blocked waiting for a monitor lock (semaphor!) is in this state.
                          terminated,   // A thread that has exited is in this state.
                          terminatedWithException }

export class Thread {
    s: any[] = [];  // stack
    programStack: ProgramState[] = [];

    currentProgramState!: ProgramState;  // also lies on top of programStack

    currentlyHeldSemaphors: Semaphor[] = [];

    private _state: ThreadState = ThreadState.new;
    public get state () {return this._state} // setter: see below

    exception?: Exception;
    stackTrace?: ProgramState[];

    stepEndsWhenProgramstackLengthLowerOrEqual: number = -1;
    stepEndsWhenStepIndexIsNotEqualTo: number = Number.MAX_SAFE_INTEGER;

    haltAtNextBreakpoint: boolean = false;

    stepCallback!: () => void;

    classes: KlassObjectRegistry;

    constructor(public scheduler: Scheduler, initialStack: any[]) {
        this.s = initialStack;
        this.classes = scheduler.classObjectRegistry;
    }

    /**
     * returns true if Thread exits
     */
    run(maxNumberOfSteps: number): ThreadStateInfoAfterRun {
        let numberOfSteps = 0;
        let stack = this.s; // for performance reasons

        try {
            //@ts-ignore
            while (numberOfSteps < maxNumberOfSteps && this.state == ThreadState.runnable) {
                // For performance reasons: store all necessary data in local variables
                let currentProgramState = this.currentProgramState;
                let stepIndex = currentProgramState.stepIndex;
                let currentStepList = currentProgramState.currentStepList;
                let stackBase = currentProgramState.stackBase;

                if (this.stepEndsWhenProgramstackLengthLowerOrEqual >= 0) {
                    // singlestep-mode (slower...)
                    while (numberOfSteps < maxNumberOfSteps &&
                        this.state == ThreadState.runnable && !this.isSingleStepCompleted()) {
                        let step = currentStepList[stepIndex];

                        /**
                         * Behold, hier the steps run!
                         */
                        stepIndex = step.run!(this, stack, stackBase);
                        if (currentProgramState != this.currentProgramState) {
                            currentProgramState.stepIndex = stepIndex;

                            currentProgramState = this.currentProgramState;
                            stepIndex = currentProgramState.stepIndex;
                            currentStepList = currentProgramState.currentStepList;
                            stackBase = currentProgramState.stackBase;
                        }

                        this.currentProgramState.stepIndex = stepIndex;
                        numberOfSteps++;
                    }
                    if (this.isSingleStepCompleted()) {
                        this.stepCallback();
                        return { state: this.state, stepsExecuted: numberOfSteps }
                    }
                } else {
                    // not in singlestep-mode (faster!)
                    while (numberOfSteps < maxNumberOfSteps && this.state == ThreadState.runnable) {
                        let step = currentStepList[stepIndex];
                        /**
                         * Behold, hier the steps run!
                         * parameter identifers inside function: 
                         *                    t, s, sb, h
                         */
                        console.log(step.codeAsString);
                        stepIndex = step.run!(this, stack, stackBase);
                        if (currentProgramState != this.currentProgramState) {
                            currentProgramState.stepIndex = stepIndex;

                            currentProgramState = this.currentProgramState;
                            stepIndex = currentProgramState.stepIndex;
                            currentStepList = currentProgramState.currentStepList;
                            stackBase = currentProgramState.stackBase;
                        }

                        numberOfSteps++;
                    }
                }


                currentProgramState.stepIndex = stepIndex;
                // this.currentProgram might by now not be the same as before this inner while-loop
                // because callMethod or returnFromMethod may have been called since from within 
                // step.run
            }
        } catch (exception) {

            if (exception instanceof ThrowableClass) {
                this.throwException(exception);
            } else {
                this.throwException(new SystemException("SystemException", "Systemfehler: " + exception));
                console.log(exception);
            }

        }

        return { state: this.state, stepsExecuted: numberOfSteps }
    }

    public set state(state: ThreadState){
        this._state = state;
    }


    isSingleStepCompleted() {
        return this.programStack.length < this.stepEndsWhenProgramstackLengthLowerOrEqual ||
            this.programStack.length == this.stepEndsWhenProgramstackLengthLowerOrEqual &&
            this.currentProgramState.stepIndex != this.stepEndsWhenStepIndexIsNotEqualTo;
    }

    markSingleStepOver(callbackWhenSingleStepOverEnds: () => void) {

        this.stepEndsWhenProgramstackLengthLowerOrEqual = this.programStack.length;
        this.stepEndsWhenStepIndexIsNotEqualTo = this.currentProgramState.stepIndex;
        this.stepCallback = () => {
            this.stepEndsWhenProgramstackLengthLowerOrEqual = -1;
            callbackWhenSingleStepOverEnds();
        };

    }

    unmarkStep() {
        this.stepEndsWhenProgramstackLengthLowerOrEqual = -1;
    }

    markStepOut(callbackWhenStepOutEnds: () => void) {

        this.stepEndsWhenProgramstackLengthLowerOrEqual = this.programStack.length - 1;
        this.stepEndsWhenStepIndexIsNotEqualTo = -1;
        this.stepCallback = () => {
            this.stepEndsWhenProgramstackLengthLowerOrEqual = -1;
            callbackWhenStepOutEnds();
        };

    }

    start(){
        if([ThreadState.new, ThreadState.blocked].indexOf(this.state) >= 0){
            this.state = ThreadState.runnable;
        }
    }

    throwException(exception: Exception & IThrowable) {
        let classNames = exception.getExtendedImplementedIdentifiers().slice();
        classNames.push(exception.getIdentifier());

        let stackTrace: ProgramState[] = [];
        let newProgramStates: ProgramState[] = [];
        let foundCatchBlockInfo: CatchBlockInfo | undefined;

        do {

            let ps = this.programStack[this.programStack.length - 1];

            while (ps.exceptionInfoList.length > 0) {
                let exInfo = ps.exceptionInfoList.pop()!;
                for (let cn of classNames) {
                    for (let catchBlockInfo of exInfo.catchBlockInfos) {
                        if (catchBlockInfo.exceptionTypes[cn]) {
                            foundCatchBlockInfo = catchBlockInfo;
                            break;
                        }
                    }
                }

                if (foundCatchBlockInfo) {
                    stackTrace.push(Object.assign({}, ps));
                    exception.stacktrace = stackTrace.map(state => {
                        return {
                            methodIdentifierWithClass: state.program.methodIdentifierWithClass,
                            range: <IRange>state.currentStepList[state.stepIndex].range
                        }
                    });

                    // prepare stack and program stack for executing catch block:
                    let ps1 = Object.assign({}, ps);
                    ps1.stepIndex = foundCatchBlockInfo.catchBlockBeginsWithStepIndex;
                    ps1.recentlyThrownException = exception;
                    ps1.afterExceptionTrimStackToSize = exInfo.stackSize;
                    newProgramStates.push(ps1);

                    break;
                } else {
                    if (exInfo.finallyBlockIndex) {
                        let ps2 = Object.assign({}, ps);
                        ps2.stepIndex = exInfo.finallyBlockIndex;
                        ps2.recentlyThrownException = exception;
                        ps2.afterExceptionTrimStackToSize = exInfo.stackSize;
                        newProgramStates.push(ps2);
                    }
                }
            }

            stackTrace.push(ps);
            this.programStack.pop();

        } while (this.programStack.length > 0 && !foundCatchBlockInfo)

        if (this.programStack.length == 0) {
            this.stackTrace = stackTrace;
            this.exception = exception;
            this.state = ThreadState.terminatedWithException;
            console.log(exception);
        } else {
            while (newProgramStates.length > 0) this.programStack.push(newProgramStates.pop()!);
        }
        this.currentProgramState = this.programStack[this.programStack.length - 1];
    }

    getExceptionAndTrimStack(removeException: boolean): Exception | undefined {
        let exception = this.currentProgramState.recentlyThrownException;
        if (!exception) return undefined;
        if(removeException) this.currentProgramState.recentlyThrownException = undefined;
        this.s.length = this.currentProgramState.afterExceptionTrimStackToSize!;
        return exception;
    }

    beginTryBlock(exceptionInfo: ExceptionInfo) {
        exceptionInfo.stackSize = this.s.length;
        this.currentProgramState.exceptionInfoList.push(exceptionInfo);
    }

    endCatchTryBlock() {
        this.currentProgramState.exceptionInfoList.pop();
    }

    aquireSemaphor(semaphor: Semaphor) {
        if (!semaphor.aquire(this)) {
            this.state = ThreadState.blocked;
        }
    }

    /**
     * return is called from within the step function
     */
    return(returnValue: any) {
        while (this.s.length > this.currentProgramState.stackBase) {
            this.s.pop();
        }

        let callback = this.programStack.pop()?.callbackAfterFinished;
        if (callback != null) {
            callback(returnValue);
        } else {
            if (returnValue != null) this.s.push(returnValue);
        }

        if (this.programStack.length > 0) {
            this.currentProgramState = this.programStack[this.programStack.length - 1];
            // if (this.scheduler.executeMode == ExecuteMode.singleSteps && 
            //     this.currentProgramState.currentStepList == this.currentProgramState.program.stepsMultiple) {
            //     this.switchFromMultipleToSingleStep(this.currentProgramState);
            // }
        } else {
            this.state = ThreadState.terminated;
        }
    }

    /**
     * call a java method which is executed by this thread
     * @param program 
     */
    pushProgram(program: Program, callback?: CallbackFunction) {
        // Object creation is faster than Object.assign, see
        // https://measurethat.net/Benchmarks/Show/18401/0/objectassign-vs-creating-new-objects3
        let state: ProgramState = {
            program: program,
            currentStepList: program.stepsSingle,
            // currentStepList: this.scheduler.executeMode == NExecuteMode.singleSteps ? program.stepsSingle : program.stepsMultiple,
            stackBase: this.s.length - program.numberOfParameters - program.numberOfThisObjects,  // 1 because of [this, parameter 1, ..., parameter n]
            stepIndex: 0,
            callbackAfterFinished: callback,
            exceptionInfoList: []
        }

        for (let i = 0; i < program.numberOfLocalVariables; i++) {
            this.s.push(null);
        }

        this.programStack.push(state);
        this.currentProgramState = state;
    }

    newArray(defaultValue: any, ...dimensions: number[]): Array<any> {
        let n0 = dimensions[0];

        if (dimensions.length == 1) {
            return Array(n0).fill(defaultValue);
        }
        else {
            let array = [];
            let subdimensions = dimensions.slice(1);
            // Recursive call
            for (let i = 0; i < n0; i++) {
                array.push(this.newArray(defaultValue, ...subdimensions));
            }
            return array;
        }

    }


    print(text: string | undefined, color: number | undefined) {
        this.scheduler.interpreter.printManager.print(text, false, color);
    }

    println(text: string | undefined, color: number | undefined) {
        this.scheduler.interpreter.printManager.print(text, true, color);
    }

    /**
     * Runtime method to throw Arithmetic exception
     * @param message 
     * @param startLineNumber 
     * @param startColumn 
     * @param endLineNumber 
     * @param endColumn 
     */
    AE(message: string, startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number){

        let range: IRange = {
            startLineNumber: startLineNumber,
            startColumn: startColumn,
            endLineNumber: endLineNumber,
            endColumn: endColumn 
        }

        let exception = new ArithmeticExceptionClass(message);
        exception.range = range;

        throw exception;
    }

    NPE(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number){

        let range: IRange = {
            startLineNumber: startLineNumber,
            startColumn: startColumn,
            endLineNumber: endLineNumber,
            endColumn: endColumn 
        }

        let exception = new NullPointerExceptionClass("Auf ein Attribut/eine Methode von null kann nicht zugegriffen werden.");
        exception.range = range;

        throw exception;
    }

    exit(){
        this.state = ThreadState.terminated;
    }

}