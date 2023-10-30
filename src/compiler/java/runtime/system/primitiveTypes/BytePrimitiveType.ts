import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class BytePrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('byte', module);
        this.defaultValue = 0;
    }
    
    isUsableAsIndex(): boolean {
        return true;
    }

}