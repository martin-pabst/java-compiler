import { IWorld } from "../../java/runtime/graphics/IWorld.ts";
import { AssertionObserver } from "../../java/runtime/unittests/AssertionObserver.ts";
import { BreakpointManager } from "../BreakpointManager.ts";
import { Debugger } from "../debugger/Debugger.ts";
import { Executable } from "../Executable.ts";
import { Module } from "../module/Module.ts";
import { ProgramPointerManager, ProgramPointerPositionInfo } from "../monacoproviders/ProgramPointerManager.ts";
import { ActionManager } from "./ActionManager.ts";
import { CodeReachedAssertions } from "./CodeReachedAssertions.ts";
import { EventManager } from "./EventManager";
import { ExceptionMarker } from "./ExceptionMarker.ts";
import { GraphicsManager } from "./GraphicsManager.ts";
import { IFilesManager as IFileManager } from "./IFilesManager.ts";
import { IInputManager } from "./IInputManager.ts";
import { ITestManager } from "./ITestManager.ts";
import { KeyboardManager } from "./KeyboardManager.ts";
import { LoadController } from "./LoadController";
import { DummyPrintManager, IPrintManager } from "./PrintManager";
import { Scheduler, SchedulerExitState, SchedulerState } from "./Scheduler";
import { Thread, ThreadState } from "./Thread.ts";


