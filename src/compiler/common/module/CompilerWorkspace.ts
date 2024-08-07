import { IMain as CompilerMain } from "../IMain";
import { CompilerFile } from "./CompilerFile";
import { Module } from "./Module";

export abstract class CompilerWorkspace {

    constructor(private cmain: CompilerMain) {

    }

    abstract getFiles(): CompilerFile[];


    ensureModuleIsCompiled(module: Module): void {
        if (module.isReplModule()) {
            this.cmain.getRepl().compileAndShowErrors(module.file.getText());
        } else {
            this.cmain.getCompiler().updateSingleModuleForCodeCompletion(module);
        }
    }

    getModuleForMonacoModel(model: monaco.editor.ITextModel | null): Module | undefined {
        if (model == null) return undefined;

        for (let file of this.getFiles()) {
            if (file.getMonacoModel() == model) {
                return this.cmain.getCompiler().findModuleByFile(file);
            }
        }

        let replModule = this.cmain.getRepl().getCurrentModule();
        if (replModule) {
            if (replModule.file.getMonacoModel() == model) {
                return replModule;
            }
        }

        return undefined;
    }

    getCurrentlyEditedModule(): Module | undefined {
        let model = this.cmain.getMainEditor().getModel();
        if (!model) return;
        return this.getModuleForMonacoModel(model);
    }

    getFileForMonacoModel(model: monaco.editor.ITextModel | null): CompilerFile | undefined {
        if (model == null) return undefined;

        for (let file of this.getFiles()) {
            if (file.getMonacoModel() == model) {
                return file;
            }
        }

        return undefined;
    }

    getCurrentlyEditedFile(): CompilerFile | undefined {
        let model = this.cmain.getMainEditor().getModel();
        if (!model) return;

    }


}
