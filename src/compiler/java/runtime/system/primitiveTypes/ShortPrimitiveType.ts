import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class ShortPrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('short', module);
        this.defaultValue = "0";
    }
    
    isUsableAsIndex(): boolean {
        return true;
    }

}