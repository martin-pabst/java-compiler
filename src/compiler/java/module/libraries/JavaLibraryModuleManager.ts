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
        let systemModule = new SystemModule();
        this.libraryModules.push(systemModule)
        if(additionalModules){
            this.libraryModules.push(...additionalModules);
        }

        this.typestore = new JavaTypeStore();
        this.compileClassesToTypes();

        let ldp: LibraryDeclarationParser = new LibraryDeclarationParser();
        ldp.parseClassOrEnumOrInterfaceDeclarationWithoutGenerics(systemModule.primitiveStringClass, systemModule);
        ldp.parseAttributesAndMethods(systemModule.primitiveStringClass, this.typestore, systemModule);
        ldp.parseClassOrInterfaceDeclarationGenericsAndExtendsImplements(systemModule.primitiveStringClass, this.typestore, systemModule);

        this.typestore.initFastExtendsImplementsLookup();

    }

    compileClassesToTypes(){
        let ldp: LibraryDeclarationParser = new LibraryDeclarationParser();
        this.typestore.empty;
        this.javaTypes = [];

        ldp.currentTypeStore = this.typestore;
    
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
                ldp.genericParameterMapStack.push({});
                ldp.parseClassOrInterfaceDeclarationGenericsAndExtendsImplements(klass, this.typestore, module);
                ldp.parseAttributesAndMethods(klass, this.typestore, module);
                ldp.genericParameterMapStack.pop();
            }
        }        

        for(let javaClass of this.typestore.getClasses()){
            javaClass.checkIfInterfacesAreImplementedAndSupplementDefaultMethods();
        }
    }

    getTypeCompletionItems(rangeToReplace: monaco.IRange): monaco.languages.CompletionItem[] {
        return this.typestore.getTypeCompletionItems(undefined, rangeToReplace, false, true);
    }


}