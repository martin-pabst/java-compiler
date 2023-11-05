import { Module } from "../module/Module";
import { EventManager } from "./EventManager";
import { LoadController } from "./LoadController";
import { PrintManager } from "./PrintManager";
import { HelperRegistry, KlassObjectRegistry, TextPositionWithModule, Scheduler, SchedulerState } from "./Scheduler";

type InterpreterEvents = "stop" | "done" | "resetRuntime";

export class Interpreter {

    maxStepsPerSecond = 1e6;

    loadController: LoadController;
    scheduler: Scheduler;

    isExternalTimer: boolean = false;
    timerId: any;
    timerIntervalMs: number = 16;

    mainModule?: Module;
    moduleStoreVersion: number = -100;

    // inputManager: InputManager;

    // keyboardTool: KeyboardTool;
    // gamepadTool: GamepadTool;

    eventManager: EventManager<InterpreterEvents> = new EventManager();
    private helperRegistry: HelperRegistry = {};

    actions: string[] = ["start", "pause", "stop", "stepOver",
        "stepInto", "stepOut", "restart"];
    //SchedulerLstatus { done, running, paused, not_initialized }

    // buttonActiveMatrix[button][i] tells if button is active at 
    // InterpreterState i
    buttonActiveMatrix: { [buttonName: string]: boolean[] } = {
        "start": [true, false, true, false],
        "pause": [false, true, false, false],
        "stop": [false, true, true, false],
        "stepOver": [true, false, true, false],
        "stepInto": [true, false, true, false],
        "stepOut": [false, false, true, false],
        "restart": [true, true, true, false]
    }



    constructor(public printManager: PrintManager) {
        // constructor(public main: MainBase, public primitiveTypes: NPrimitiveTypeManager, public controlButtons: ProgramControlButtons, $runDiv: JQuery<HTMLElement>) {

        // this.printManager = new PrintManager($runDiv, this.main);
        // this.inputManager = new InputManager($runDiv, this.main);
        // if (main.isEmbedded()) {
        //     this.keyboardTool = new KeyboardTool(jQuery('html'), main);
        // } else {
        //     this.keyboardTool = new KeyboardTool(jQuery(window), main);
        // }

        // this.gamepadTool = new GamepadTool();

        // TODO: This wires up speedcontrol with interpreter
        // controlButtons.setInterpreter(this);

        this.scheduler = new Scheduler(this, this.helperRegistry);
        this.loadController = new LoadController(this.scheduler, this);
        this.initTimer();
    }

    registerHelper(identifier: string, helper: Object) {
        this.helperRegistry.set(identifier, helper);
    }

    initTimer() {

        let that = this;
        let periodicFunction = () => {

            if (!that.isExternalTimer) {
                that.timerFunction(that.timerIntervalMs);
            }

        }

        this.timerId = setInterval(periodicFunction, this.timerIntervalMs);

    }

    timerFunction(timerIntervalMs: number) {
        this.loadController.tick(timerIntervalMs);
    }

    executeOneStep(stepInto: boolean) {

        if (this.scheduler.state != SchedulerState.paused) {
            // TODO!
            // this.init();
            if (this.scheduler.state == SchedulerState.not_initialized) {
                return;
            }
            this.resetRuntime();
        }

        this.scheduler.runSingleStepKeepingThread(stepInto, () => {
            this.pause();
        });
        if (!stepInto) {
            this.scheduler.setState(SchedulerState.running);
        }
    }

    showProgramPointer(_textPositionWithModule: TextPositionWithModule) {
        // TODO: Show program pointer
    }

    pause() {
        this.scheduler.setState(SchedulerState.paused);
        this.scheduler.unmarkStep();
        this.showProgramPointer(this.scheduler.getNextStepPosition());
    }

    stop(restart: boolean) {

        // this.inputManager.hide();
        this.scheduler.setState(SchedulerState.stopped);
        this.scheduler.unmarkStep();

        this.eventManager.fire("stop");

        // Beware: originally this was after this.getTimerClass().stopTimer();
        // if Bitmap caching doesn't work, we need two events...
        // if (this.worldHelper != null) {
        //     this.worldHelper.cacheAsBitmap();
        // }


        setTimeout(() => {
            // this.main.hideProgramPointerPosition();
            if (restart) {
                this.start();
            }
        }, 500);


    }

    start() {

        // this.main.getBottomDiv()?.console?.clearErrors();

        if (this.scheduler.state != SchedulerState.paused) {
            // TODO!
            // this.init(this.mainModule);
            this.resetRuntime();
        }

        this.hideProgrampointerPosition();

        this.scheduler.setState(SchedulerState.running);

        // this.getTimerClass().startTimer();

    }

