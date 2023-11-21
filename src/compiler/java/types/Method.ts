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

    program?: Program;

    parameters: Parameter[] = [];

    /**
     * undefined, if null
     */
    returnParameterType?: JavaType;

    private internalNames: {[callingConvention: string]: string} = {}

    public hasImplementationWithNativeCallingConvention: boolean = false;

    classEnumInterface!: JavaClass | JavaEnum | JavaInterface;

    usagePositions: UsagePosition[] = [];

    programStub?: string;       // only for debugging purposes

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
        
        return newMethod;

    }

    getInternalName(callingConvention: CallingConvention): string {
        if(!this.internalNames[callingConvention]){
            let cc = callingConvention == "java" ? "j" : "n";
    
            let shorthand = this.isConstructor ? 'c' : 'm';
            let s = `_${shorthand}${cc}$${this.identifier}$${this.returnParameterType ? this.returnParameterType.identifier : 'void'}$`;
            s += this.parameters.map(p => p.type.identifier).join("$");
            this.internalNames[callingConvention] = s;
        }
        return this.internalNames[callingConvention];
    }

    clearUsagePositions(): void {
        this.usagePositions = [];
        this.parameters.forEach(p => p.usagePositions = []);
    }

}