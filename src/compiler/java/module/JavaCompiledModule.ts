import { Error } from "../../common/Error";
import { Program } from "../../common/interpreter/Program";
import { File } from "../../common/module/File";
import { TokenList } from "../lexer/Token";
import { ASTGlobalNode } from "../parser/AST";
import { JavaType } from "../types/JavaType";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { JavaBaseModule } from "./JavaBaseModule";
import { JavaModuleManager } from "./JavaModuleManager";

/**
 * A JavaModule represents a compiled Java Sourcecode File.
 */
export class JavaCompiledModule extends JavaBaseModule {

    sourceCode: string = "";

    tokens?: TokenList;
    ast?: ASTGlobalNode;
    mainProgram?: Program;

    usedTypesFromOtherModules: Map<JavaType, boolean> = new Map();


    errors: Error[] = [];

    constructor(file: File, public moduleManager: JavaModuleManager){
        super(file, false);
    }

    resetBeforeCompilation(){
        this.tokens = undefined;
        this.ast = undefined;
        this.types = [];
        this.usedTypesFromOtherModules = new Map();
        this.errors = [];
    }

    setDirtyIfProgramCodeChanged(){
        this.dirty = this.sourceCode != this.file.getText();
        this.sourceCode = this.file.getText();
    }


    clearAndRegisterTypeUsagePositions(): void {
        this.clearTypeUsagePositions();
        this.registerTypeUsagePositions();
    }

    clearTypeUsagePositions(): void {
        if(this.ast?.classOrInterfaceOrEnumDefinitions){
            for(let def of this.ast?.classOrInterfaceOrEnumDefinitions){
                if(def.resolvedType) def.resolvedType?.clearUsagePositions();
            }
        }        
    }

    registerTypeUsagePositions(): void {
        if(this.ast?.collectedTypeNodes){
            for(let typeNode of this.ast!.collectedTypeNodes){
                let resolvedType = typeNode.resolvedType;
                if(resolvedType && resolvedType instanceof NonPrimitiveType && !resolvedType.isGenericVariant()){                    
                    resolvedType.usagePositions.push({
                        file: this.file,
                        range: typeNode.range
                    })
                }
            }
        }
    }

    getMainProgram(): Program | undefined {
        return this.mainProgram;
    }


}