import { BaseSymbol } from "../../common/BaseSymbolTable.ts";
import { Error } from "../../common/Error";
import { UsagePosition } from "../../common/UsagePosition.ts";
import { Program, Step } from "../../common/interpreter/Program";
import { Thread } from "../../common/interpreter/Thread.ts";
import { File } from "../../common/module/File";
import { Position } from "../../common/range/Position.ts";
import { JavaSymbolTable } from "../codegenerator/JavaSymbolTable.ts";
import { LexerOutput } from "../lexer/Lexer.ts";
import { TokenList } from "../lexer/Token";
import { ASTBlockNode, ASTClassDefinitionNode, ASTGlobalNode } from "../parser/AST";
import { JavaArrayType } from "../types/JavaArrayType.ts";
import { JavaType } from "../types/JavaType";
import { JavaMethod } from "../types/JavaMethod.ts";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { StaticNonPrimitiveType } from "../types/StaticNonPrimitiveType.ts";
import { JavaBaseModule } from "./JavaBaseModule";
import { JavaModuleManager } from "./JavaModuleManager";
import { TypePosition } from "./TypePosition.ts";

export type JavaMethodCallPosition = {
    identifierRange: monaco.IRange,
    possibleMethods: JavaMethod[] | string, // string for print, println, ...
    commaPositions: monaco.IPosition[],
    rightBracketPosition: monaco.IPosition,
    bestMethod?: JavaMethod
}

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

    typePositions: {[line: number]: TypePosition[]} = {};

    methodCallPositions: {[line: number]: JavaMethodCallPosition[]} = {};

    constructor(file: File, public moduleManager?: JavaModuleManager){
        super(file, false);
    }

    setLexerOutput(lexerOutput: LexerOutput) {
        this.tokens = lexerOutput.tokens;
        this.errors = lexerOutput.errors;
        this.colorInformation = lexerOutput.colorInformation;
    }


    addTypePosition(position: Position, type: JavaType){


        if(type instanceof NonPrimitiveType || type instanceof StaticNonPrimitiveType || type instanceof JavaArrayType){
            let list = this.typePositions[position.lineNumber];
            if(list == null){
                list = [];
                this.typePositions[position.lineNumber] = list;
            }
            list.push({
                type: type,
                position: position
            })
        }
    }

    getTypeAtPosition(line: number, column: number): NonPrimitiveType | StaticNonPrimitiveType | JavaArrayType | undefined {

        return this.typePositions[line]?.find(tp => tp.position.column == column)?.type;

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
        this.typePositions = {};
        this.methodCallPositions = {};
        this.symbolTables = [];
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
        
        methodStub.call(THIS, thread, thread.s);

        return true;

    }


    dependsOnOtherDirtyModule(): boolean {
        return this.compiledSymbolsUsageTracker.existsDependencyToOtherDirtyModule();
    }

    findSymbolTableAtPosition(position: Position): JavaSymbolTable | undefined {
        let tableWithSmallestNumberOfLines: JavaSymbolTable | undefined;
        let smallestNumberOfLines: number = Number.MAX_SAFE_INTEGER;
        for(let table of this.symbolTables){
            let t1: JavaSymbolTable | undefined = table.findSymbolTableAtPosition(position) as JavaSymbolTable;
            if(t1){
                let lineCount = t1.range.endLineNumber - t1.range.startLineNumber + 1;
                if(lineCount < smallestNumberOfLines){
                    smallestNumberOfLines = lineCount;
                    tableWithSmallestNumberOfLines = t1;
                }
            }
        }

        return tableWithSmallestNumberOfLines;
    }

    getUsagePositionsForSymbol(symbol: BaseSymbol): UsagePosition[] | undefined {
        return this.compiledSymbolsUsageTracker.getUsagePositionsForSymbol(symbol) || this.systemSymbolsUsageTracker.getUsagePositionsForSymbol(symbol);
    }

    pushMethodCallPosition(identifierRange: monaco.IRange, commaPositions: monaco.IPosition[],
        possibleMethods: JavaMethod[] | string, rightBracketPosition: monaco.IPosition,
    bestMethod?: JavaMethod) {

        let lines: number[] = [];
        lines.push(identifierRange.startLineNumber);
        for (let cp of commaPositions) {
            if (lines.indexOf(cp.lineNumber) < 0) {
                lines.push(cp.lineNumber);
            }
        }

        let mcp: JavaMethodCallPosition = {
            identifierRange: identifierRange,
            commaPositions: commaPositions,
            possibleMethods: possibleMethods,
            rightBracketPosition: rightBracketPosition,
            bestMethod: bestMethod
        };

        for (let line of lines) {
            let mcpList = this.methodCallPositions[line];
            if (mcpList == null) {
                this.methodCallPositions[line] = [];
                mcpList = this.methodCallPositions[line];
            }
            mcpList.push(mcp);
        }

    }

}