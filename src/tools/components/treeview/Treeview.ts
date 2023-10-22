import { DOM } from '../../DOM.ts';
import { TreeviewAccordion } from './TreeviewAccordion.ts';
import '/include/css/treeview.css';
import '/include/css/icons.css';
import { ExpandCollapseComponent, ExpandCollapseState } from '../ExpandCollapseComponent.ts';
import { IconButtonComponent, IconButtonListener } from '../IconButtonComponent.ts';
import { TreeviewNode } from './TreeviewNode.ts';


export type TreeviewConfig<E> = {
    captionLine: {
        enabled: boolean,
        text: string
    },
    contextMenu?: {
        messageNewNode?: string
    },
    flexWeight?: string,
    withFolders?: boolean,
    withDeleteButtons?: boolean,
    withDragAndDrop?: boolean,
    comparator?: (externalElement1: E, externalElement2: E) => number,
    minHeight?: number,
    
    initialExpandCollapseState?: ExpandCollapseState
}


export type TreeviewContextMenuItem<E> = {
    caption: string;
    color?: string;
    callback: (element: E, node: TreeviewNode<E>) => void;
    subMenu?: TreeviewContextMenuItem<E>[]
}

// Callback functions return true if changes shall be executed on treeview, false if action should get cancelled

export type TreeviewMoveNodesCallback<E> = (movedElements: E[], destinationFolder: E | null, position: { order: number, elementBefore: E | null, elementAfter: E | null }) => boolean;
export type TreeviewRenameCallback<E> = (element: E, newName: string, node: TreeviewNode<E>) => boolean;
export type TreeviewContextMenuProvider<E> = (element: E, node: TreeviewNode<E>) => TreeviewContextMenuItem<E>[];


export class Treeview<E> {

    private treeviewAccordion?: TreeviewAccordion;
    private parentElement: HTMLElement;

    private nodes: TreeviewNode<E>[] = [];

    private rootNode: TreeviewNode<E>;

    private currentSelection: TreeviewNode<E>[] = [];

    private lastSelectedElement?: TreeviewNode<E>;

    private _lastExpandedHeight: number;

    private _outerDiv!: HTMLDivElement;
    get outerDiv():HTMLElement {
        return this._outerDiv;
    }

    // div with nodes
    private _nodeDiv!: HTMLDivElement;
    get nodeDiv():HTMLDivElement {
        return this._nodeDiv;
    }

    // caption
    private captionLineDiv!: HTMLDivElement;
    private captionLineExpandCollapseDiv!: HTMLDivElement;
    private captionLineTextDiv!: HTMLDivElement;
    private captionLineButtonsDiv!: HTMLDivElement;

    captionLineExpandCollapseComponent!: ExpandCollapseComponent;

    config: TreeviewConfig<E>;

    //callbacks
    private _moveNodesCallback?: TreeviewMoveNodesCallback<E>;
    public get moveNodesCallback(): TreeviewMoveNodesCallback<E> | undefined {
        return this._moveNodesCallback;
    }
    public set moveNodesCallback(value: TreeviewMoveNodesCallback<E> | undefined) {
        this._moveNodesCallback = value;
    }

    private _renameCallback?: TreeviewRenameCallback<E> | undefined;
    public get renameCallback(): TreeviewRenameCallback<E> | undefined {
        return this._renameCallback;
    }
    public set renameCallback(value: TreeviewRenameCallback<E> | undefined) {
        this._renameCallback = value;
    }

    private _contextMenuProvider?: TreeviewContextMenuProvider<E> | undefined;
    public get contextMenuProvider(): TreeviewContextMenuProvider<E> | undefined {
        return this._contextMenuProvider;
    }
    public set contextMenuProvider(value: TreeviewContextMenuProvider<E> | undefined) {
        this._contextMenuProvider = value;
    }

    constructor(parent: HTMLElement | TreeviewAccordion, config?: TreeviewConfig<E>) {

        if(parent instanceof TreeviewAccordion){
            this.treeviewAccordion = parent;
            this.parentElement = this.treeviewAccordion.mainDiv;
        } else {
            this.parentElement = parent;
        }

        let c = config ? config : {};

        let standardConfig: TreeviewConfig<E> = {
            captionLine: {
                enabled: true,
                text: "Überschrift"
            },
            withFolders: true,
            withDeleteButtons: true,
            withDragAndDrop: true,
            contextMenu: {
                messageNewNode: "Neues Element anlegen..."
            },
            minHeight: 200,
            initialExpandCollapseState: "expanded"
        }

        this._lastExpandedHeight = config?.minHeight!;
        
        this.config = Object.assign(standardConfig, c);
        
        this.buildHtmlScaffolding();
        
        if(config?.flexWeight) this.setFlexWeight(config.flexWeight);
        
        this.rootNode = new TreeviewNode<E>(this, true, 'Root', undefined, null, null, null);
        this.rootNode.render();
        
        if(this.treeviewAccordion) this.treeviewAccordion.addTreeview(this);

        if(this.config.initialExpandCollapseState == "expanded"){
            this._lastExpandedHeight = this.outerDiv.getBoundingClientRect().height;
        }

    }

    setFlexWeight(flex: string){
        this._outerDiv.style.flexGrow = flex;
        this._outerDiv.style.flexBasis = this.config.minHeight + "px";
    }

