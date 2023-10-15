import { GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Parameter } from "./Parameter";
import { Visibility } from "./Visibility";

export class Method {

    parameters: Parameter[] = [];

    /**
     * undefined, if null
     */
    returnParameter?: JavaType;

    constructor(public identifier: string, public visibility: Visibility = Visibility.public){

    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, NonPrimitiveType>): Method {

        let copyNeeded: boolean = false;
        let newParameters: Parameter[] = [];
        for(let p of this.parameters){
            let copy = p.getCopyWithConcreteType(typeMap);
            newParameters.push(copy);
            if(copy != p) copyNeeded = true;
        }

        let newReturnParameter = this.returnParameter;
        if(this.returnParameter && !this.returnParameter.isPrimitive){
            newReturnParameter = (<NonPrimitiveType>this.returnParameter).getCopyWithConcreteType(typeMap);
        }

        if(newReturnParameter != this.returnParameter) copyNeeded = true;

        if(!copyNeeded) return this;

        return new Method(this.identifier, this.visibility);

    }


}