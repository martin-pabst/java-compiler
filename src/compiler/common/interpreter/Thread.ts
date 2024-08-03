import { Program, Step } from "./Program";
import { Scheduler, SchedulerState } from "./Scheduler";
import { EmptyRange, IRange } from "../range/Range.ts";
import { CallbackFunction, KlassObjectRegistry } from "./StepFunction.ts";
import { ExceptionInfo, CatchBlockInfo, Exception } from "./ExceptionInfo.ts";
import { ThrowableClass } from "../../java/runtime/system/javalang/ThrowableClass.ts";
import { SystemException } from "./SystemException.ts";
import { IThrowable, Stacktrace } from "./ThrowableType.ts";
import { ArithmeticExceptionClass } from "../../java/runtime/system/javalang/ArithmeticExceptionClass.ts";
import { NullPointerExceptionClass } from "../../java/runtime/system/javalang/NullPointerExceptionClass.ts";
import { AssertionObserver, DummyAssertionObserver } from "../../java/runtime/unittests/AssertionObserver.ts";
import { ObjectClass, StringClass } from "../../java/runtime/system/javalang/ObjectClassStringClass.ts";
import { NonPrimitiveType } from "../../java/types/NonPrimitiveType.ts";
import { ClassCastExceptionClass } from "../../java/runtime/system/javalang/ClassCastExceptionClass.ts";
import { IndexOutOfBoundsExceptionClass } from "../../java/runtime/system/javalang/IndexOutOfBoundsExceptionClass.ts";
import { CallbackParameter } from "./CallbackParameter.ts";
import { ArrayToStringCaster, TextContainer } from "./ArrayToStringCaster.ts";
import { ExceptionPrinter } from "./ExceptionPrinter.ts";


export type ProgramState = {
    program: Program;
    currentStepList: Step[];   // Link to program.stepSingle or program.stepMultiple
    stepIndex: number;
    stackBase: number;
    callbackAfterFinished?: () => void;
    exceptionInfoList: ExceptionInfo[];

    recentlyThrownException?: Exception;
    afterExceptionTrimStackToSize?: number;     // stack size when entering try {...} block

    aquiredObjectLocks?: ObjectClass[];

    lastExecutedStep?: Step;

}

export type ThreadStateInfoAfterRun = {
    state: ThreadState,
    stepsExecuted: number;
}

/**
 * @link https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.State.html
 */
export enum ThreadState {
    new,          // A thread that has not yet started is in this state.
    runnable,     // A thread executing in the Java virtual machine is in this state.
    stoppedAtBreakpoint,
    blocked,      // A thread that is blocked waiting for a monitor lock (semaphor!) is in this state.
    waiting,
    timedWaiting,
    terminated,   // A thread that has exited is in this state.
    terminatedWithException,
    immediatelyAfterReplStatement
}

export class Thread {
    s: any[] = [];  // stack
    programStack: ProgramState[] = [];

    currentProgramState!: ProgramState;  // also lies on top of programStack

    lastRange?: IRange;

    private _state: ThreadState = ThreadState.new;
    public get state() { return this._state } // setter: see below

    exception?: Exception;
    stackTrace?: Stacktrace;

    stepEndsWhenProgramstackLengthLowerOrEqual: number = -1;
    stepEndsWhenStepIndexIsNotEqualTo: number = Number.MAX_SAFE_INTEGER;

    haltAtNextBreakpoint: boolean = true;

    stepCallback!: () => void;

    classes: KlassObjectRegistry;

    maxStepsPerSecond?: number;
    lastTimeThreadWasRun: number = performance.now();

    stacksizeBeforeREPLProgram: number  = 0;
    replReturnValue: any;

    numberOfSteps: number = 0;

    callbackAfterTerminated?: () => void;

    get assertionObservers() {
        return this.scheduler.interpreter.assertionObserverList;
    }

    constructor(public scheduler: Scheduler, public name: string, initialStack: any[]) {
        this.s = initialStack;
        this.classes = scheduler.classObjectRegistry;
    }