    invokeMoveNodesCallback(movedElements: E[], destinationFolder: E | null, position: { order: number, elementBefore: E | null, elementAfter: E | null }): boolean {
        if (this._moveNodesCallback) return this._moveNodesCallback(movedElements, destinationFolder, position);
        return true;
    }

    buildHtmlScaffolding() {
        this._outerDiv = DOM.makeDiv(this.parentElement, 'jo_treeview_outer');

        this.buildCaption();
        this._nodeDiv = DOM.makeDiv(this._outerDiv, "jo_treeview_nodediv", "jo_scrollable");
        if(this.config.initialExpandCollapseState! == "collapsed"){
            this._nodeDiv.style.display = "none";
        }

    }

    getNodeDiv(): HTMLDivElement {
        return this._nodeDiv;
    }

    buildCaption() {
        this.captionLineDiv = DOM.makeDiv(this._outerDiv, 'jo_treeview_caption');
        this.captionLineExpandCollapseDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treevew_caption_expandcollapse')
        this.captionLineTextDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treeview_caption_text')
        this.captionLineButtonsDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treeview_caption_buttons')
        this.captionLineDiv.style.display = this.config.captionLine.enabled ? "flex" : "none";
        this.captionLineTextDiv.textContent = this.config.captionLine.text;

        this.captionLineExpandCollapseComponent = new ExpandCollapseComponent(this.captionLineExpandCollapseDiv, (newState: ExpandCollapseState) => {
            if(this.isCollapsed()){
                this._lastExpandedHeight = this._outerDiv.getBoundingClientRect().height;
                let deltaHeight: number = this._lastExpandedHeight - this.getCaptionHeight();
                this._outerDiv.style.height = this.getCaptionHeight() + "px";
                if(this.treeviewAccordion) this.treeviewAccordion.onExpandCollapseTreeview(this, newState, deltaHeight);
            } else {
                let deltaHeight: number = this.getCaptionHeight() - this._lastExpandedHeight;
                this._outerDiv.style.height = this._lastExpandedHeight + "px";
                if(this.treeviewAccordion) this.treeviewAccordion.onExpandCollapseTreeview(this, newState, deltaHeight);
            }
                
        }, "expanded")

        if (this.config.withFolders) {
            this.captionLineAddIconButton("img_add-folder-dark", () => {

            }, "Ordner hinzufügen");
        }

    }

    captionLineAddIconButton(iconClass: string, callback: IconButtonListener, tooltip?: string): IconButtonComponent {
        return new IconButtonComponent(this.captionLineButtonsDiv, iconClass, callback, tooltip);
    }

    captionLineAddElementToButtonDiv(element: HTMLElement){
        this.captionLineButtonsDiv.prepend(element);
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

        if (renderImmediately) node.render();

        return node;
    }

    public initialRenderAll() {
        let renderedExternalReferences: Map<any, boolean> = new Map();

        // the following algorithm ensures that parents are rendered before their children:
        let elementsToRender = this.nodes.slice();
        let done: boolean = false;

        while (!done) {

            done = true;

            for (let i = 0; i < elementsToRender.length; i++) {
                let e = elementsToRender[i];
                if (e.parentExternalReference == null || renderedExternalReferences.get(e.parentExternalReference) != null) {
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

        if (this.config.comparator) {
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
        this.nodes.forEach(el => {
            el.setSelected(false);
            el.setFocus(false);
        });
        this.currentSelection = [];
    }

    addToSelection(node: TreeviewNode<E>) {
        if (this.currentSelection.indexOf(node) < 0) this.currentSelection.push(node);
    }

    setLastSelectedElement(el: TreeviewNode<E>) {
        this.lastSelectedElement = el;
    }

    getOrderedNodeListRecursively(): TreeviewNode<E>[] {
        return this.rootNode.getOrderedNodeListRecursively();
    }

    expandSelectionTo(selectedElement: TreeviewNode<E>) {
        if (this.lastSelectedElement) {
            let list = this.rootNode.getOrderedNodeListRecursively();
            let index1 = list.indexOf(this.lastSelectedElement);
            let index2 = list.indexOf(selectedElement);
            if (index1 >= 0 && index2 >= 0) {
                if (index2 < index1) {
                    let z = index1;
                    index1 = index2;
                    index2 = z;
                }
                this.unselectAllNodes();
                for (let i = index1; i <= index2; i++) {
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
        this._outerDiv.classList.toggle("jo_dragdrop", start);
    }

    getDragGhost(): HTMLElement {
        let element = document.createElement("div");
        element.classList.add('jo_treeview_drag_ghost');
        element.style.top = "-10000px";
        if (this.currentSelection.length == 1) {
            element.textContent = this.currentSelection[0].caption;
        } else {
            element.textContent = this.currentSelection.length + " Dateien/Ordner";
        }
        document.body.appendChild(element);
        return element;
    }

    removeDragGhost() {
        let ghosts = document.getElementsByClassName('jo_treeview_drag_ghost');
        for (let ghost of ghosts) {
            ghost.remove();
        }
    }

    isSelected(node: TreeviewNode<E>) {
        return this.currentSelection.indexOf(node) >= 0;
    }

    isCollapsed(): boolean {
        return this.captionLineExpandCollapseComponent.state == "collapsed";
    }

    getCaptionHeight(): number {
        return this.captionLineDiv.getBoundingClientRect().height;
    }
}