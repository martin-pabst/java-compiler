import { Compiler } from "../common/Compiler.ts";
import { Module } from "../common/module/Module.ts";
import { JavaBaseModule } from "../java/module/JavaBaseModule.ts";
import { JavaRepl } from "../java/parser/repl/JavaRepl.ts";
import { Executable } from "./Executable.ts";
import { Interpreter } from "./interpreter/Interpreter.ts";
import { Language } from "./Language.ts";
import { CompilerWorkspace } from "./module/CompilerWorkspace.ts";

export interface IMain {

    isEmbedded(): boolean;

    getInterpreter(): Interpreter;

    getLanguage(): Language;

    getCompiler(): Compiler;

    getRepl(): JavaRepl;


    getMainEditor(): monaco.editor.IStandaloneCodeEditor;
    
    getReplEditor(): monaco.editor.IStandaloneCodeEditor;


    getCurrentWorkspace(): CompilerWorkspace | undefined;

    onCompilationFinished(executable: Executable | undefined): void;

    adjustWidthToWorld(): void;
}