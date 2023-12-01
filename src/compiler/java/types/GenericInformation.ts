import { UsagePosition } from "../../common/UsagePosition";
import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { Field } from "./Field";
import { IJavaClass } from "./JavaClass";
import { IJavaInterface } from "./JavaInterface";
import { JavaType } from "./JavaType";
import { Method } from "./Method";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility.ts";

export class GenericTypeParameter extends NonPrimitiveType {

    isWildcard: boolean;

    private fieldCache?: Field[];
    private methodCache?: Method[];
    public usagePositions: UsagePosition[] = [];

    /**
     * 
     * @param identifier 
     * @param upperBounds: ? extends B1 & B2 & B3...  B1 can be class or interface, B2, ... only interfaces; The type is SUBtype of B1, B2, ...
     * @param lowerBound : ? super B: the given type has B as its subtype
     */
    constructor(identifier: string, module: JavaBaseModule, identifierRange: IRange, 
        public upperBounds: (IJavaClass | IJavaInterface)[] = [], public lowerBound?: IJavaClass){
        super(identifier, identifierRange, "", module);
        this.isWildcard = (this.identifier == '?');
    }

    getField(identifier: string, uptoVisibility: Visibility, forceStatic?: boolean | undefined): Field | undefined {
        return undefined;
    }

    toString(): string {
        return this.identifier + 
        (this.lowerBound ? "super " + this.lowerBound?.toString() : "") + 
        (this.upperBounds.length > 0 ? "extends " + this.upperBounds.map(ub => ub.toString).join(" & ") : "");
    }

    isGenericVariant(): boolean {
        return false;
    }

    isGenericTypeParameter(): boolean {
        return true;
    }

    getFile(): File {
        return this.module.file;
    }

    getFields(): Field[]{
        if(!this.fieldCache){
            if(this.upperBounds.length == 0){
                this.fieldCache = [];     // TODO: fields of Object class!
            } else {
                this.fieldCache = this.upperBounds[0].getFields();
            } 
        }
        return this.fieldCache;
    }

    getMethods(): Method[]{
        if(!this.methodCache){
            this.methodCache = [];
            for(let ub of this.upperBounds){
                this.methodCache = this.methodCache.concat(ub.getMethods());
            }
        }
        return this.methodCache;
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        let ownMappedType = typeMap.get(this);
        if(ownMappedType) return ownMappedType;

        return this;
    }

    canImplicitlyCastTo(otherType: JavaType): boolean {
        if(otherType.isPrimitive) return false;
        if(otherType == this) return true;

        if(otherType instanceof GenericTypeParameter){
            if(!otherType.lowerBound) return false;
            for(let ub of this.upperBounds){
                if(ub.canImplicitlyCastTo(otherType.lowerBound)) return true;
            }
            return false;
        }

        for(let ub of this.upperBounds){
            if(ub.canImplicitlyCastTo(otherType)) return true;
        }

        return false;
    }

    canExplicitlyCastTo(otherType: JavaType): boolean {
        if(otherType.isPrimitive) return false;
        if(otherType == this) return true;

        if(otherType instanceof GenericTypeParameter){
            if(!otherType.lowerBound) return false;
            for(let ub of this.upperBounds){
                if(ub.canExplicitlyCastTo(otherType.lowerBound)) return true;
            }
            return false;
        }

        for(let ub of this.upperBounds){
            if(ub.canExplicitlyCastTo(otherType)) return true;
        }

        return false;
    }

    getReifiedIdentifier(): string {
        return this.identifier;
    }


}

export type GenericInformation  = GenericTypeParameter[];