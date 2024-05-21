import { JavaType } from "../../java/types/JavaType.ts";
import { BaseSymbol } from "../BaseSymbolTable.ts";
import { Error } from "../Error";
import { UsagePosition, UsageTracker } from "../UsagePosition";
import { Program } from "../interpreter/Program";
import { Thread } from "../interpreter/Thread";
import { Position } from "../range/Position.ts";
import { IRange } from "../range/Range.ts";
import { File } from "./File";

export abstract class Module {

    errors: Error[] = [];
    bracketError?: string;
    colorInformation: monaco.languages.IColorInformation[] = [];

    dirty: boolean = true;

    programsToCompileToFunctions: Program[] = [];


    compiledSymbolsUsageTracker: UsageTracker = new UsageTracker(this);

    systemSymbolsUsageTracker: UsageTracker = new UsageTracker(this);

    constructor(public file: File, public isLibraryModule: boolean) {

    }

    abstract hasMainProgram(): boolean;

    abstract startMainProgram(thread: Thread): boolean;

    isStartable(): boolean {
        if (this.hasMainProgram()) {
            return !this.hasErrors();
        }

        return false;
    }

    hasErrors(): boolean {
        return this.errors.find(error => error.level == "error") ? true : false;
    }

    findSymbolAtPosition(position: Position): UsagePosition | undefined {
        let symbol = this.compiledSymbolsUsageTracker.findSymbolAtPosition(position);
        if (symbol) return symbol;
        return this.systemSymbolsUsageTracker.findSymbolAtPosition(position);
    }

    registerTypeUsage(type: JavaType, range: IRange) {
        if (type.module.isLibraryModule) {
            this.systemSymbolsUsageTracker.registerUsagePosition(type, this.file,
                range);
        } else {
            this.compiledSymbolsUsageTracker.registerUsagePosition(type, this.file,
                range);
        }
    }

}