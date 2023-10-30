import { UsagePosition } from "../../common/UsagePosition";
import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";

export class ArrayType implements JavaType {
    
    isPrimitive: boolean;
    usagePositions: UsagePosition[] = [];
    genericInformation: GenericInformation | undefined = undefined;

    constructor(public identifier: string, public elementType: JavaType, public dimenstion: number,
         public module: JavaBaseModule, public identifierRange: IRange){
        this.isPrimitive = true;
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        return this;
    }

    canCastTo(otherType: JavaType): boolean {
        throw new Error("Method not implemented.");
    }

    getFile(): File {
        throw new Error("Method not implemented.");
    }

}