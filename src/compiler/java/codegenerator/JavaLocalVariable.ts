import { BaseSymbol, SymbolKind } from "../../common/BaseSymbolTable";
import { IRange } from "../../common/range/Range";
import { JavaType } from "../types/JavaType";

export class JavaLocalVariable extends BaseSymbol {

    declare type: JavaType;

    constructor(identifier: string, public identifierRange: IRange,
         type: JavaType){
        super(identifier, identifierRange, type, SymbolKind.localVariable);
    }

    getValue(stack: any, stackframeStart: number): any {
        // TODO
    }

}