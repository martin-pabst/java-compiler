import { JavaMethod } from "../../java/types/JavaMethod";
import { ITestManager } from "../interpreter/ITestManager";

export class TestRunner implements ITestManager {
    executeSingleTest(method: JavaMethod, callback: () => void): void {
        throw new Error("Method not implemented.");
    }
    executeListOfTests(methods: JavaMethod[], testgroup: string): void {
        throw new Error("Method not implemented.");
    }
    executeAllTests(): void {
        throw new Error("Method not implemented.");
    }
    markTestsInEditor(): void {
        throw new Error("Method not implemented.");
    }

}