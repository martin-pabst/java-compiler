import { PrintManager } from "../../compiler/common/interpreter/PrintManager";
import { Step } from "../../compiler/common/interpreter/Program";
import { Thread } from "../../compiler/common/interpreter/Thread";
import { Assertions } from "../../compiler/java/runtime/unittests/Assertions";
import { GUITestRunner } from "./GUITestRunner";

export class GUITestAssertions implements Assertions {
    constructor(public testRunner: GUITestRunner) {

    }
    assertFalse(thread: Thread, step: Step, condition: boolean, message: string): void {
        throw new Error("Method not implemented.");
    }
    assertEqualsNumber(thread: Thread, step: Step, expected: number, actual: number, message: string): void {
        if (expected != actual) {
            this.logFailedTest(thread, step, message, "Expected: " + expected + ", actual " + actual);
        }
    }
    assertEqualsString(thread: Thread, step: Step, expected: string, actual: string, message: string): void {
        if (expected != actual) {
            this.logFailedTest(thread, step, message, "Expected: " + expected + ", actual " + actual);
        }
    }
    fail(thread: Thread, step: Step, message: string): void {
        this.logFailedTest(thread, step, message,"");
    }

    assertTrue(thread: Thread, step: Step, condition: boolean, message: string): void {
        if (condition !== true) {
            this.logFailedTest(thread, step, message, "Expected: " + "true" + ", actual: " + "false");
        }
        // expect(condition).to.equal(true, message);
    }

    logFailedTest(thread: Thread, step: Step, message: string, detail: string){
        this.testRunner.log(message, detail);

    }
}