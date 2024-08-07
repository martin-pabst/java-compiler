import { EmptyRange } from "../../../../common/range/Range";
import { JCM } from "../../../language/JavaCompilerMessages";
import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { GenericTypeParameter } from "../../../types/GenericTypeParameter";
import { JavaType } from "../../../types/JavaType";

export class NullType extends JavaType {
    
    constructor(module: JavaBaseModule){
        super("null", EmptyRange.instance, module);
    }

    getAbsoluteName(): string {
        return "null";
    }
    
    getCompletionItemDetail(): string {
        return JCM.nullType();
    }


    isUsableAsIndex(): boolean {
        return false;
    }
    
    getDefaultValue() {
        return 0;
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        return this;
    }
    toString(): string {
        return "null";
    }

    getReifiedIdentifier(): string {
        return "null";
    }

    getDeclaration(): string {
        return "null";    
    }

    
}