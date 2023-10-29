import { JavaType } from "../types/JavaType";
import { JavaModuleManager } from "./JavaModuleManager";

export class JavaTypeStore {
 
    typeMap: Map<string, JavaType> = new Map();
    
    constructor(private moduleManager: JavaModuleManager){
        
    }

    empty(){
        this.typeMap = new Map();
    }

}