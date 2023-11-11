import { JavaModuleManager } from "../java/module/JavaModuleManager";
import { JavaClassOrEnum } from "../java/types/JavaClassOrEnum";
import { Error } from "./Error";
import { Program } from "./interpreter/Program";
import { Klass, KlassObjectRegistry } from "./interpreter/StepFunction";
import { File } from "./module/File";
import { Module } from "./module/Module";

type StaticInitializationStep = {
    klass: Klass,
    program: Program
}

export class Executable {

    staticInitializationSequence: StaticInitializationStep[] = [];

    mainProgram?: Program;

    mainModule?: Module;

    constructor(public classObjectRegistry: KlassObjectRegistry, public moduleManager: JavaModuleManager, 
        lastOpenedFile?: File, currentlyOpenedFile?: File){

        this.findMainModule(lastOpenedFile, currentlyOpenedFile);

        this.setupStaticInitializationSequence();

    }

    setupStaticInitializationSequence() {
        let classesToInitialize: JavaClassOrEnum[] = [];
        
        this.staticInitializationSequence = [];

        for(let module of this.moduleManager.modules){
            if(!module.ast) continue;
            for(let cdef of module.ast.classOrInterfaceOrEnumDefinitions){
                if(cdef instanceof JavaClassOrEnum){
                    if((cdef.staticConstructor || cdef.staticFieldConstructor) && cdef.runtimeClass){
                        classesToInitialize.push(cdef);
                    }
                }
            }
        }

        let done: boolean = false;
        while(!done && classesToInitialize.length > 0){
            done = true;

            for(let i = 0; i < classesToInitialize.length; i++){
                let cti = classesToInitialize[i];

                let dependsOnOthers: boolean = false;
                for(let cti1 of classesToInitialize){
                    if(cti1 != cti && cti.staticConstructorsDependOn.get(cti1)){
                        dependsOnOthers = true;
                        break;
                    }
                }

                if(!dependsOnOthers){
                    if(cti.staticFieldConstructor){
                        this.staticInitializationSequence.push({
                            klass: cti.runtimeClass!,
                            program: cti.staticFieldConstructor
                        })
                    }
                    if(cti.staticConstructor){
                        this.staticInitializationSequence.push({
                            klass: cti.runtimeClass!,
                            program: cti.staticConstructor
                        })
                    }

                    classesToInitialize.splice(classesToInitialize.indexOf(cti), 1);
                    i--;
                    done = false;
                }

            }

        }


    }

    findMainModule(lastOpenedFile?: File, currentlyOpenedFile?: File) {
        let currentModule = this.findModuleByFile(currentlyOpenedFile);
        if(currentModule?.isStartable()){
            this.mainModule = currentModule;
        } else {
            let lastOpenedModule = this.findModuleByFile(lastOpenedFile);
            if(lastOpenedModule?.isStartable()){
                this.mainModule = lastOpenedModule;
            } else {
                // find first startable module...
                this.mainModule = this.moduleManager.modules.find(m => m.isStartable());
            }
        }

        if(this.mainModule){
            this.mainProgram = this.mainModule.getMainProgram();
        }
    }

    findModuleByFile(file?: File): Module | undefined {
        if(!file) return undefined;
        return this.moduleManager.modules.find(m => m.file == file);
    }

  

}