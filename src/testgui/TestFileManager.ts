import { Main } from "../Main";
import { IMain } from "../compiler/common/IMain";
import { IFilesManager as IFileManager } from "../compiler/common/interpreter/IFilesManager";
import { CompilerFile } from "../compiler/common/module/CompilerFile";
import { FileNotFoundExceptionClass } from "../compiler/java/runtime/system/javalang/FileNotFoundException";
import { RuntimeExceptionClass } from "../compiler/java/runtime/system/javalang/RuntimeException";

export class TestFileManager implements IFileManager {
    
    constructor(public main: Main){

    }
    
    read(filename: string): string {
        let file = this.getFile(filename);
        return file.getText();
    }

    write(filename: string, content: string): void {
        let file = this.getFile(filename);
        file.setText(content);
    }

    append(filename: string, content: string): void {
        let file = this.getFile(filename);
        file.setText(file.getText() + content);
    }
    
    getFile(filename: string): CompilerFile {
        let file = this.main.files.find(f => f.filename == filename);
        if(!file){
            throw new FileNotFoundExceptionClass(filename);
        }

        return file;
    }

}