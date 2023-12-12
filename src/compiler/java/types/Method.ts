import { UsagePosition } from "../../common/UsagePosition";
import { Program } from "../../common/interpreter/Program";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { GenericTypeParameter } from "./GenericInformation";
import { JavaClass } from "./JavaClass";
import { JavaEnum } from "./JavaEnum";
import { JavaInterface } from "./JavaInterface";
import { JavaType } from "./JavaType";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { Parameter } from "./Parameter";
import { Visibility } from "./Visibility";

export class Method {

    isStatic: boolean = false;
    isFinal: boolean = false;
    isAbstract: boolean = false;

    isConstructor: boolean = false;

    isDefault: boolean = false;

    program?: Program;

    parameters: Parameter[] = [];
    hasOuterClassParameter: boolean = false;            // constructors of non-static inner classes have invisible first parameter with identifier outerClassAttributeIdentifier

    template?: string;      // only for library Methods, i.e. Math.sin
    constantFoldingFunction?: (...parms: any) => any; 

    /**
     * undefined, if null
     */
    returnParameterType?: JavaType;

    private signatureCache: {[callingConvention: string]: string} = {}
    private signatureCacheWithGenericParameterIdentifiers: {[callingConvention: string]: string} = {}

    public hasImplementationWithNativeCallingConvention: boolean = false;

    classEnumInterface!: JavaClass | JavaEnum | JavaInterface;

    usagePositions: UsagePosition[] = [];

    programStub?: string;       // only for debugging purposes

    callbackAfterCodeGeneration: (() => void)[] = [];

    constructor(public identifier: string, public identifierRange: IRange, public module: JavaBaseModule,
          public visibility: Visibility = TokenType.keywordPublic){

    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, NonPrimitiveType>): Method {

        let copyNeeded: boolean = false;
        let newParameters: Parameter[] = [];
        for(let p of this.parameters){
            let copy = p.getCopyWithConcreteType(typeMap);
            newParameters.push(copy);
            if(copy != p) copyNeeded = true;
        }

        let newReturnParameter = this.returnParameterType;
        if(this.returnParameterType && !this.returnParameterType.isPrimitive){
            newReturnParameter = (<NonPrimitiveType>this.returnParameterType).getCopyWithConcreteType(typeMap);
        }

        if(newReturnParameter != this.returnParameterType) copyNeeded = true;

        if(!copyNeeded) return this;

        let newMethod = new Method(this.identifier, this.identifierRange, this.module, this.visibility);
        newMethod.isConstructor = this.isConstructor;
        newMethod.isFinal = this.isFinal;
        newMethod.isAbstract = this.isAbstract;
        newMethod.isDefault = this.isDefault;
        newMethod.hasOuterClassParameter = this.hasOuterClassParameter;
        newMethod.parameters = newParameters;
        newMethod.returnParameterType = newReturnParameter;

        this.getInternalName("java");
        this.getInternalName("native");
        newMethod.signatureCacheWithGenericParameterIdentifiers = this.signatureCache;

        return newMethod;

    }

    getCopy(): Method {

        let newParameters: Parameter[] = [];
        for(let p of this.parameters) newParameters.push(p.getCopy());

        let newMethod = new Method(this.identifier, this.identifierRange, this.module, this.visibility);
        newMethod.isConstructor = this.isConstructor;
        newMethod.isFinal = this.isFinal;
        newMethod.isAbstract = this.isAbstract;
        newMethod.returnParameterType = this.returnParameterType;
        newMethod.parameters = newParameters;
        
        return newMethod;

    }

    getInternalName(callingConvention: CallingConvention): string {
        if(!this.signatureCache[callingConvention]){
            let cc = callingConvention == "java" ? "j" : "n";
    
            let shorthand = this.isConstructor ? 'c' : 'm';
            let s = `_${shorthand}${cc}$${this.isConstructor ? "_constructor_" : this.identifier}$${this.returnParameterType ? this.returnParameterType.getInternalName() : 'void'}$`;
            s += this.parameters.map(p => p.type.getInternalName()).join("$");
            this.signatureCache[callingConvention] = s;
        }
        return this.signatureCache[callingConvention];
    }

    getInternalNameWithGenericParameterIdentifiers(callingConvention: CallingConvention): string {
        if(!this.signatureCacheWithGenericParameterIdentifiers[callingConvention]){
            this.signatureCacheWithGenericParameterIdentifiers[callingConvention] = this.getInternalName(callingConvention);
        }
        return this.signatureCacheWithGenericParameterIdentifiers[callingConvention];
    }

    takeInternalJavaNameWithGenericParamterIdentifiersFrom(method: Method) {
        this.signatureCache["java"] = method.getInternalNameWithGenericParameterIdentifiers("java");
        this.signatureCacheWithGenericParameterIdentifiers["java"] = this.signatureCache["java"];
    }


    clearUsagePositions(): void {
        this.usagePositions = [];
        this.parameters.forEach(p => p.usagePositions = []);
    }

    getSignature(){
        if(this.isConstructor){
            return this.identifier + "(" + this.parameters.map(p => p.type.getReifiedIdentifier()).join(", ") + ")";
        } else {
            return this.returnParameterType?.getReifiedIdentifier() + " " + this.identifier + "(" + this.parameters.map(p => p.type.getReifiedIdentifier()).join(", ") + ")";
        }
    }
}