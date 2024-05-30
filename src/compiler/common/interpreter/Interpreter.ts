import { ActionManager } from "../../../testgui/ActionManager.ts";
import { AssertionObserver } from "../../java/runtime/unittests/AssertionObserver.ts";
import { Executable } from "../Executable.ts";
import { CodeReachedAssertions } from "./CodeReachedAssertions.ts";
import { EventManager } from "./EventManager";
import { LoadController } from "./LoadController";
import { DummyPrintManager, PrintManager } from "./PrintManager";
import { ProgramPointerPositionInfo, Scheduler, SchedulerState } from "./Scheduler";
import { GraphicsManager } from "./GraphicsManager.ts";
import { IWorld } from "../../java/runtime/graphics/IWorld.ts";
import { KeyboardManager } from "./KeyboardManager.ts";
import { Thread, ThreadState } from "./Thread.ts";
import { BreakpointManager } from "../BreakpointManager.ts";
import { Debugger } from "../debugger/Debugger.ts";


type InterpreterEvents = "stop" | "done" | "resetRuntime";



export type ShowProgramPointerCallback = (showHide: "show" | "hide", _textPositionWithModule?: ProgramPointerPositionInfo) => void;

export class Interpreter {

    loadController: LoadController;
    scheduler: Scheduler;

    isExternalTimer: boolean = false;
    timerId: any;
    timerIntervalMs: number = 10;

    executable?: Executable;

    assertionObserverList: AssertionObserver[] = [];
    codeReachedAssertions: CodeReachedAssertions = new CodeReachedAssertions();

    // inputManager: InputManager;

    // keyboardTool: KeyboardTool;
    // gamepadTool: GamepadTool;

    public printManager: PrintManager;

    eventManager: EventManager<InterpreterEvents> = new EventManager();
    showProgramPointerCallback?: ShowProgramPointerCallback;

    objectStore: { [key: string]: any } = {};

    actions: string[] = ["start", "pause", "stop", "stepOver",
        "stepInto", "stepOut", "restart"];
    //SchedulerLstatus { done, running, paused, not_initialized }

    // buttonActiveMatrix[button][i] tells if button is active at 
    // SchedulerState i
    // export enum SchedulerState { not_initialized, running, paused, stopped }

    buttonActiveMatrix: { [buttonName: string]: boolean[] } = {
        "start": [false, false, true, true],
        "pause": [false, true, false, false],
        "stop": [false, true, true, false],
        "stepOver": [false, false, true, true],
        "stepInto": [false, false, true, true],
        "stepOut": [false, false, true, false],
        "restart": [false, true, true, true]
    }

    mainThread?: Thread;
    public stepsPerSecondGoal: number = 1e8;
    public isMaxSpeed: boolean = true;

    constructor(printManager?: PrintManager, private actionManager?: ActionManager,
        public graphicsManager?: GraphicsManager, public keyboardManager?: KeyboardManager,
        public breakpointManager?: BreakpointManager, public _debugger?: Debugger
    ) {
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

        this.printManager = printManager || new DummyPrintManager();

        this.registerActions();

        if (breakpointManager) breakpointManager.attachToInterpreter(this);

        this.scheduler = new Scheduler(this);
        this.loadController = new LoadController(this.scheduler, this);
        this.initTimer();
        this.setStepsPerSecond(1e8, true);
        this.setState(SchedulerState.not_initialized);
    }

    setTestExecutable(executable: Executable | undefined) {
        if (!executable) return;

        executable.setTestExecutable();
        this.executable = executable;
        if (executable.testModule) {
            executable.compileToJavascript();
            if (executable.isCompiledToJavascript) {
                this.init(executable);
                this.setState(SchedulerState.stopped);
            } else {
                this.setState(SchedulerState.not_initialized);
            }
        } else {
            this.setState(SchedulerState.not_initialized);
        }
    }

    setExecutable(executable: Executable | undefined) {
        if (!executable) return;
        this.executable = executable;
        if (executable.mainModule) {
            executable.compileToJavascript();
            if (executable.isCompiledToJavascript) {
                this.init(executable);
                this.setState(SchedulerState.stopped);
            } else {
                this.setState(SchedulerState.not_initialized);
            }
        } else {
            this.setState(SchedulerState.not_initialized);
        }
    }

