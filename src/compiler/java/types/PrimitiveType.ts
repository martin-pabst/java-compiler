import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { JavaModule } from "../module/JavaModule";
import { GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";

export abstract class PrimitiveType implements JavaType {
    isPrimitive: boolean;
    isGenericTypeParameter: boolean;

    constructor(public identifier: string, public module: JavaModule, public identifierRange: IRange){
        this.isPrimitive = true;
        this.isGenericTypeParameter = false;
    }

    getFile(): File {
        return this.module.file;
    }

    getCopyWithConcreteType(_typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        return this;
    }

    abstract canCastTo(otherType: JavaType): boolean;
}