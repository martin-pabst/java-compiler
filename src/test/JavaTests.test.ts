import fs from "fs";
import { test } from "vitest";
import { it } from 'vitest';
import { File } from "../compiler/common/module/File";
import { JavaCompiler } from "../compiler/java/JavaCompiler";
import { Interpreter } from "../compiler/common/interpreter/Interpreter";
import { ViteTestAssertions } from "./lib/ViteTestAssertions";
import chalk from "chalk";

let javaDir: string = __dirname + "/java";

let files = fs.readdirSync(javaDir);
files.forEach(function (file) {
    if (file && file.endsWith(".java")) {
        let data = fs.readFileSync(javaDir + '/' + file, 'utf8');
        test1(data, file);
    }
});


function test1(data: string, file: string) {
    data = data.replace(/\r\n/g, "\n");
    let testBegin = data.indexOf("/**::");
    while (testBegin >= 0) {
        let titleBegin = data.indexOf(" * ", testBegin) + 3;
        let titleEnd = data.indexOf("\n", titleBegin);

        let title = "File " + file + ": " + data.substring(titleBegin, titleEnd);

        let testEnd = data.indexOf("/**::", testBegin + 1);
        if (testEnd <= testBegin + 1) testEnd = data.length;

        let code = data.substring(testBegin, testEnd);

        compileAndTest(title, code);


        testBegin = data.indexOf("/**::", testBegin + 1);
    } 



}

function compileAndTest(name: string, program: string) {

    test(name, (context) => {
        let file = new File();

        file.setText(program);

        let compiler = new JavaCompiler();
        let executable = compiler.compile(file);

        if(!executable.mainModule){
            let module = executable.moduleManager.modules[0]; 
            console.log(chalk.red("Compilation errors ") + "in " + name);
            for(let error of module.errors){
                console.log(chalk.white("Line ") + 
                chalk.blue(error.range.startLineNumber) + chalk.white(", Column ") + 
                chalk.blue(error.range.startColumn) + chalk.white(": " + error.message));

            }
    
            //@ts-ignore
            context.task.fails = 1;
    
        } else {
            let interpreter = new Interpreter();
            interpreter.setExecutable(executable);
            interpreter.setAssertions(new ViteTestAssertions(context));
    
            interpreter.runMainProgramSynchronously();
        }

    });
}