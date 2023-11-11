import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class DoublePrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('double', module);
        this.defaultValueAsString = "0.0";
    }
    
    isUsableAsIndex(): boolean {
        return false;
    }

    getDefaultValue() {
        return 0.0;
    }


}