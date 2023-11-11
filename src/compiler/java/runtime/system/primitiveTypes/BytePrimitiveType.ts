import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class BytePrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('byte', module);
        this.defaultValueAsString = "0";
    }
    
    isUsableAsIndex(): boolean {
        return true;
    }

    getDefaultValue() {
        return 0;
    }

}