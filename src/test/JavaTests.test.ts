import fs from "fs";
import { test } from "vitest";
import { it } from 'vitest';
import { File } from "../compiler/common/module/File";
import { JavaCompiler } from "../compiler/java/JavaCompiler";
import { Interpreter } from "../compiler/common/interpreter/Interpreter";
import { ViteTestAssertions } from "./lib/ViteTestAssertions";
import chalk from "chalk";
import { PrintManager } from "../compiler/common/interpreter/PrintManager";
import { getLine, getLineNumber, threeDez } from "../tools/StringTools";

class StoreOutputPrintManager implements PrintManager {

    output: string = "";

    print(text: string | undefined, withNewline: boolean, color: number | undefined): void {
        if (!text) return;
        if (text.startsWith("Duration")) return;
        this.output += text;
        if (withNewline) this.output += "\n";
    }
    clear(): void {
        this.output = "";
    }

}

try {

    let javaDir: string = __dirname + "/java";

    let files = fs.readdirSync(javaDir);
    files.forEach(function (file) {
        if (file && file.endsWith(".java")) {
            let data = fs.readFileSync(javaDir + '/' + file, 'utf8');
            test1(data, file);
        }
    });
} catch (ex){
    console.error(ex);
}


type ExpectedError = { id: string, line?: number, found?: boolean }

type TestInfo = {
    expectedOutput?: string,
    expectedCompilationError?: ExpectedError,
    expectedCompilationErrors?: ExpectedError[]
}

function test1(sourcecode: string, file: string) {
    /**::
     * Test switch case with constant
     * {expectOutput: "Here!", expectedError: { id: "id13", line: 10 }}
     */

    sourcecode = sourcecode.replace(/\r\n/g, "\n");
    let testBegin = sourcecode.indexOf("/**::");
    while (testBegin >= 0) {
        let lineOffset = getLineNumber(sourcecode, testBegin);
        let titleBegin = sourcecode.indexOf(" * ", testBegin) + 3;
        let titleEnd = sourcecode.indexOf("\n", titleBegin);

        let title = "File " + file + ": " + sourcecode.substring(titleBegin, titleEnd);

        let testEnd = sourcecode.indexOf("/**::", testBegin + 1);
        if (testEnd <= testBegin + 1) testEnd = sourcecode.length;

        let code = sourcecode.substring(testBegin, testEnd);

        let headerEnd = sourcecode.indexOf("*/", testBegin);

        let expectedOutput: string | undefined;
        let expectedErrors: ExpectedError[] = [];

        let leftCurlyBraceIndex = sourcecode.indexOf("{", testBegin);
        if (leftCurlyBraceIndex >= 0 && leftCurlyBraceIndex < headerEnd) {
            let infoText = sourcecode.substring(leftCurlyBraceIndex, headerEnd);
            infoText = infoText.replace(/\s*\s/g, "");

            let testInfo: TestInfo = JSON.parse(infoText);
            if (testInfo) {
                expectedOutput = testInfo.expectedOutput;
                if (testInfo.expectedCompilationError) expectedErrors.push(testInfo.expectedCompilationError);
                if (testInfo.expectedCompilationErrors) expectedErrors = expectedErrors.concat(testInfo.expectedCompilationErrors);
            }
        }

        compileAndTest(title, code, lineOffset, expectedOutput, expectedErrors);

        testBegin = sourcecode.indexOf("/**::", testBegin + 1);
    }



}

