import { Interpreter } from "./Interpreter";
import { Scheduler, SchedulerState as SchedulerState } from "./Scheduler";

export class LoadController {

    private maxLoadFactor: number = 0.7;

    private lastTickTime: number = 0;

    private stepsPerSecondGoal!: number;
    private timeBetweenStepsGoal!: number;

    constructor(private scheduler: Scheduler, private interpreter: Interpreter) {
        this.setStepsPerSecond(100);
    }

    tick(deltaUntilNextTick: number) {
        let t0 = performance.now();
        let deltaTime = t0 - this.lastTickTime;

        if (deltaTime < this.timeBetweenStepsGoal) return;
        this.lastTickTime = t0;

        if (this.timeBetweenStepsGoal >= deltaUntilNextTick && this.scheduler.state == SchedulerState.running) {
            this.scheduler.run(1);
            if(this.stepsPerSecondGoal <= 12){
                this.interpreter.showProgramPointer(this.scheduler.getNextStepPosition());
            }
            return;
        }

        let stepsPerTickGoal = this.stepsPerSecondGoal / 1000 * deltaUntilNextTick;
        let batch = Math.max(stepsPerTickGoal, 1000);

        let i: number = 0;
        while (i < stepsPerTickGoal &&
            (performance.now() - t0) / deltaUntilNextTick < this.maxLoadFactor &&
            this.scheduler.state == SchedulerState.running) {

            this.scheduler.run(Math.max(batch, stepsPerTickGoal - i));
            i += batch;

        }

    }

    setStepsPerSecond(value: number) {
        this.stepsPerSecondGoal = value;
        this.timeBetweenStepsGoal = 1000 / value;
    }



}