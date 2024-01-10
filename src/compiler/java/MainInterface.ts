import { JavaBaseModule } from "./module/JavaBaseModule.ts";
import { Module } from "../common/module/Module.ts";
import { JavaCompiledModule } from "./module/JavaCompiledModule.ts";

export interface JavaMainClass {

    getModuleForMonacoModel(model: monaco.editor.ITextModel): JavaCompiledModule | undefined;
    

}