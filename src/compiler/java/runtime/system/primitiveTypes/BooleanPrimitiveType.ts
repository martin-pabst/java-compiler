import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class BooleanPrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('boolean', module);
        this.defaultValue = false;
    }
    
    isUsableAsIndex(): boolean {
        return false;
    }

}