import chalk from "chalk";
import { JavaCompiledModule } from "../java/module/JavaCompiledModule";
import { JavaLibraryModule } from "../java/module/libraries/JavaLibraryModule";
import { SystemModule } from "../java/runtime/system/SystemModule";
import { Field } from "../java/types/Field.ts";
import { GenericVariantOfJavaClass } from "../java/types/JavaClass.ts";
import { GenericVariantOfJavaInterface } from "../java/types/JavaInterface.ts";
import { Method } from "../java/types/Method.ts";
import { NonPrimitiveType } from "../java/types/NonPrimitiveType.ts";
import { StaticNonPrimitiveType } from "../java/types/StaticNonPrimitiveType.ts";
import { BaseSymbol } from "./BaseSymbolTable";
import { File } from "./module/File";
import { Module } from "./module/Module";
import { Position } from "./range/Position";
import { IRange, Range } from "./range/Range";

export class UsagePosition {
    constructor(public symbol: BaseSymbol, public file: File, public range: IRange){}
}

export class NonPrimitiveTypeUsage {
    declaration: string;
    symbolDeclarations: Map<string, boolean> = new Map();

    constructor(type: NonPrimitiveType){
        if(type instanceof GenericVariantOfJavaClass || type instanceof GenericVariantOfJavaInterface){
            type = type.isGenericVariantOf;
        }

        this.declaration = type.getDeclaration();
    }

    toString(): string {
        let str: string = "   " + this.declaration + "\n";
        this.symbolDeclarations.forEach((v, decl) => {
            str += "      " + decl + "\n";
        })
        return str;
    }

}

export class ModuleUsage {

    typeUsage: Map<string, NonPrimitiveTypeUsage> = new Map();

    constructor(private usageTracker: UsageTracker, private module: Module){
        
    }

    toString() : string {
        let str = chalk.blue(this.module.file.filename) + ":\n";

        if(this.typeUsage.size == 0) return "";

        this.typeUsage.forEach((usage, typePath) => {
            str += "   " + typePath + ":\n";
            str += usage.toString();
        })
        return str;
    }

    private addTypeWithSymbol(symbol: BaseSymbol, type: NonPrimitiveType){
        if(type.module == this.usageTracker.module) return;
        if(type.isLibraryType) return;

        let tu = this.typeUsage.get(type.pathAndIdentifier);
        if(!tu){
            tu = new NonPrimitiveTypeUsage(type);
            this.typeUsage.set(type.pathAndIdentifier, tu);
        }

        tu.symbolDeclarations.set(symbol.getDeclaration(), true);
    }

    private addType(type: NonPrimitiveType){
        if(type.module == this.usageTracker.module) return;
        if(type.isLibraryType) return;
        let tu = this.typeUsage.get(type.pathAndIdentifier);
        if(!tu){
            tu = new NonPrimitiveTypeUsage(type);
        }
   }

    public addSymbol(symbol: BaseSymbol){
        if(symbol instanceof Field){
            return this.addTypeWithSymbol(symbol, symbol.classEnum);
        }
        
        if(symbol instanceof Method){
            let originalType = symbol.classEnumInterface;
            if(symbol.isCopyOf){
                this.addType(originalType);
                while((<Method>symbol).isCopyOf) symbol = (<Method>symbol).isCopyOf!;
                let otherType = (<Method>symbol).classEnumInterface;
                if(otherType && !otherType.isLibraryType){
                    this.addTypeWithSymbol(symbol, otherType);
                }
            } else {
                this.addTypeWithSymbol(symbol, originalType);
            }
            return;
        }

        if(symbol instanceof StaticNonPrimitiveType){
            this.addType(symbol.nonPrimitiveType);
            return;
        }

        if(symbol instanceof NonPrimitiveType){
            this.addType(symbol);
        }
    }
}

/**
 *  - for onHover or code completion we have to search for symbols by given sourcecode position
 *  - for refactor->rename and to display all occurrences of a symbol we have to search for all
 *    usage positions for a given symbol
 */
export class UsageTracker {

    private lineToUsagePositionListMap: Map<number, UsagePosition[]> = new Map();

    private symbolToUsagePositionListMap: Map<BaseSymbol, UsagePosition[]> = new Map();

    private dependsOnModules: Map<Module, ModuleUsage> = new Map();

    constructor(public module: Module){

    }

    clear(){
        this.lineToUsagePositionListMap.clear();
        this.symbolToUsagePositionListMap.clear();
        this.dependsOnModules.clear();
    }

    registerUsagePosition(symbol: BaseSymbol, file: File, range: IRange){
        if(!range) return;
        let up = new UsagePosition(symbol, file, range);

        for(let line = range.startLineNumber; line <= range.endLineNumber; line++){
            let list = this.lineToUsagePositionListMap.get(line);
            if(!list){
                list = [];
                this.lineToUsagePositionListMap.set(line, list);
            }
            list.push(up);
        }

        let upList = this.symbolToUsagePositionListMap.get(symbol);
        if(!upList){
            upList = [];
            this.symbolToUsagePositionListMap.set(symbol, upList);
        }
        upList.push(up);

        if(!symbol.module.isLibraryModule){
            let moduleUsage = this.dependsOnModules.get(symbol.module);
            if(!moduleUsage){
                moduleUsage = new ModuleUsage(this, symbol.module);
                this.dependsOnModules.set(symbol.module, moduleUsage);
            }
            moduleUsage.addSymbol(symbol);
        }
    }

    findSymbolAtPosition(position: Position): UsagePosition | undefined {
        let usagePositionsOnLine = this.lineToUsagePositionListMap.get(position.lineNumber);
        if(!usagePositionsOnLine) return undefined;

        for(let up of usagePositionsOnLine){
            if(Range.containsPosition(up.range, position)) return up;
        }

        return undefined;
    }

    getUsagePositionsForSymbol(symbol: BaseSymbol){
        return this.symbolToUsagePositionListMap.get(symbol);
    }

    getModulesWhichThisModuleDependsOn():Module[] {
        let modules: Module[] =  [];

        this.dependsOnModules.forEach((v, module) => {modules.push(module)});

        return modules;
    }

    getDependsOnModulesDebugInformation(): string {
        let str: string = chalk.red("");

        this.dependsOnModules.forEach((moduleUsage, module) => {
            let mu: string = moduleUsage.toString();
            if(mu.length > 0){
                str += chalk.blue("Depends on module " + module.file.filename + ":\n");
                str += chalk.white(moduleUsage.toString());
            }
        })

        return str;
    }

    existsDependencyToOtherDirtyModule(): boolean {
        
        for(let entry of this.dependsOnModules.entries()){
            // TODO: analyze if used signatures are available

            if(entry[0].dirty){
                return true;
            }
        }

        return false;
    }

}