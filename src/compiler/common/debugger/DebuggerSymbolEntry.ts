import { TreeviewNode } from "../../../tools/components/treeview/TreeviewNode";
import { DebM } from "./DebuggerMessages";
import { GenericVariantOfJavaClass, IJavaClass, JavaClass } from "../../java/types/JavaClass";
import { BaseField, BaseSymbol, SymbolOnStackframe } from "../BaseSymbolTable";
import { BaseArrayType, BaseListType, BaseType } from "../BaseType";
import { SymbolTableSection } from "./SymbolTableSection";
import { ValueRenderer } from "./ValueRenderer.ts";

export type RuntimeObject = {
    getType(): RuntimeObjectType & BaseType;
    [index: string]: any;
}

interface RuntimeObjectType {
    getOwnAndInheritedFields(): BaseField[];
    [index: string]: any;
}


export class DebuggerSymbolEntry {

    treeViewNode: TreeviewNode<DebuggerSymbolEntry>;
    children: DebuggerSymbolEntry[] = [];
    oldValue?: any; // old value if value is primitive type
    oldLength?: number; // old length if value is array
    isLocalVariable: boolean = true;

    static MAXCHILDREN: number = 20;
    static MAXARRAYSECTIONLENGTH: number = 100;

    static quickArrayOutputMaxLength = 100;

    constructor(protected symbolTableSection: SymbolTableSection,
        parent: DebuggerSymbolEntry | undefined, protected type: BaseType | undefined, public identifier: string
    ) {

        this.treeViewNode = new TreeviewNode(symbolTableSection.treeview,
            false, "", undefined,
            this, this, parent, true
        )
        
        this.treeViewNode.render();

        if(identifier == "this"){
            this.treeViewNode.expandCollapseComponent.setState("expanded");
        }
    }

    render(value: any) {

        if (value == null) {
            this.setCaption(" = ", "null", "jo_debugger_value");
            this.removeChildren();
        } else if (Array.isArray(value)) {
            this.renderArray(value, DebuggerSymbolEntry.quickArrayOutputMaxLength);
        } else if (typeof value == "object") {
            this.renderObject(<RuntimeObject>value);
        } else {
            this.renderPrimitiveValue(value);
        }

    }

    attachNodesToTreeview() {
        this.treeViewNode.attachAfterDetaching();
        this.children.forEach(c => c.attachNodesToTreeview());        
    }


    removeChildren() {
        this.children.forEach(child => child.treeViewNode.destroy());
        this.children = [];
    }

