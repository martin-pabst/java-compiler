import { CompilerFile } from "./module/CompilerFile";
import { Module } from "./module/Module";

export interface Compiler {
    setFiles(files: CompilerFile[]): void;    
    updateSingleModuleForCodeCompletion(module: Module): "success" | "completeCompilingNecessary";
    findModuleByFile(file: CompilerFile): Module | undefined;
    getAllModules(): Module[];
}