    stepOut() {
        this.scheduler.stepOut(() => {
            this.pause();
        })
    }

    initGUI() {

        // let am = this.main.getActionManager();

        // am.registerAction("interpreter.start", ['F4'],
        //     () => {
        //         if (am.isActive("interpreter.start")) {
        //             this.start();
        //         } else {
        //             this.pause();
        //         }

        //     }, "Programm starten", this.controlButtons.$buttonStart);

        // am.registerAction("interpreter.pause", ['F4'],
        //     () => {
        //         if (am.isActive("interpreter.start")) {
        //             this.start();
        //         } else {
        //             this.pause();
        //         }

        //     }, "Pause", this.controlButtons.$buttonPause);

        // am.registerAction("interpreter.stop", [],
        //     () => {
        //         this.stop(false);
        //     }, "Programm anhalten", this.controlButtons.$buttonStop);

        // am.registerAction("interpreter.stepOver", ['F6'],
        //     () => {
        //         this.executeOneStep(false);
        //     }, "Einzelschritt (Step over)", this.controlButtons.$buttonStepOver);

        // am.registerAction("interpreter.stepInto", ['F7'],
        //     () => {
        //         this.executeOneStep(true);
        //     }, "Einzelschritt (Step into)", this.controlButtons.$buttonStepInto);

        // am.registerAction("interpreter.stepOut", [],
        //     () => {
        //         this.stepOut();
        //     }, "Step out", this.controlButtons.$buttonStepOut);

        // am.registerAction("interpreter.restart", [],
        //     () => {
        //         this.stop(true);
        //     }, "Neu starten", this.controlButtons.$buttonRestart);

    }

    setState(state: SchedulerState) {

        if (state == SchedulerState.stopped) {
            // TODO
            // this.closeAllWebsockets();
        }

        // let am = this.main.getActionManager();

        // for (let actionId of this.actions) {
        //     am.setActive("interpreter." + actionId, this.buttonActiveMatrix[actionId][state]);
        // }

        // let buttonStartActive = this.buttonActiveMatrix['start'][state];

        // if (buttonStartActive) {
        //     this.controlButtons.$buttonStart.show();
        //     this.controlButtons.$buttonPause.hide();
        // } else {
        //     this.controlButtons.$buttonStart.hide();
        //     this.controlButtons.$buttonPause.show();
        // }

        // let buttonStopActive = this.buttonActiveMatrix['stop'][state];

        // if (state == SchedulerLstate.stopped) {
        //     this.eventManager.fireEvent("done");
        //     if (this.worldHelper != null) {
        //         this.worldHelper.clearActorLists();
        //     }
        //     this.gngEreignisbehandlungHelper?.detachEvents();
        //     this.gngEreignisbehandlungHelper = null;

        // }

        // if (oldState != SchedulerLstate.stopped && state == SchedulerLstate.stopped) {
        //     // TODO
        //     // this.debugger.disable();
        //     this.keyboardTool.unsubscribeAllListeners();
        // }

        // if ([SchedulerLstate.running, SchedulerLstate.paused].indexOf(oldState) < 0
        //     && state == SchedulerLstate.running) {
        //     // TODO
        //     //   this.debugger.enable();
        // }

        this.scheduler.setState(state);
    }

    resetRuntime() {
        this.eventManager.fire("resetRuntime");
        
        // this.printManager.clear();
        // this.worldHelper?.destroyWorld();
        // this.processingHelper?.destroyWorld();
        // this.gngEreignisbehandlungHelper?.detachEvents();
        // this.gngEreignisbehandlungHelper = null;
    }

    init(newMainModule: Module, classes: KlassObjectRegistry) {

        // this.main.getBottomDiv()?.console?.clearErrors();

        // let cem = this.main.getCurrentlyEditedModule();

        // cem.getBreakpointPositionsFromEditor();

        // this.main.getBottomDiv()?.console?.clearExceptions();

        // /*
        //     As long as there is no startable new Version of current workspace we keep current compiled modules so
        //     that variables and objects defined/instantiated via console can be kept, too. 
        // */
        // if (this.moduleStoreVersion != this.main.version && this.main.getCompiler().atLeastOneModuleIsStartable) {
        //     this.main.copyExecutableModuleStoreToInterpreter();
        //     this.main.getBottomDiv()?.console?.detachValues();  // detach values from console entries
        // }


        this.mainModule = newMainModule;

        this.scheduler.init(this.mainModule, classes);
        this.scheduler.setState(SchedulerState.stopped);

    }

    hideProgrampointerPosition() {

        // this.main.hideProgramPointerPosition();

    }


}