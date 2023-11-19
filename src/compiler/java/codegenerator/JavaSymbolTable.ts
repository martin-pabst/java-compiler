import { BaseStackframe, BaseSymbol, BaseSymbolTable, SymbolKind } from "../../common/BaseSymbolTable";
import { IRange } from "../../common/range/Range";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaClass } from "../types/JavaClass";
import { JavaEnum } from "../types/JavaEnum";
import { JavaType } from "../types/JavaType.ts";
import { Method } from "../types/Method.ts";
import { JavaLocalVariable } from "./JavaLocalVariable";


export class JavaSymbolTable extends BaseSymbolTable {

    declare childTables: JavaSymbolTable[];

    declare parent?: JavaSymbolTable;

    declare identifierToSymbolMap: Map<string, JavaLocalVariable>;

    constructor(public module: JavaCompiledModule, range: IRange, withStackFrame: boolean,
        public classContext?: JavaClass | JavaEnum | undefined,
        public methodContext?: Method){
        super(range, module.file);
        if(withStackFrame){
            this.stackframe = new BaseStackframe(classContext ? 1 : 0);    // if calling a method: 1st element on stack is this
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

    findSymbol(identifier: string): BaseSymbol | undefined {
        return this.findSymbolIntern(identifier, this.classContext);
    }

    private findSymbolIntern(identifier: string, classContext: JavaClass | JavaEnum | undefined): JavaLocalVariable | undefined {
        let symbol = this.identifierToSymbolMap.get(identifier);
        if(symbol) return symbol;
        if(this.parent){
            if(this.parent.classContext == classContext){
                return this.parent.findSymbolIntern(identifier, classContext);
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

