import { Klass, KlassObjectRegistry } from "../../common/interpreter/StepFunction";
import { PrimitiveStringClass } from "../runtime/system/javalang/PrimitiveStringClass";
import { JavaClass } from "../types/JavaClass";
import { JavaType } from "../types/JavaType";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { LibraryKlassType } from "./libraries/JavaLibraryModule";

export class JavaTypeStore {
 
    private typeMap: Map<string, JavaType> = new Map();
    
    constructor(){

    }

    empty(){
        this.typeMap = new Map();
    }

    addType(type: JavaType) {
        if(type instanceof NonPrimitiveType){
            this.typeMap.set(type.path, type);
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
                klassObjectRegistry[type.identifier] = type.runtimeClass;
            }
        })
    }

    registerExtendsImplements(){
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

}