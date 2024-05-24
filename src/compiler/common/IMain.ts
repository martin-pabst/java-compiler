import { Compiler } from "../common/Compiler.ts";
import { Module } from "../common/module/Module.ts";
import { JavaBaseModule } from "../java/module/JavaBaseModule.ts";
import { Interpreter } from "./interpreter/Interpreter.ts";

export interface IMain {

    getModuleForMonacoModel(model: monaco.editor.ITextModel | null): Module | undefined;
    
    ensureModuleIsCompiled(module: Module): void;

    getCompiler(): Compiler;

    getAllModules(): Module[];

    isEmbedded(): boolean;

    getInterpreter(): Interpreter;

    getEditor(): monaco.editor.IStandaloneCodeEditor;

    getCurrentlyEditedModule(): Module | undefined;
}