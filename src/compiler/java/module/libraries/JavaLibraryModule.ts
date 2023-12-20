import { Klass } from "../../../common/interpreter/StepFunction.ts";
import { File } from "../../../common/module/File";
import { JavaType } from "../../types/JavaType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { JavaBaseModule } from "../JavaBaseModule";

export type LibraryKlassType = {

    __javaDeclarations: LibraryDeclarations;

}

export type JavaTypeMap = { [identifier: string]: JavaType };

export abstract class JavaLibraryModule extends JavaBaseModule {
    
    classes: (Klass & LibraryKlassType)[] = [];
    
    constructor() {
        super(new File("Library file"), true);
        this.dirty = false;
    }
    
}