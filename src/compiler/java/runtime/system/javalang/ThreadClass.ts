import { Exception } from "../../../../common/interpreter/ExceptionInfo.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread, ThreadState } from "../../../../common/interpreter/Thread.ts";
import { IThrowable, Stacktrace } from "../../../../common/interpreter/ThrowableType.ts";
import { IRange } from "../../../../common/range/Range.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { EnumClass } from "./EnumClass.ts";
import { ObjectClass, StringClass } from "./ObjectClassStringClass.ts";
import { RunnableInterface } from "./RunnableInterface.ts";


export class ThreadStateClass extends EnumClass {

    static values: ThreadStateClass[] = [
    new ThreadStateClass("new", ThreadState.new),
    new ThreadStateClass("runnable", ThreadState.runnable),
    new ThreadStateClass("stopped_at_breakpoint", ThreadState.stoppedAtBreakpoint),
    new ThreadStateClass("blocked", ThreadState.blocked),
    new ThreadStateClass("waiting", ThreadState.waiting),
    new ThreadStateClass("timed_waiting", ThreadState.timed_waiting),
    new ThreadStateClass("terminated", ThreadState.terminated)];

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "enum Thread.State" }
    ]

    static type: NonPrimitiveType;

    static _values(): ThreadStateClass[] {
        return ThreadStateClass.values;
    }

    /**
     * NEW
     * A thread that has not yet started is in this state.
     * RUNNABLE
     * A thread executing in the Java virtual machine is in this state.
     * BLOCKED
     * A thread that is blocked waiting for a monitor lock is in this state.
     * WAITING
     * A thread that is waiting indefinitely for another thread to perform a particular action is in this state.
     * (see Object.wait(), Object.notify(), Object.notifyAll())
     * TIMED_WAITING
     * A thread that is waiting for another thread to perform an action for up to a specified waiting time is in this state.
     * TERMINATED
     * A thread that has exited is in this state.
     */



}



export class ThreadClass extends ObjectClass implements RunnableInterface {

    stacktrace: Stacktrace = [];
    range?: IRange;

    thread?: Thread;
    runnable?: RunnableInterface;

    threadsToJoinWhenFinished: Thread[] = [];

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Thread extends Object implements Runnable" },
        { type: "method", signature: "public Thread()", java: ThreadClass.prototype._jconstructor },
        { type: "method", signature: "public Thread(Runnable runnable)", java: ThreadClass.prototype._jconstructor },
        { type: "method", signature: "public Thread.State getState()", java: ThreadClass.prototype._mj$getState$Thread_State$ },
        { type: "method", signature: "public void run()", java: ThreadClass.prototype._mj$run$void$ },
        { type: "method", signature: "public void start()", java: ThreadClass.prototype._mj$start$void$ },
        { type: "method", signature: "public void join()", java: ThreadClass.prototype._mj$join },
        { type: "method", signature: "public void join(int milliseconds)", java: ThreadClass.prototype._mj$join },
    ]


    static type: NonPrimitiveType;

    constructor() {
        super();
    }

    _jconstructor(t: Thread, callback?: CallbackFunction, runnable?: RunnableInterface) {
        t.s.push(this);        
        this.runnable = runnable;
    }

    _mj$getState$Thread_State$(t: Thread, callback: CallbackFunction){

        let state: ThreadStateClass = ThreadStateClass._values()[0];
        if(this.thread){
            state = ThreadStateClass._values()[this.thread.state];
        }

        t.s.push(state);
        if(callback) callback;
    }

    _mj$run$void$(t: Thread, callback: CallbackFunction): void {
        if(callback) callback();   // do nothing!
    }

    _mj$start$void$(t: Thread, callback: CallbackFunction): void {
        
        if(!this.thread){

            let runnable = this.runnable;
            if(!runnable) runnable = this;

            this.thread = t.scheduler.createThread([]);
            
            let that = this;
            runnable._mj$run$void$(this.thread, () => {
                that.callbackWhenThreadFinished();        
            })

            this.thread.start();
        }

        if(callback) callback(); 
    }

    callbackWhenThreadFinished(){
        for (let t of this.threadsToJoinWhenFinished){
            t.scheduler.restoreThread(t);
        }
        this.threadsToJoinWhenFinished.length = 0;
    }

    _mj$join(t: Thread, callback: CallbackFunction, milliseconds?: number){

        // only other thread can join this thread
        if(!this.thread || this.thread == t || this.thread.state >= ThreadState.terminated){
            if(callback) callback();
            return;
        }

        let that = this;

        if(milliseconds){

            setTimeout(() => {
                let index = that.threadsToJoinWhenFinished.indexOf(t);
                if(index >= 0) that.threadsToJoinWhenFinished.splice(index, 1);
                t.scheduler.restoreThread(t);
            }, milliseconds);

            t.state = ThreadState.timed_waiting;
        } else {
            t.state = ThreadState.waiting;
        }

        this.threadsToJoinWhenFinished.push(t);
        t.scheduler.suspendThread(t);

        if(callback) callback();
    }

    _toString() {
        return new StringClass(this.getClassName() + ": ");
    }




}