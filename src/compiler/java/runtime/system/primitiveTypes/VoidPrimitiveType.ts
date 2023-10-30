import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class VoidPrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('void', module);
        this.defaultValue = 0;
    }
    
    isUsableAsIndex(): boolean {
        return false;
    }

}