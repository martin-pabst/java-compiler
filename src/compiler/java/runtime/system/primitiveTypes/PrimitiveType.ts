import { File } from "../../../../common/module/File";
import { EmptyRange, IRange } from "../../../../common/range/Range";
import { TokenType, TokenTypeReadable } from "../../../TokenType";
import { FunctionTemplate } from "../../../codegenerator/FunctionTemplate";
import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { JavaTypeStore } from "../../../module/JavaTypeStore";
import { BinaryOperator } from "../../../parser/AST";
import { GenericTypeParameter } from "../../../types/GenericInformation";
import { JavaType } from "../../../types/JavaType";

export abstract class PrimitiveType extends JavaType {
    myIndex: number;

    defaultValue: any = 0;

    static boxedTypeIdentifiers: string[] = ["Boolean", "Character", "Byte", "Integer", "Long", "Float", "Double"];
    static typeIdentifiers: string[] = ['boolean', 'char', 'byte', 'int', 'long', 'float', 'double'];
    static plusMinusMultDivOperators: TokenType[] = [TokenType.plus, TokenType.minus, TokenType.multiplication, TokenType.division, TokenType.modulo];
    static shiftOperators: TokenType[] = [TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned];
    static logicOperators: TokenType[] = [TokenType.and, TokenType.or, TokenType.XOR];
    static plusMinusMultDivAssignmentOperators: TokenType[] = [TokenType.plusAssignment, TokenType.minusAssignment, TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.modulo];
    static comparisonOperators: TokenType[] = [TokenType.lower, TokenType.greater, TokenType.lowerOrEqual, TokenType.greaterOrEqual, TokenType.notEqual];

    static unboxingMethods: { [boxedTypeidentifier: string]: string } = {
        "Character": "charValue",
        "Byte": "byteValue",
        "Integer": "intValue",
        "Float": "floatValue",
        "Double": "doubleValue",

    }

    public identifierRange: IRange = { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 };

    constructor(public identifier: string, public module: JavaBaseModule) {
        super(identifier, EmptyRange.instance, module)
        this.isPrimitive = true;
        this.myIndex = PrimitiveType.typeIdentifiers.indexOf(this.identifier);
    }

    abstract isUsableAsIndex(): boolean;

    getFile(): File {
        return this.module.file;
    }

    getCopyWithConcreteType(_typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        return this;
    }

    canCastTo(otherType: JavaType): boolean {
        return this.getCastFunction(otherType) != null;
    }

    /**
     *                    0          1       2       3      4       5        6
     * @param destType ['boolean', 'char', 'byte', 'int', 'long', 'float', 'double']
     * @returns 
     */
    getCastFunction(destType: JavaType): FunctionTemplate | undefined {
        if (destType.identifier == 'String') return new FunctionTemplate("new ho.classes['String']('' + $1)", '$1');

        if (destType.isPrimitive) {
            let destIndex: number = PrimitiveType.typeIdentifiers.indexOf(destType.identifier);
            if (destIndex == this.myIndex) return FunctionTemplate.identity;
            if (this.myIndex >= 2 && destIndex >= 2) {
                if (destIndex >= this.myIndex) return FunctionTemplate.identity;
                switch (destIndex) {
                    case 2: return this.myIndex <= 4 ? new FunctionTemplate('(($1 + 128) % 256 - 128)', '$1') : new FunctionTemplate('((Math.trunc($1) + 128) % 256 - 128)', '$1');
                    case 3: return this.myIndex <= 4 ? new FunctionTemplate('(($1 + 0x80000000) % 0x100000000 - 0x80000000)', '$1') : new FunctionTemplate('((Math.trunc($1) + 0x80000000) % 0x100000000 - 0x80000000)', '$1');
                    case 4: return new FunctionTemplate('Math.trunc($1)', '$1');
                    case 5: return new FunctionTemplate('Math.fround($1)', '$1');
                    default: return FunctionTemplate.identity;
                }
            }
            if (destIndex == 1 && this.myIndex > 1) return new FunctionTemplate('String.fromCharCode($1)', '$1');

            return undefined;

        } else {
            // boxing
            let unboxedDestTypeIndex = this.getUnboxedTypeIndex(destType);
            if (!unboxedDestTypeIndex) return undefined;

            if (unboxedDestTypeIndex == this.myIndex || this.myIndex >= 2 && unboxedDestTypeIndex >= this.myIndex) {
                return new FunctionTemplate(`new ho.classes['${destType.identifier}']('' + $1)`, '$1');
            }

            return undefined;
        }

    }

