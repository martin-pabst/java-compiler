import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { CodeTemplate } from "../codegenerator/CodeTemplate";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { BinaryOperator, UnaryPrefixOperator } from "../parser/AST";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";

export class ArrayType extends JavaType {

    genericInformation: GenericInformation | undefined = undefined;


    constructor(public elementType: JavaType, public dimension: number,
        public module: JavaBaseModule, public identifierRange: IRange) {
        super(elementType.identifier + "[]".repeat(dimension), identifierRange, module);
        this.isPrimitive = false;

    }

    getCastFunction(_destType: JavaType): CodeTemplate | undefined {
        return undefined;  // you can't cast arrays in java (to my knowledge...).
    }

    clearUsagePositions(): void {
        this.usagePositions = [];
    }

    getCopyWithConcreteType(_typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        return this;
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

}