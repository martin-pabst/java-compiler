import { Error } from "../../common/Error";
import { Program, Step } from "../../common/interpreter/Program";
import { File } from "../../common/module/File";
import { JavaSymbolTable } from "../codegenerator/JavaSymbolTable.ts";
import { TokenList } from "../lexer/Token";
import { ASTClassDefinitionNode, ASTGlobalNode } from "../parser/AST";
import { JavaType } from "../types/JavaType";
import { JavaTypeWithInstanceInitializer } from "../types/JavaTypeWithInstanceInitializer.ts";
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

    symbolTables: JavaSymbolTable[] = [];  // contains one symbol table for main program and one for each class/interface/enum in global scope    

    constructor(file: File, public moduleManager: JavaModuleManager){
        super(file, false);
    }

    setBreakpoint(line: number){
        let steps = this.findSteps(line);
        steps.forEach(step => step.setBreakpoint());
    }

    clearBreakpoint(line: number){
        let steps = this.findSteps(line);
        steps.forEach(step => step.clearBreakpoint());
    }

    findSteps(line: number): Step[] {
        if(this.mainProgram){
            let step = this.mainProgram.findStep(line);
            if(step) return [step];
        }

        for(let type of this.types){

            if(type instanceof NonPrimitiveType){

                if(type.staticInitializer){
                    let step = type.staticInitializer.findStep(line);
                    if(step) return [step];
                }

                // A instance initializer may have been copied to several constructors, so if 
                // breakpoint in instance initializer is set there may be several steps to
                // consider setting a breakpoint in.
                let steps: Step[] = [];
                for(let method of type.getOwnMethods()){
                    if(method.program){
                        let step = method.program.findStep(line);
                        if(step) steps.push(step);
                    }
                }

                return steps;
            }

        }

        return [];

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
                if(def.resolvedType) def.resolvedType?.clearUsagePositionsAndInheritanceInformation();
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