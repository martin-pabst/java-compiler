import { Error } from "../../common/Error";
import { Program, Step } from "../../common/interpreter/Program";
import { Thread } from "../../common/interpreter/Thread.ts";
import { File } from "../../common/module/File";
import { JavaSymbolTable } from "../codegenerator/JavaSymbolTable.ts";
import { TokenList } from "../lexer/Token";
import { ASTBlockNode, ASTClassDefinitionNode, ASTGlobalNode } from "../parser/AST";
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
    mainClass?: ASTClassDefinitionNode;

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

        let types = this.types;
        if(this.mainClass){
            types = this.types.slice();
            types.push(this.mainClass.resolvedType!);
        }

        for(let type of types){

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
        this.errors = [];
        this.compiledSymbolsUsageTracker.clear();
        this.systemSymbolsUsageTracker.clear();
    }

    setDirtyIfProgramCodeChanged(){
        this.dirty = this.sourceCode != this.file.getText();
        this.sourceCode = this.file.getText();
    }

    hasMainProgram(): boolean {
        if(!this.mainClass) return false;
        let mainMethod = this.mainClass.methods.find( m => m.isStatic && m.identifier == "main")

        if(mainMethod){
            let statements = mainMethod.statement as ASTBlockNode;
            return statements.statements.length > 0;
        }

        return false;

    }

    startMainProgram(thread: Thread): boolean {
        let mainRuntimeClass = this.mainClass?.resolvedType?.runtimeClass;
        if(!mainRuntimeClass) return false;
        let mainMethod = this.mainClass?.resolvedType?.methods.find(m => m.getSignature() == "void main(String[])" && m.isStatic);

        if(!mainMethod) return false;

        let methodStub = mainRuntimeClass[mainMethod.getInternalNameWithGenericParameterIdentifiers("java")];
        if(!methodStub) return false;

        let THIS = mainRuntimeClass;
        
        methodStub.call(THIS, thread, []);

        return true;

    }


    dependsOnOtherDirtyModule(): boolean {
        return this.compiledSymbolsUsageTracker.existsDependencyToOtherDirtyModule();
    }

}