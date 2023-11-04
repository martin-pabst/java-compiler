import { File } from "../../../../common/module/File";
import { EmptyRange, IRange } from "../../../../common/range/Range";
import { TokenType, TokenTypeReadable } from "../../../TokenType";
import { BinaryOperatorTemplate, CodeTemplate, IdentityTemplate, OneParameterOnceTemplate, UnarySuffixTemplate } from "../../../codegenerator/CodeTemplate";
import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { JavaTypeStore } from "../../../module/JavaTypeStore";
import { BinaryOperator, UnaryPrefixOperator } from "../../../parser/AST";
import { GenericTypeParameter } from "../../../types/GenericInformation";
import { JavaType } from "../../../types/JavaType";

export abstract class PrimitiveType extends JavaType {
    myIndex: number;

    defaultValue: string = "0";

    static boxedTypeIdentifiers: string[] = ["Boolean", "Character", "Byte", "Short", "Integer", "Long", "Float", "Double"];
    static typeIdentifiers: string[] = ['boolean', 'char', 'byte', 'short', 'int', 'long', 'float', 'double'];

    static plusMinusMultDivOperators: TokenType[] = [TokenType.plus, TokenType.minus, TokenType.multiplication, TokenType.division, TokenType.modulo];
    static shiftOperators: TokenType[] = [TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned];
    static logicOperators: TokenType[] = [TokenType.and, TokenType.or, TokenType.XOR];
    static plusMinusMultDivAssignmentOperators: TokenType[] = [TokenType.assignment, TokenType.plusAssignment, TokenType.minusAssignment, TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment];
    static comparisonOperators: TokenType[] = [TokenType.lower, TokenType.greater, TokenType.lowerOrEqual, TokenType.greaterOrEqual, TokenType.notEqual];

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

    canExplicitlyCastTo(otherType: JavaType): boolean {
        return this.getCastFunction(otherType) != null;
    }

    canImplicitlyCastTo(otherType: JavaType): boolean {
        if(otherType.identifier == 'String') return true;
        let otherTypeIdentifier = otherType.identifier;

        if(!otherType.isPrimitive){
            let boxedTypeIndex = PrimitiveType.boxedTypeIdentifiers.indexOf(otherType.identifier);
            if(boxedTypeIndex < 0) return false;
            otherTypeIdentifier = PrimitiveType.typeIdentifiers[boxedTypeIndex];
        }
        
        let myIndex = PrimitiveType.typeIdentifiers.indexOf(this.identifier);
        let otherIndex = PrimitiveType.typeIdentifiers.indexOf(otherTypeIdentifier);

        return myIndex > 1 && otherIndex >= myIndex;

    }

    /**
     *                    0          1       2       3       4       5        6       7
     * @param destType ['boolean', 'char', 'byte', 'short', 'int', 'long', 'float', 'double']
     * @returns 
     */
    getCastFunction(destType: JavaType): CodeTemplate | undefined {
        if (destType.identifier == 'String') return new OneParameterOnceTemplate("new ho.classes['String']('' + $1)");

        if (destType.isPrimitive) {
            let destIndex: number = PrimitiveType.typeIdentifiers.indexOf(destType.identifier);
            if (destIndex == this.myIndex) return new IdentityTemplate();
            if (this.myIndex >= 2 && destIndex >= 2) {
                if (destIndex >= this.myIndex) return new IdentityTemplate();
                switch (destIndex) {
                    case 2: return this.myIndex <= 5 ? new OneParameterOnceTemplate('(($1 + 128) % 256 - 128)') : new OneParameterOnceTemplate('((Math.trunc($1) + 128) % 256 - 128)');
                    case 3: return this.myIndex <= 5 ? new OneParameterOnceTemplate('(($1 + 0x8000) % 0x10000 - 0x8000)') : new OneParameterOnceTemplate('((Math.trunc($1) + 0x80000000) % 0x100000000 - 0x80000000)');
                    case 4: return this.myIndex <= 5 ? new OneParameterOnceTemplate('(($1 + 0x80000000) % 0x100000000 - 0x80000000)') : new OneParameterOnceTemplate('((Math.trunc($1) + 0x80000000) % 0x100000000 - 0x80000000)');
                    case 5: return new OneParameterOnceTemplate('Math.trunc($1)');
                    case 6: return new OneParameterOnceTemplate('Math.fround($1)');
                    default: return new IdentityTemplate();
                }
            }
            if (destIndex == 1 && this.myIndex > 1) return new OneParameterOnceTemplate('String.fromCharCode($1)');

            return undefined;

        } else {
            // boxing
            let unboxedDestTypeIndex = PrimitiveType.getUnboxedTypeIndex(destType);
            if (!unboxedDestTypeIndex) return undefined;

            if (unboxedDestTypeIndex == this.myIndex || this.myIndex >= 2 && unboxedDestTypeIndex >= this.myIndex) {
                return new OneParameterOnceTemplate(`new ho.classes['${destType.identifier}']('' + $1)`);
            }

            return undefined;
        }

    }

