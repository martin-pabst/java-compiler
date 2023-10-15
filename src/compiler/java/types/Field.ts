import { GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";
import { Visibility } from "./Visibility";

export class Field {

    constructor(public identifier: string, public type: JavaType, public visibility: Visibility = Visibility.public){

    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): Field {
        let newType: JavaType = this.type.getCopyWithConcreteType(typeMap);
        if(newType == this.type) return this;
        
        let copy = new Field(this.identifier, newType, this.visibility);

        return copy;
    }

}