import { UsagePosition } from "../../common/UsagePosition";
import { TokenType } from "../TokenType";
import { GenericTypeParameter } from "./GenericInformation";
import { JavaClass } from "./JavaClass";
import { JavaEnum } from "./JavaEnum";
import { JavaType } from "./JavaType";
import { Visibility } from "./Visibility";

export class Field {

    isStatic: boolean = false;
    isFinal: boolean = false;

    classEnum!: JavaClass | JavaEnum;

    internalName?: string;

    usagePositions: UsagePosition[] = [];

    constructor(public identifier: string, public type: JavaType, public visibility: Visibility = TokenType.keywordPublic){

    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): Field {
        let newType: JavaType = this.type.getCopyWithConcreteType(typeMap);
        if(newType == this.type) return this;
        
        let copy = new Field(this.identifier, newType, this.visibility);

        return copy;
    }

    getInternalName(): string {
        if(!this.internalName){
            this.internalName = this.identifier;
            if(this.classEnum instanceof JavaClass){
                let parent = this.classEnum.getExtends();
                while(parent){
                    if(parent.getFields().filter(f => f.identifier == this.identifier)){
                        this.internalName = "_" + this.internalName;
                    }
                }
            }
        }

        return this.internalName;
    }
}