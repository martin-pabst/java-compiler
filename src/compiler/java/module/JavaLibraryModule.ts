import { Klass } from "../../common/interpreter/ThreadPool";
import { File } from "../../common/module/File";
import { JavaType } from "../types/JavaType";
import { NonPrimitiveType } from "../types/NonPrimitiveType";
import { JavaBaseModule } from "./JavaBaseModule";
import { LibraryDeclarationParser } from "./LibraryDeclarationParser";

export type LibraryKlassType = {

    __declareType(): string[];
    type: NonPrimitiveType;

}

export type JavaTypeMap = {[identifier: string]: JavaType};

export abstract class JavaLibraryModule extends JavaBaseModule {

    classes: (Klass & LibraryKlassType)[] = [];
    javaTypeMap: JavaTypeMap = {};

constructor(){
    super(new File(), true);
    this.dirty = false;
}

compileClassesToTypes(){
    let ldp: LibraryDeclarationParser = new LibraryDeclarationParser(this);
    this.javaTypeMap = {};

    for (let klass of this.classes) {
        let npt = ldp.parseClassOrEnumOrInterfaceDeclarationWithoutGenerics(klass);
        this.javaTypeMap[npt.identifier] = npt;        
    }

    for(let type of this.types){
        this.javaTypeMap[type.identifier] = type;
    }

    for(let klass of this.classes){
        ldp.parseClassOrInterfaceDeclarationGenericsAndExtendsImplements(klass, this.javaTypeMap);
    }

}


}