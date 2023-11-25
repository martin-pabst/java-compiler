import { Program } from "./Program.ts";
import { Thread } from "./Thread.ts";

export type StepFunction = (thread: Thread, stack: any[], stackBase: number) => number;

export class StepParams {
    static thread = "__t";            // type Thread
    static stack = "__s";             // type any[]
    static stackBase = "__sb";        // type number
}

export class Helpers {
    static classes = StepParams.thread + ".classes";
    static newArray = StepParams.thread + "." + Thread.prototype.newArray.name; 
    static print = StepParams.thread + "." + Thread.prototype.print.name; 
    static println = StepParams.thread + "." + Thread.prototype.println.name; 
    static return = StepParams.thread + "." + Thread.prototype.return.name;
    static threadStack = StepParams.thread + ".s";
    static pushProgram = StepParams.thread + "." + Thread.prototype.pushProgram.name;
    static getExceptionAndTrimStack = StepParams.thread + "." + Thread.prototype.getExceptionAndTrimStack.name;
    static throwException = StepParams.thread + "." + Thread.prototype.throwException.name;
    static beginTryBlock = StepParams.thread + "." + Thread.prototype.beginTryBlock.name;
    static endTryBlock = StepParams.thread + "." + Thread.prototype.endCatchTryBlock.name;
    static throwAE = StepParams.thread + "." + Thread.prototype.AE.name;
    static throwNPE = StepParams.thread + "." + Thread.prototype.NPE.name;
}

/**
 * int a = v[b + 3][x];
 * compiles to: 
 * s[sb + 2] = h.arr(s[sb + 7], 1370, s[sb + 12] + 3, s[sb + 13])
 * (v lies on pos 7, b on pos 12, x on pos 13)
 */

// Thread function returns new stepIndex

export type Klass = { new(...args: any[]): any, [index: string]: any };
export type KlassObjectRegistry = Record<string, Klass>;

    
