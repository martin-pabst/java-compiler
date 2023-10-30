import { File } from "../../common/module/File";
import { TokenList } from "../lexer/Token";
import { ASTGlobalNode } from "../parser/AST";
import { JavaType } from "../types/JavaType";
import { JavaBaseModule } from "./JavaBaseModule";
import { JavaModuleManager } from "./JavaModuleManager";
import { JavaTypeStore } from "./JavaTypeStore";

/**
 * A JavaModule represents a compiled Java Sourcecode File.
 */
export class JavaModule extends JavaBaseModule {

    tokens?: TokenList;
    ast?: ASTGlobalNode;

    usedTypesFromOtherModules: Map<JavaType, boolean> = new Map();

    lastCompiledProgramText: string = "";

    constructor(file: File, public moduleManager: JavaModuleManager){
        super(file, false);
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