import { Interpreter } from "../../../common/interpreter/Interpreter.ts";
import { Thread } from "../../../common/interpreter/Thread.ts";
import { JavaSymbolTable } from "../../codegenerator/JavaSymbolTable.ts";


export class Repl {

    /**
     * If REPL-Statements are executed outside a paused program context
     * then use this symbol table an this thread:
     */
    standaloneSymbolTable: JavaSymbolTable;
    standaloneThread: Thread;


    constructor(interpreter: Interpreter){
        
    }


}