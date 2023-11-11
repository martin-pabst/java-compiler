import { File } from "../../common/module/File";
import { JavaTypeStore } from "./JavaTypeStore";
import { JavaCompiledModule as JavaCompiledModule } from "./JavaCompiledModule";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { JavaClassOrEnum } from "../types/JavaClassOrEnum";


/**
 * A JavaModuleManager includes all Modules of a Java Workspace together with all library 
 * Modules and thus represents a "Java Program".
 */
export class JavaModuleManager {

    modules: JavaCompiledModule[] = [];
    typestore: JavaTypeStore;

    constructor(){
        this.typestore = new JavaTypeStore();
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
        this.typestore.empty();

        for(let m of this.getUnChangedModules()){
            m.registerTypesAtTypestore(this.typestore);
        }
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

    compileModulesToJavascript(){
        for(let module of this.modules){
            module.mainProgram?.compileToJavascriptFunctions();
            if(!module.ast) continue;
            for(let cdef of module.ast.classOrInterfaceOrEnumDefinitions){
                if(cdef instanceof NonPrimitiveType){
                    if(!cdef.runtimeClass) continue;
                    for(let method of cdef.runtimeClass.__programs){
                        method.compileToJavascriptFunctions();
                    }
                }

                if(cdef instanceof JavaClassOrEnum){
                    cdef.staticConstructor?.compileToJavascriptFunctions();
                    cdef.staticFieldConstructor?.compileToJavascriptFunctions();
                    cdef.fieldConstructor?.compileToJavascriptFunctions();
                }
            }
        }

    }

}