import { Program } from "../../common/interpreter/Program";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { CodeSnippet } from "./CodeSnippet";
import { JavaSymbolTable } from "./JavaSymbolTable";
import { SnippetLinker } from "./SnippetLinker";
import { StatementCodeGenerator } from "./StatementCodeGenerator";

export class CodeGenerator extends StatementCodeGenerator {

    linker: SnippetLinker;

    constructor(module: JavaCompiledModule, libraryTypestore: JavaTypeStore) {
        super(module, libraryTypestore);
        this.linker = new SnippetLinker();
    }

    start() {
        this.compileMainProgram();
    }

    compileMainProgram() {
        let ast = this.module.ast!;
        this.currentSymbolTable = new JavaSymbolTable(this.module, ast.range, true);

        let snippets: CodeSnippet[] = [];

        for(let statement of ast.mainProgramNode.statements){
            let snippet = this.compileStatementOrTerm(statement);
            if(snippet) snippets.push(snippet);
        }

        let steps = this.linker.link(snippets);

        this.module.mainProgram = new Program(this.module, this.currentSymbolTable,
            "main program");
        this.module.mainProgram.stepsSingle = steps;

    }





}