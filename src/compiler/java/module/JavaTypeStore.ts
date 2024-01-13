import { Klass, KlassObjectRegistry } from "../../common/interpreter/StepFunction";
import { PrimitiveStringClass } from "../runtime/system/javalang/PrimitiveStringClass";
import { JavaClass } from "../types/JavaClass";
import { JavaType } from "../types/JavaType";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { JavaCompiledModule } from "./JavaCompiledModule";
import { LibraryKlassType } from "./libraries/JavaLibraryModule";

export class JavaTypeStore {
 
    private typeMap: Map<string, JavaType> = new Map();
    
    constructor(){

    }

    copy(excludeTypesOfModule?: JavaCompiledModule): JavaTypeStore {
        let jts = new JavaTypeStore();
        if(excludeTypesOfModule){
            this.typeMap.forEach((value, key) => {if(value.module !== excludeTypesOfModule) jts.typeMap.set(key, value)});
        } else {
            this.typeMap.forEach((value, key) => {jts.typeMap.set(key, value)});
        }
        return jts;
    }

    empty(){
        this.typeMap = new Map();
    }

    addType(type: JavaType) {
        if(type instanceof NonPrimitiveType){
            this.typeMap.set(type.pathAndIdentifier, type);
        } else {
            this.typeMap.set(type.identifier, type);
        }
    }

    getType(identifierWithPath: string): JavaType | undefined {
        return this.typeMap.get(identifierWithPath);
    }

    populateClassObjectRegistry(klassObjectRegistry: KlassObjectRegistry){
        this.typeMap.forEach((type, key) => {
            if(type instanceof NonPrimitiveType && type.runtimeClass){
                klassObjectRegistry[type.pathAndIdentifier] = type.runtimeClass;
            }
        })
    }

    initFastExtendsImplementsLookup(){
        this.typeMap.forEach((type, key) => {
            type.registerExtendsImplementsOnAncestors();
        })
    }

    getClasses(): JavaClass[] {
        let classes: JavaClass[] = [];
        
        this.typeMap.forEach((type, identifier) => {
            if(type instanceof JavaClass){
                classes.push(type);
            }
        })

        return classes;
    }

    getNonPrimitiveTypes(): NonPrimitiveType[] {
        let npts: NonPrimitiveType[] = [];
        
        this.typeMap.forEach((type, identifier) => {
            if(type instanceof NonPrimitiveType){
                npts.push(type);
            }
        })

        return npts;
    }

}