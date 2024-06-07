import { BaseSymbolTable } from "../../../common/BaseSymbolTable.ts";
import { Executable } from "../../../common/Executable.ts";
import { Program } from "../../../common/interpreter/Program.ts";
import { TypeResolver } from "../../TypeResolver/TypeResolver.ts";
import { ExceptionTree } from "../../codegenerator/ExceptionTree.ts";
import { JavaSymbolTable } from "../../codegenerator/JavaSymbolTable.ts";
import { Lexer } from "../../lexer/Lexer.ts";
import { ReplCodeGenerator } from "./ReplCodeGenerator.ts";
import { ReplCompiledModule } from "./ReplCompiledModule.ts";
import { ReplParser } from "./ReplParser.ts";

export class ReplCompiler {

    compile(code: string, symbolTable: JavaSymbolTable, executable: Executable): {module: ReplCompiledModule, program: Program | undefined} {
        let replCompiledModule: ReplCompiledModule = new ReplCompiledModule(code);

        let lexerOutput = new Lexer().lex(code);
        replCompiledModule.setLexerOutput(lexerOutput);

        let replParser = new ReplParser(replCompiledModule);
        replParser.parse();

        let libraryTypestore = executable.libraryModuleManager.typestore;
        let compiledTypesTypestore = executable.moduleManager.typestore;

        let typeResolver = new TypeResolver(executable.moduleManager, executable.libraryModuleManager);
        if(typeResolver.resolve()){

            let replCodeGenerator = new ReplCodeGenerator(replCompiledModule, libraryTypestore,
                compiledTypesTypestore, executable.exceptionTree);

            let program = replCodeGenerator.start(symbolTable);
            return {
                module: replCompiledModule,
                program: program
            }
                
        }

        return {
            module: replCompiledModule,
            program: undefined
        }

    }



}