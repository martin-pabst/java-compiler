import { JavaType } from "../types/JavaType";

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


}