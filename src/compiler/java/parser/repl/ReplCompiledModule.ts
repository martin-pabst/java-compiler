import { File } from "../../../common/module/File";
import { Position } from "../../../common/range/Position";
import { JavaSymbolTable } from "../../codegenerator/JavaSymbolTable";
import { JavaCompiledModule } from "../../module/JavaCompiledModule";

export class ReplCompiledModule extends JavaCompiledModule {

    constructor(code: string){
        super(new File());
        this.file.setText(code);
    }

    findSymbolTableAtPosition(position: Position): JavaSymbolTable | undefined {
        return this.symbolTables[0];
    }


}