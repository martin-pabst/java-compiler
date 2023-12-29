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

let javaDir: string = __dirname + "/java";

let files = fs.readdirSync(javaDir);
files.forEach(function (file) {
    if (file && file.endsWith(".java")) {
        let data = fs.readFileSync(javaDir + '/' + file, 'utf8');
        test1(data, file);
    }
});

function test1(sourcecode: string, file: string) {
    /**::
     * Test switch case with constant
     * @expectOutput: "Here!"
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


        let expectedOutputIndex = code.indexOf("@expectedOutput:");
        let expectedOutput: string | undefined;

        if (expectedOutputIndex >= 0) {
            let i1 = code.indexOf('"', expectedOutputIndex);
            let i2 = code.indexOf('"', i1 + 1);
            expectedOutput = code.substring(i1 + 1, i2);
        }

        compileAndTest(title, code, lineOffset, expectedOutput);

        testBegin = sourcecode.indexOf("/**::", testBegin + 1);
    }



}

function compileAndTest(name: string, program: string, lineOffset: number, expectedOutput?: string) {

    test(name, (context) => {
        let file = new File();

        file.setText(program);

        let compiler = new JavaCompiler();
        let executable = compiler.compile(file);

        if (!executable.mainModule) {
            let module = executable.moduleManager.modules[0];
            console.log(chalk.red("Compilation errors ") + "in " + name);
            for (let error of module.errors) {
                console.log(chalk.white("Line ") +
                    chalk.blue(error.range.startLineNumber + lineOffset) + chalk.white(", Column ") +
                    chalk.blue(error.range.startColumn) + chalk.white(": " + error.message));
                printCode(program, error.range.startLineNumber, lineOffset);
            }

            //@ts-ignore
            context.task.fails = 1;

        } else {

            let printManager = new StoreOutputPrintManager();

            let interpreter = new Interpreter(printManager);
            interpreter.setExecutable(executable);
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

    });

    function printCode(code: string, errorLine: number, lineOffset: number){

        for(let i = -4; i <= 2; i++){
            let line = errorLine + i;
            if(i == 0){
                console.log(chalk.blue(threeDez(line + lineOffset) + ": ") + chalk.italic.white(getLine(code, line)))
            } else {
                console.log(chalk.blue(threeDez(line + lineOffset) + ": ") + chalk.gray(getLine(code, line)))
            }
        }
    }



}