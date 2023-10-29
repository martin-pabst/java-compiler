import { File } from "../../common/module/File";
import { Module } from "../../common/module/module";
import { TokenList } from "../lexer/Token";
import { ASTGlobalNode } from "../parser/AST";
import { JavaType } from "../types/JavaType";
import { JavaModuleManager } from "./JavaModuleManager";

/**
 * A JavaModule represents a compiled Java Sourcecode File.
 */
export class JavaModule extends Module {

    tokens?: TokenList;
    ast?: ASTGlobalNode;

    /**
     * This is used if module is reused later without recompiliation.
     * It contains only pure types (no generic variants) declared in this module.
     */
    types: JavaType[] = [];     
    usedTypesFromOtherModules: Map<JavaType, boolean> = new Map();

    lastCompiledProgramText: string = "";
    dirty: boolean = true;

    constructor(file: File, public moduleManager: JavaModuleManager){
        super(file);
    }

    resetBeforeCompilation(){
        this.tokens = undefined;
        this.ast = undefined;
        this.types = [];
        this.usedTypesFromOtherModules = new Map();
    }

    setDirtyIfProgramCodeChanged(){
        this.dirty = this.lastCompiledProgramText != this.file.getText();
        this.lastCompiledProgramText = this.file.getText();
    }

}