import { File } from "../../../../common/module/File";
import { EmptyRange, IRange } from "../../../../common/range/Range";
import { TokenType } from "../../../TokenType";
import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { GenericTypeParameter } from "../../../types/GenericInformation";
import { JavaType } from "../../../types/JavaType";

export abstract class PrimitiveType extends JavaType {
    myIndex: number;

    defaultValueAsString: string = "0";

    static boxedTypeIdentifiers: string[] = ["Boolean", "Character", "Byte", "Short", "Integer", "Long", "Float", "Double"];
    static typeIdentifiers: string[] = ['boolean', 'char', 'byte', 'short', 'int', 'long', 'float', 'double'];

    static plusMinusMultDivOperators: TokenType[] = [TokenType.plus, TokenType.minus, TokenType.multiplication, TokenType.division, TokenType.modulo];
    static shiftOperators: TokenType[] = [TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned];
    static logicOperators: TokenType[] = [TokenType.and, TokenType.or, TokenType.XOR];
    static plusMinusMultDivAssignmentOperators: TokenType[] = [TokenType.plusAssignment, TokenType.minusAssignment, TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment, TokenType.assignment];
    static comparisonOperators: TokenType[] = [TokenType.lower, TokenType.greater, TokenType.lowerOrEqual, TokenType.greaterOrEqual, TokenType.notEqual, TokenType.equal];



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

    abstract getDefaultValue(): any;

    getCopyWithConcreteType(_typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        return this;
    }

    static getUnboxedTypeIndex(type: JavaType): number {
        return PrimitiveType.boxedTypeIdentifiers.indexOf(type.identifier);
    }

    static getTypeIndex(type: JavaType): number | undefined {
        if (!type) return undefined;
        let index = PrimitiveType.boxedTypeIdentifiers.indexOf(type.identifier);
        if (index >= 0) return index;
        return this.typeIdentifiers.indexOf(type.identifier);
    }

    clearUsagePositionsAndInheritanceInformation(): void {
        this.usagePositions = [];
    }

   toString(): string {
        return this.identifier;
    }


}