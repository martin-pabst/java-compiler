import { Compiler } from "../common/Compiler.ts";
import { JavaRepl } from "../java/parser/repl/JavaRepl.ts";
import { Disassembler } from "./disassembler/Disassembler.ts";
import { ActionManager } from "./interpreter/ActionManager.ts";
import { Interpreter } from "./interpreter/Interpreter.ts";
import { Language } from "./Language.ts";
import { CompilerFile } from "./module/CompilerFile.ts";
import { CompilerWorkspace } from "./module/CompilerWorkspace.ts";
import { IPosition } from "./range/Position.ts";
import { IRange } from "./range/Range.ts";

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

    showFile(file?: CompilerFile): void;

    showProgramPosition(file?: CompilerFile, positionOrRange?: IPosition | IRange);

    getDisassembler(): Disassembler | undefined;

    getActionManager(): ActionManager;

    showJUnitDiv(): void;
}