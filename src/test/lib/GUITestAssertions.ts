import { IPrintManager } from "../../compiler/common/interpreter/PrintManager";
import { Step } from "../../compiler/common/interpreter/Program";
import { Thread } from "../../compiler/common/interpreter/Thread";
import { AssertionObserver } from "../../compiler/java/runtime/unittests/AssertionObserver.ts";
import { GUITestRunner } from "./GUITestRunner";

export class GUITestAssertions implements AssertionObserver {
    constructor(public testRunner: GUITestRunner) {

    }
    notifyOnAssertFalse(thread: Thread, step: Step, condition: boolean, message: string): void {
        throw new Error("Method not implemented.");
    }
    notifyOnAssertEqualsNumber(thread: Thread, step: Step, expected: number, actual: number, message: string): void {
        if (expected != actual) {
            this.logFailedTest(thread, step, message, "Expected: " + expected + ", actual " + actual);
        }
    }
    notifyOnAssertEqualsString(thread: Thread, step: Step, expected: string, actual: string, message: string): void {
        if (expected != actual) {
            this.logFailedTest(thread, step, message, "Expected: " + expected + ", actual " + actual);
        }
    }
    notifyOnAssertEqualsObject(thread: Thread, step: Step, expected: string, actual: string, message: string): void {
        this.logFailedTest(thread, step, message, "Expected: " + expected + ", actual " + actual);
    }
    notifyOnFail(thread: Thread, step: Step, message: string): void {
        this.logFailedTest(thread, step, message, "");
    }

    notifyOnAssertTrue(thread: Thread, step: Step, condition: boolean, message: string): void {
        if (condition !== true) {
            this.logFailedTest(thread, step, message, "Expected: " + "true" + ", actual: " + "false");
        }
        // expect(condition).to.equal(true, message);
    }

    logFailedTest(thread: Thread, step: Step, message: string, detail: string) {
        this.testRunner.log(message, detail);

    }
}