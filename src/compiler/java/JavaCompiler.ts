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
import { JavaModuleManager } from "./module/JavaModuleManager";
import { JavaLibraryModuleManager } from "./module/libraries/JavaLibraryModuleManager";
import { Parser } from "./parser/Parser";
import { Assertions } from "./runtime/unittests/Assertions.ts";
import { NonPrimitiveType } from "./types/NonPrimitiveType.ts";

export class JavaCompiler {

    moduleManager: JavaModuleManager;
    lastOpenedFile?: File;
    private libraryModuleManager: JavaLibraryModuleManager;

    private errors: Error[] = [];

    constructor(){
        this.libraryModuleManager = new JavaLibraryModuleManager();
        this.moduleManager = new JavaModuleManager();
    }

    compile(files: File | File[], currentlyOpenFile?: File): Executable {

        this.errors = [];

        if(!Array.isArray(files)) files = [files];

        LabelCodeSnippet.resetCount();

        this.libraryModuleManager.clearUsagePositionsAndInheritanceInformation();

        this.moduleManager.setupModulesBeforeCompiliation(files);
        this.moduleManager.setDirtyFlags();

        let cleanModules = this.moduleManager.getUnChangedModules();
        cleanModules.forEach(cm => cm.clearAndRegisterTypeUsagePositions());
        cleanModules.forEach(cm => cm.registerTypesAtTypestore(this.moduleManager.typestore))

        let newOrDirtyModules = this.moduleManager.getNewOrDirtyModules();
        
        for(let module of newOrDirtyModules){
            
            module.resetBeforeCompilation();

            let lexer = new Lexer(module);
            lexer.lex();
            
            let parser = new Parser(module);
            parser.parse();
            
        }

        let typeResolver = new TypeResolver(this.moduleManager, this.libraryModuleManager);
        
        // resolve returns false if cyclic references are found. In this case we don't continue compiling.
        if(typeResolver.resolve()){
            this.moduleManager.typestore.initFastExtendsImplementsLookup();
    
            let exceptionTree = new ExceptionTree(this.libraryModuleManager.typestore, this.moduleManager.typestore);
    
            for(let module of newOrDirtyModules){
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
            this.errors, this.lastOpenedFile, currentlyOpenFile);
            
            if(executable.mainModule){
                this.lastOpenedFile = executable.mainModule.file;
            }
                
        return executable;

    }



}