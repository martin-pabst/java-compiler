import { JavaType } from "../../java/types/JavaType.ts";
import { Error } from "../Error";
import { UsagePosition, UsageTracker } from "../UsagePosition";
import { Program, Step } from "../interpreter/Program";
import { Thread } from "../interpreter/Thread";
import { Position } from "../range/Position.ts";
import { IRange } from "../range/Range.ts";
import { File } from "./File";

export abstract class Module {

    errors: Error[] = [];
    bracketError?: string;
    colorInformation: monaco.languages.IColorInformation[] = [];

    private lastCompiledMonacoVersion: number = -2;

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

    findStep(lineNumber: number): Step | undefined {
        let nearestStep: Step | undefined;

        for(let program of this.programsToCompileToFunctions){
            let step = program.findStep(lineNumber);
            if(step){
                if(nearestStep){
                    if(Math.abs(step.range.startLineNumber! - lineNumber) < Math.abs(nearestStep.range.startLineNumber! - lineNumber)){
                        nearestStep = step;
                    }
                } else {
                    nearestStep = step;
                }
            }
        }
        return nearestStep;
    }

    isDirty(): boolean {
        return this.file.getMonacoVersion() != this.lastCompiledMonacoVersion;
    }

    setDirty() {
        this.lastCompiledMonacoVersion = -2;
    }

}