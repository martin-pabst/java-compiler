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

    clearUsagePositions(): void {
        
    }

    constructor(public identifier: string, 
        public elementType: JavaType, public dimenstion: number,
         public module: JavaBaseModule, public identifierRange: IRange){
            super(identifier, identifierRange, module);
            this.isPrimitive = true;
    }

    getCopyWithConcreteType(_typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        return this;
    }

    canCastTo(_otherType: JavaType): boolean {
        throw new Error("Method not implemented.");
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