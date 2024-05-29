import { TreeviewNode } from "../../../tools/components/treeview/TreeviewNode";
import { ObjectClass } from "../../java/runtime/system/javalang/ObjectClassStringClass";
import { BaseField, BaseSymbol, SymbolOnStackframe } from "../BaseSymbolTable";
import { BaseArrayType, BaseType } from "../BaseType";
import { Klass } from "../interpreter/StepFunction";
import { ProgramState } from "../interpreter/Thread";
import { SymbolTableSection } from "./SymbolTableSection";

type RuntimeObject = {
    getType(): RuntimeObjectType & BaseType;
    [index: string]: any;
}

interface RuntimeObjectType {
    getFields(): BaseField[];
}

export class DebuggerEntry {
    
    treeViewNode: TreeviewNode<DebuggerEntry>;
    children: DebuggerEntry[] = [];
    oldValue?: any; // old value if value is primitive type
    oldLength?: number; // old length if value is array

    constructor(private symbolTableSection: SymbolTableSection,
        parent: DebuggerEntry | undefined, private type: BaseType, private identifier: string
    ){    
        this.treeViewNode = new TreeviewNode(symbolTableSection.treeview, 
            false, "", undefined,
            this, this, parent, true
        )

        this.treeViewNode.render();
    }

    render(value: any){

        if(value == null){
            this.setCaption("null");
            this.removeChildren();
        } else if(Array.isArray(value)){
            this.renderArray(value);
        } else if(typeof value == "object"){
            this.renderObject(<RuntimeObject>value);
        } else {
            this.renderPrimitiveValue(value);
        }

    }

    removeChildren(){
        this.children.forEach(child => child.treeViewNode.destroy());
        this.children = [];
    }

    setCaption(value: string){
        let caption = `<span>${this.identifier} = </span><span>${value}</span>`;
        this.treeViewNode.caption = caption;
    }

    renderPrimitiveValue(value: any){
        if(typeof value == "string"){
            this.setCaption(`"${value}"`);
        } else {
            this.setCaption("" + value);
        }
        this.removeChildren();
    }


    renderObject(o: RuntimeObject){
        let type = o.getType();
        this.setCaption(type.toString() + "-Object");

        if(type != this.type || this.children.length == 0){
            this.type = type;
            this.removeChildren();
            let fields = type.getFields();
            for(let field of type.getFields()){
                let fde = new ObjectFieldDebuggerEntry(this.symbolTableSection, this, field);
                this.children.push(fde);
            }
            this.treeViewNode.isFolder = fields.length > 0;
        }

        this.children.forEach(c => (<ObjectFieldDebuggerEntry>c).fetchValueFromObjectAndRender(o));
    }

    renderArray(a: any[]){
        this.treeViewNode.isFolder = true;
        this.setCaption(this.type.toString() + "[" + a.length + "]");

        if(a.length != this.oldLength || this.children.length == 0){
            this.oldLength = a.length;
            this.removeChildren();
            for(let i = 0; i < a.length; i++){
                this.children.push(new ArrayElementDebuggerEntry(
                    this.symbolTableSection, this, i, 
                    (<BaseArrayType><any>this.type).getElementType()
                ))
            }
            this.children.forEach( c => (<ArrayElementDebuggerEntry>c).fetchValueFromArrayAndRender(a));
        }
    }

}


export class StackElementDebuggerEntry extends DebuggerEntry {
    
    constructor(symbolTableSection: SymbolTableSection, 
        private symbol: SymbolOnStackframe){
        super(symbolTableSection, undefined, symbol.getType(), symbol.identifier);
        
    }
  
    fetchValueFromStackAndRender(stack: any[], stackBase: number){

        if(!(this.symbol instanceof SymbolOnStackframe)) return;

        let value = this.symbol.getValue(stack, stackBase);

        this.render(value);

    }

}

export class ObjectFieldDebuggerEntry extends DebuggerEntry {

    constructor(symbolTableSection: SymbolTableSection, 
        parent: DebuggerEntry,
        private field: BaseField){
        super(symbolTableSection, parent, field.getType(), field.identifier);
    }

    fetchValueFromObjectAndRender(object: RuntimeObject){
        let value = object[this.field.getFieldIndentifier()];
        this.render(value);
    }

}

export class ArrayElementDebuggerEntry extends DebuggerEntry {

    constructor(symbolTableSection: SymbolTableSection, 
        parent: DebuggerEntry,
        private index: number,
        elementType: BaseType){
        super(symbolTableSection, parent, elementType, "" + index + ": ");
    }

    fetchValueFromArrayAndRender(a: any[]){
        let value = a[this.index];
        this.render(value);
    }
    
}