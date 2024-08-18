import { CompilerFile } from "../../../../common/module/CompilerFile";
import { EmptyRange, IRange } from "../../../../common/range/Range";
import { TokenType } from "../../../TokenType";
import { JCM } from "../../../language/JavaCompilerMessages";
import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { GenericTypeParameter } from "../../../types/GenericTypeParameter";
import { JavaType } from "../../../types/JavaType";

export abstract class PrimitiveType extends JavaType {
    myIndex: number;

    defaultValueAsString: string = "0";
    defaultValue: any = 0;

    static boxedTypeIdentifiers: string[] = ["Boolean", "Character", "Byte", "Short", "Integer", "Long", "Float", "Double"];
    static typeIdentifiers: string[] = ['boolean', 'char', 'byte', 'short', 'int', 'long', 'float', 'double'];

    static plusMinusMultDivOperators: TokenType[] = [TokenType.plus, TokenType.minus, TokenType.multiplication, TokenType.division, TokenType.modulo];
    static shiftOperators: TokenType[] = [TokenType.shiftLeft, TokenType.shiftRight, TokenType.shiftRightUnsigned];
    static logicOperators: TokenType[] = [TokenType.and, TokenType.or, TokenType.XOR];
    static plusMinusMultDivAssignmentOperators: TokenType[] = [TokenType.plusAssignment, TokenType.minusAssignment, TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.moduloAssignment, TokenType.assignment];
    static comparisonOperators: TokenType[] = [TokenType.lower, TokenType.greater, TokenType.lowerOrEqual, TokenType.greaterOrEqual, TokenType.notEqual, TokenType.equal];



    public identifierRange: IRange = { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 };

    constructor(identifier: string, module: JavaBaseModule) {
        super(identifier, EmptyRange.instance, module)
        this.isPrimitive = true;
        this.myIndex = PrimitiveType.typeIdentifiers.indexOf(this.identifier);
    }

    abstract isUsableAsIndex(): boolean;

    getCompletionItemDetail(): string {
        return JCM.primitiveType();
    }


    getFile(): CompilerFile {
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

   toString(): string {
        return this.identifier;
    }

    getReifiedIdentifier(): string {
        return this.identifier;
    }

    getDeclaration(): string {
        return this.identifier;
    }

    getAbsoluteName(): string {
        return this.toString();
    }
}