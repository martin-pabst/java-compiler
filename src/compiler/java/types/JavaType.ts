import { BaseType } from "../../common/BaseType";
import { IRange } from "../../common/range/Range";
import { CodeTemplate } from "../codegenerator/CodeTemplate";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { BinaryOperator, UnaryPrefixOperator } from "../parser/AST";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";

export abstract class JavaType extends BaseType {
    isPrimitive: boolean;
    genericInformation: GenericInformation | undefined;

    abstract getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType;

    abstract canCastTo(otherType: JavaType): boolean;
    abstract getBinaryResultType(destType: JavaType, operator: BinaryOperator, typeStore: JavaTypeStore): JavaType | undefined;
    abstract getBinaryOperation(destType: JavaType, operator: BinaryOperator): CodeTemplate | undefined;
    
    abstract getUnaryResultType(operator: UnaryPrefixOperator): JavaType | undefined;
    abstract getUnaryOperation(operator: UnaryPrefixOperator): CodeTemplate | undefined;

    constructor(identifier: string, identifierRange: IRange, public module: JavaBaseModule){
        super(identifier, identifierRange, module.file);
        this.isPrimitive = false;
    }

    hasGenericParameters(): boolean {
        if(!this.isPrimitive) return false;
        if(!this.genericInformation) return false;
        return this.genericInformation.length > 0;
    }

    /**
     * Overwrite this for boxed types!
     * @returns 
     */
    getUnboxedType(): JavaType {
        return this;
    }

}