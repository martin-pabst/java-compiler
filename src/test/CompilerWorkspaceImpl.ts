import { CompilerFile } from "../compiler/common/module/CompilerFile";
import { CompilerWorkspace } from "../compiler/common/module/CompilerWorkspace";

export class CompilerWorkspaceImpl extends CompilerWorkspace {
    
    private files: CompilerFile[] = [];
    
    getFiles(): CompilerFile[] {
        return this.files;
    }

    addFile(file: CompilerFile){
        this.files.push(file);
    }

}