import { JavaCompiledModule } from "../java/module/JavaCompiledModule";
import { JavaLibraryModule } from "../java/module/libraries/JavaLibraryModule";
import { SystemModule } from "../java/runtime/system/SystemModule";
import { BaseSymbol } from "./BaseSymbolTable";
import { File } from "./module/File";
import { Module } from "./module/Module";
import { Position } from "./range/Position";
import { IRange, Range } from "./range/Range";

export class UsagePosition {
    constructor(public symbol: BaseSymbol, public file: File, public range: IRange){}
}


/**
 *  - for onHover or code completion we have to search for symbols by given sourcecode position
 *  - for refactor->rename and to display all occurrences of a symbol we have to search for all
 *    usage positions for a given symbol
 */
export class UsageTracker {

    private lineToUsagePositionListMap: Map<number, UsagePosition[]> = new Map();

    private symbolToUsagePositionListMap: Map<BaseSymbol, UsagePosition[]> = new Map();

    private dependsOnModules: Map<Module, boolean> = new Map();

    clear(){
        this.lineToUsagePositionListMap.clear();
        this.symbolToUsagePositionListMap.clear();
        this.dependsOnModules.clear();
    }

    registerUsagePosition(symbol: BaseSymbol, file: File, range: IRange){
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
            this.dependsOnModules.set(symbol.module, true);
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

}