import { test } from "vitest";
import { it } from 'vitest';
import { File } from "../../compiler/common/module/File";
import { JavaCompiler } from "../../compiler/java/JavaCompiler";
import { Interpreter } from "../../compiler/common/interpreter/Interpreter";
import { ViteTestAssertions } from "./ViteTestAssertions";
import { createLogger } from "vite";

export function compileAndTest(name: string, program: string){

    test(name, (context) => {
        let file = new File();
        
        file.setText(program);
        
        let compiler = new JavaCompiler();
        let executable = compiler.compile(file);
        
        let interpreter = new Interpreter();
        interpreter.setExecutable(executable);
        interpreter.setAssertions(new ViteTestAssertions(context));
    
        interpreter.runMainProgramSynchronously();
    });
}