/**
 * The JavaCompiler takes a bundle of files and tries to compile them into
 * a runnable java program.
 * 
 * If it is invoked with files it already knows it may reuse code from 
 * a former compilation run.
 */

import { Executable } from "../common/Executable.ts";
import { KlassObjectRegistry } from "../common/interpreter/StepFunction.ts";
import { File } from "../common/module/File";
import { TypeResolver } from "./TypeResolver/TypeResolver";
import { CodeGenerator } from "./codegenerator/CodeGenerator";
import { LabelCodeSnippet } from "./codegenerator/LabelManager.ts";
import { Lexer } from "./lexer/Lexer";
import { JavaModuleManager } from "./module/JavaModuleManager";
import { JavaLibraryModuleManager } from "./module/libraries/JavaLibraryModuleManager";
import { Parser } from "./parser/Parser";
import { NonPrimitiveType } from "./types/NonPrimitiveType.ts";

export class JavaCompiler {

    moduleManager: JavaModuleManager;
    lastOpenedFile?: File;

    constructor(private libraryModuleManager: JavaLibraryModuleManager){
        this.moduleManager = new JavaModuleManager();
    }

    compile(files: File[], currentlyOpenFile?: File): Executable {

        LabelCodeSnippet.resetCount();

        this.libraryModuleManager.clearUsagePositions();

        this.moduleManager.setupModulesBeforeCompiliation(files);
        this.moduleManager.setDirtyFlags();

        let cleanModules = this.moduleManager.getUnChangedModules();
        cleanModules.forEach(cm => cm.clearAndRegisterTypeUsagePositions());

        let newOrDirtyModules = this.moduleManager.getNewOrDirtyModules();
        
        for(let module of newOrDirtyModules){
            
            module.resetBeforeCompilation();

            let lexer = new Lexer(module);
            lexer.lex();
            
            let parser = new Parser(module);
            parser.parse();
            
        }

        let typeResolver = new TypeResolver(this.moduleManager, this.libraryModuleManager);
        typeResolver.resolve();

        for(let module of newOrDirtyModules){
            let codegenerator = new CodeGenerator(module, this.libraryModuleManager.typestore, 
                this.moduleManager.typestore);
            codegenerator.start();
        }

        let klassObjectRegistry: KlassObjectRegistry = {}; 

        this.moduleManager.compileModulesToJavascript();

        this.libraryModuleManager.typestore.populateClassObjectRegistry(klassObjectRegistry);

        this.moduleManager.typestore.populateClassObjectRegistry(klassObjectRegistry);

        let executable = new Executable(klassObjectRegistry, this.moduleManager, this.lastOpenedFile, currentlyOpenFile);

        if(executable.mainModule){
            this.lastOpenedFile = executable.mainModule.file;
        }

        return executable;

    }



}