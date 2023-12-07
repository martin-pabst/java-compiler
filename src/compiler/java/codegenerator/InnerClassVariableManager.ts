import { JavaLocalVariable } from "./JavaLocalVariable.ts"
import { LocalVariableInformation } from "./JavaSymbolTable.ts";


export type InnerClassVariable = {
    variableInfo: LocalVariableInformation;
    innerClassAttributeIdentifier: string;
}

export class InnerClassStackEntry {
    variables: InnerClassVariable[] = [];
}


export class InnnerClassVariableManager {

    stack: InnerClassStackEntry[] = [];

    beginInnerClass(): void {
        this.stack.push(new InnerClassStackEntry());
    }

    getUsedOuterVariablesAndEndInnerClass(): InnerClassStackEntry {
        return this.stack.pop()!;
    }

    getInnerClassAttributeIdentifier(localVariableInformation: LocalVariableInformation){
        let currentStackEntry = this.stack[this.stack.length - 1];
        for(let innerClassVariable of currentStackEntry.variables){
            if(innerClassVariable.variableInfo.symbol == localVariableInformation.symbol){
                return innerClassVariable.innerClassAttributeIdentifier;
            }
        }

        let innerClassVariable: InnerClassVariable = {
            variableInfo: localVariableInformation,
            innerClassAttributeIdentifier: "__innerClassAttribute__" + currentStackEntry.variables.length
        }

        currentStackEntry.variables.push(innerClassVariable);

        return innerClassVariable.innerClassAttributeIdentifier;
    }


}
