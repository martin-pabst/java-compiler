import { BaseSymbol, SymbolOnStackframe } from "../../common/BaseSymbolTable";
import { IRange } from "../../common/range/Range";
import { JavaType } from "../types/JavaType";
import { JavaSymbolTable } from "./JavaSymbolTable.ts";

export class JavaLocalVariable extends SymbolOnStackframe {

    constructor(identifier: string, public identifierRange: IRange,
         public type: JavaType, symbolTable: JavaSymbolTable){
        super(identifier, identifierRange, symbolTable.module);
    }

    getValue(stack: any, stackframeStart: number): any {
        // TODO
    }

}