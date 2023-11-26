import { BaseSymbol } from "../../common/BaseSymbolTable";
import { Error } from "../../common/Error";
import { IRange } from "../../common/range/Range";
import { JavaType } from "../types/JavaType";
import { Method } from "../types/Method";
import { Parameter } from "../types/Parameter";

class MissingStatements {

    symbols: BaseSymbol[];
    symbolReadHappened: boolean[];
    symbolWriteHappened: boolean[];

    returnHappened: boolean;
    childrenCount: number = 0;
    childrenWithReturnStatement: number = 0;

    constructor(public parent?: MissingStatements){
        if(parent){
            this.symbols = parent.symbols.slice();
            this.symbolReadHappened = parent.symbolReadHappened.slice();
            this.symbolWriteHappened = parent.symbolWriteHappened.slice();
            this.returnHappened = parent.returnHappened;
            parent.childrenCount++;
        } else {
            this.symbols = [];
            this.symbolReadHappened = [];
            this.symbolWriteHappened = [];
            this.returnHappened = false;
        }
    }

    addSymbolDeclaration(symbol: BaseSymbol, withInitialization: boolean){
        this.symbols.push(symbol);
        this.symbolReadHappened.push(false);
        this.symbolWriteHappened.push(withInitialization);
    }    

    onSymbolRead(symbol: BaseSymbol, range: IRange, errors: Error[]){
        let i = this.symbols.indexOf(symbol);
        if(i >= 0) {
            if(!this.symbolWriteHappened[i]){
                errors.push({message: "Die Variable/der Parameter " + symbol.identifier + " is vor diesem lesenden Zugriff noch nicht initialisiet worden.", level: "error", range: range});
            }
            this.symbolReadHappened[i] = true;
        }
    }

    onSymbolWrite(symbol: BaseSymbol, range: IRange, errors: Error[]){
        let i = this.symbols.indexOf(symbol);
        if(i >= 0) {
            this.symbolWriteHappened[i] = true;
        }
    }
    
    onReturnHappened(){
        this.returnHappened = true;
    }
    
    onCloseBranch(errors: Error[]){
        let start: number = 0;

        if(this.parent){
            if(this.returnHappened) this.parent.childrenWithReturnStatement++;

            for(let i = 0; i < this.parent.symbolReadHappened.length; i++){
                if(this.symbolReadHappened[i]) this.parent.symbolReadHappened[i] = true;
                start = this.parent.symbolReadHappened.length;
            }        
        } 

        for(let i = start; i < this.symbolReadHappened.length; i++){
            if(!this.symbolReadHappened[i]){
                errors.push({message: "Auf die Variable/den Parameter " + this.symbols[i].identifier + " wird nie lesend zugegriffen.", level: "info", range: this.symbols[i].identifierRange});                    
            }   
        }
        
    }
    
}

export class MissingStatementManager {
    
    stack: MissingStatements[] = [];
    
    beginMethodBody(parameters: Parameter[]){
        this.stack = [];
        let missingStatements = new MissingStatements();
        for(let parameter of parameters) missingStatements.addSymbolDeclaration(parameter, true);
        this.stack.push(missingStatements);
    }
    
    openBranch(){
        this.stack.push(new MissingStatements(this.stack[this.stack.length - 1]));
    }
    
    closeBranch(errors: Error[]){
        this.stack.pop()?.onCloseBranch(errors);
    }

    endBranching(){
        let currentMissingStatements = this.stack[this.stack.length - 1];
        if(currentMissingStatements.childrenWithReturnStatement == currentMissingStatements.childrenCount){
            currentMissingStatements.returnHappened = true;
        }
        
        currentMissingStatements.childrenCount = 0;
        currentMissingStatements.childrenWithReturnStatement = 0;
    }
    
    endMethodBody(method: Method | undefined, errors: Error[]){
        let currentMissingStatements = this.stack[this.stack.length - 1];
        
        if(method && method.returnParameterType && method.returnParameterType.identifier != "void"){
            if(!currentMissingStatements.returnHappened){
                errors.push({message: "Die Methode " + method.identifier + " muss einen Wert vom Typ " + method.returnParameterType.identifier + " zurückliefern. In einem der Ausführungszweige fehlt ein entsprechendes return-statement.", level: "error", range: method.identifierRange});                    
            }
        }

        currentMissingStatements.onCloseBranch(errors);
    }
    
    addSymbolDeclaration(symbol: BaseSymbol, withInitialization: boolean){
        let currentMissingStatements = this.stack[this.stack.length - 1];
        currentMissingStatements.addSymbolDeclaration(symbol, withInitialization);
    }    
    
    onSymbolRead(symbol: BaseSymbol, range: IRange, errors: Error[]){
        let currentMissingStatements = this.stack[this.stack.length - 1];
        currentMissingStatements.onSymbolRead(symbol, range, errors);
    }
    
    onSymbolWrite(symbol: BaseSymbol, range: IRange, errors: Error[]){
        let currentMissingStatements = this.stack[this.stack.length - 1];
        currentMissingStatements.onSymbolWrite(symbol, range, errors);
    }
    
    onReturnHappened(){
        let currentMissingStatements = this.stack[this.stack.length - 1];
        currentMissingStatements.onReturnHappened();
    }
    
    onCloseBranch(errors: Error[]){
        let currentMissingStatements = this.stack[this.stack.length - 1];
        currentMissingStatements.onCloseBranch(errors);        
    }
    
    hasReturnHappened(){
        let currentMissingStatements = this.stack[this.stack.length - 1];
        return currentMissingStatements.returnHappened;
    }

}