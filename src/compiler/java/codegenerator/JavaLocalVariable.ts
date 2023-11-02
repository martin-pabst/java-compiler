import { BaseSymbolOnStackframe } from "../../common/BaseSymbolTable";
import { IRange } from "../../common/range/Range";
import { JavaType } from "../types/JavaType";

export class JavaLocalVariable extends BaseSymbolOnStackframe {

    declare type: JavaType;

    constructor(identifier: string, public identifierRange: IRange,
         type: JavaType){
        super(identifier, identifierRange, type);
    }

    getValue(stack: any, stackframeStart: number): any {
        // TODO
    }


}