    setCaption(delimiter: string, value: string, valuecss: string) {

        value = value.replaceAll("<", "&lt;")
        value = value.replaceAll(">", "&gt;")

        let caption = `<span class="${this.isLocalVariable ? "jo_debugger_localVariableIdentifier" : "jo_debugger_fieldIdentifier"}">${this.identifier}</span>${delimiter}<span class="${valuecss}">${value}</span>`;
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

        let caption: string;
        if(o["_debugOutput"]){
            caption = o["_debugOutput"]();
        } else {
            caption = ValueRenderer.renderValue(o, DebuggerSymbolEntry.quickArrayOutputMaxLength);
        }

        if(this.identifier == "this") caption = '';

        this.treeViewNode.iconClass = "img_debugger-object";
        this.setCaption(": " +  this.type.toString(), " " + caption, "jo_debugger_value");

        if (typesDiffer || this.children.length == 0) {
            this.removeChildren();
            let fields: BaseField[] = type.getOwnAndInheritedFields();
            this.treeViewNode.isFolder = fields.length > 0;
            
            this.treeViewNode.removeAllExpandListeners();
            this.treeViewNode.addExpandListener((state) => {
                if(state == "collapsed") return;
                for (let field of fields) {
                    let fde = new ObjectFieldDebuggerEntry(this.symbolTableSection, this, field);
                    this.children.push(fde);
                }
                this.children.forEach(c => (<ObjectFieldDebuggerEntry>c).fetchValueFromObjectAndRender(o));
            }, true)
            
            this.treeViewNode.expandCollapseComponent.setState(this.identifier == 'this' ? "expanded" : "collapsed");
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
    
    renderArray(a: any[], maxLength: number) {
        if(a == null || !this.type) return;

        this.treeViewNode.isFolder = a.length > 0;      // isFolder is a property -> a method gets called where the ExpandCollapseComponent is shown            

        // on first opening:
        if(typeof this.oldLength == "undefined") this.treeViewNode.expandCollapseComponent.setState("collapsed");
        
        let elementtype = (<BaseArrayType><any>this.type).getElementType()
        this.setCaption(": " + elementtype.toString() + "[" + a.length + "] ", ValueRenderer.quickArrayOutput(a, DebuggerSymbolEntry.quickArrayOutputMaxLength) , "jo_debugger_value");

        while((this.children.length || 0) > a.length){
            this.children.pop()!.treeViewNode.destroy();
        }

        if (a.length != this.oldLength || this.children.length == 0) {
            
            let addAndDisplayChildren = () => {

                if(a.length! > DebuggerSymbolEntry.MAXARRAYSECTIONLENGTH){

                    let subintervalLength = this.getSubintervalLength(a.length); 
                    for(let nextIndex = 0; nextIndex < a.length; nextIndex += subintervalLength){
                        this.children.push(new ArraySectionDebuggerEntry(
                            this.symbolTableSection, this, nextIndex, Math.min(nextIndex + subintervalLength - 1, a.length - 1),
                            elementtype
                        ))
                    }

                } else {
                    for (let i = this.oldLength || 0; i < Math.min(a.length, DebuggerSymbolEntry.MAXCHILDREN); i++) {
                        this.children.push(new ArrayElementDebuggerEntry(
                            this.symbolTableSection, this, i,
                            elementtype
                        ))
                    }                
                }


                this.oldLength = a.length;
                this.children.forEach(c => (<ArrayElementDebuggerEntry>c).fetchValueFromArrayAndRender(a));
            }

            if(this.treeViewNode.expandCollapseComponent.state == "expanded"){
                addAndDisplayChildren();
            } else {
                this.treeViewNode.removeAllExpandListeners();
                this.treeViewNode.addExpandListener((state) => {
                    addAndDisplayChildren();
                });
            }

        }
    }

    getSubintervalLength(intervalLength: number){
        let digits = Math.trunc(Math.log10(intervalLength));
        return Math.trunc(Math.pow(10, Math.max(digits - 2, 2)));
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
        this.isLocalVariable = false;
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

export class ArraySectionDebuggerEntry extends DebuggerSymbolEntry {

    constructor(symbolTableSection: SymbolTableSection,
        parent: DebuggerSymbolEntry,
        private indexFrom: number,
        private indexTo: number,
        elementType: BaseType) {
        super(symbolTableSection, parent, elementType, parent.identifier);
        this.setCaption("", "[" + this.indexFrom + " ... " + this.indexTo + "]", "jo_debugger_index");
    }

    fetchValueFromArrayAndRender(a: any[]) {
        this.treeViewNode.isFolder = true;      // isFolder is a property -> a method gets called where the ExpandCollapseComponent is shown            

        // on first rendering:
        if(typeof this.oldLength == "undefined"){
            this.treeViewNode.expandCollapseComponent.setState("collapsed");
            this.treeViewNode.removeAllExpandListeners();
            this.oldLength = this.indexTo - this.indexFrom + 1;
            
            this.treeViewNode.addExpandListener((state) => {
                if(this.oldLength! > DebuggerSymbolEntry.MAXARRAYSECTIONLENGTH){

                    let subintervalLength = this.getSubintervalLength(this.oldLength!); 
                    for(let nextIndex = this.indexFrom; nextIndex <= this.indexTo; nextIndex += subintervalLength){
                        this.children.push(new ArraySectionDebuggerEntry(
                            this.symbolTableSection, this, nextIndex, 
                            Math.min(nextIndex + subintervalLength - 1, this.indexTo),
                            this.type!
                        ))
                    }

                } else {
                    for (let i = this.indexFrom || 0; i <= this.indexTo; i++) {
                        this.children.push(new ArrayElementDebuggerEntry(
                            this.symbolTableSection, this, i,
                            this.type!
                        ))
                    }                
                }
                
                this.children.forEach(c => (<ArrayElementDebuggerEntry>c).fetchValueFromArrayAndRender(a));
            }, true);
            
            this.children.forEach(c => (<ArrayElementDebuggerEntry>c).fetchValueFromArrayAndRender(a));
        } 
        
        
        if (a.length != this.oldLength || this.children.length == 0) {
            
            let addAndDisplayChildren = () => {
            }

            if(this.treeViewNode.expandCollapseComponent.state == "expanded"){
                addAndDisplayChildren();
            } else {
            }

        }




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