import { UsagePosition } from "../../common/UsagePosition";
import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";
import { JavaClass } from "./JavaClass";
import { JavaInterface } from "./JavaInterface";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility";


export class JavaEnum implements NonPrimitiveType {
    isPrimitive: false;
    genericInformation: GenericInformation = [];

    fields: Field[] = [];
    methods: Method[] = [];

    visibility: Visibility = TokenType.keywordPublic;
    enclosingParent: JavaClass | undefined = undefined;

    public usagePositions: UsagePosition[] = [];

    private implements: JavaInterface[] = [];

    constructor(public identifier: string, public module: JavaBaseModule, public identifierRange: IRange) {
        this.isPrimitive = false;
    }

    getFile(): File {
        return this.module.file;
    }

    getCopyWithConcreteType(_typeMap: Map<GenericTypeParameter, NonPrimitiveType>): JavaEnum {
        return this;
    }

    getImplements(): JavaInterface[]{
        return this.implements;
    }

    public getFields(): Field[] {

        return this.fields;

    }

    public getMethods(): Method[] {
        return this.methods;
    }

    canCastTo(otherType: JavaType): boolean {
        if(otherType.isPrimitive) return false;
        if(otherType instanceof JavaInterface){
            for(let intf of this.implements){
                if(intf.canCastTo(otherType)) return true;
            }
            return false;
        }

        if(otherType instanceof JavaEnum){
            if(otherType == this) return true;
            return false;
        }

        if(otherType instanceof JavaClass){
            if(otherType.identifier == 'Object') return true;
            return false;
        }

        return false;
    }

}

