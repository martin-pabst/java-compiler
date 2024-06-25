import { BaseSymbol, SymbolOnStackframe } from "../../common/BaseSymbolTable";
import { BaseType } from "../../common/BaseType.ts";
import { IRange } from "../../common/range/Range";
import { JavaType } from "../types/JavaType";
import { JavaSymbolTable } from "./JavaSymbolTable.ts";

export class JavaLocalVariable extends SymbolOnStackframe {
    
    constructor(identifier: string, public identifierRange: IRange,
        public type: JavaType, symbolTable: JavaSymbolTable){
            super(identifier, identifierRange, symbolTable.module);
        }
        
        getDeclaration(): string {
            let decl: string = "";
            if(this.isFinal) decl += "final ";
            return decl + this.type?.toString() + " " + this.identifier;
        }
        
        getType(): BaseType {
            return this.type;
        }
}