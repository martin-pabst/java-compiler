import { fail } from "assert";
import { TreeviewNode } from "../../../tools/components/treeview/TreeviewNode";
import { JavaModuleManager } from "../../java/module/JavaModuleManager";
import { JavaClass } from "../../java/types/JavaClass";
import { JavaMethod } from "../../java/types/JavaMethod";
import { SchedulerState } from "../interpreter/Scheduler";
import { ThreadState } from "../interpreter/Thread";
import { AggregatingAssertionObserver, AssertionResult } from "./AggregatingAssertionObserver";
import { JUnitTestrunner } from "./JUnitTestrunner";
import { JUnitTestrunnerLanguage } from "./JUnitTestrunnerLanguage";
import { DOM } from "../../../tools/DOM";
import { ExceptionPrinter } from "../interpreter/ExceptionPrinter";

export type JUnitTreeviewEntryType = "all" | "class" | "method";

type Testresult = {
    state: "passed" | "failed",
    message?: string
}

type TestProgress = {
    overall: number,
    passed: number,
    failed: number
}

export class JUnitTreeviewEntry {

    children: JUnitTreeviewEntry[] = [];
    treeviewNode: TreeviewNode<JUnitTreeviewEntry>;

    testProgress: TestProgress = { overall: 0, passed: 0, failed: 0 };

    assertionResults: AssertionResult[] = [];   // Results of last run

    constructor(private testrunner: JUnitTestrunner, private parent: JUnitTreeviewEntry | undefined,
        public moduleManager: JavaModuleManager | undefined,
        public klass: JavaClass | undefined,
        public method: JavaMethod | undefined) {

        this.treeviewNode = new TreeviewNode(testrunner.testTreeview, !this.method, "", "img_test-start", this, this, parent, true);
        this.treeviewNode.render();
        this.treeviewNode.onIconClicked = (element) => {
            testrunner.clearOutput();
            element.runTests();
        }

        this.treeviewNode.onClickHandler = () => {
            if (this.method) {
                this.jumpToMethod(method);
            } else if (this.klass) {
                this.testrunner.main.showProgramPosition(this.klass.module.file, this.klass.identifierRange);
            }
        }

        this.setCaption();

        this.addChildren();

    }

    jumpToMethod(method: JavaMethod) {
        this.testrunner.main.showProgramPosition(this.method.module.file, this.method.identifierRange);
    }

    private addChildren() {
        if (this.method) return;
        if (this.klass) {
            for (let method of this.klass.getOwnMethods()
                .filter(m => !m.isConstructor && m.hasAnnotation("Test") && m.returnParameterType?.identifier == "void"
                    && m.parameters.length == 0)) {
                this.children.push(new JUnitTreeviewEntry(this.testrunner, this, undefined, undefined, method));
            }
            return;
        }
        for (let module of this.moduleManager.modules) {
            for (let type of module.types.filter(type => type instanceof JavaClass)) {
                let testMethods = type.getOwnMethods()
                    .filter(m => !m.isConstructor && m.hasAnnotation("Test") && m.returnParameterType?.identifier == "void" && m.parameters.length == 0);
                if (testMethods.length > 0) {
                    this.children.push(new JUnitTreeviewEntry(this.testrunner, this, undefined, type, undefined));
                }
            }
        }
    }

    private setCaption() {
        let name: string = '';
        if (this.method) {
            name = `<span class="jo_junitMethodIdentifier">${this.method.identifier}</span>`;
        } else if (this.klass) {
            name = `<span class="jo_junitClassIdentifier">${this.klass.identifier}</span>`;
        } else {
            name = JUnitTestrunnerLanguage.allTests()
        }

        this.treeviewNode.caption = `<span class="jo_junitCaption">${name}</span>`;

        let numberOfTests = this.getTestCount();
        let rightSideHtml = `<span class="jo_junit_captionRightside">${this.testProgress.passed}<span class="img_junit-passed-dark"></span>` +
            `${numberOfTests - this.testProgress.passed - this.testProgress.failed}<span class="img_junit-todo-dark" style="left: -4px; width: 12px"></span>` +
            `${this.testProgress.failed}<span class="img_junit-failed-dark"></span></span>`;

        this.treeviewNode.setRightPartOfCaptionHtml(rightSideHtml);
    }

