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

    static NEW: ThreadStateClass = new ThreadStateClass("NEW", 0);
    static RUNNABLE: ThreadStateClass = new ThreadStateClass("RUNNABLE", 1);
    static BLOCKED: ThreadStateClass = new ThreadStateClass("BLOCKED", 2);
    static WAITING: ThreadStateClass = new ThreadStateClass("WAITING", 3);
    static TIMED_WAITING: ThreadStateClass = new ThreadStateClass("TIMED_WAITING", 4);
    static TERMINATED: ThreadStateClass = new ThreadStateClass("TERMINATED", 5);

    static values: ThreadStateClass[] = [ThreadStateClass.NEW, ThreadStateClass.RUNNABLE, ThreadStateClass.BLOCKED, ThreadStateClass.WAITING, ThreadStateClass.TIMED_WAITING, ThreadStateClass.TERMINATED];

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "enum Thread.State" }
    ]

    static type: NonPrimitiveType;

    static ThreadStateToEnumMap: Record<ThreadState, ThreadStateClass> = {
        [ThreadState.new]: ThreadStateClass.NEW,
        [ThreadState.runnable]: ThreadStateClass.RUNNABLE,
        [ThreadState.blocked]: ThreadStateClass.BLOCKED,
        [ThreadState.waiting]: ThreadStateClass.WAITING,
        [ThreadState.timed_waiting]: ThreadStateClass.TIMED_WAITING,
        [ThreadState.terminated]: ThreadStateClass.TERMINATED,
        [ThreadState.terminatedWithException]: ThreadStateClass.TERMINATED,
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

    _jconstructor(t: Thread, runnable?: RunnableInterface) {
        t.s.push(this);        
        this.runnable = runnable;
    }

    _mj$getState$Thread_State$(t: Thread, callback: CallbackFunction){

        let state: ThreadStateClass = ThreadStateClass.NEW;
        if(this.thread){
            state = ThreadStateClass.ThreadStateToEnumMap[this.thread.state];
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
                that.threadsToJoinWhenFinished.splice(that.threadsToJoinWhenFinished.indexOf(t), 1);
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