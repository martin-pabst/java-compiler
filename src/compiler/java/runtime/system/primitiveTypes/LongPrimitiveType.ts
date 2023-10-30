import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class LongPrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('long', module);
        this.defaultValue = 0;
    }
    
    isUsableAsIndex(): boolean {
        return true;
    }

}