import { GenericTypeParameter } from "./GenericInformation";
import { JavaClass } from "./JavaClass";
import { JavaClassOrEnum } from "./JavaClassOrEnum";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";

export class StaticNonPrimitiveType extends JavaType {



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

}