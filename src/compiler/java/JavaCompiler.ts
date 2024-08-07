/**
 * The JavaCompiler takes a bundle of files and tries to compile them into
 * a runnable java program.
 * 
 * If it is invoked with files it already knows it may reuse code from 
 * a former compilation run.
 */

import { Compiler } from "../common/Compiler.ts";
import { Error } from "../common/Error.ts";
import { Executable } from "../common/Executable.ts";
import { IMain } from "../common/IMain.ts";
import { KlassObjectRegistry } from "../common/interpreter/StepFunction.ts";
import { CompilerFile } from "../common/module/CompilerFile";
import { Module } from "../common/module/Module.ts";
import { ErrorMarker } from "../common/monacoproviders/ErrorMarker.ts";
import { TypeResolver } from "./TypeResolver/TypeResolver";
import { CodeGenerator } from "./codegenerator/CodeGenerator";
import { ExceptionTree } from "./codegenerator/ExceptionTree.ts";
import { LabelCodeSnippet } from "./codegenerator/LabelManager.ts";
import { Lexer } from "./lexer/Lexer";
import { JavaCompiledModule } from "./module/JavaCompiledModule.ts";
import { JavaModuleManager } from "./module/JavaModuleManager";
import { JavaLibraryModuleManager } from "./module/libraries/JavaLibraryModuleManager";
import { Parser } from "./parser/Parser";


enum CompilerState {
    compilingPeriodically, stopped
}

type CompiliationFinishedCallback = (lastCompiledExecutable?: Executable) => void;
type AskBeforeCompilingCallback = () => boolean;

export class JavaCompiler implements Compiler {

    public moduleManager: JavaModuleManager;
    lastOpenedFile?: CompilerFile;
    public libraryModuleManager: JavaLibraryModuleManager;

    private errors: Error[] = [];

    public lastCompiledExecutable?: Executable;

    public files: CompilerFile[] = [];

    public state: CompilerState = CompilerState.stopped;
    private maxMsBetweenRuns: number = 100;


    constructor(public main?: IMain) {
        this.libraryModuleManager = new JavaLibraryModuleManager();
        this.moduleManager = new JavaModuleManager();
        this.startCompilingPeriodically();
    }

    setFiles(files: CompilerFile[]) {
        this.files = files;
    }

    compileIfDirty(): Executable | undefined {

        let time = performance.now();

        if (this.main?.getInterpreter().isRunningOrPaused()) return;

        /**
         * if no module has changed, return as fast as possible
         */
        this.moduleManager.setDirtyFlags();
        this.moduleManager.setupModulesBeforeCompiliation(this.files);
        let newOrDirtyModules = this.moduleManager.getNewOrDirtyModules();
        // console.log(Math.round(performance.now() - time) + " ms: Found " + newOrDirtyModules.length + " new or dirty modules.");
        if (newOrDirtyModules.length == 0) return this.lastCompiledExecutable;

        this.errors = [];

        this.moduleManager.emptyTypeStore();

        LabelCodeSnippet.resetCount();

        let cleanModules = this.moduleManager.getUnChangedModules();
        cleanModules.forEach(cm => cm.registerTypesAtTypestore(this.moduleManager.typestore))

        for (let module of newOrDirtyModules) {

            module.resetBeforeCompilation();

            let lexerOutput = new Lexer().lex(module.file.getText());
            module.setLexerOutput(lexerOutput);

            let parser = new Parser(module);
            parser.parse();

        }

        let typeResolver = new TypeResolver(this.moduleManager, this.libraryModuleManager);

        let exceptionTree = new ExceptionTree(this.libraryModuleManager.typestore, this.moduleManager.typestore);

        // resolve returns false if cyclic references are found. In this case we don't continue compiling.
        if (typeResolver.resolve()) {
            this.moduleManager.typestore.initFastExtendsImplementsLookup();


            for (let module of newOrDirtyModules) {
                let codegenerator = new CodeGenerator(module, this.libraryModuleManager.typestore,
                    this.moduleManager.typestore, exceptionTree);
                codegenerator.start();
                module.setDirty(false);
            }

        }

        let klassObjectRegistry: KlassObjectRegistry = {};

        this.libraryModuleManager.typestore.populateClassObjectRegistry(klassObjectRegistry);

        this.moduleManager.typestore.populateClassObjectRegistry(klassObjectRegistry);

        let executable = new Executable(klassObjectRegistry,
            this.moduleManager, this.libraryModuleManager,
            this.errors, exceptionTree,
            this.lastOpenedFile, this.main?.getCurrentWorkspace()?.getCurrentlyEditedModule());

        if (executable.mainModule) {
            this.lastOpenedFile = executable.mainModule.file;
        }

        this.lastCompiledExecutable = executable;

        this.main?.onCompilationFinished(this.lastCompiledExecutable);

        if (this.lastCompiledExecutable) {
            for (let module of this.lastCompiledExecutable.moduleManager.modules) {
                ErrorMarker.markErrorsOfModule(module);
            }

        }

        // console.log(Math.round(performance.now() - time) + " ms: Done compiling!");

        return executable;

    }

    /**
     * If user presses . or <ctrl> + <space> then we assume that only 
     * currently edited file is dirty, therefore it suffices to compile only this module.
     */
    updateSingleModuleForCodeCompletion(module: JavaCompiledModule): "success" | "completeCompilingNecessary" {
        if (!module) return "completeCompilingNecessary";

        if (!module.isDirty()) return "success";

        let moduleManagerCopy = this.moduleManager.copy(module);

        module.compiledSymbolsUsageTracker.clear();
        module.systemSymbolsUsageTracker.clear();

        module.resetBeforeCompilation();

        let lexerOutput = new Lexer().lex(module.file.getText());
        module.setLexerOutput(lexerOutput);

        let parser = new Parser(module);
        parser.parse();

        let typeResolver = new TypeResolver(moduleManagerCopy, this.libraryModuleManager);

        // resolve returns false if cyclic references are found. In this case we don't continue compiling.
        if (!typeResolver.resolve()) {
            return "completeCompilingNecessary";
        }

        // this.moduleManager.typestore.initFastExtendsImplementsLookup();

        let exceptionTree = new ExceptionTree(this.libraryModuleManager.typestore, this.moduleManager.typestore);

        let codegenerator = new CodeGenerator(module, this.libraryModuleManager.typestore,
            this.moduleManager.typestore, exceptionTree);
        codegenerator.start();

        /**
         * The compilation run we did is not sufficient to produce a up to date executable,
         * so we mark module as dirty to force new compilation
         */
        module.setDirty(true);

        return "success";

    }

    startCompilingPeriodically(maxMsBetweenRuns?: number) {
        if (maxMsBetweenRuns) this.maxMsBetweenRuns = maxMsBetweenRuns;
        if (this.state == CompilerState.compilingPeriodically) return;

        this.state = CompilerState.compilingPeriodically;

        let f = () => {
            if (this.state == CompilerState.compilingPeriodically) {
                this.compileIfDirty();
                setTimeout(f, this.maxMsBetweenRuns);
            }
        }

        f();
    }

    stopCompilingPeriodically() {
        this.state = CompilerState.stopped;
    }

    findModuleByFile(file: CompilerFile): Module | undefined {
        return this.lastCompiledExecutable?.moduleManager.findModuleByFile(file);
    }

    getAllModules(): Module[] {
        return this.moduleManager.modules;
    }

}