import { BaseSymbol, SymbolKind } from "../../common/BaseSymbolTable";
import { UsagePosition } from "../../common/UsagePosition";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericTypeParameter } from "./GenericInformation";
import { JavaClass } from "./JavaClass";
import { JavaEnum } from "./JavaEnum";
import { JavaType } from "./JavaType";
import { Visibility } from "./Visibility";

export class Field extends BaseSymbol {

    isStatic: boolean = false;

    classEnum!: JavaClass | JavaEnum;

    internalName?: string;

    usagePositions: UsagePosition[] = [];

    initialValue?: any;
    initialValueIsConstant: boolean = false;    // enables us to resolve values of final variables as constants

    declare type: JavaType;

    constructor(identifier: string, identifierRange: IRange, public module: JavaBaseModule,
         type: JavaType, public visibility: Visibility = TokenType.keywordPublic){
            super(identifier, identifierRange, type, SymbolKind.field);
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): Field {
        let newType: JavaType = this.type.getCopyWithConcreteType(typeMap);
        if(newType == this.type) return this;
        
        let copy = new Field(this.identifier, this.identifierRange, this.module,
             newType, this.visibility);

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
                    parent = parent.getExtends();
                }
            }
        }

        return this.internalName;
    }

    getValue(stack: any, stackframeStart: number) {
        throw new Error("Method not implemented.");
    }

}