import { JavaLibraryModuleManager } from "../java/module/libraries/JavaLibraryModuleManager";
import { BaseType } from "./BaseType";
import { Error } from "./Error";
import { CompilerFile } from "./module/CompilerFile";
import { Module } from "./module/Module";

export interface Compiler {
    setFiles(files: CompilerFile[]): void;    
    updateSingleModuleForCodeCompletion(module: Module): "success" | "completeCompilingNecessary";
    findModuleByFile(file: CompilerFile): Module | undefined;
    getAllModules(): Module[];
    setFileDirty(file: CompilerFile): void;
    getSortedAndFilteredErrors(file: CompilerFile): Error[];
    getType(identifier: string): BaseType | undefined;
}