type InterpreterEvents = "stop" | "done" | "resetRuntime" | "stateChanged" | "showProgramPointer" | "hideProgramPointer";

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

    public printManager: IPrintManager;

    eventManager: EventManager<InterpreterEvents> = new EventManager();

    private objectStore: Map<string, any> = new Map();

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

    static ProgramPointerIndentifier = "ProgramPointer";

    mainThread?: Thread;
    public stepsPerSecondGoal: number = 1e8;
    public isMaxSpeed: boolean = true;
    

    constructor(printManager?: IPrintManager, private actionManager?: ActionManager,
        public graphicsManager?: GraphicsManager, public keyboardManager?: KeyboardManager,
        public breakpointManager?: BreakpointManager, public _debugger?: Debugger,
        public programPointerManager?: ProgramPointerManager, public testManager?: ITestManager,
        public inputManager?: IInputManager, public fileManager?: IFileManager,
        public exceptionMarker?: ExceptionMarker
    ) {

        //@ts-ignore
        if(typeof p5 === 'object') p5.disableFriendlyErrors = true

        this.printManager = printManager || new DummyPrintManager();

        this.graphicsManager?.setInterpreter(this);

        this.registerActions();

        if (breakpointManager) breakpointManager.attachToInterpreter(this);

        this.scheduler = new Scheduler(this);
        this.loadController = new LoadController(this.scheduler, this);
        this.initTimer();
        this.setStepsPerSecond(1e8, true);
        this.setState(SchedulerState.not_initialized);
    }

    setExecutable(executable: Executable | undefined) {
        if (!executable) return;
        this.executable = executable;
        // if (executable.mainModule || executable.hasTests()) {
        executable.compileToJavascript();
        if (executable.isCompiledToJavascript) {
            this.init(executable);
            this.setState(SchedulerState.stopped);
            this.testManager?.markTestsInEditor();
        } else {
            this.setState(SchedulerState.not_initialized);
        }
        // } else {
        //     this.setState(SchedulerState.not_initialized);
        // }
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

    showProgramPointer(_textPositionWithModule?: ProgramPointerPositionInfo, tag?: string) {
        if (this.programPointerManager) {
            if (!_textPositionWithModule){

                _textPositionWithModule = this.scheduler.getNextStepPosition();

                if(!this.programPointerManager.fileIsCurrentlyShownInEditor((<Module>_textPositionWithModule?.programOrmoduleOrMonacoModel).file)){
                    _textPositionWithModule = undefined;
                }

            }  
            if (_textPositionWithModule?.range) {
                this.eventManager.fire("showProgramPointer");
                if (_textPositionWithModule.range.startLineNumber >= 0) {

                    this.programPointerManager.show(_textPositionWithModule, {
                        key: tag || Interpreter.ProgramPointerIndentifier,
                        isWholeLine: true,
                        className: "jo_revealProgramPointer",
                        rulerColor: "#6fd61b",
                        minimapColor: "#6fd61b",
                        beforeContentClassName: "jo_revealProgramPointerBefore"
                    })

                }
            } else {
                this.programPointerManager.hide(tag || Interpreter.ProgramPointerIndentifier);
            }

        }
    }

    pause() {
        if (this.scheduler.getNextStepPosition()) {
            this.pauseIntern();
        } else {
            if (this.hasActorsOrPApplet()) {
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
        this._debugger?.showCurrentThreadState();
    }

    stop(restart: boolean) {

        this.hideProgrampointerPosition();

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
        this.runREPLSynchronously();
    }

    runREPLSynchronously() {
        this.scheduler.runsSynchronously = true;
        this.scheduler.setState(SchedulerState.running);
        try {
            while (this.scheduler.state == SchedulerState.running) {
                if(this.scheduler.run(100) == SchedulerExitState.nothingMoreToDo){
                    break;
                };
            }
        } finally {
            this.scheduler.runsSynchronously = false;
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

    executableHasTests(): boolean {
        return this.executable != null && this.executable.hasTests();
    }

    setState(state: SchedulerState) {

        if(state == SchedulerState.running) this.exceptionMarker?.removeExceptionMarker();

        if (state == SchedulerState.stopped) {
            this.hideProgrampointerPosition();
            this.keyboardManager?.unsubscribeAllListeners();
            this.eventManager.fire("stop");
            // TODO
            // this.closeAllWebsockets();
        }

        if (this.actionManager) {
            for (let actionId of this.actions) {
                this.actionManager.setActive("interpreter." + actionId, this.buttonActiveMatrix[actionId][state]);
            }

            let mainModuleExists = this.executable?.mainModule != null;
            let mainModuleExistsOrTestIsRunning = mainModuleExists || (state == 2 && this.scheduler.state == 1);

            let buttonStartActive = this.buttonActiveMatrix['start'][state];
            buttonStartActive = buttonStartActive && mainModuleExistsOrTestIsRunning;

            let buttonRestartActive = this.buttonActiveMatrix['restart'][state];
            buttonRestartActive = buttonRestartActive && mainModuleExists;

            let buttonStepOverActive = this.buttonActiveMatrix['stepOver'][state];
            buttonStepOverActive = buttonStepOverActive && mainModuleExistsOrTestIsRunning;

            let buttonStepIntoActive = this.buttonActiveMatrix['stepInto'][state];
            buttonStepIntoActive = buttonStepIntoActive && mainModuleExistsOrTestIsRunning;

            this.actionManager.showHideButtons("interpreter.start", buttonStartActive);
            this.actionManager.showHideButtons("interpreter.pause", !buttonStartActive);

            this.actionManager.setActive("interpreter.restart", buttonRestartActive);
            this.actionManager.setActive("interpreter.stepOver", buttonStepOverActive);
            this.actionManager.setActive("interpreter.stepInto", buttonStepIntoActive);
            this.actionManager.setActive("interpreter.startTests", this.executableHasTests() && state == SchedulerState.stopped);


        }

        if (state == SchedulerState.stopped) {
            this.eventManager.fire("done");

        }
        
        let runningStates: SchedulerState[] = [SchedulerState.paused, SchedulerState.running];
        if (runningStates.indexOf(this.scheduler.state) >= 0 && runningStates.indexOf(state) < 0) {
            this._debugger?.hide();
            this.keyboardManager?.unsubscribeAllListeners();
        }
        
        if (runningStates.indexOf(this.scheduler.state) < 0 && runningStates.indexOf(state) >= 0) {
            this._debugger?.show();
        }
        
        this.eventManager.fire("stateChanged", this.scheduler.state, state);
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

    hideProgrampointerPosition(tag?: string) {
        this.programPointerManager?.hide(tag || Interpreter.ProgramPointerIndentifier);
        this.eventManager.fire("hideProgramPointer");
    }

    registerCodeReached(key: string) {
        this.codeReachedAssertions.registerAssertionReached(key);
    }

    isRunningOrPaused(): boolean {
        return this.scheduler.state == SchedulerState.running ||
            this.scheduler.state == SchedulerState.paused;
    }

    hasActorsOrPApplet(): boolean {

        if (this.retrieveObject("PAppletClass")) return true;

        let world: IWorld = this.retrieveObject("WorldClass");
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

    runsEmbedded(): boolean {
        return false; // TODO
    }

    public storeObject(classIdentifier: string, object: any){
        this.objectStore.set(classIdentifier, object);
    }

    public retrieveObject(classIdentifier: string){
        return this.objectStore.get(classIdentifier);
    }

    public deleteObject(classIdentifier: string){
        this.objectStore.delete(classIdentifier);
    }
}