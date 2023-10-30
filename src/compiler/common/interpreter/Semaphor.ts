import { Thread } from "./Thread";
import { ThreadPool } from "./ThreadPool";

export class Semaphor {
    counter: number;        // Number of currently available tokens

    runningThreads: Thread[] = [];
    waitingThreads: Thread[] = [];

    constructor(private threadPool: ThreadPool, private _capacity: number) {
        this.counter = this._capacity;
        threadPool.semaphors.push(this);
    }

    aquire(thread: Thread): boolean {
        if (this.counter > 0) {
            this.counter--;
            this.runningThreads.push(thread);
            thread.currentlyHeldSemaphors.push(this);
            return true;
        } else {
            this.threadPool.suspendThread(thread);
            this.waitingThreads.push(thread);
            return false;
        }
    }

    release(thread: Thread) {
        let index = this.runningThreads.indexOf(thread);
        if (index >= 0) {
            this.runningThreads.splice(index, 1);
            if (this.waitingThreads.length > 0) {
                this.threadPool.restoreThread(this.waitingThreads.shift()!);
            } else {
                this.counter++;
            }
        } else {
            // Error: Thread had no token!
        }
    }



}