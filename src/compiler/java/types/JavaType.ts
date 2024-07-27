import { BaseType } from "../../common/BaseType";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { PrimitiveType } from "../runtime/system/primitiveTypes/PrimitiveType";
import { GenericTypeParameters, GenericTypeParameter } from "./GenericTypeParameter.ts";

export abstract class JavaType extends BaseType {

    isPrimitive: boolean;
    genericTypeParameters: GenericTypeParameters | undefined;

    abstract getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType;

    declare module: JavaBaseModule;

    constructor(identifier: string, identifierRange: IRange, module: JavaBaseModule){
        super(identifier, identifierRange, module);
        this.isPrimitive = false;
    }

    hasGenericParameters(): boolean {
        if(this.isPrimitive) return false;
        if(!this.genericTypeParameters) return false;
        return this.genericTypeParameters.length > 0;
    }

    isUsableAsIndex(): boolean {
        return this.isPrimitive && (<PrimitiveType><any>this).isUsableAsIndex();
    }

    abstract getDefaultValue(): any;

    public registerExtendsImplementsOnAncestors(){
    }

    abstract toString(): string;

    abstract getReifiedIdentifier(): string;

    getInternalName(): string {
        return this.identifier;
    }

    abstract getAbsoluteName(): string;


}