import { Klass } from "../../common/interpreter/StepFunction.ts";
import { Field } from "./Field.ts";
import { GenericTypeParameter } from "./GenericTypeParameter";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility.ts";

export class StaticNonPrimitiveType extends JavaType {

    get runtimeClass(): Klass | undefined {
        return this.nonPrimitiveType.runtimeClass;
    }

    get outerType(): NonPrimitiveType | StaticNonPrimitiveType | undefined {
        return this.nonPrimitiveType.outerType;
    }

    innerTypes: (NonPrimitiveType | StaticNonPrimitiveType)[] = [];

    constructor(public nonPrimitiveType: NonPrimitiveType) {
        super(nonPrimitiveType.identifier, nonPrimitiveType.identifierRange, nonPrimitiveType.module);
    }

    fastExtendsImplements(identifier: string) {
        return this.nonPrimitiveType.fastExtendsImplements(identifier);
    }


    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        throw new Error("Method not implemented.");
    }

    getDefaultValue() {
        throw new Error("Method not implemented.");
    }

    getPossibleMethods(identifier: string, length: number, isConstructor: boolean, hasToBeStatic: boolean): Method[] {
        return this.nonPrimitiveType.getPossibleMethods(identifier, length, isConstructor, hasToBeStatic);
    }

    getField(identifier: string, uptoVisibility: Visibility): Field | undefined {
        return this.nonPrimitiveType.getField(identifier, uptoVisibility, true);
    }

    canImplicitlyCastTo(type: JavaType) {
        return false;
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }

    getReifiedIdentifier(): string {
        throw new Error("Method not implemented.");
    }

    getDeclaration(): string {
        return this.nonPrimitiveType.getDeclaration();
    }

}