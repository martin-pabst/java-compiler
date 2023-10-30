import { JavaType } from "../types/JavaType";
import { JavaModuleManager } from "./JavaModuleManager";

export class JavaTypeStore {
 
    private typeMap: Map<string, JavaType> = new Map();
    
    constructor(private moduleManager: JavaModuleManager){

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


}