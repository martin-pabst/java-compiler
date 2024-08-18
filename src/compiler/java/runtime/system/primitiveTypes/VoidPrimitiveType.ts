import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class VoidPrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('void', module);
        this.defaultValueAsString = "null";
        this.defaultValue = null;
    }
    
    isUsableAsIndex(): boolean {
        return false;
    }

    getDefaultValue() {
        return null;
    }

}