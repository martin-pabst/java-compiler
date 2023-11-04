import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class FloatPrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('float', module);
        this.defaultValue = "0.0";
    }
    
    isUsableAsIndex(): boolean {
        return false;
    }

}