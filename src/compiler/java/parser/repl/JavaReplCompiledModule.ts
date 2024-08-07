import { CompilerFile } from "../../../common/module/CompilerFile";
import { Position } from "../../../common/range/Position";
import { JavaSymbolTable } from "../../codegenerator/JavaSymbolTable";
import { JavaCompiledModule } from "../../module/JavaCompiledModule";

export class JavaReplCompiledModule extends JavaCompiledModule {

    constructor(code: string){
        super(new CompilerFile());
        this.file.setText(code);
    }

    findSymbolTableAtPosition(position: Position): JavaSymbolTable | undefined {
        return this.symbolTables[0];
    }

    isReplModule(): boolean {
        return true;
    }

}