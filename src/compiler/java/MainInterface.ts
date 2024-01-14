import { JavaBaseModule } from "./module/JavaBaseModule.ts";
import { Module } from "../common/module/Module.ts";
import { JavaCompiledModule } from "./module/JavaCompiledModule.ts";
import { Executable } from "../common/Executable.ts";
import { JavaCompiler } from "./JavaCompiler.ts";

export interface JavaMainClass {

    getModuleForMonacoModel(model: monaco.editor.ITextModel): JavaCompiledModule | undefined;
    
    ensureModuleIsCompiled(module: JavaCompiledModule): void;

    getCompiler(): JavaCompiler;

}