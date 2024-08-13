import { CompilerFile } from "../../common/module/CompilerFile";
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

    getModuleFromFile(file: CompilerFile){
        return this.modules.find(m => m.file == file);
    }

    setupModulesBeforeCompiliation(files: CompilerFile[]){
        this.removeUnusedModules(files);
        this.createNewModules(files);
    }

    emptyTypeStore() {
        this.typestore.empty();
    }

    iterativelySetDirtyFlags(){

        for(let module of this.modules){
            if(module.hasErrors()) module.setDirty(true);
        }

        let done: boolean = false;
        while(!done){
            done = true;
            for(let module of this.modules){
                if(module.isDirty()) continue;
                // does module depend on dirty other module?
                if(module.dependsOnOtherDirtyModule()){
                    module.setDirty(true);
                    done = false;
                    break;
                }
            }
        }

        for(let module of this.modules){
            if(module.isDirty()){
                module.resetBeforeCompilation();
            } 
        }

    }

    createNewModules(files: CompilerFile[]){
        for(let file of files){
            if(!this.getModuleFromFile(file)){
                let newModule = new JavaCompiledModule(file, this);
                this.addModule(newModule);
            }
        }
    }

    removeUnusedModules(files: CompilerFile[]){
        this.modules = this.modules.filter(m => files.indexOf(m.file) >= 0);
    }

    getNewOrDirtyModules(): JavaCompiledModule[] {
        return this.modules.filter(
            m => m.isDirty()
        );
    }

    getUnChangedModules(): JavaCompiledModule[] {
        return this.modules.filter(m => !m.isDirty());
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


    findModuleByFile(file: CompilerFile){
        return this.modules.find(m => m.file == file);
    }

    getTypeCompletionItems(module: JavaCompiledModule, rangeToReplace: monaco.IRange, classContext: NonPrimitiveType | StaticNonPrimitiveType| undefined): monaco.languages.CompletionItem[] {
        return this.typestore.getTypeCompletionItems(classContext, rangeToReplace, false, false);
    }

}