    public async runTests(notifyProgressChange?: (passed: boolean) => void) {
        let thisIsGlobalTestScope: boolean = !notifyProgressChange;
        if (thisIsGlobalTestScope) {
            this.reset();
            this.testrunner.progressbar.showProgress(this.testProgress.overall, this.testProgress.passed, this.testProgress.failed);
        }

        if (this.method) {
            this.treeviewNode.setSelected(true);
            this.treeviewNode.scrollIntoView();

            await this.runSingleTest(this.method);
            if (notifyProgressChange) notifyProgressChange(this.testProgress.passed > 0);
            this.setCaption();
            if (thisIsGlobalTestScope) {
                this.testrunner.progressbar.showProgress(this.testProgress.overall, this.testProgress.passed, this.testProgress.failed);
            }
        } else {
            for (let child of this.children) {
                await child.runTests((passed: boolean) => {
                    if (passed) {
                        this.testProgress.passed++;
                    } else {
                        this.testProgress.failed++;
                    }
                    this.setCaption();
                    if (thisIsGlobalTestScope) {
                        this.testrunner.progressbar.showProgress(this.testProgress.overall, this.testProgress.passed, this.testProgress.failed);
                    } else {
                        if (notifyProgressChange) notifyProgressChange(passed);
                    }
                });
            }


        }
    }

    private async runSingleTest(method: JavaMethod): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => {
            let assertionObserver = new AggregatingAssertionObserver(this.testrunner.main);
            let interpreter = this.testrunner.main.getInterpreter();
            interpreter.attachAssertionObserver(assertionObserver);
            let mainThread = interpreter.scheduler.initJUnitTestMethodAndReturnMainThread(interpreter.executable, method, () => {
                let results = assertionObserver.assertionResults;
                this.testrunner.eraseExecutingTestCaption();

                if (mainThread.state == ThreadState.terminatedWithException) {
                    let htmlElement = DOM.makeDiv(undefined);

                    htmlElement.innerHTML = `<div class="jo_junitFailBlock">` +
                        `<div><span class="jo_junitError">Test exited with exception:</span> </div>\n` +
                        `</div>`;

                    let exceptionHtml = ExceptionPrinter.getHtmlWithLinks(mainThread.exception, mainThread.stackTrace!, this.testrunner.main);
                    exceptionHtml.classList.add('jo_junitFailBlock');
                    htmlElement.append(exceptionHtml);

                    results.push({
                        state: "failed",
                        messageHtmlElement: htmlElement
                    })

                    results.push()
                }

                this.evaluateAssertionResults(results);
                resolve();
            });

            if (!mainThread) {
                resolve();
                this.testrunner.printError("Error: couldn't get main tread.");
                return;
            }

            this.testrunner.printExecutingTestCaption(this.method);
            interpreter.scheduler.setState(SchedulerState.paused);
            mainThread.state = ThreadState.runnable;
            interpreter.start();

        });

        return promise;
    }

    evaluateAssertionResults(results: AssertionResult[]) {
        if (results.length == 0) {
            this.testProgress.passed++;
        } else {
            this.testProgress.failed++;
            this.assertionResults = results;
        }
        this.printResults();
        this.setCaption();
    }

    printResults() {
        if (this.method) {
            let html: string = JUnitTestrunnerLanguage.executingTestMethod(this.method.classEnumInterface.identifier, this.method.identifier);
            if (this.assertionResults.length == 0) {
                html += `<span class="img_junit-passed-dark jo_junitImageInline"></span>`;
            } else {
                html += `<span class="img_junit-failed-dark jo_junitImageInline"></span>`;
            }
            let line = this.testrunner.printLine(html, 'jo_junitReportFirstLine');

            let linkSpan = <HTMLSpanElement>line.getElementsByClassName("jo_junitLink")[0];
            linkSpan.addEventListener("click", () => {
                this.jumpToMethod(this.method);
            })


            for (let result of this.assertionResults) {
                this.testrunner.printResult(result);
            }
        } else {
            if (this.klass) {
                this.testrunner.printLine(JUnitTestrunnerLanguage.runningAllTestsOfClass(this.klass.identifier), "jo_junitCaption");
            } else {
                this.testrunner.printLine(JUnitTestrunnerLanguage.runningAllTestsOfWorkspace(this.moduleManager.workspace?.getIdentifier() || "---"), "jo_junitCaption");
            }
            for (let child of this.children) {
                child.printResults();
            }
        }
    }

    getTestCount() {
        if (this.method) return 1;
        let count = 0;
        this.children.forEach(c => count += c.getTestCount());
        return count;
    }

    reset() {
        this.testProgress = {
            overall: this.getTestCount(),
            passed: 0,
            failed: 0
        }

        this.children.forEach(c => c.reset());
    }

}