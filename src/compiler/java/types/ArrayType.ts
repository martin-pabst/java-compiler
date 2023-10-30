import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericInformation, GenericTypeParameter } from "./GenericInformation";
import { JavaType } from "./JavaType";

export class ArrayType extends JavaType {
    
    genericInformation: GenericInformation | undefined = undefined;

    clearUsagePositions(): void {
        
    }

    constructor(public identifier: string, 
        public elementType: JavaType, public dimenstion: number,
         public module: JavaBaseModule, public identifierRange: IRange){
            super(identifier, identifierRange, module);
            this.isPrimitive = true;
    }

    getCopyWithConcreteType(_typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        return this;
    }

    canCastTo(_otherType: JavaType): boolean {
        throw new Error("Method not implemented.");
    }

    getFile(): File {
        throw new Error("Method not implemented.");
    }

}