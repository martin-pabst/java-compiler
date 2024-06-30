import { Interpreter } from "./Interpreter";
import { Scheduler, SchedulerExitState, SchedulerState as SchedulerState } from "./Scheduler";

export class LoadController {

    private maxLoadFactor: number = 0.8;
    private numberOfStepsPerBatch: number = 10000;

    private lastTickTime?: number;

    constructor(private scheduler: Scheduler, private interpreter: Interpreter) {
        
    }

    /**
     * This method is called periodically. It computes number of steps to execute in a way
     * that consumes this.maxLoadFactor of CPU-Time at most.
     * 
     * As it doesn't know exactly how long an average step takes it feeds
     * Scheduler.run in batches and measures elapsed time after each batch.
     * 
     * This is the outer one of three main loops:
     * LoadController.tick calls Scheduler.run calls Thread.run
     * 
     * @param timerIntervalInMs the interval this method is called
     */
    tick(timerIntervalInMs: number) {
        let t0 = performance.now();

        // if(this.scheduler.runningThreads.length > 0)
        // console.log("started batch: " + t0);

        // we don't trust given timerIntervalInMs if we can measure
        // elapsed time since last call ourselves:
        if(this.lastTickTime){
            let dt = t0 - this.lastTickTime;
            if(dt < 100) timerIntervalInMs = dt;
        }
        this.lastTickTime = t0;

        let numberOfBatchesSoFar: number = 0;
        while ((performance.now() - t0) / timerIntervalInMs < this.maxLoadFactor &&  // <- this ensures we don't overload the system
            this.scheduler.state == SchedulerState.running) {
            
            // let it run!
            let schedulerExitState = this.scheduler.run(this.numberOfStepsPerBatch);
            
            // exit prematurely if scheduler has nothing more to do
            if(schedulerExitState == SchedulerExitState.nothingMoreToDo){
                break;
            }
            numberOfBatchesSoFar++;
        }

        // if more than two batches fit into available time: make batches larger!
        if(numberOfBatchesSoFar > 2 && this.scheduler.stepCountSinceStartOfProgram > 10000){
            this.numberOfStepsPerBatch += 10000;
        }
    }


}