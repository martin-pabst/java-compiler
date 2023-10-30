import { SystemModule } from "../../runtime/system/SystemModule";
import { JavaType } from "../../types/JavaType";
import { JavaLibraryModule, JavaTypeMap } from "./JavaLibraryModule";
import { LibraryDeclarationParser } from "./LibraryDeclarationParser";

export class JavaLibraryModuleManager {

    libraryModules: JavaLibraryModule[] = [];
    javaTypeMap: JavaTypeMap = {};
    javaTypes: JavaType[] = [];

    constructor(){
        this.libraryModules.push(new SystemModule())
    }

    compileClassesToTypes(){
        let ldp: LibraryDeclarationParser = new LibraryDeclarationParser();
        this.javaTypeMap = {};
        this.javaTypes = [];
    
        for(let module of this.libraryModules){
            for (let klass of module.classes) {
                let npt = ldp.parseClassOrEnumOrInterfaceDeclarationWithoutGenerics(klass, module);
                this.javaTypeMap[npt.identifier] = npt;
                this.javaTypes.push(npt);        
            }

            for(let type of module.types){
                this.javaTypeMap[type.identifier] = type;
                this.javaTypes.push(type);
            }

        }

        for(let module of this.libraryModules){
            for(let klass of module.classes){
                ldp.parseClassOrInterfaceDeclarationGenericsAndExtendsImplements(klass, this.javaTypeMap, module);
            }
        }        
    }

    clearUsagePositions(){
        for(let type of this.javaTypes){
            type.clearUsagePositions();
        }
    }

}