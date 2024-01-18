/**
 * The JavaCompiler takes a bundle of files and tries to compile them into
 * a runnable java program.
 * 
 * If it is invoked with files it already knows it may reuse code from 
 * a former compilation run.
 */

import { Error } from "../common/Error.ts";
import { Executable } from "../common/Executable.ts";
import { KlassObjectRegistry } from "../common/interpreter/StepFunction.ts";
import { File } from "../common/module/File";
import { TypeResolver } from "./TypeResolver/TypeResolver";
import { CodeGenerator } from "./codegenerator/CodeGenerator";
import { ExceptionTree } from "./codegenerator/ExceptionTree.ts";
import { LabelCodeSnippet } from "./codegenerator/LabelManager.ts";
import { Lexer } from "./lexer/Lexer";
import { JavaCompiledModule } from "./module/JavaCompiledModule.ts";
import { JavaModuleManager } from "./module/JavaModuleManager";
import { JavaLibraryModuleManager } from "./module/libraries/JavaLibraryModuleManager";
import { Parser } from "./parser/Parser";
import { Assertions } from "./runtime/unittests/Assertions.ts";
import { NonPrimitiveType } from "./types/NonPrimitiveType.ts";


enum CompilerState {
    compilingPeriodically, stopped
}

type CompiliationFinishedCallback = (lastCompiledExecutable?: Executable) => void;
type AskBeforeCompilingCallback = () => boolean;

export class JavaCompiler {

    public moduleManager: JavaModuleManager;
    lastOpenedFile?: File;
    public libraryModuleManager: JavaLibraryModuleManager;

    private errors: Error[] = [];

    public lastCompiledExecutable?: Executable;

    public currentlyOpenFile?: File;

    public files: File[] = [];

    public compilationFinishedCallback?: CompiliationFinishedCallback;
    public askBeforeCompilingCallback?: AskBeforeCompilingCallback;

    public state: CompilerState = CompilerState.stopped;
    private maxMsBetweenRuns: number = 100;


    constructor() {
        this.libraryModuleManager = new JavaLibraryModuleManager();
        this.moduleManager = new JavaModuleManager();
    }

    compileIfDirty(): Executable | undefined {

        if (this.askBeforeCompilingCallback && !this.askBeforeCompilingCallback()) return;

        /**
         * if no module has changed, return as fast as possible
         */
        this.moduleManager.setDirtyFlags();
        this.moduleManager.setupModulesBeforeCompiliation(this.files);
        let newOrDirtyModules = this.moduleManager.getNewOrDirtyModules();
        if (newOrDirtyModules.length == 0) return this.lastCompiledExecutable;

        this.errors = [];

        this.moduleManager.emptyTypeStore();

        LabelCodeSnippet.resetCount();

        let cleanModules = this.moduleManager.getUnChangedModules();
        cleanModules.forEach(cm => cm.registerTypesAtTypestore(this.moduleManager.typestore))

        for (let module of newOrDirtyModules) {

            module.resetBeforeCompilation();

            let lexer = new Lexer(module);
            lexer.lex();

            let parser = new Parser(module);
            parser.parse();

        }

        let typeResolver = new TypeResolver(this.moduleManager, this.libraryModuleManager);

        // resolve returns false if cyclic references are found. In this case we don't continue compiling.
        if (typeResolver.resolve()) {
            this.moduleManager.typestore.initFastExtendsImplementsLookup();

            let exceptionTree = new ExceptionTree(this.libraryModuleManager.typestore, this.moduleManager.typestore);

            for (let module of newOrDirtyModules) {
                let codegenerator = new CodeGenerator(module, this.libraryModuleManager.typestore,
                    this.moduleManager.typestore, exceptionTree);
                codegenerator.start();
            }

        }

        let klassObjectRegistry: KlassObjectRegistry = {};

        this.libraryModuleManager.typestore.populateClassObjectRegistry(klassObjectRegistry);

        this.moduleManager.typestore.populateClassObjectRegistry(klassObjectRegistry);

        let executable = new Executable(klassObjectRegistry,
            this.moduleManager, this.libraryModuleManager,
            this.errors, this.lastOpenedFile, this.currentlyOpenFile);

        if (executable.mainModule) {
            this.lastOpenedFile = executable.mainModule.file;
        }

        this.lastCompiledExecutable = executable;

        if (this.compilationFinishedCallback) {
            this.compilationFinishedCallback(executable);
        }

        return executable;

    }

    /**
     * If user presses . or <ctrl> + <space> then we assume that only 
     * currently edited file is dirty, therefore it suffices to compile only this module.
     */
    updateSingleModuleForCodeCompletion(module: JavaCompiledModule): "success" | "completeCompilingNecessary" {
        if (!module) return "completeCompilingNecessary";

        let moduleManagerCopy = this.moduleManager.copy(module);

        module.dirty = true;
        module.compiledSymbolsUsageTracker.clear();
        module.systemSymbolsUsageTracker.clear();

        module.resetBeforeCompilation();

        let lexer = new Lexer(module);
        lexer.lex();

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
        module.sourceCode = "";

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

}