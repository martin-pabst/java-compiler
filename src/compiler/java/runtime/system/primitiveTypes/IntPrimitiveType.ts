import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class IntPrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('int', module);
        this.defaultValue = 0;
    }
    
    isUsableAsIndex(): boolean {
        return true;
    }

}