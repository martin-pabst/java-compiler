import { Step } from "../../../common/interpreter/Program";
import { Thread } from "../../../common/interpreter/Thread";

export interface Assertions {
    assertTrue(thread: Thread, step: Step, condition: boolean, message: string): void;
    assertFalse(thread: Thread, step: Step, condition: boolean, message: string): void;
    assertEqualsNumber(thread: Thread, step: Step, expected: number, actual: number, message: string): void;
    assertEqualsString(thread: Thread, step: Step, expected: string, actual: string, message: string): void;
    fail(thread: Thread, step: Step, message: string): void;
}

export class DummyAssertions implements Assertions {
    
    assertTrue(thread: Thread, step: Step, condition: boolean, message: string): void {
    }
    
    assertFalse(thread: Thread, step: Step, condition: boolean, message: string): void {
    }
    
    assertEqualsNumber(thread: Thread, step: Step, expected: number, actual: number, message: string): void {
    }
    
    assertEqualsString(thread: Thread, step: Step, expected: string, actual: string, message: string): void {
    }

    fail(thread: Thread, step: Step, message: string): void {
    }

}