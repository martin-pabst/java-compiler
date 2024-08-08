import { IPrintManager } from "../../compiler/common/interpreter/PrintManager";
export abstract class TestResult {
    constructor(public testName: TestName) {

    }

    public toJSON() {
        return Object.assign({}, this, {isOk: this.isOk()});
    }

    public static fromJSON(json: any) {
        let testName = new TestName(json.testName.name, json.testName.group);
        if(json.isOk) {
            return new TestSuccess(testName,json.message);
        }
        else {
            return new TestError(testName, json.message, json.detail);
        }
    }

    abstract isOk() : boolean;

    abstract print(): void;
}

export class TestSuccess extends TestResult {
    constructor(public testName: TestName, public message: string) {
        super(testName);
    }

    public print() {
        return this.message;
    }

    public isOk() {
        return true;
    }

    
}

export class TestError extends TestResult {
    constructor(public testName: TestName, public message: string, public detail: string) {
        super(testName);
    }

    public print() {
        return this.message + ": " + this.detail;
    }

    public isOk() {
        return false;
    }

    public toJSON() {
        return Object.assign({}, this, {isOk: false});
    }
}


export class TestName {
    constructor(public name:string, public group: string) {

    }

    public print(testResult: TestResult, printManager: IPrintManager) {
        if (testResult.isOk()) {
            printManager.print(`\x1b[1m\x1b[1;42mBestanden\x1b[0m \x1b[0m\tTest "${this.name}"`,true, 0);
        }
        else {
            printManager.print(`\x1b[1m\x1b[1;41mFehlgeschlagen\x1b[0m \x1b[0m\tTest "${this.name}"`,true, 0);
            printManager.print("\t"+testResult.print(),true, 0);
        }
    }
}

export class GUITestRunner {
   
    results: TestResult[] = [];
    testRunning: TestName | undefined;
    hasError = false;
    numberOfFailedTests = 0;

    public log(message: string, detail: string) {
        if (!this.testRunning) return;
        this.results.push(new TestError(this.testRunning, message, detail));
        this.hasError = true;
    }

    public getTestResults() : any {
        return JSON.stringify(this.results);
    }

    public printResults(printManager: IPrintManager) {
        printManager.print("Test Results:", true, 0);
        this.results.forEach((testResult) => testResult.testName.print(testResult, printManager));
        if (this.numberOfFailedTests > 0 ) {
            printManager.print(`${this.numberOfFailedTests} von ${this.results.length} Tests sind fehlgeschlagen.`, true, 0);
        }
        else {
            printManager.print(`Alle ${this.results.length} Tests waren erfolgreich! 🎉`, true, 0);
        }
    }

    public startTest(name: string, group: string) {
        this.testRunning = new TestName(name,group);
    }

    public endTest(executionError: boolean) {
        if (!this.hasError && !executionError) {
            if (!this.testRunning) return;
            this.results.push(new TestSuccess(this.testRunning, "OK"));
        }
        else {
            this.numberOfFailedTests ++;
        }
        this.hasError = false;
        this.testRunning = undefined;
    }
}