    /**
     * returns true if Thread exits
     */
    run(maxNumberOfSteps: number): ThreadStateInfoAfterRun {
        this.numberOfSteps = 0;
        let stack = this.s; // for performance reasons

        try {
            //@ts-ignore
            while (this.numberOfSteps < maxNumberOfSteps && this.state == ThreadState.runnable) {
                // For performance reasons: store all necessary data in local variables
                let currentProgramState = this.currentProgramState;
                let stepIndex = currentProgramState.stepIndex;
                let currentStepList = currentProgramState.currentStepList;
                let stackBase = currentProgramState.stackBase;

                if (this.stepEndsWhenProgramstackLengthLowerOrEqual >= 0) {
                    // singlestep-mode (slower...)
                    while (this.numberOfSteps < maxNumberOfSteps &&
                        this.state == ThreadState.runnable && !this.isSingleStepCompleted()) {
                        let step = currentStepList[stepIndex];

                        /**
                         * Behold, here the steps run!
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
                        this.numberOfSteps++;
                        this.lastRange = step.range as IRange;
                    }
                    if (this.isSingleStepCompleted()) {
                        this.stepCallback();
                        return { state: this._state, stepsExecuted: this.numberOfSteps }
                    }

                } else {
                    // not in singlestep-mode (faster!)
                    while (this.numberOfSteps < maxNumberOfSteps && this.state == ThreadState.runnable) {
                        let step = currentStepList[stepIndex];

                        /**
                         * Behold, here the steps run!
                         * parameter identifers inside function: 
                         *                    t, s, sb, h
                         */

                        // console.log(step.codeAsString);

                        stepIndex = step.run!(this, stack, stackBase);

                        if (currentProgramState != this.currentProgramState) {
                            currentProgramState.stepIndex = stepIndex;

                            currentProgramState.lastExecutedStep = step; // for Exception printing

                            currentProgramState = this.currentProgramState;
                            stepIndex = currentProgramState.stepIndex;
                            currentStepList = currentProgramState.currentStepList;
                            stackBase = currentProgramState.stackBase;
                        }

                        this.numberOfSteps++;
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

        return { state: this._state, stepsExecuted: this.numberOfSteps }
    }

    public set state(state: ThreadState) {
        this._state = state;
        if(state == ThreadState.terminated && this.callbackAfterTerminated){
            this.callbackAfterTerminated();
            this.callbackAfterTerminated = undefined;
        }
    }

    isSingleStepCompleted() {

        // if step to execute is on same position in program text as next step: execute both!
        if (this.programStack.length == this.stepEndsWhenProgramstackLengthLowerOrEqual) {
            let nextStep = this.currentProgramState.program.stepsSingle[this.currentProgramState.stepIndex];
            if (nextStep && nextStep.range && this.lastRange) {
                if (this.lastRange.startLineNumber == nextStep.range.startLineNumber && this.lastRange.startColumn == nextStep.range.startColumn) {
                    return false;
                }
            }
        }

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

    startIfNotEmptyOrDestroy() {
        if(this.programStack.length == 0){
            this.scheduler.removeThread(this);
            this.return;
        }
        if ([ThreadState.new, ThreadState.blocked].indexOf(this.state) >= 0) {
            this.state = ThreadState.runnable;
        }
    }

    throwException(exception: Exception & IThrowable) {
        let classNames = exception.getExtendedImplementedIdentifiers().slice();
        classNames.push(exception.getIdentifier());

        let rawStackTrace: ProgramState[] = [];
        let newProgramStates: ProgramState[] = [];
        let foundCatchBlockInfo: CatchBlockInfo | undefined;

        do {

            let ps = this.programStack[this.programStack.length - 1];

            while (ps?.exceptionInfoList.length > 0) {
                let exInfo = ps.exceptionInfoList.pop()!;

                if (exInfo.aquiredObjectLocks) {
                    while (exInfo.aquiredObjectLocks.length > 0) this.leaveSynchronizedBlock(exInfo.aquiredObjectLocks.pop()!);
                }

                for (let cn of classNames) {
                    for (let catchBlockInfo of exInfo.catchBlockInfos) {
                        if (catchBlockInfo.exceptionTypes[cn]) {
                            foundCatchBlockInfo = catchBlockInfo;
                            break;
                        }
                    }
                }

                if (foundCatchBlockInfo) {
                    rawStackTrace.push(Object.assign({}, ps));
                    exception.stacktrace = rawStackTrace.map(state => {
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

            if (ps?.aquiredObjectLocks) {
                while (ps.aquiredObjectLocks.length > 0) this.leaveSynchronizedBlock(ps.aquiredObjectLocks.pop()!);
            }

            rawStackTrace.push(ps);
            this.programStack.pop();

        } while (this.programStack.length > 0 && !foundCatchBlockInfo)

        if (this.programStack.length == 0) {
            this.stackTrace = rawStackTrace.map( ste => {
                if(ste) {
                    return {
                        range: ste.lastExecutedStep? ste.lastExecutedStep.range : ste.currentStepList[ste.stepIndex].range,
                        methodIdentifierWithClass: ste.program.methodIdentifierWithClass
                    }
                } else {
                    return {
                        range: EmptyRange.instance,
                        methodIdentifierWithClass: "---"
                    }
                }
            });
            this.exception = exception;
            this.state = ThreadState.terminatedWithException;
            console.log(exception);
            ExceptionPrinter.print(exception, this.stackTrace, this.scheduler.interpreter.printManager);
            //@ts-ignore
            this.currentProgramState = undefined;
        } else {
            while (newProgramStates.length > 0) this.programStack.push(newProgramStates.pop()!);
            this.currentProgramState = this.programStack[this.programStack.length - 1];
        }
    }

    getExceptionAndTrimStack(removeException: boolean): Exception | undefined {
        let exception = this.currentProgramState.recentlyThrownException;
        if (!exception) return undefined;
        if (removeException) this.currentProgramState.recentlyThrownException = undefined;
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


    /**
     * return is called from within the step function
     */
    return(returnValue: any) {
        while (this.s.length > this.currentProgramState.stackBase) {
            this.s.pop();
        }

        let callback = this.programStack.pop()?.callbackAfterFinished;
        if (returnValue != null) this.s.push(returnValue);
        if (callback != null) {
            callback();
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

    startREPLProgram(){
        this.stacksizeBeforeREPLProgram = this.s.length;
    }

    /**
     * return from REPL-Program
     */
    returnFromREPLProgram(){
        let replProgram = this.programStack.pop();
        this.replReturnValue = undefined;
        if(this.s.length > this.stacksizeBeforeREPLProgram){
            this.replReturnValue = this.s.pop();
        }
        // shouldn't be necessary:
        while(this.s.length > this.stacksizeBeforeREPLProgram){
            this.s.pop();
        }

        if(replProgram?.callbackAfterFinished){
            replProgram.callbackAfterFinished();
        }

        
        this.currentProgramState = this.programStack[this.programStack.length - 1];
        this.state = ThreadState.immediatelyAfterReplStatement;

        if(!this.currentProgramState){
            this.currentProgramState = {
                currentStepList: [],
                stepIndex: 0,
                exceptionInfoList: [],
                //@ts-ignore
                program: undefined,
                stackBase: 0
            }
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

    /**
     * call a java method which is executed by this thread
     * @param program 
     */
    pushReplProgram(program: Program, callback?: CallbackFunction) {

        // Object creation is faster than Object.assign, see
        // https://measurethat.net/Benchmarks/Show/18401/0/objectassign-vs-creating-new-objects3
        let state: ProgramState = {
            program: program,
            currentStepList: program.stepsSingle,
            // currentStepList: this.scheduler.executeMode == NExecuteMode.singleSteps ? program.stepsSingle : program.stepsMultiple,
            stackBase: this.currentProgramState ? this.currentProgramState.stackBase : 0,
            stepIndex: 0,
            callbackAfterFinished: callback,
            exceptionInfoList: []
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

    clearScreen(){
        this.scheduler.interpreter.printManager.clear();
    }

    /**
     * Runtime method to throw Arithmetic exception
     * @param message 
     * @param startLineNumber 
     * @param startColumn 
     * @param endLineNumber 
     * @param endColumn 
     */
    AE(message: string, startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number) {

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

    /**
     * Runtime method to throw IndexOutOfBoundsException exception
     * @param message 
     * @param startLineNumber 
     * @param startColumn 
     * @param endLineNumber 
     * @param endColumn 
     */
    IOBE(message: string, startLineNumber?: number, startColumn?: number, endLineNumber?: number, endColumn?: number) {

        let range: IRange | undefined = startLineNumber ? {
            startLineNumber: startLineNumber!,
            startColumn: startColumn!,
            endLineNumber: endLineNumber!,
            endColumn: endColumn!
        } : undefined;

        let exception = new IndexOutOfBoundsExceptionClass(message);
        exception.range = range;

        throw exception;
    }

    NPE(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number) {

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

    CheckCast(object: ObjectClass, destType: string, startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number): ObjectClass {
        if (object == null) return object;

        let type = object.getType() as NonPrimitiveType;

        if (type.fastExtendsImplements(destType)) return object;

        let range: IRange = {
            startLineNumber: startLineNumber,
            startColumn: startColumn,
            endLineNumber: endLineNumber,
            endColumn: endColumn
        }

        let exception = new ClassCastExceptionClass(`Ein Objekt der Klasse ${type.identifier} ist kein Objekt der Klasse ${destType} und kann daher nicht in diesen Typ gecastet werden.`);
        exception.range = range;

        throw exception;
    }

    Instanceof(object: ObjectClass, type: string): boolean {
        if(object == null) return false;
        let objType = object.getType() as NonPrimitiveType;
        return objType.fastExtendsImplements(type);
    }

    ToString(t: Thread, callback: CallbackParameter, object: ObjectClass){
        if(object == null){
            t.s.push(null);
            if(callback) callback();
            return;
        }
        object._mj$toString$String$(t, () => {
            if(callback) callback();
            return;
        });
    }

    NullstringIfNull(s: StringClass): string {
        return s == null ? "null" : s.value;
    }

    exit() {
        if(this.name == "main thread"){
            console.log("Hier!");
        }
        this.state = ThreadState.terminated;
    }

    registerCodeReached(key: string) {
        this.scheduler.interpreter.registerCodeReached(key);
    }

    registerEnteringSynchronizedBlock(aquiredLock: ObjectClass) {
        let ps = this.programStack[this.programStack.length - 1];
        if (ps.exceptionInfoList.length > 0) {
            let ei = ps.exceptionInfoList[ps.exceptionInfoList.length - 1];
            if (!ei.aquiredObjectLocks) ei.aquiredObjectLocks = [];
            ei.aquiredObjectLocks.push(aquiredLock);
        } else {
            if (!ps.aquiredObjectLocks) ps.aquiredObjectLocks = [];
            ps.aquiredObjectLocks.push(aquiredLock);
        }
    }

    leaveSynchronizedBlock(aquiredLock: ObjectClass) {
        aquiredLock.leaveSynchronizedBlock(this);
    }

    _arrayOfObjectsToString(array: any[], callback?: CallbackParameter) {
        let textContainer: TextContainer = {text: ""};
        ArrayToStringCaster.arrayOfObjectsToString(textContainer, this, array, () => {
            this.s.push(textContainer.text);
            if(callback) callback();
        });
    }

    _primitiveElementOrArrayToString(element: any): string {
        if (Array.isArray(element)) {
            return "[" + element.map(e => this._primitiveElementOrArrayToString(e)).join(", ") + "]";
        }

        if (typeof element == "string") return '"' + element + '"';

        return "" + element;
    }

}