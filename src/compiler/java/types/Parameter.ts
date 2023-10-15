import { GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";

export class Parameter {
    constructor(public identifier: string, public type: JavaType){}

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): Parameter {
        let newType: JavaType = this.type.getCopyWithConcreteType(typeMap);
        if(newType == this.type) return this;
        
        let copy = new Parameter(this.identifier, newType);

        return copy;
    }



}