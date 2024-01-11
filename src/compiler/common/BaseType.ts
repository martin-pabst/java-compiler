import { BaseSymbol } from "./BaseSymbolTable";
import { Module } from "./module/Module";
import { IRange } from "./range/Range";

/**
 * encapsultes methods for debugger
 */
export abstract class BaseType extends BaseSymbol {

    constructor(identifier: string, identifierRange: IRange, module: Module) {
        super(identifier, identifierRange, module);
    }

}