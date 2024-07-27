import { Error } from "../../common/Error.ts";
import { File } from "../../common/module/File";
import { IRange } from "../../common/range/Range";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { JavaField } from "./JavaField";
import { IJavaClass } from "./JavaClass";
import { IJavaInterface } from "./JavaInterface";
import { JavaType } from "./JavaType";
import { JavaMethod } from "./JavaMethod";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Visibility } from "./Visibility.ts";
import { JCM } from "../../../tools/language/JavaCompilerMessages.ts";

export class GenericTypeParameter extends NonPrimitiveType {

    isWildcard: boolean;

    private fieldCache?: JavaField[];
    private methodCache?: JavaMethod[];

    // only used for generic type parameters of generic methods:
    public catches?: NonPrimitiveType[];

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

    getField(identifier: string, uptoVisibility: Visibility, forceStatic?: boolean | undefined): JavaField | undefined {
        return undefined;
    }

    getDeclaration(): string {
        return this.toString();        
    }

    toString(): string {
        return this.identifier + 
        (this.lowerBound ? " super " + this.lowerBound?.identifier : "") + 
        // (this.lowerBound ? " super " + this.lowerBound?.toString() : "") + 
        // (this.upperBounds.length > 0 ? " extends " + this.upperBounds.map(ub => ub.toString()).join(" & ") : "");
        (this.upperBounds.length > 0 ? " extends " + this.upperBounds.map(ub => ub.identifier).join(" & ") : "");
    }

    getAbsoluteName(): string {
        return this.pathAndIdentifier + 
        (this.lowerBound ? " super " + this.lowerBound?.pathAndIdentifier : "") + 
        // (this.lowerBound ? " super " + this.lowerBound?.toString() : "") + 
        // (this.upperBounds.length > 0 ? " extends " + this.upperBounds.map(ub => ub.toString()).join(" & ") : "");
        (this.upperBounds.length > 0 ? " extends " + this.upperBounds.map(ub => ub.pathAndIdentifier).join(" & ") : "");
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

    getFields(): JavaField[]{
        if(!this.fieldCache){
            if(this.upperBounds.length == 0){
                this.fieldCache = [];     // TODO: fields of Object class!
            } else {
                this.fieldCache = this.upperBounds[0].getFields();
            } 
        }
        return this.fieldCache;
    }

    getOwnMethods(): JavaMethod[]{
        if(!this.methodCache){
            this.methodCache = [];
            for(let ub of this.upperBounds){
                this.methodCache = this.methodCache.concat(ub.getAllMethods());
            }
        }
        return this.methodCache;
    }

    getAllMethods(): JavaMethod[]{
        return this.getOwnMethods();
    }

    getPossibleMethods(identifier: string, isConstructor: boolean, hasToBeStatic: boolean): JavaMethod[] {
        return this.getAllMethods().filter(m => m.identifier == identifier && m.isConstructor == isConstructor && (m.isStatic || !hasToBeStatic));
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, JavaType>): JavaType {
        let ownMappedType = typeMap.get(this);
        if(ownMappedType) return ownMappedType;

        let copy = new GenericTypeParameter(this.identifier, this.module, this.identifierRange);
        if(this.lowerBound){
            copy.lowerBound = this.lowerBound.getCopyWithConcreteType(typeMap) as IJavaClass;
        }

        for(let ub of this.upperBounds){
            copy.upperBounds.push(ub.getCopyWithConcreteType(typeMap) as IJavaClass | IJavaInterface);
        }

        return copy;
    }

    canBeReplacedByConcreteType(gpType: JavaType): boolean {
        if(!(gpType instanceof NonPrimitiveType)) return false;
        for(let ub of this.upperBounds){
            if(!gpType.fastExtendsImplements(ub.identifier)) return false;
        }

        if(this.lowerBound && !this.lowerBound.fastExtendsImplements(gpType.identifier)) return false;

        return true;
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

    initCatches(){
        this.catches = [];
    }

    checkCatches(errors: Error[], methodCallPosition: IRange) {
        if(!this.catches || this.catches.length == 0){
            let error = JCM.parameterNotDefined(this.identifier);
            errors.push({
                message: error.message,
                id: error.id,
                level: "error",
                range: methodCallPosition
            })
            return;
        }

        let catchesAsString = this.catches.map(c => c.toString());
        let allEqual = true;
        for(let i = 0; i < catchesAsString.length && allEqual; i++){
            for(let j = i + 1; j < catchesAsString.length && allEqual; j++){
                if(catchesAsString[i] != catchesAsString[j]){
                    allEqual = false;
                }
            }
        }

        if(!allEqual){
            let error = JCM.parameterContradictoryBound(this.identifier, catchesAsString.join(", "));
            errors.push({
                message: error.message,
                id: error.id,
                level: "error",
                range: methodCallPosition
            })
        }

    }

    getInternalName(): string {
        return this.identifier;
    }

    getCompletionItems(visibilityUpTo: Visibility, leftBracketAlreadyThere: boolean, identifierAndBracketAfterCursor: string, rangeToReplace: monaco.IRange, methodContext: JavaMethod | undefined, onlyStatic?: boolean | undefined): monaco.languages.CompletionItem[] {
        return [];
    }

    getCompletionItemDetail(): string {
        return "";
    }


}

export type GenericTypeParameters  = GenericTypeParameter[];