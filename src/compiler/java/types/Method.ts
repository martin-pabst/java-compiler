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
    returnParameter?: JavaType;

    private internalNames: {[callingConvention: string]: string} = {}

    public hasImplementationWithNativeCallingConvention: boolean = false;

    classEnumInterface!: JavaClass | JavaEnum | JavaInterface;

    usagePositions: UsagePosition[] = [];

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

        let newReturnParameter = this.returnParameter;
        if(this.returnParameter && !this.returnParameter.isPrimitive){
            newReturnParameter = (<NonPrimitiveType>this.returnParameter).getCopyWithConcreteType(typeMap);
        }

        if(newReturnParameter != this.returnParameter) copyNeeded = true;

        if(!copyNeeded) return this;

        return new Method(this.identifier, this.identifierRange, this.module, this.visibility);

    }

    getInternalName(callingConvention: CallingConvention): string {
        if(!this.internalNames[callingConvention]){
            let cc = callingConvention == "java" ? "j" : "n";
    
            let shorthand = this.isConstructor ? 'c' : 'm';
            let s = `_${shorthand}${cc}$${this.identifier}$${this.returnParameter ? this.returnParameter.identifier : 'void'}$`;
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