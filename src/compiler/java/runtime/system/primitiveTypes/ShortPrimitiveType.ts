import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class ShortPrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('short', module);
        this.defaultValueAsString = "0";
    }
    
    isUsableAsIndex(): boolean {
        return true;
    }

    getDefaultValue() {
        return 0;
    }

    isByteShortIntLong(){
        return true;
    }

}