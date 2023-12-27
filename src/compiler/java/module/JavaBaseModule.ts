import { CodeReachedAssertions } from "../../common/interpreter/CodeReachedAssertions";
import { Program } from "../../common/interpreter/Program";
import { Module } from "../../common/module/Module";
import { JavaType } from "../types/JavaType";
import { JavaTypeStore } from "./JavaTypeStore";

export class JavaBaseModule extends Module {
    
    types: JavaType[] = [];
    codeReachedAssertions: CodeReachedAssertions = new CodeReachedAssertions();
        
    registerTypesAtTypestore(typestore: JavaTypeStore) {
        for(let type of this.types){
            typestore.addType(type);
        }
    }

    getMainProgram(): Program | undefined {
        throw new Error("Method not implemented.");
    }

}