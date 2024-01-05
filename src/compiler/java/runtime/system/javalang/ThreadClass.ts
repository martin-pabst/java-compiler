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
     * TIMED_WAITING
     * A thread that is waiting for another thread to perform an action for up to a specified waiting time is in this state.
     * TERMINATED
     * A thread that has exited is in this state.
     */



}



export class ThreadClass extends ObjectClass implements RunnableInterface {

    stacktrace: Stacktrace = [];
    range?: IRange;

    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Thread extends Object" },
        { type: "method", signature: "public Thread()", java: ThreadClass.prototype._jconstructor },
        { type: "method", signature: "public Thread(Runnable runnable)", java: ThreadClass.prototype._jconstructor },
    ]


    static type: NonPrimitiveType;

    constructor() {
        super();
    }

    _jconstructor(t: Thread, runnable?: RunnableInterface) {

    }

    _mj$run$void$(t: Thread, callback: CallbackFunction): void {
        throw new Error("Method not implemented.");
    }


    _toString() {
        return new StringClass(this.getClassName() + ": ");
    }




}