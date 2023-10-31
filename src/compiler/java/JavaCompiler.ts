/**
 * The JavaCompiler takes a bundle of files and tries to compile them into
 * a runnable java program.
 * 
 * If it is invoked with files it already knows it may reuse code from 
 * a former compilation run.
 */

import { File } from "../common/module/File";
import { TypeResolver } from "./TypeResolver/TypeResolver";
import { Lexer } from "./lexer/Lexer";
import { JavaModuleManager } from "./module/JavaModuleManager";
import { JavaLibraryModuleManager } from "./module/libraries/JavaLibraryModuleManager";
import { Parser } from "./parser/Parser";

export class JavaCompiler {

    moduleManager: JavaModuleManager;

    constructor(private libraryModuleManager: JavaLibraryModuleManager){
        this.moduleManager = new JavaModuleManager();
    }

    compile(files: File[]){

        this.libraryModuleManager.clearUsagePositions();

        this.moduleManager.setupModulesBeforeCompiliation(files);
        this.moduleManager.setDirtyFlags();

        let cleanModules = this.moduleManager.getUnChangedModules();
        cleanModules.forEach(cm => cm.clearAndRegisterTypeUsagePositions());

        let dirtyModules = this.moduleManager.getDirtyModules();
        
        for(let module of dirtyModules){
            
            module.resetBeforeCompilation();

            let lexer = new Lexer(module);
            lexer.lex();
            
            let parser = new Parser(module);
            parser.parse();
            
        }

        let typeResolver = new TypeResolver(this.moduleManager, this.libraryModuleManager);
        typeResolver.resolve();

    }



}