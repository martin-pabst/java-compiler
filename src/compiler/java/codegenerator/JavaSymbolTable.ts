import { BaseStackframe, BaseSymbol, BaseSymbolTable, SymbolKind } from "../../common/BaseSymbolTable";
import { IRange } from "../../common/range/Range";
import { TokenType } from "../TokenType.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaClass } from "../types/JavaClass";
import { JavaEnum } from "../types/JavaEnum";
import { JavaInterface } from "../types/JavaInterface.ts";
import { JavaType } from "../types/JavaType.ts";
import { Method } from "../types/Method.ts";
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

    constructor(public module: JavaCompiledModule, range: IRange, withStackFrame: boolean,
        public classContext?: JavaClass | JavaEnum | JavaInterface | undefined,
        public methodContext?: Method){
        super(range, module.file);
        
        module.symbolTables.push(this);

        if(withStackFrame){
            // inside non-static java-methods: 1st element on stack is this
            this.stackframe = new BaseStackframe(classContext ? 1 : 0);    
        }
    }

    getChildTable(range: IRange, withStackFrame: boolean, classContext?: JavaClass | JavaEnum | undefined){
        let childTable = new JavaSymbolTable(this.module, range, withStackFrame, classContext);
        this.childTables.push(childTable);
        childTable.parent = this;
    }

    addChildTable(childTable: JavaSymbolTable) {
        this.childTables.push(childTable);
        childTable.parent = this;
    }

    findSymbol(identifier: string): LocalVariableInformation | undefined {
        return this.findSymbolIntern(identifier, TokenType.keywordPrivate, true, 0);
    }

    private findSymbolIntern(identifier: string, upToVisibility: Visibility, searchForFields: boolean, outerClassLevel: number): LocalVariableInformation | undefined {
        let symbol = this.identifierToSymbolMap.get(identifier);
        if(symbol) return {
            symbol: symbol,
            outerClassLevel: outerClassLevel
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
        if(symbol.onStackframe()){
            this.getStackFrame()?.addSymbol(symbol);
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

    getClassContext(): JavaType | undefined {
        let st: JavaSymbolTable = this;
        while(!st.classContext && st.parent){
            st = st.parent;
        }
        return st.classContext;
    }

    getMethodContext(): Method | undefined {
        let st: JavaSymbolTable = this;
        while(!st.methodContext && st.parent){
            st = st.parent;
        }
        return st.methodContext;
    }


}