    /**
     *                    0          1       2       3      4       5        6
     * @param destType ['boolean', 'char', 'byte', 'int', 'long', 'float', 'double']
     * @returns 
     */
    getBinaryOperation(destType: JavaType, operator: BinaryOperator): FunctionTemplate | undefined {

        let myTemplate = '$1';
        let destTemplate = '$2';

        let destIndex = destType.isPrimitive ? PrimitiveType.typeIdentifiers.indexOf(destType.identifier) : this.getUnboxedTypeIndex(destType);

        if (this.myIndex == 1) myTemplate = 'String.fromCharCode($1)';
        if (destIndex == 1) destTemplate = `String.fromCharCode(${destTemplate})`;

        if (destIndex && !destType.isPrimitive) destTemplate = '$2.' + PrimitiveType.unboxingMethods[destIndex];

        let operatorString = TokenTypeReadable[operator];

        if (PrimitiveType.plusMinusMultDivOperators.indexOf(operator) >= 0) {
            if (!destType.isPrimitive) {
                if (destType.identifier == 'String') {
                    return operator == TokenType.plus ? new FunctionTemplate('$1 + $2') : undefined;
                }

                if (!destIndex) return undefined;
            }

            if (this.myIndex >= 1 && destIndex! >= 1) return new FunctionTemplate(myTemplate + " " + operatorString + " " + destTemplate, '$1', '$2');

            return undefined;
        }

        if (!destIndex) return undefined; // in subsequent

        if (PrimitiveType.comparisonOperators.indexOf(operator) >= 0) {
            if (this.myIndex >= 1 && destIndex >= 1) return new FunctionTemplate(myTemplate + " " + operatorString + " " + destTemplate, '$1', '$2');
            return undefined;
        }

        if (PrimitiveType.shiftOperators.indexOf(operator) >= 0) {
            if (this.myIndex >= 2 && this.myIndex <= 4 && destIndex >= 2 && destIndex <= 4) {
                return new FunctionTemplate(myTemplate + " " + operatorString + " " + destTemplate, '$1', '$2')
            }

            return undefined;
        }

        if (PrimitiveType.plusMinusMultDivAssignmentOperators.indexOf(operator) >= 0) {
            if (this.myIndex >= 2) {
                return new FunctionTemplate(myTemplate + " " + operatorString + " " + destTemplate, '$1', '$2')
            } else {
                return undefined;
            }
        }

        return undefined;

    }

    /**
     *                    0          1       2       3      4       5        6
     * @param destType ['boolean', 'char', 'byte', 'int', 'long', 'float', 'double']
     * @returns 
     */
    getBinaryResultType(destType: JavaType, operator: BinaryOperator, typeStore: JavaTypeStore): JavaType | undefined {

        if (PrimitiveType.plusMinusMultDivOperators.indexOf(operator) >= 0) {
            if (!destType.isPrimitive) {
                if (destType.identifier == 'String' && operator == TokenType.plus) {
                    return destType;
                }

                let unboxedDestTypeIndex = this.getUnboxedTypeIndex(destType);
                if (!unboxedDestTypeIndex) return undefined;

                let unboxedDestType = typeStore.getType(PrimitiveType.typeIdentifiers[unboxedDestTypeIndex])!;

                if (this.myIndex >= 1 && unboxedDestTypeIndex >= 1) return this.myIndex > unboxedDestTypeIndex ? this : unboxedDestType;

                return undefined;

            }

            let destIndex: number = PrimitiveType.typeIdentifiers.indexOf(destType.identifier);
            if (this.myIndex >= 1 && destIndex >= 1) return this.myIndex > destIndex ? this : destType;

            return undefined;
        }

        if (PrimitiveType.comparisonOperators.indexOf(operator) >= 0) {
            let booleanType = typeStore.getType('boolean')!;
            let destIndex: number = PrimitiveType.typeIdentifiers.indexOf(destType.identifier.toLowerCase());
            if (!destIndex) return undefined;
            if (this.myIndex == destIndex) return booleanType;
            if (this.myIndex >= 1 && destIndex >= 1) return booleanType;
            return undefined;
        }

        if (PrimitiveType.shiftOperators.indexOf(operator) >= 0) {
            let destIndex: number = PrimitiveType.typeIdentifiers.indexOf(destType.identifier.toLowerCase());
            if (!destIndex) return undefined;
            if (this.myIndex >= 2 && this.myIndex <= 4 && destIndex >= 2 && destIndex <= 4) {
                return this;
            }
            return undefined;
        }

        if (PrimitiveType.plusMinusMultDivAssignmentOperators.indexOf(operator) >= 0) {
            let assignmentOperatorIndex = PrimitiveType.plusMinusMultDivAssignmentOperators.indexOf(operator);
            let normalOperator = PrimitiveType.plusMinusMultDivOperators[assignmentOperatorIndex];
            return this.getBinaryResultType(destType, <BinaryOperator>normalOperator, typeStore);
        }

        return undefined;
    }

    getUnboxedTypeIndex(type: JavaType): number | undefined {
        let index = PrimitiveType.boxedTypeIdentifiers.indexOf(type.identifier);
        return index >= 0 ? index : undefined;
    }

    clearUsagePositions(): void {
        this.usagePositions = [];
    }

}