import { Module } from "../module/Module";
import { EventManager } from "./EventManager";
import { LoadController } from "./LoadController";
import { PrintManager } from "./PrintManager";
import { HelperRegistry, KlassObjectRegistry, TextPositionWithModule, ThreadPool, ThreadPoolLstate } from "./ThreadPool";

type InterpreterEvents = "stop" | "done" | "resetRuntime";

export class Interpreter {

    loadController: LoadController;
    threadPool: ThreadPool;

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
    //ThreadPoolLstatus { done, running, paused, not_initialized }

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

        this.threadPool = new ThreadPool(this, this.helperRegistry);
        this.loadController = new LoadController(this.threadPool, this);
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

        if (this.threadPool.state != ThreadPoolLstate.paused) {
            // TODO!
            // this.init();
            if (this.threadPool.state == ThreadPoolLstate.not_initialized) {
                return;
            }
            this.resetRuntime();
        }

        this.threadPool.runSingleStepKeepingThread(stepInto, () => {
            this.pause();
        });
        if (!stepInto) {
            this.threadPool.setState(ThreadPoolLstate.running);
        }
    }

    showProgramPointer(_textPositionWithModule: TextPositionWithModule) {
        // TODO: Show program pointer
    }

    pause() {
        this.threadPool.setState(ThreadPoolLstate.paused);
        this.threadPool.unmarkStep();
        this.showProgramPointer(this.threadPool.getNextStepPosition());
    }

    stop(restart: boolean) {

        // this.inputManager.hide();
        this.threadPool.setState(ThreadPoolLstate.stopped);
        this.threadPool.unmarkStep();

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

        if (this.threadPool.state != ThreadPoolLstate.paused) {
            // TODO!
            // this.init(this.mainModule);
            this.resetRuntime();
        }

        this.hideProgrampointerPosition();

        this.threadPool.setState(ThreadPoolLstate.running);

        // this.getTimerClass().startTimer();

    }

    stepOut() {
        this.threadPool.stepOut(() => {
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

    setState(state: ThreadPoolLstate) {

        if (state == ThreadPoolLstate.stopped) {
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

        // if (state == ThreadPoolLstate.stopped) {
        //     this.eventManager.fireEvent("done");
        //     if (this.worldHelper != null) {
        //         this.worldHelper.clearActorLists();
        //     }
        //     this.gngEreignisbehandlungHelper?.detachEvents();
        //     this.gngEreignisbehandlungHelper = null;

        // }

        // if (oldState != ThreadPoolLstate.stopped && state == ThreadPoolLstate.stopped) {
        //     // TODO
        //     // this.debugger.disable();
        //     this.keyboardTool.unsubscribeAllListeners();
        // }

        // if ([ThreadPoolLstate.running, ThreadPoolLstate.paused].indexOf(oldState) < 0
        //     && state == ThreadPoolLstate.running) {
        //     // TODO
        //     //   this.debugger.enable();
        // }

        this.threadPool.setState(state);
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

        this.threadPool.init(this.mainModule, classes);
        this.threadPool.setState(ThreadPoolLstate.stopped);

    }

    hideProgrampointerPosition() {

        // this.main.hideProgramPointerPosition();

    }


}