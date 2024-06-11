import { TreeviewNode } from "../../../tools/components/treeview/TreeviewNode";
import { DebM } from "../../../tools/language/DebuggerMessages";
import { GenericVariantOfJavaClass, JavaClass } from "../../java/types/JavaClass";
import { BaseField, BaseSymbol, SymbolOnStackframe } from "../BaseSymbolTable";
import { BaseArrayType, BaseListType, BaseType } from "../BaseType";
import { SymbolTableSection } from "./SymbolTableSection";

type RuntimeObject = {
    getType(): RuntimeObjectType & BaseType;
    [index: string]: any;
}

interface RuntimeObjectType {
    getFields(): BaseField[];
    [index: string]: any;
}

type ArrayOutputData = {
    text: string
}

export class DebuggerSymbolEntry {

    treeViewNode: TreeviewNode<DebuggerSymbolEntry>;
    children: DebuggerSymbolEntry[] = [];
    oldValue?: any; // old value if value is primitive type
    oldLength?: number; // old length if value is array

    static quickArrayOutputMaxLength = 20;

    constructor(private symbolTableSection: SymbolTableSection,
        parent: DebuggerSymbolEntry | undefined, private type: BaseType | undefined, public identifier: string
    ) {
        this.treeViewNode = new TreeviewNode(symbolTableSection.treeview,
            false, "", undefined,
            this, this, parent, true
        )

        this.treeViewNode.render();
    }

    render(value: any) {

        if (value == null) {
            this.setCaption(" = ", "null", "jo_debugger_value");
            this.removeChildren();
        } else if (Array.isArray(value)) {
            this.renderArray(value);
        } else if (typeof value == "object") {
            this.renderObject(<RuntimeObject>value);
        } else {
            this.renderPrimitiveValue(value);
        }

    }

    removeChildren() {
        this.children.forEach(child => child.treeViewNode.destroy());
        this.children = [];
    }

    setCaption(delimiter: string, value: string, valuecss: string) {

        value = value.replaceAll("<", "&lt;")
        value = value.replaceAll(">", "&gt;")

        let caption = `<span class="jo_debugger_identifier">${this.identifier}</span>${delimiter}<span class="${valuecss}">${value}</span>`;
        this.treeViewNode.caption = caption;
    }



    renderPrimitiveValue(value: any) {
        if (typeof value == "string") {
            this.setCaption(" = ", `"${value}"`, "jo_debugger_value");
        } else {
            this.setCaption(" = ", "" + value, "jo_debugger_value");
        }
        this.removeChildren();
    }


    renderObject(o: RuntimeObject) {
        let type = o.getType();

        if(type.identifier == "String"){
            this.setCaption(" = ", '"' + ("" + o.value) + '"', "jo_debugger_value");
            return;
        } 
        
        if(["Double", "Boolean", "Integer", "Float", "Character"].indexOf(type.identifier) >= 0){
            this.renderPrimitiveValue(o.value);
            return;
        }

        let typesDiffer: boolean = false;
        if(type != this.type){
            typesDiffer = true;
            if(type instanceof JavaClass && this.type instanceof GenericVariantOfJavaClass && this.type.isGenericVariantOf == type){
                typesDiffer = false;
            }
        }
        
        if(typesDiffer || !this.type){
            this.type = type;
        }

        if(o["isBaseListType"]){
            this.renderList(<BaseListType><any>o);
            return;
        }

        this.treeViewNode.iconClass = "img_debugger-object";
        this.setCaption(": ", this.type.toString() + "-" + DebM.object(), "jo_debugger_type");

        if (typesDiffer || this.children.length == 0) {
            this.removeChildren();
            let fields = type.getFields();

            if(type instanceof JavaClass){
                let baseType = type.getExtends()
                while(baseType){
                    fields = fields.concat(baseType.getFields());
                    baseType = baseType.getExtends();
                }
            }

            for (let field of fields) {
                let fde = new ObjectFieldDebuggerEntry(this.symbolTableSection, this, field);
                this.children.push(fde);
            }
            this.treeViewNode.isFolder = fields.length > 0;
        }

        this.children.forEach(c => (<ObjectFieldDebuggerEntry>c).fetchValueFromObjectAndRender(o));
    }

    renderList(value: BaseListType){
        this.setCaption(": ", this.type!.toString() + "-" + DebM.object(), "jo_debugger_type");
        let elements = value.getElements();
        if(elements.length != this.oldLength){
            this.removeChildren();
            this.oldLength = elements.length;
            for (let i = 0; i < elements.length; i++) {
                this.children.push(new ListElementDebuggerEntry(
                    this.symbolTableSection, this, i
                ))
            }
            this.treeViewNode.isFolder = elements.length > 0;
        }
        this.children.forEach(c => (<ListElementDebuggerEntry>c).fetchValueFromArrayAndRender(elements));
    }
    
