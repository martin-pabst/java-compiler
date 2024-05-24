import { Interpreter } from "./Interpreter";
import { Scheduler, SchedulerExitState, SchedulerState as SchedulerState } from "./Scheduler";

export class LoadController {

    private maxLoadFactor: number = 0.8;
    private batch: number = 10000;

    private lastTickTime?: number;

    constructor(private scheduler: Scheduler, private interpreter: Interpreter) {
        
    }

    tick(timerIntervalInMs: number) {

        let t0 = performance.now();
        if(this.lastTickTime){
            let dt = t0 - this.lastTickTime;
            if(dt < 100) timerIntervalInMs = dt;
        }
        this.lastTickTime = t0;

        let cycles: number = 0;
        while ((performance.now() - t0) / timerIntervalInMs < this.maxLoadFactor &&
            this.scheduler.state == SchedulerState.running) {

            let schedulerExitState = this.scheduler.run(this.batch);
            if(schedulerExitState == SchedulerExitState.nothingMoreToDo){
                break;
            }
            cycles++;
        }

        if(cycles > 2 && this.scheduler.stepCountSinceStartOfProgram > 10000){
            this.batch += 10000;
        }
    }


}