import { BaseStackframe, BaseSymbol, BaseSymbolOnStackframe, BaseSymbolTable } from "../../common/BaseSymbolTable";
import { IRange } from "../../common/range/Range";
import { JavaCompiledModule } from "../module/JavaCompiledModule";
import { JavaClass } from "../types/JavaClass";
import { JavaEnum } from "../types/JavaEnum";
import { JavaLocalVariable } from "./JavaLocalVariable";

export class JavaSymbolTable extends BaseSymbolTable {

    declare symbols: JavaLocalVariable[];
    declare childTables: JavaSymbolTable[];

    declare parent?: JavaSymbolTable;

    declare identifierToSymbolMap: Map<string, JavaLocalVariable>;

    constructor(public module: JavaCompiledModule, range: IRange, withStackFrame: boolean,
        public classContext?: JavaClass | JavaEnum | undefined){
        super(range, module.file);
        if(withStackFrame){
            this.stackframe = new BaseStackframe(classContext ? 1 : 0);
        }
    }

    getChildTable(range: IRange, withStackFrame: boolean, classContext?: JavaClass | JavaEnum | undefined){
        let childTable = new JavaSymbolTable(this.module, range, withStackFrame, classContext);
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
        if(symbol instanceof BaseSymbolOnStackframe){
            let parameterOrVariable: "parameter" | "variable" = "parameter";
            if(symbol instanceof JavaLocalVariable){
                parameterOrVariable = "variable";
            }
            this.getStackFrame()?.addSymbol(symbol, parameterOrVariable);
        }
    }

    getStackFrame(): BaseStackframe | undefined {
        let st: JavaSymbolTable = this;
        while(!st.stackframe && st.parent){
            st = st.parent;
        }
        return st.stackframe;
    }

}