    attachAssertionObserver(observer: AssertionObserver) {
        this.assertionObserverList.push(observer);
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
            if (this.scheduler.state == SchedulerState.not_initialized) {
                return;
            }
            this.printManager.clear();
            this.init(this.executable!);
            this.resetRuntime();
            this.showProgramPointer(this.scheduler.getNextStepPosition());
            this.updateDebugger();
            this.setState(SchedulerState.paused);
            return;
        }
        this.scheduler.runSingleStepKeepingThread(stepInto, () => {
            this.pause();
        });
        if (!stepInto) {
            this.setState(SchedulerState.running);
        }
    }

    showProgramPointer(_textPositionWithModule: ProgramPointerPositionInfo | undefined) {
        if (this.showProgramPointerCallback) {
            if (_textPositionWithModule?.range) {
                if (_textPositionWithModule.range.startLineNumber >= 0) {
                    this.showProgramPointerCallback("show", _textPositionWithModule);
                }
            } else {
                this.showProgramPointerCallback("hide");
            }
        }
    }

    pause() {
        if (this.scheduler.getNextStepPosition()) {
            this.pauseIntern();
        } else {
            if (this.hasActors()) {
                this.scheduler.onStartingNextThreadCallback = () => {
                    this.pauseIntern();
                }
            }
        }
    }

    private pauseIntern() {
        this.setState(SchedulerState.paused);
        this.scheduler.keepThread = true;
        this.scheduler.unmarkCurrentlyExecutedSingleStep();
        this.showProgramPointer(this.scheduler.getNextStepPosition());
        this.updateDebugger();
    }

    public updateDebugger() {
        if (!this._debugger) return;
        this._debugger.showThreadState(this.scheduler.getCurrentThread());
    }

    stop(restart: boolean) {

        this.showProgramPointer(undefined);
        this.updateDebugger();

        // this.inputManager.hide();
        this.setState(SchedulerState.stopped);
        this.scheduler.unmarkCurrentlyExecutedSingleStep();

        // Beware: originally this was after this.getTimerClass().stopTimer();
        // if Bitmap caching doesn't work, we need two events...
        // if (this.worldHelper != null) {
        //     this.worldHelper.cacheAsBitmap();
        // }


        setTimeout(() => {
            this.hideProgrampointerPosition();
            if (restart) {
                this.start();
            }
        }, 500);


    }

    start() {

        // this.main.getBottomDiv()?.console?.clearErrors();
        if (this.scheduler.state != SchedulerState.paused && this.executable) {
            this.printManager.clear();
            this.init(this.executable);
            this.resetRuntime();
        }

        this.hideProgrampointerPosition();

        this.scheduler.keepThread = false;
        this.scheduler.resetLastTimeExecutedTimestamps();

        this.setState(SchedulerState.running);

        // this.getTimerClass().startTimer();

    }

    runMainProgramSynchronously() {
        this.start();
        while (this.scheduler.state != SchedulerState.stopped && this.scheduler.state != SchedulerState.error) {
            this.scheduler.run(100);
        }
    }

    stepOut() {
        this.scheduler.stepOut(() => {
            this.pause();
        })
        this.setState(SchedulerState.running);
    }

    registerActions() {

        if (!this.actionManager) return;

        this.actionManager.registerAction("interpreter.start", ['F4'],
            () => {
                if (this.actionManager!.isActive("interpreter.start")) {
                    this.start();
                } else {
                    this.pause();
                }

            }, "Programm starten");

        this.actionManager.registerAction("interpreter.pause", ['F4'],
            () => {
                if (this.actionManager!.isActive("interpreter.start")) {
                    this.start();
                } else {
                    this.pause();
                }

            }, "Pause");

        this.actionManager.registerAction("interpreter.stop", [],
            () => {
                this.stop(false);
            }, "Programm anhalten");

        this.actionManager.registerAction("interpreter.stepOver", ['F6'],
            () => {
                this.executeOneStep(false);
            }, "Einzelschritt (Step over)");

        this.actionManager.registerAction("interpreter.stepInto", ['F7'],
            () => {
                this.executeOneStep(true);
            }, "Einzelschritt (Step into)");

        this.actionManager.registerAction("interpreter.stepOut", [],
            () => {
                this.stepOut();
            }, "Step out");

        this.actionManager.registerAction("interpreter.restart", [],
            () => {
                this.stop(true);
            }, "Neu starten");

    }

    setState(state: SchedulerState) {

        if (state == SchedulerState.stopped) {
            this.showProgramPointer(undefined);
            this.updateDebugger();
            this.eventManager.fire("stop");
            // TODO
            // this.closeAllWebsockets();
        }

        if (this.actionManager) {
            for (let actionId of this.actions) {
                this.actionManager.setActive("interpreter." + actionId, this.buttonActiveMatrix[actionId][state]);
            }

            let buttonStartActive = this.buttonActiveMatrix['start'][state];

            this.actionManager.showHideButtons("interpreter.start", buttonStartActive);
            this.actionManager.showHideButtons("interpreter.pause", !buttonStartActive);
        }

        if (state == SchedulerState.stopped) {
            this.eventManager.fire("done");

        }

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

    private init(executable: Executable) {

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



        this.setState(SchedulerState.stopped);
        this.mainThread = this.scheduler.init(executable);

        if (this.mainThread) {
            this.codeReachedAssertions.init(executable.moduleManager);
            this.mainThread.maxStepsPerSecond = this.stepsPerSecondGoal;
            this.mainThread.state = ThreadState.runnable; // this statement actually makes the program run
        }


    }

    hideProgrampointerPosition() {

        if (this.showProgramPointerCallback) this.showProgramPointerCallback("hide");

    }

    registerCodeReached(key: string) {
        this.codeReachedAssertions.registerAssertionReached(key);
    }

    isRunningOrPaused(): boolean {
        return this.scheduler.state == SchedulerState.running ||
            this.scheduler.state == SchedulerState.paused;
    }

    hasActors(): boolean {
        let world: IWorld = this.objectStore["World"];
        if (!world) return false;
        return world.hasActors();
    }

    setStepsPerSecond(value: number, isMaxSpeed: boolean) {
        this.stepsPerSecondGoal = value;
        this.isMaxSpeed = isMaxSpeed;
        if (this.mainThread) {
            this.mainThread.maxStepsPerSecond = isMaxSpeed ? undefined : value;
        }

        this.scheduler.setMaxSpeed(value, isMaxSpeed);

        if (!isMaxSpeed && this.stepsPerSecondGoal > 20) {
            this.hideProgrampointerPosition();
        }
    }

    getStepsPerSecond(): number {
        return this.stepsPerSecondGoal;
    }

}