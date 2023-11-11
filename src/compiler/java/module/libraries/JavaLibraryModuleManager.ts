import { SystemModule } from "../../runtime/system/SystemModule";
import { JavaType } from "../../types/JavaType";
import { JavaTypeStore } from "../JavaTypeStore";
import { JavaLibraryModule, JavaTypeMap } from "./JavaLibraryModule";
import { LibraryDeclarationParser } from "./LibraryDeclarationParser";

export class JavaLibraryModuleManager {

    libraryModules: JavaLibraryModule[] = [];
    javaTypes: JavaType[] = [];
    typestore: JavaTypeStore;

    constructor(...additionalModules: JavaLibraryModule[]){
        this.libraryModules.push(new SystemModule())
        if(additionalModules){
            this.libraryModules.push(...additionalModules);
        }

        this.typestore = new JavaTypeStore();
        this.compileClassesToTypes();
    }

    compileClassesToTypes(){
        let ldp: LibraryDeclarationParser = new LibraryDeclarationParser();
        this.typestore.empty;
        this.javaTypes = [];
    
        for(let module of this.libraryModules){
            for (let klass of module.classes) {
                let npt = ldp.parseClassOrEnumOrInterfaceDeclarationWithoutGenerics(klass, module);
                this.typestore.addType(npt);
                this.javaTypes.push(npt);        
            }

            for(let type of module.types){
                this.typestore.addType(type);
                this.javaTypes.push(type);
            }

        }

        for(let module of this.libraryModules){
            for(let klass of module.classes){
                ldp.parseClassOrInterfaceDeclarationGenericsAndExtendsImplements(klass, this.typestore, module);
                ldp.parseAttributesAndMethods(klass, this.typestore, module);
            }
        }        
    }

    clearUsagePositions(){
        for(let type of this.javaTypes){
            type.clearUsagePositions();
        }
    }

}