    renderArray(a: any[]) {
        this.treeViewNode.isFolder = true;
        this.treeViewNode.expandCollapseComponent.setState("collapsed");

        let elementtype = (<BaseArrayType><any>this.type).getElementType()
        this.setCaption(": " + elementtype.toString() + "[" + a.length + "] == ", this.quickArrayOutput(a) , "jo_debugger_value");

        if (a.length != this.oldLength || this.children.length == 0) {
            this.oldLength = a.length;
            this.removeChildren();
            for (let i = 0; i < a.length; i++) {
                this.children.push(new ArrayElementDebuggerEntry(
                    this.symbolTableSection, this, i,
                    elementtype
                ))
            }
        }
        this.treeViewNode.isFolder = a.length > 0;
        this.children.forEach(c => (<ArrayElementDebuggerEntry>c).fetchValueFromArrayAndRender(a));
    }

    quickArrayOutput(a: any[]): string {

        let dimension: number = 0;
        let a1 = a;
        while(Array.isArray(a1)){
            dimension++;
            if(a1.length > 0){
                a1 = a1[0];
            }
        }
        
        let elementTypeIsString: boolean = (typeof a1 == 'string');
        let elementTypeIsObject: boolean = (typeof a1 == 'object');

        if(elementTypeIsObject) return "";

        let data: ArrayOutputData = {
            text: ""
        }

        this.quickArrayOutputHelper(a, data);

        return data.text;
    }

    quickArrayOutputHelper(a: any[], data: ArrayOutputData){
        let index: number = 0;
        data.text += "[";
        while(index < a.length && data.text.length < DebuggerSymbolEntry.quickArrayOutputMaxLength){
            let element = a[index];
            if(Array.isArray(element)){
                this.quickArrayOutputHelper(element, data);
            } else {
                switch(typeof element){
                    case "object":
                        if(element == null){
                            data.text += "null";
                        } else {
                            data.text += "{}";
                        }
                        break;
                    case "string":
                        data.text += '"' + element.substring(0, DebuggerSymbolEntry.quickArrayOutputMaxLength - data.text.length - 3) + '"';
                        break;
                    case "undefined":
                        break;
                    default:
                        data.text += ("" + element).substring(0, DebuggerSymbolEntry.quickArrayOutputMaxLength - data.text.length - 2);
                        break;
                }
            }
            if(index < a.length - 1) data.text += ", ";
            index++;
        }

        if(index < a.length) data.text += "...";

        data.text += "]";
    }
    


}


export class StackElementDebuggerEntry extends DebuggerSymbolEntry {

    constructor(symbolTableSection: SymbolTableSection,
        private symbol: SymbolOnStackframe) {
        super(symbolTableSection, undefined, symbol.getType(), symbol.identifier);

    }

    fetchValueFromStackAndRender(stack: any[], stackBase: number) {

        if (!(this.symbol instanceof SymbolOnStackframe)) return;

        let value = this.symbol.getValue(stack, stackBase);

        this.render(value);

    }

}

export class ObjectFieldDebuggerEntry extends DebuggerSymbolEntry {

    constructor(symbolTableSection: SymbolTableSection,
        parent: DebuggerSymbolEntry,
        private field: BaseField) {
        super(symbolTableSection, parent, field.getType(), field.identifier);
    }

    fetchValueFromObjectAndRender(object: RuntimeObject) {
        let value: any;
        if(this.field.isStatic()){
            value = object.getType().runtimeClass[this.field.getFieldIndentifier()];
        } else {
            value = object[this.field.getFieldIndentifier()];
        }
        this.render(value);
    }

}

export class ArrayElementDebuggerEntry extends DebuggerSymbolEntry {

    constructor(symbolTableSection: SymbolTableSection,
        parent: DebuggerSymbolEntry,
        private index: number,
        elementType: BaseType) {
        super(symbolTableSection, parent, elementType, parent.identifier + '[<span class="jo_debugger_index">' + index + '</span>]');
    }

    fetchValueFromArrayAndRender(a: any[]) {
        let value = a[this.index];
        this.render(value);
    }

}

export class ListElementDebuggerEntry extends DebuggerSymbolEntry {

    constructor(symbolTableSection: SymbolTableSection,
        parent: DebuggerSymbolEntry,
        private index: number) {
        super(symbolTableSection, parent, undefined, parent.identifier + '.get(<span class="jo_debugger_index">' + index + '</span>)');
    }

    fetchValueFromArrayAndRender(a: any[]) {
        let value = a[this.index];
        this.render(value);
    }

}