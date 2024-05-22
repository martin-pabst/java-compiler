import { BaseStackframe, BaseSymbol, BaseSymbolTable, SymbolOnStackframe as SymbolOnStack } from "../../common/BaseSymbolTable";
import { Position } from "../../common/range/Position.ts";
import { IRange, Range } from "../../common/range/Range";
import { TokenType } from "../TokenType.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaClass } from "../types/JavaClass";
import { JavaEnum } from "../types/JavaEnum";
import { JavaInterface } from "../types/JavaInterface.ts";
import { Method } from "../types/Method.ts";
import { Parameter } from "../types/Parameter.ts";
import { StaticNonPrimitiveType } from "../types/StaticNonPrimitiveType.ts";
import { Visibility } from "../types/Visibility.ts";
import { JavaLocalVariable } from "./JavaLocalVariable";

export type LocalVariableInformation = {
    symbol: JavaLocalVariable,
    outerClassLevel: number
}


export class JavaSymbolTable extends BaseSymbolTable {
    
    declare childTables: JavaSymbolTable[];
    
    declare parent?: JavaSymbolTable;

    declare identifierToSymbolMap: Map<string, JavaLocalVariable>;

    constructor(public module: JavaCompiledModule, public range: IRange, withStackFrame: boolean,
        parent?: BaseSymbolTable,
        public classContext?: JavaClass | JavaEnum | JavaInterface | StaticNonPrimitiveType | undefined,
        public methodContext?: Method){

        super(parent);
        
        if(parent){
            if(!classContext) this.classContext = (<JavaSymbolTable>parent).classContext;
            if(!methodContext) this.methodContext = (<JavaSymbolTable>parent).methodContext;
        }

        if(!parent){
            module.symbolTables.push(this);
        }

        if(withStackFrame){
            // inside non-static java-methods: 1st element on stack is this
            this.stackframe = new BaseStackframe(classContext ? 1 : 0);    
        }
    }


    findSymbol(identifier: string): LocalVariableInformation | undefined {
        return this.findSymbolIntern(identifier, TokenType.keywordPrivate, true, 0);
    }

    private findSymbolIntern(identifier: string, upToVisibility: Visibility, searchForFields: boolean, outerClassLevel: number): LocalVariableInformation | undefined {
        // local variable?
        let symbol = this.identifierToSymbolMap.get(identifier);
        if(symbol) return {
            symbol: symbol,
            outerClassLevel: outerClassLevel
        }

        // parameter?
        // Topmost Symbol table inside method has parameters...
        if(this.methodContext != null && this.parent != null){
            let parent = this.parent;
            while(parent && parent.parent?.methodContext == this.methodContext){
                parent = parent.parent;
            }
            symbol = parent.identifierToSymbolMap.get(identifier);
            if(symbol){
                return {
                    symbol: symbol,
                    outerClassLevel: outerClassLevel                        }
            }
        }

        if(this.classContext && searchForFields){
            let field = this.classContext.getField(identifier, TokenType.keywordPrivate);
            if(field){
                return {
                    symbol: field,
                    outerClassLevel: outerClassLevel
                } 
            }
            
        }
        
        if(this.parent){
            if(this.parent.classContext == this.classContext){
                return this.parent.findSymbolIntern(identifier, upToVisibility, false, outerClassLevel);
            } else {
                return this.parent.findSymbolIntern(identifier, TokenType.keywordProtected, true, outerClassLevel + 1);
            }
        }

        return undefined;
    }   
    
    public addSymbol(symbol: BaseSymbol): void {
        super.addSymbol(symbol);
        if(symbol instanceof SymbolOnStack){
            this.getStackFrame()?.addSymbol(symbol, symbol instanceof Parameter ? "parameter" : "localVariable");
        }
    }

    public insertInvisibleParameter(){
        this.getStackFrame()?.insertInvisibleParameter();
    }
    
    getStackFrame(): BaseStackframe | undefined {
        let st: JavaSymbolTable = this;
        while(!st.stackframe && st.parent){
            st = st.parent;
        }
        return st.stackframe;
    }
    
    findSymbolTableAtPosition(position: Position): JavaSymbolTable | undefined {
        if(!Range.containsPosition(this.range, position)) return undefined;
        let bestTable: JavaSymbolTable = this;
        for(let child of this.childTables){
            let t1 = child.findSymbolTableAtPosition(position);
            if(t1) bestTable = child;
        }

        return bestTable;
    }

    getLocalVariableCompletionItems(rangeToReplace: monaco.IRange): monaco.languages.CompletionItem[] {
        let items: monaco.languages.CompletionItem[] = [];
        this.identifierToSymbolMap.forEach((symbol, identifier) => {
            items.push({
                label: symbol.getDeclaration(),
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: symbol.identifier,
                filterText: symbol.identifier,
                range: rangeToReplace
            })
        })

        if(this.parent){
            let newItems = this.parent.getLocalVariableCompletionItems(rangeToReplace).filter(newItem => items.findIndex(item => item.insertText == newItem.insertText) == -1);
            items = items.concat(newItems);
        }

        return items;
    }


}



