import { DOM } from '../DOM.ts';
import { TreeviewAccordion } from './TreeviewAccordion.ts';
import '/include/css/treeview.css';
import '/include/css/icons.css';
import { ExpandCollapseComponent } from './ExpandCollapseComponent.ts';
import { IconButtonComponent, IconButtonListener } from './IconButtonComponent.ts';
import { TreeviewNode } from './TreeviewNode.ts';


export type TreeviewConfig<E> = {
    captionLine: {
        enabled: boolean,
        text: string
    },
    withFolders?: boolean,
    withDeleteButtons?: boolean,
    withDragAndDrop?: boolean,
    comparator?: (externalElement1: E, externalElement2: E) => number
}


export class Treeview<E> {

    private treeviewAccordion?: TreeviewAccordion;

    private nodes: TreeviewNode<E>[] = [];

    private rootNode: TreeviewNode<E>;

    private currentSelection: TreeviewNode<E>[] = [];

    private lastSelectedElement?: TreeviewNode<E>;

    private outerDiv!: HTMLDivElement;

    // div with nodes
    private nodeDiv!: HTMLDivElement;

    // caption
    private captionLineDiv!: HTMLDivElement;
    private captionLineExpandCollapseDiv!: HTMLDivElement;
    private captionLineTextDiv!: HTMLDivElement;
    private captionLineButtonsDiv!: HTMLDivElement;

    captionLineExpandCollapseComponent!: ExpandCollapseComponent;

    config: TreeviewConfig<E>;

    constructor(private parentElement: HTMLElement, config?: TreeviewConfig<E>) {

        let c = config ? config : {};

        this.config = Object.assign(
            {
                captionLine: {
                    enabled: true,
                    text: "Überschrift"
                },
                withFolders: true,
                withDeleteButtons: true,
                withDragAndDrop: true
            }, c);

        this.buildHtmlScaffolding();

        this.rootNode = new TreeviewNode<E>(this, true, 'Root', undefined, null, null, null);
        this.rootNode.render();

    }

    buildHtmlScaffolding() {
        this.outerDiv = DOM.makeDiv(this.parentElement, 'jo_treeview_outer');
        
        this.buildCaption();
        this.nodeDiv = DOM.makeDiv(this.outerDiv, "jo_treeview_nodediv");

        this.buildTreeview();
    }

    getNodeDiv(): HTMLDivElement {
        return this.nodeDiv;
    }

    buildTreeview() {
    }

    buildCaption() {
        this.captionLineDiv = DOM.makeDiv(this.outerDiv, 'jo_treeview_caption');
        this.captionLineExpandCollapseDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treevew_caption_expandcollapse')
        this.captionLineTextDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treeview_caption_text')
        this.captionLineButtonsDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treeview_caption_buttons')
        this.captionLineDiv.style.display = this.config.captionLine.enabled ? "flex" : "none";
        this.captionLineTextDiv.textContent = this.config.captionLine.text;

        this.captionLineExpandCollapseComponent = new ExpandCollapseComponent(this.captionLineExpandCollapseDiv, () => {

        }, "expanded")

        if(this.config.withFolders){
            this.captionLineAddButton("img_add-folder-dark", () => {

            }, "Ordner hinzufügen");
        }

    }

    captionLineAddButton(iconClass: string, callback: IconButtonListener, tooltip?: string): IconButtonComponent {
        return new IconButtonComponent(this.captionLineButtonsDiv, iconClass, callback, tooltip);
    }

    captionLineSetText(text: string) {
        this.captionLineTextDiv.textContent = text;
    }

    addNode(isFolder: boolean, caption: string, iconClass: string | undefined,
        externalElement: E,
        externalReference: any,
        parentExternalReference: any, renderImmediately: boolean = false): TreeviewNode<E> {

        let node = new TreeviewNode(this, isFolder, caption, iconClass,
            externalElement, externalReference, parentExternalReference,);
        this.nodes.push(node);

        if(renderImmediately) node.render();        

        return node;
    }

    renderAll(){
        let renderedExternalReferences: Map<any, boolean> = new Map();

        // the following algorithm ensures that parents are rendered before their children:
        let elementsToRender = this.nodes.slice();
        let done: boolean = false;

        while(!done){
            
            done = true;

            for(let i = 0; i < elementsToRender.length; i++){
                let e = elementsToRender[i];
                if(e.parentExternalReference == null || renderedExternalReferences.get(e.parentExternalReference) != null){
                    e.render();
                    e.findAndCorrectParent();
                    renderedExternalReferences.set(e.externalReference, true);
                    elementsToRender.splice(i, 1);
                    i--;
                    done = false;
                } 
            }
        }

        this.nodes.forEach(node => node.adjustLeftMarginToDepth());

        if(this.config.comparator){
            this.rootNode.sort(this.config.comparator);
        }

    }

    findParent(node: TreeviewNode<E>): TreeviewNode<E> | undefined {
        return node.parentExternalReference == null ? this.rootNode : <TreeviewNode<E> | undefined>this.nodes.find(e => e.externalReference == node.parentExternalReference);
    }

    unfocusAllNodes() {
        this.nodes.forEach(el => el.setFocus(false));
    }

    unselectAllNodes() {
        this.nodes.forEach(el => el.setSelected(false));
        this.currentSelection = [];
    }

    addToSelection(node: TreeviewNode<E>){
        if(this.currentSelection.indexOf(node) < 0) this.currentSelection.push(node);
    }

    setLastSelectedElement(el: TreeviewNode<E>){
        this.lastSelectedElement = el;
    }

    expandSelectionTo(selectedElement: TreeviewNode<E>){
        if(this.lastSelectedElement){
            let list = this.rootNode.getOrderedNodeListRecursively();
            let index1 = list.indexOf(this.lastSelectedElement);
            let index2 = list.indexOf(selectedElement);
            if(index1 >= 0 && index2 >= 0){
                if(index2 < index1){
                    let z = index1;
                    index1 = index2;
                    index2 = z;
                }
                this.unselectAllNodes();
                for(let i = index1; i <= index2; i++){
                    list[i].setSelected(true);
                    this.currentSelection.push(list[i]);
                }
            }
        }
    }

    removeNode(node: TreeviewNode<E>) {
        this.nodes.splice(this.nodes.indexOf(node), 1);
        node.destroy(false);
    }

    getCurrentlySelectedNodes(): TreeviewNode<E>[] {
        return this.currentSelection;
    }

    startStopDragDrop(start: boolean) {
        this.outerDiv.classList.toggle("jo_dragdrop", start);
    }


}