    /**
     *                    0          1       2       3       4       5        6       7
     * @param destType ['boolean', 'char', 'byte', 'short', 'int', 'long', 'float', 'double']
     * @returns 
     */
    getBinaryOperation(destType: JavaType, operator: BinaryOperator): CodeTemplate | undefined {

        let destIndex = destType.isPrimitive ? PrimitiveType.typeIdentifiers.indexOf(destType.identifier) : PrimitiveType.getUnboxedTypeIndex(destType);

        let operatorString = TokenTypeReadable[operator];
        let isCommutative = [TokenType.plus, TokenType.multiplication, TokenType.equal].indexOf(operator) >= 0;

        if (PrimitiveType.plusMinusMultDivOperators.indexOf(operator) >= 0) {
            if (!destType.isPrimitive) {
                if (destType.identifier == 'String') {
                    return operator == TokenType.plus ? new BinaryOperatorTemplate('+', true) : undefined;
                }

                if (!destIndex) return undefined;
            }

            if (this.myIndex >= 1 && destIndex! >= 1) return new BinaryOperatorTemplate(operatorString, isCommutative);

            return undefined;
        }

        if (!destIndex) return undefined; // in subsequent

        if (PrimitiveType.comparisonOperators.indexOf(operator) >= 0) {
            if (this.myIndex >= 1 && destIndex >= 1) return new BinaryOperatorTemplate(operatorString, isCommutative);
            return undefined;
        }

        if (PrimitiveType.shiftOperators.indexOf(operator) >= 0) {
            if (this.myIndex >= 2 && this.myIndex <= 5 && destIndex >= 2 && destIndex <= 5) {
                return new BinaryOperatorTemplate(operatorString, isCommutative)
            }

            return undefined;
        }

        if (PrimitiveType.plusMinusMultDivAssignmentOperators.indexOf(operator) >= 0) {
            if (this.myIndex >= 2) {
                return new BinaryOperatorTemplate(operatorString, isCommutative)
            } else {
                return undefined;
            }
        }

        return undefined;

    }

    /**
     *                    0          1       2       3       4       5        6       7
     * @param destType ['boolean', 'char', 'byte', 'short', 'int', 'long', 'float', 'double']
     * @returns 
     */
    getBinaryResultType(destType: JavaType, operator: BinaryOperator, typeStore: JavaTypeStore): JavaType | undefined {

        if (PrimitiveType.plusMinusMultDivOperators.indexOf(operator) >= 0) {
            if (!destType.isPrimitive) {
                if (destType.identifier == 'String' && operator == TokenType.plus) {
                    return destType;
                }

                let unboxedDestTypeIndex = PrimitiveType.getUnboxedTypeIndex(destType);
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
            if (this.myIndex >= 2 && this.myIndex <= 5 && destIndex >= 2 && destIndex <= 5) {
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

    static getUnboxedTypeIndex(type: JavaType): number | undefined {
        let index = PrimitiveType.boxedTypeIdentifiers.indexOf(type.identifier);
        return index >= 0 ? index : undefined;
    }

    static getTypeIndex(type: JavaType): number | undefined {
        if(!type) return undefined;
        let index = PrimitiveType.boxedTypeIdentifiers.indexOf(type.identifier);
        if(index) return index;
        return this.typeIdentifiers.indexOf(type.identifier);        
    }

    clearUsagePositions(): void {
        this.usagePositions = [];
    }

     /**
     *                    0          1       2       3       4       5        6       7
     * @param destType ['boolean', 'char', 'byte', 'short', 'int', 'long', 'float', 'double']
     * @returns 
     */
     getUnaryResultType(operator: UnaryPrefixOperator): JavaType | undefined {
        let myIndex = PrimitiveType.typeIdentifiers.indexOf(this.identifier);

        switch(operator){
            case TokenType.not: return myIndex == 0 ? this : undefined;
            case TokenType.plus:
            case TokenType.negation:
            case TokenType.plusPlus:
            case TokenType.minusMinus:
                return myIndex >= 2 ? this : undefined;
            case TokenType.tilde: 
                return myIndex >= 2 && myIndex <= 5 ? this : undefined;
        }

        return undefined;
    }

    getUnaryOperation(operator: UnaryPrefixOperator): CodeTemplate | undefined {
        switch(operator){
            case TokenType.plus: return new IdentityTemplate();
            default: return new OneParameterOnceTemplate( TokenTypeReadable[operator] + '($1)');
        }
    }


    static getPlusPlusMinusMinusSuffixOperation(type: JavaType, operator: TokenType.plusPlus | TokenType.minusMinus): CodeTemplate | undefined {
        let typeIndex = PrimitiveType.getTypeIndex(type);
        if(typeIndex && typeIndex >= 1) return new UnarySuffixTemplate(operator);
        return undefined;
    }

    toString() : string {
        return this.identifier;
    }


}