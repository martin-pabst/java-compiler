import { BaseField, BaseSymbol } from "./BaseSymbolTable";
import { Module } from "./module/Module";
import { IRange } from "./range/Range";

/**
 * encapsultes methods for debugger
 */
export abstract class BaseType extends BaseSymbol {

    constructor(identifier: string, identifierRange: IRange, module: Module) {
        super(identifier, identifierRange, module);
    }

    getType(): BaseType {
        return this;
    }

}

export interface BaseObjectType {
    getFields(): BaseField[];
}

export interface BaseArrayType {
    getElementType(): BaseType;
}

export interface BaseListType {
    isBaseListType(): boolean;
    getElements(): any[];
}