import { Compiler } from "../common/Compiler.ts";
import { JavaRepl } from "../java/parser/repl/JavaRepl.ts";
import { Executable } from "./Executable.ts";
import { Interpreter } from "./interpreter/Interpreter.ts";
import { Language } from "./Language.ts";
import { CompilerFile } from "./module/CompilerFile.ts";
import { CompilerWorkspace } from "./module/CompilerWorkspace.ts";
import { ProgramPointerManager } from "./monacoproviders/ProgramPointerManager.ts";

export interface IMain {

    isEmbedded(): boolean;

    getInterpreter(): Interpreter;

    getLanguage(): Language;

    getCompiler(): Compiler;

    getRepl(): JavaRepl;


    getMainEditor(): monaco.editor.IStandaloneCodeEditor;
    
    getReplEditor(): monaco.editor.IStandaloneCodeEditor;


    getCurrentWorkspace(): CompilerWorkspace | undefined;

    adjustWidthToWorld(): void;

    showFile(file: CompilerFile): void;


}