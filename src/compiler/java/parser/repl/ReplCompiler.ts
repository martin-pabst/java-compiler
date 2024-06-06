import { BaseSymbolTable } from "../../../common/BaseSymbolTable.ts";
import { Program } from "../../../common/interpreter/Program.ts";
import { Lexer } from "../../lexer/Lexer.ts";
import { ReplParser } from "./ReplParser.ts";
import { ReplStatement } from "./ReplStatement.ts";

export class ReplCompiler {


    compile(code: string, symbolTable: BaseSymbolTable): Program {
        let replStatement: ReplStatement = new ReplStatement(code);
        
        let replParser = new ReplParser(replStatement);
        replParser.parse();

        let replCodeGenerator = new ReplCodeGenerator(replStatement);



    }



}