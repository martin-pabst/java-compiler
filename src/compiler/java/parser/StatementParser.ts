import { Module } from "../../common/module/module.ts";
import { TermParser } from "./TermParser.ts";

export class StatementParser extends TermParser {

    constructor(protected module: Module) {
        super(module);
    }



}