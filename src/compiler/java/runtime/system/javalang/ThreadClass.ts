import { Exception } from "../../../../common/interpreter/ExceptionInfo.ts";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../../common/interpreter/Thread.ts";
import { IThrowable, Stacktrace } from "../../../../common/interpreter/ThrowableType.ts";
import { IRange } from "../../../../common/range/Range.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { EnumClass } from "./EnumClass.ts";
import { ObjectClass, StringClass } from "./ObjectClassStringClass.ts";
import { RunnableInterface } from "./RunnableInterface.ts";


export class ThreadState extends EnumClass {

    static NEW: ThreadState = new ThreadState("NEW", 0);
    static RUNNABLE: ThreadState = new ThreadState("RUNNABLE", 1);
    static BLOCKED: ThreadState = new ThreadState("BLOCKED", 2);
    static WAITING: ThreadState = new ThreadState("WAITING", 3);
    static TIMED_WAITING: ThreadState = new ThreadState("TIMED_WAITING", 4);
    static TERMINATED: ThreadState = new ThreadState("TERMINATED", 5);

    static values: ThreadState[] = [ThreadState.NEW, ThreadState.RUNNABLE, ThreadState.BLOCKED, ThreadState.WAITING, ThreadState.TIMED_WAITING, ThreadState.TERMINATED];

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "enum Thread.State" }
    ]

    static type: NonPrimitiveType;


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

    state: ThreadState = ThreadState.NEW;
    thread?: Thread;
    runnable?: RunnableInterface;
    callbackWhenThreadFinished?: CallbackFunction;

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Thread extends Object implements Runnable" },
        { type: "method", signature: "public Thread()", java: ThreadClass.prototype._jconstructor },
        { type: "method", signature: "public Thread(Runnable runnable)", java: ThreadClass.prototype._jconstructor },
        { type: "method", signature: "public Thread.State getState()", java: ThreadClass.prototype._mj$getState$Thread_State$ },
        { type: "method", signature: "public void run()", java: ThreadClass.prototype._mj$run$void$ },
        { type: "method", signature: "public void start()", java: ThreadClass.prototype._mj$start$void$ },
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
        t.s.push(this.state);
        if(callback) callback;
    }

    _mj$run$void$(t: Thread, callback: CallbackFunction): void {
        if(callback) callback();   // do nothing!
    }

    _mj$start$void$(t: Thread, callback: CallbackFunction): void {
        
        if(this.state == ThreadState.NEW){

            let runnable = this.runnable;
            if(!runnable) runnable = this;

            this.thread = t.scheduler.createThread([]);
            
            let that = this;
            runnable._mj$run$void$(this.thread, () => {
                if(that.callbackWhenThreadFinished) that.callbackWhenThreadFinished();
            })

            this.thread.start();
        }

        if(callback) callback(); 
    }

    _toString() {
        return new StringClass(this.getClassName() + ": ");
    }




}