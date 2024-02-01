import { File } from "../../common/module/File";
import { JavaTypeStore } from "./JavaTypeStore";
import { JavaCompiledModule as JavaCompiledModule } from "./JavaCompiledModule";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { JavaTypeWithInstanceInitializer } from "../types/JavaTypeWithInstanceInitializer";
import { StaticNonPrimitiveType } from "../types/StaticNonPrimitiveType";


/**
 * A JavaModuleManager includes all Modules of a Java Workspace together with all library 
 * Modules and thus represents a "Java Program".
 */
export class JavaModuleManager {

    modules: JavaCompiledModule[] = [];
    typestore: JavaTypeStore;

    overriddenOrImplementedMethodPaths: Record<string, boolean> = {};

    constructor(){
        this.typestore = new JavaTypeStore();
    }

    copy(excludeTypesOfModule?: JavaCompiledModule): JavaModuleManager {
        let mm = new JavaModuleManager();
        mm.modules = this.modules.slice();
        mm.typestore = this.typestore.copy(excludeTypesOfModule);

        return mm;
    }

    addModule(module: JavaCompiledModule){
        this.modules.push(module);
    }

    getModuleFromFile(file: File){
        return this.modules.find(m => m.file == file);
    }

    setupModulesBeforeCompiliation(files: File[]){
        this.removeUnusedModules(files);
        this.createNewModules(files);
    }

    emptyTypeStore() {
        this.typestore.empty();
    }

    setDirtyFlags(){
        this.modules.forEach( m => m.setDirtyIfProgramCodeChanged());

        let done: boolean = false;
        while(!done){
            done = true;
            for(let module of this.modules){
                if(module.dirty) continue;
                // does module depend on dirty other module?
                if(module.dependsOnOtherDirtyModule()){
                    module.dirty = true;
                    done = false;
                    break;
                }
            }
        }

        for(let module of this.modules){
            if(module.dirty){
                module.resetBeforeCompilation();
            } else {

            }
        }

    }

    createNewModules(files: File[]){
        for(let file of files){
            if(!this.getModuleFromFile(file)){
                let newModule = new JavaCompiledModule(file, this);
                this.addModule(newModule);
            }
        }
    }

    removeUnusedModules(files: File[]){
        this.modules = this.modules.filter(m => files.indexOf(m.file) >= 0);
    }

    getNewOrDirtyModules(): JavaCompiledModule[] {
        return this.modules.filter(m => m.dirty);
    }

    getUnChangedModules(): JavaCompiledModule[] {
        return this.modules.filter(m => !m.dirty);
    }

    compileModulesToJavascript(): boolean {
        for(let module of this.modules){
            if(!module.hasErrors()){
                for(let program of module.programsToCompileToFunctions){
                    if(!program.compileToJavascriptFunctions()) return false;
                }
            }
        }
        return true;
    }


    findModuleByFile(file: File){
        return this.modules.find(m => m.file == file);
    }

    getTypeCompletionItems(module: JavaCompiledModule, rangeToReplace: monaco.IRange, classContext: NonPrimitiveType | StaticNonPrimitiveType| undefined): monaco.languages.CompletionItem[] {
        return this.typestore.getTypeCompletionItems(classContext, rangeToReplace, false, false);
    }

}