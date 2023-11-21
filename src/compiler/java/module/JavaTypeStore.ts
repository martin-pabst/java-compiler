import { KlassObjectRegistry } from "../../common/interpreter/StepFunction";
import { JavaType } from "../types/JavaType";
import { NonPrimitiveType } from "../types/NonPrimitiveType";

export class JavaTypeStore {
 
    private typeMap: Map<string, JavaType> = new Map();
    
    constructor(){

    }

    empty(){
        this.typeMap = new Map();
    }

    addType(type: JavaType) {
        this.typeMap.set(type.identifier, type);
    }

    getType(identifier: string): JavaType | undefined {
        return this.typeMap.get(identifier);
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

}