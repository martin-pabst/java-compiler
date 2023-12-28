import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { CodeTemplate } from "../codegenerator/CodeTemplate";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { BinaryOperator, UnaryPrefixOperator } from "../parser/AST";
import { GenericTypeParameters, GenericTypeParameter } from "./GenericTypeParameter";
import { JavaType } from "./JavaType";

export class ArrayType extends JavaType {

    constructor(public elementType: JavaType, public dimension: number,
        public module: JavaBaseModule, public identifierRange: IRange) {
        super(elementType.identifier + "[]".repeat(dimension), identifierRange, module);
        this.isPrimitive = false;
        this.genericTypeParameters = undefined;
    }

    getDefaultValue(){
        return null;
    }

    getCastFunction(_destType: JavaType): CodeTemplate | undefined {
        return undefined;  // you can't cast arrays in java (to my knowledge...).
    }

    clearUsagePositions(): void {
        this.usagePositions = [];
    }

    getCopyWithConcreteType(_typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        if(!(this.elementType instanceof GenericTypeParameter)) return this;
        let mappedElemenType = _typeMap.get(this.elementType);
        if(!mappedElemenType) return this;

        return new ArrayType(mappedElemenType, this.dimension, this.module, this.identifierRange)
    }

    getFile(): File {
        throw new Error("Method not implemented.");
    }

    getBinaryResultType(_destType: JavaType, _operator: BinaryOperator, _typeStore: JavaTypeStore): JavaType | undefined {
        return undefined;
    }
    getBinaryOperation(_destType: JavaType, _operator: BinaryOperator): CodeTemplate | undefined {
        return undefined;
    }
    getUnaryResultType(_operator: UnaryPrefixOperator): JavaType | undefined {
        return undefined;
    }
    getUnaryOperation(_operator: UnaryPrefixOperator): CodeTemplate | undefined {
        return undefined;
    }

    toString(): string {
        let s: string = this.elementType.toString();
        for(let i = 0; i < this.dimension; i++) s += "[]";
        return s;
    }

    getReifiedIdentifier(): string {
        return this.toString();
    }

    getInternalName(): string {
        let internalName = this.elementType.identifier;
        for(let i = 0; i < this.dimension; i++) internalName += "_I";        
        return internalName;
    }

    static increaseArrayDimension(type: JavaType): ArrayType {
        if(type instanceof ArrayType){
            type.dimension++;
            return type;
        }
        return new ArrayType(type, 1, type.module, type.identifierRange);
    }

}