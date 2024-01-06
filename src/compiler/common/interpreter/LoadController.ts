import { Interpreter } from "./Interpreter";
import { Scheduler, SchedulerState as SchedulerState } from "./Scheduler";

export class LoadController {

    private maxLoadFactor: number = 0.7;

    private lastTickTime: number = 0;

    private stepsPerSecondGoal: number = 1e6;
    private timeBetweenStepsGoal!: number;

    constructor(private scheduler: Scheduler, private interpreter: Interpreter) {
        this.setStepsPerSecond(1e8);
    }

    tick(timerIntervalInMs: number) {

        let t0 = performance.now();
        let deltaTime = t0 - this.lastTickTime;
        
        // if(deltaTime > timerIntervalInMs * 1.5) console.log("Timer Interval instable: " + deltaTime);

        if (deltaTime < this.timeBetweenStepsGoal) return;
        this.lastTickTime = t0;

        if (this.timeBetweenStepsGoal >= timerIntervalInMs && this.scheduler.state == SchedulerState.running) {
            this.scheduler.run(1);
            if(this.stepsPerSecondGoal <= 12){
                this.interpreter.showProgramPointer(this.scheduler.getNextStepPosition());
            }
            return;
        }

        let stepsPerTickGoal = this.stepsPerSecondGoal / 1000 * timerIntervalInMs;
        let batch = Math.max(stepsPerTickGoal, 10000);
        let i: number = 0;
        while (i < stepsPerTickGoal &&
            (performance.now() - t0) / timerIntervalInMs < this.maxLoadFactor &&
            this.scheduler.state == SchedulerState.running) {

            let n = Math.min(batch, stepsPerTickGoal - i);
            this.scheduler.run(n);
            i += n;

        }

    }

    setStepsPerSecond(value: number) {
        console.log(value);
        this.stepsPerSecondGoal = value;
        this.timeBetweenStepsGoal = 1000 / value;
    }

    getStepsPerSecond(): number {
        return this.stepsPerSecondGoal;
    }


}