import { JavaMethod } from "../../java/types/JavaMethod";

export interface ITestManager {

    executeSingleTest(method: JavaMethod, callback: () => void): void;

    executeListOfTests(methods: JavaMethod[], testgroup: string): void; 

    executeAllTests(): void

    markTestsInEditor(): void

}