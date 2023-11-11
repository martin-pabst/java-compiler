import { BaseType } from "../../common/BaseType";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";

export abstract class JavaType extends BaseType {

    isPrimitive: boolean;
    genericInformation: GenericInformation | undefined;

    abstract getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType;

    constructor(identifier: string, identifierRange: IRange, public module: JavaBaseModule){
        super(identifier, identifierRange, module.file);
        this.isPrimitive = false;
    }

    hasGenericParameters(): boolean {
        if(!this.isPrimitive) return false;
        if(!this.genericInformation) return false;
        return this.genericInformation.length > 0;
    }

    isUsableAsIndex(): boolean {
        return this.isPrimitive && (<PrimitiveType><any>this).isUsableAsIndex();
    }

    abstract getDefaultValue(): any;

}