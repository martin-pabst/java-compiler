import { File } from "../../common/module/File";
import { JavaModule } from "./JavaModule";
import { JavaSystemModule } from "./JavaSystemModule";
import { JavaTypeStore } from "./JavaTypeStore";


/**
 * A JavaModuleManager includes all Modules of a Java Workspace together with all library 
 * Modules and thus represents a "Java Program".
 */
export class JavaModuleManager {

    modules: JavaModule[] = [];
    systemModules: JavaSystemModule[] = [];
    typestore: JavaTypeStore;

    constructor(){
        this.typestore = new JavaTypeStore(this);
    }

    addModule(module: JavaModule){
        this.modules.push(module);
    }

    getModuleFromFile(file: File){
        return this.modules.find(m => m.file == file);
    }

    setupModulesBeforeCompiliation(files: File[]){
        this.removeUnusedModules(files);
        this.createNewModules(files);
        this.typestore.empty();
    }

    setDirtyFlags(){
        this.modules.forEach( m => m.setDirtyIfProgramCodeChanged());

        let done: boolean = false;
        while(!done){
            done = true;
            for(let module of this.modules){
                if(module.dirty) continue;
                for(const [type, _b] of module.usedTypesFromOtherModules){
                    if(type.module.dirty){
                        module.dirty = true;
                        done = false;
                        break;
                    }
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
                let newModule = new JavaModule(file, this);
                this.addModule(newModule);
            }
        }
    }

    removeUnusedModules(files: File[]){
        this.modules = this.modules.filter(m => files.indexOf(m.file) >= 0);
    }

    getDirtyModules(): JavaModule[] {
        return this.modules.filter(m => m.dirty);
    }

}