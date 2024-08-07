import { Klass } from "../../../common/interpreter/StepFunction.ts";
import { CompilerFile } from "../../../common/module/CompilerFile";
import { JavaType } from "../../types/JavaType";
import { JavaBaseModule } from "../JavaBaseModule";
import { LibraryDeclarations } from "./DeclareType.ts";

export type LibraryKlassType = {

    __javaDeclarations: LibraryDeclarations;

}

export type JavaTypeMap = { [identifier: string]: JavaType };

export abstract class JavaLibraryModule extends JavaBaseModule {
    
    classes: (Klass & LibraryKlassType)[] = [];
    
    constructor() {
        super(new CompilerFile("Library file"), true);
        this.setDirty(false);
    }
    
}