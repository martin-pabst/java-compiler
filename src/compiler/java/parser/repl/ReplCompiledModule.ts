import { File } from "../../../common/module/File";
import { JavaCompiledModule } from "../../module/JavaCompiledModule";

export class ReplCompiledModule extends JavaCompiledModule {

    constructor(code: string){
        super(new File());
        this.file.setText(code);
    }



}