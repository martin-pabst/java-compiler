import { GUITestAssertions } from "../../../test/lib/GUITestAssertions";
import { GUITestRunner } from "../../../test/lib/GUITestRunner";
import { TestResultViewer } from "../../../testgui/TestResultViewer";
import { JavaBaseModule } from "../../java/module/JavaBaseModule";
import { JavaCompiledModule } from "../../java/module/JavaCompiledModule";
import { JavaClass } from "../../java/types/JavaClass";
import { JavaMethod } from "../../java/types/JavaMethod";
import { NonPrimitiveType } from "../../java/types/NonPrimitiveType";
import { IMain } from "../IMain";
import { Module } from "../module/Module";
import { ActionManager } from "./ActionManager";
import { Program } from "./Program";
import { SchedulerState } from "./Scheduler";
import { Helpers, StepParams } from "./StepFunction";
import { ThreadState } from "./Thread";

type MouseDownHandler = () => void;

type DecorationInfo = {
    model: monaco.editor.ITextModel,
    decorations: string[]
}

export class TestManager {

    decorationInfoList: DecorationInfo[] = [];

    mouseDownHandler: Map<Module, Map<number, MouseDownHandler>> = new Map();

    constructor(private main: IMain, private actionManager: ActionManager, private testResultViewer: TestResultViewer) {

        actionManager.registerAction("interpreter.startTests", [], (name) => {
            this.executeAllTests();
        }, "Führt alle im aktuellen Workspace enthaltenen JUnit-Test aus.");

        let editor = main.getMainEditor();

        editor.onMouseDown((e: monaco.editor.IEditorMouseEvent) => {
            if (e.target.type != monaco.editor.MouseTargetType.GUTTER_LINE_DECORATIONS) {
                return;
            }

            let model = editor.getModel();
            let module = main.getCurrentWorkspace()?.getModuleForMonacoModel(model);
            if (!module) return;

            this.onMarginMouseDown(module, e.target.position.lineNumber);
            return;
        });

    }

    onMarginMouseDown(module: Module, lineNumber: number) {
        let map = this.mouseDownHandler.get(module);
        if (map) {
            let handler = map.get(lineNumber);
            if (handler) {
                handler();
            }
        }
    }

    executeSingleTest(method: JavaMethod, callback: () => void) {

        let interpreter = this.main.getInterpreter();
        let mainThread = interpreter.scheduler.initJUnitTestMethodAndReturnMainThread(interpreter.executable, method, callback);
        if(!mainThread) return;
        interpreter.scheduler.setState(SchedulerState.paused);
        mainThread.state = ThreadState.runnable;
        interpreter.start();
    }

    executeListOfTests(methods: JavaMethod[], testgroup: string) {
        let testRunner = new GUITestRunner();
        this.main.getInterpreter().attachAssertionObserver(new GUITestAssertions(testRunner));

        let methods1 = methods.slice();

        let f = () => {
            if(methods1.length > 0){
                let method = methods1.shift()!;
                testRunner.startTest(method.identifier, "");
                this.executeSingleTest(method, () => {
                    testRunner.endTest(false);
                    f();
                });

            } else {
                let testResults = testRunner.getTestResults();
                this.testResultViewer.setAttribute('results', JSON.stringify(testResults));
            }
        }

        f();
    }

    executeAllTests() {
        let testclassToTestMethodsMap = this.main.getInterpreter().executable?.getTestMethods();
        if (!testclassToTestMethodsMap) return;
        testclassToTestMethodsMap.forEach((methodList, klass) => {
            this.executeListOfTests(methodList, klass.identifier);
        })
    }

    markTestsInEditor() {

        this.decorationInfoList.forEach(decorationInfo => decorationInfo.model.deltaDecorations(decorationInfo.decorations, []));
        this.decorationInfoList = [];

        this.mouseDownHandler.clear();

        let executable = this.main.getInterpreter().executable;
        if (executable) {

            let testClassToTestMethodMap = executable.getTestMethods();

            testClassToTestMethodMap.forEach((methods, klass) => {

                let decorations: monaco.editor.IModelDeltaDecoration[] = [];
                let model = klass.module.file.getMonacoModel();
                if (!model) return;

                decorations.push(this.getDecoration(klass.module, klass.identifierRange.startLineNumber, "Alle JUnit-Tests dieser Klasse ausführen", () => {
                    this.executeListOfTests(methods, "")
                }));

                for (let method of methods) {
                    let annotation = method.getAnnotation("Test");
                    if(!annotation) continue;
                    decorations.push(this.getDecoration(klass.module, annotation?.range.startLineNumber, "Diesen JUnit-Test ausführen", () => {
                        this.executeListOfTests([method], "");
                    }));

                }

                this.decorationInfoList.push({
                    model: model,
                    decorations: model.deltaDecorations([], decorations)
                });
            })

        }

    }

    getDecoration(module: Module, lineNumber: number, tooltip: string, mouseDownHandler: MouseDownHandler): monaco.editor.IModelDeltaDecoration {
        let map = this.mouseDownHandler.get(module);
        if (!map) {
            map = new Map<number, MouseDownHandler>();
            this.mouseDownHandler.set(module, map);
        }

        map.set(lineNumber, mouseDownHandler);

        return {
            range: { startLineNumber: lineNumber, endLineNumber: lineNumber, startColumn: 1, endColumn: 1 },
            options: {
                marginClassName: "jo_margin_test_start",
                stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,

            }
        }
    }
}