import { Program } from "../../common/interpreter/Program";
import { TokenType } from "../TokenType";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { ASTClassDefinitionNode } from "../parser/AST";
import { CodeSnippet, StringCodeSnippet } from "./CodeSnippet";
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
        this.compileClasses();
    }

    compileMainProgram() {
        let ast = this.module.ast!;
        this.currentSymbolTable = new JavaSymbolTable(this.module, ast.range, true);

        let snippets: CodeSnippet[] = [];

        for(let statement of ast.mainProgramNode.statements){
            let snippet = this.compileStatementOrTerm(statement);
            if(snippet) snippets.push(snippet);
        }

        snippets.push(new StringCodeSnippet("t.state = 4;"));

        let steps = this.linker.link(snippets);

        this.module.mainProgram = new Program(this.module, this.currentSymbolTable,
            "main program");
        this.module.mainProgram.stepsSingle = steps;

    }

    compileClasses(){
        if(!this.module.ast?.classOrInterfaceOrEnumDefinitions) return;

        for(let cdef of this.module.ast?.classOrInterfaceOrEnumDefinitions){
            switch(cdef.kind){
                case TokenType.keywordClass:
                    this.compileClass(cdef);
                    break;
                case TokenType.keywordEnum:
                    break;
                case TokenType.keywordInterface:
                    break;
            }
        }
    }

    compileClass(cdef: ASTClassDefinitionNode) {
        let type = cdef.resolvedType;
        if(!type) return;

        
    }



}