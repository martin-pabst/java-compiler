import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { CodeTemplate, TwoParameterTemplate } from "../codegenerator/CodeTemplate";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { JavaTypeStore } from "../module/JavaTypeStore";
import { BinaryOperator, UnaryPrefixOperator } from "../parser/AST";
import { Field } from "./Field";
import { JavaType } from "./JavaType";
import { Method } from "./Method";

/**
 * A NonPrimitiveType 
 *  - may have attributes
 *  - may have fields (de: "Attribute")
 *  - may have methods
 */
export abstract class NonPrimitiveType extends JavaType {

    abstract isGenericVariant(): boolean;
    abstract isGenericTypeParameter(): boolean;

    abstract getFields(): Field[];
    abstract getMethods(): Method[];

    constructor(identifier: string, identifierRange: IRange, module: JavaBaseModule){
        super(identifier, identifierRange, module);
        this.isPrimitive = false;
    }

    getUnaryResultType(_operator: UnaryPrefixOperator): JavaType | undefined {
        return undefined;
    }

    getUnaryOperation(_operator: UnaryPrefixOperator): CodeTemplate | undefined {
        return undefined;
    }

    getBinaryResultType(destType: JavaType, operator: BinaryOperator, _typeStore: JavaTypeStore): JavaType | undefined {
        if(operator != TokenType.plus) return undefined;
        if(this.identifier == 'String') return this;
        if(destType.identifier == 'String') return destType;
        return undefined;        
    }

    getBinaryOperation(destType: JavaType, _operator: BinaryOperator): CodeTemplate | undefined {
        if(this.identifier == 'String'){
            if(destType.isPrimitive) return new TwoParameterTemplate('$1.plus($2)');
            if(destType.identifier == 'String') {
                return new TwoParameterTemplate('$1.plusOtherString($2)');
            } else {
                return new TwoParameterTemplate('$1.plusObject(thread, $2)');
            }
        } 
        if(destType.identifier == 'String' ){
            return new TwoParameterTemplate('$2.plusObjectFromLeft($1)');
        }        
        return undefined;
    }

}