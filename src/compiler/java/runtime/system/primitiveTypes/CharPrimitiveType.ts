import { JavaBaseModule } from "../../../module/JavaBaseModule";
import { PrimitiveType } from "./PrimitiveType";

export class CharPrimitiveType extends PrimitiveType {
    
    constructor(module: JavaBaseModule){
        super('char', module);
        this.defaultValue = String.fromCharCode(0);
    }
    
    isUsableAsIndex(): boolean {
        return true;
    }

}