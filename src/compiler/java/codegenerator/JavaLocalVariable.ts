import { BaseSymbol, SymbolKind } from "../../common/BaseSymbolTable";
import { IRange } from "../../common/range/Range";
import { JavaType } from "../types/JavaType";
import { JavaSymbolTable } from "./JavaSymbolTable.ts";

export class JavaLocalVariable extends BaseSymbol {

    declare type: JavaType;

    constructor(identifier: string, public identifierRange: IRange,
         type: JavaType, symbolTable: JavaSymbolTable){
        super(identifier, identifierRange, type, SymbolKind.localVariable);
    }

    getValue(stack: any, stackframeStart: number): any {
        // TODO
    }

}