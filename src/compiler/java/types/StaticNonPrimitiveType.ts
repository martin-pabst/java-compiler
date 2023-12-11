import { Field } from "./Field.ts";
import { GenericTypeParameter } from "./GenericInformation";
import { JavaClass } from "./JavaClass";
import { JavaTypeWithInstanceInitializer } from "./JavaTypeWithInstanceInitializer.ts";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility.ts";

export class StaticNonPrimitiveType extends JavaType {

    toString(): string {
        throw new Error("Method not implemented.");
    }
    getReifiedIdentifier(): string {
        throw new Error("Method not implemented.");
    }



    constructor(public nonPrimitiveType: NonPrimitiveType) {
        super(nonPrimitiveType.identifier, nonPrimitiveType.identifierRange, nonPrimitiveType.module);
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

   canImplicitlyCastTo(type: JavaType){
        return false;
   }

}