import { Program } from "./Program.ts";
import { Thread } from "./Thread.ts";

export type StepFunction = (thread: Thread, stack: any[], stackBase: number) => number;

export class StepParams {
    static thread = "t";            // type Thread
    static stack = "s";             // type any[]
    static stackBase = "sb";        // type number
}

export class Helpers {
    static classes = StepParams.thread + ".classes";
    static arrayRef = StepParams.thread + ".arr"; 
    static newArray = StepParams.thread + ".newArray"; 
    static print = StepParams.thread + ".print"; 
    static println = StepParams.thread + ".println"; 
    static return = StepParams.thread + ".return";
    static threadStack = StepParams.thread + ".s";
    static pushProgram = StepParams.thread + ".pushProgram";
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

    
