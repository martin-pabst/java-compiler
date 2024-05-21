import { Compiler } from "../common/Compiler.ts";
import { Module } from "../common/module/Module.ts";

export interface JavaMainClass {

    getModuleForMonacoModel(model: monaco.editor.ITextModel | null): Module | undefined;
    
    ensureModuleIsCompiled(module: Module): void;

    getCompiler(): Compiler;

}