function compileAndTest(name: string, program: string, lineOffset: number, expectedOutput: string | undefined, expectedCompiliationErrors: ExpectedError[]) {

    test(name, (context) => {
        let file = new File();

        file.setText(program);

        let compiler = new JavaCompiler();
        compiler.files = [file];
        let executable = compiler.compileIfDirty();
        if (!executable) return;

        let allErrors = executable.getAllErrors().filter(error => error.level == "error");

        let allNotExpectedErrors = allErrors.filter(error => {
            let expectedError = expectedCompiliationErrors.find(expectedError => expectedError.id == error.id && (!expectedError.line || expectedError.line == error.range.startLineNumber));
            if (expectedError) expectedError.found = true;
            return !expectedError;
        })

        if (allNotExpectedErrors.length > 0) {
            console.log(chalk.red("Compilation errors ") + "in " + name);
            for (let error of allNotExpectedErrors) {

                let expectedError = expectedCompiliationErrors.find(expectedError => expectedError.id == error.id && (!expectedError.line || expectedError.line == error.range.startLineNumber + lineOffset));
                if (expectedError) {
                    expectedError.found = true;
                } else {
                    console.log(chalk.white("Line ") +
                        chalk.blue(error.range.startLineNumber + lineOffset) +
                        chalk.gray("(relative: " + error.range.startLineNumber + ")")
                        + chalk.white(", Column ") +
                        chalk.blue(error.range.startColumn) + chalk.white(": " + error.message));
                    printCode(program, error.range.startLineNumber, lineOffset);
                }

            }

            //@ts-ignore
            context.task.fails = 1;

        } else if (allErrors.length == 0) {

            let printManager = new StoreOutputPrintManager();

            let interpreter = new Interpreter(printManager);
            interpreter.setExecutable(executable);

            if (!executable.isCompiledToJavascript) {
                //@ts-ignore
                context.task.fails = 1;
                return;
            }

            interpreter.setAssertions(new ViteTestAssertions(context, lineOffset));

            interpreter.runMainProgramSynchronously();

            let codeNotReachedAssertions = interpreter.codeReachedAssertions.getUnreachedAssertions();
            if (codeNotReachedAssertions.length > 0) {
                console.log(chalk.red("Test failed: ") + "CodeReached-assertions not reached");

                for (let cnr of codeNotReachedAssertions) {
                    console.log(chalk.gray("Details:     ") + cnr.messageIfNotReached);
                    console.log(chalk.gray("Position:    ") + chalk.white("Line ") +
                        chalk.blue(cnr.range.startLineNumber + lineOffset) + chalk.white(", Column ") +
                        chalk.blue(cnr.range.startColumn) + chalk.white(": " + cnr.messageIfNotReached));
                    printCode(program, cnr.range.startLineNumber, lineOffset);
                }

                //@ts-ignore
                context.task.fails = 1;
            }

            if (expectedOutput) {
                let actualOutput = printManager.output.replace(/\n/g, "\\n");
                if (expectedOutput != actualOutput) {
                    console.log(chalk.gray("Position:    ") + chalk.white("Test beginning with Line ") + chalk.blue(lineOffset));
                    console.log(chalk.red("Test failed: ") + "Output doesn't match expected output.");
                    console.log(chalk.gray("Details:     ") + "Expected: " + chalk.green(expectedOutput) + " Actual: " + chalk.yellow(actualOutput));
                    //@ts-ignore
                    context.task.fails = 1;
                }

            }


        }

        for (let expectedError of expectedCompiliationErrors.filter(e => !e.found)) {
            let message = chalk.red("Expected Error") + " with id " + chalk.blue(expectedError.id);
            if (expectedError.line) {
                message += " on line " + chalk.blue(expectedError.line);
                console.error(message);
                printCode(program, expectedError.line, lineOffset);
            } else {
                console.error(message);
            }
            //@ts-ignore
            context.task.fails = 1;
        }

    });

    function printCode(code: string, errorLine: number, lineOffset: number) {

        for (let i = -4; i <= 2; i++) {
            let line = errorLine + i;
            if (i == 0) {
                console.log(chalk.blue(threeDez(line + lineOffset) + ": ") + chalk.italic.white(getLine(code, line)))
            } else {
                console.log(chalk.blue(threeDez(line + lineOffset) + ": ") + chalk.gray(getLine(code, line)))
            }
        }
    }



}