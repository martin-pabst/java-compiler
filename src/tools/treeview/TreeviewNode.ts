import { DOM } from "../DOM.ts";
import { ExpandCollapseComponent, ExpandCollapseState } from "./ExpandCollapseComponent.ts";
import { IconButtonComponent, IconButtonListener } from "./IconButtonComponent.ts";
import { Treeview } from "./Treeview.ts";

export class TreeviewNode<E> {

    private _hasFocus: boolean = false;

    public get hasFocus(): boolean {
        return this._hasFocus;
    }
    public setFocus(value: boolean) {
        if (value) this.treeview.unfocusAllNodes();
        this._hasFocus = value;
        this.nodeLineDiv.classList.toggle('jo_treeview_focus', value);
    }

    private _isSelected: boolean = false;
    public get isSelected(): boolean {
        return this._isSelected;
    }
    public setSelected(value: boolean) {
        this._isSelected = value;
        this.nodeLineDiv.classList.toggle('jo_treeview_selected', value);
    }


    protected children: TreeviewNode<E>[] = [];

    private parent?: TreeviewNode<E>;

    protected childrenDiv!: HTMLDivElement;

    /* whole line */
    private nodeWithChildrenDiv!: HTMLElement;

    private dragAndDropDestinationDiv!: HTMLElement;
    private dropzoneDiv!: HTMLElement;


    private nodeLineDiv!: HTMLElement;
    private marginLeftDiv!: HTMLDivElement;
    private expandCollapseDiv!: HTMLDivElement;
    private iconDiv!: HTMLDivElement;
    private captionDiv!: HTMLDivElement;
    private errorsDiv!: HTMLDivElement;
    private buttonsDiv!: HTMLDivElement;
    private expandCollapseComponent!: ExpandCollapseComponent;
    private childrenLineDiv!: HTMLDivElement;

    private currentCountOfVerticalLines: number = 0;
    private currentIconClass?: string;
    private static currentlyDraggedNode?: TreeviewNode<any>;

    constructor(private _treeview: Treeview<E>,
        private _isFolder: boolean, private _caption: string,
        private _iconClass: string | undefined,
        private _externalObject: E | null,
        private _externalReference: any,
        private _parentExternalReference: any) {
    }

    findAndCorrectParent() {
        let parent = this.treeview.findParent(this);
        if (this.parent != parent) {
            this.parent?.remove(this);
            this.parent = parent;
            parent?.add(this);
        }
    }

    getMainDiv(): HTMLElement {
        return this.nodeWithChildrenDiv;
    }

    render() {
        if (!this.nodeWithChildrenDiv) {
            this.buildHtmlScaffolding();
        }

        if (this.isRootNode()) return;

        this.captionDiv.textContent = this.caption;

        // adjust icon
        if (this.currentIconClass != this.iconClass) {
            if (this.currentIconClass) this.iconDiv.classList.remove(this.currentIconClass);
            if (this.iconClass) this.iconDiv.classList.add(this.iconClass);
            this.currentIconClass = this.iconClass;
        }

        this.adjustLeftMarginToDepth();

    }

    public get parentExternalReference(): any {
        return this._parentExternalReference;
    }
    public set parentExternalReference(value: any) {
        this._parentExternalReference = value;
    }
    public get externalReference(): any {
        return this._externalReference;
    }
    public set externalReference(value: any) {
        this._externalReference = value;
    }

    public get externalObject(): E | null {
        return this._externalObject;
    }
    public get iconClass(): string | undefined {
        return this._iconClass;
    }
    public set iconClass(value: string) {
        this._iconClass = value;
    }
    public get caption(): string {
        return this._caption;
    }
    public set caption(value: string) {
        this._caption = value;
    }
    public get isFolder(): boolean {
        return this._isFolder;
    }
    public set isFolder(value: boolean) {
        this._isFolder = value;
    }
    public get treeview(): Treeview<E> {
        return this._treeview;
    }
    public set treeview(value: Treeview<E>) {
        this._treeview = value;
    }

    isRootNode(): boolean {
        return this.externalObject == null;
    }

    buildHtmlScaffolding() {

        this.nodeWithChildrenDiv = DOM.makeDiv(undefined, 'jo_treeviewNodeWithChildren');

        if (this.isRootNode()) {
            this.treeview.getNodeDiv().appendChild(this.nodeWithChildrenDiv);
        } else {
            this.parent?.appendHtmlChild(this.nodeWithChildrenDiv);
        }


        if (this.isFolder) {
            this.dropzoneDiv = DOM.makeDiv(this.nodeWithChildrenDiv, this._isFolder ? 'jo_treeviewNode_dropzone' : 'jo');
        }

        this.dragAndDropDestinationDiv = DOM.makeDiv(this.nodeWithChildrenDiv, 'jo_treeviewNode_dragAndDropDestinationLine');
        this.dragAndDropDestinationDiv.style.display = "none";

        if (!this.isRootNode()) {
            this.nodeLineDiv = DOM.makeDiv(this.nodeWithChildrenDiv, 'jo_treeviewNode');
            this.marginLeftDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_marginLeft');
            this.expandCollapseDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_expandCollapse');
            this.iconDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_icon');
            this.captionDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_caption');
            this.errorsDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_errors');
            this.buttonsDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_buttons');

            this.nodeLineDiv.onpointerup = (ev) => {
                ev.stopPropagation();
                if (!ev.shiftKey && !ev.ctrlKey) {
                    this.treeview.unselectAllNodes();
                }

                if (ev.shiftKey) {
                    this.treeview.expandSelectionTo(this);
                } else {
                    this.treeview.setLastSelectedElement(this);
                }


                this.setSelected(true);
                this.treeview.addToSelection(this);
                this.setFocus(true);
            }

        }

        this.childrenDiv = DOM.makeDiv(this.nodeWithChildrenDiv, 'jo_treeviewChildren');
        this.childrenLineDiv = DOM.makeDiv(this.childrenDiv, 'jo_treeviewChildrenLineDiv');

        if (this._isFolder) {
            this.expandCollapseComponent =
                new ExpandCollapseComponent(this.expandCollapseDiv, (state: ExpandCollapseState) => {
                    this.toggleChildrenDiv(state);
                }, "expanded")
            if (!this.isRootNode()) {
                this.captionDiv.onpointerup = () => {
                    this.expandCollapseComponent.toggleState();
                }
            }
        }

        if (this.treeview.config.withDeleteButtons && !this.isRootNode()) {
            this.addIconButton("img_delete", () => {
                // TODO!
            }, "Löschen");
        }

        this.adjustLeftMarginToDepth();

        if (this.treeview.config.withDragAndDrop) this.initDragAndDrop();

    }

    /**
     * Return
     *  -1 if mouse cursor is above mid-line of caption
     *  0 if insert-position is between caption and first child
     *  1 if insert-position is between first child and second child
     *  ...
     * @param mouseX 
     * @param mouseY 
     */
    getDragAndDropIndex(mouseX: number, mouseY: number): { index: number, insertPosY: number } {
        let boundingRect = this.nodeWithChildrenDiv.getBoundingClientRect();
        let top = boundingRect.top;

        if (!this.isRootNode()) {
            let nodeLineRect = this.nodeLineDiv.getBoundingClientRect();
            if (mouseY <= nodeLineRect.top + nodeLineRect.height / 2) {
                return { index: -1, insertPosY: nodeLineRect.top - top };
            }
        }


        for (let i = 0; i < this.children.length; i++) {
            let tvn = <TreeviewNode<E>>this.children[i];
            let boundingRect = tvn.nodeLineDiv.getBoundingClientRect();
            if (mouseY < boundingRect.top + boundingRect.height / 2)
                return { index: i, insertPosY: boundingRect.top - top };
        }

        return { index: this.children.length, insertPosY: this.nodeWithChildrenDiv.getBoundingClientRect().bottom - top }
    }


    initDragAndDrop() {
        this.nodeWithChildrenDiv.setAttribute("draggable", "true");

        this.nodeWithChildrenDiv.ondragstart = (event) => {

            if (!this.treeview.isSelected(this)) {
                this.treeview.unselectAllNodes();
                this.treeview.addToSelection(this);
                this.setFocus(true);
            }


            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "move";
                event.dataTransfer.setDragImage(this.treeview.getDragGhost(), -10, 10);
            }

            event.stopPropagation();
            setTimeout(() => {
                this.treeview.startStopDragDrop(true);
            }, 100);
        }

        this.nodeWithChildrenDiv.ondragend = () => {

            this.treeview.startStopDragDrop(false);
            this.treeview.removeDragGhost();
        }

        if (this.isFolder) {
            this.dropzoneDiv.ondragover = (event) => {
                let ddi = this.getDragAndDropIndex(event.pageX, event.pageY);
                if (ddi.index < 0) {
                    if (this.parent?.dropzoneDiv.ondragover) {
                        this.parent.dropzoneDiv.ondragover(event);
                        this.dropzoneDiv.ondragleave!(event);
                    }
                    return; // event bubbles up to parent div's handler
                }

                if (this.parent?.dropzoneDiv.ondragleave) {
                    this.parent.dropzoneDiv.ondragleave(event);
                }

                this.dragAndDropDestinationDiv.style.top = (ddi.insertPosY - 1) + "px";
                this.dragAndDropDestinationDiv.style.display = "block";

                this.nodeWithChildrenDiv.classList.toggle('jo_treeviewNode_highlightDragDropDestination', true);
                event.preventDefault();
                event.stopPropagation();
            }

            this.dropzoneDiv.ondragleave = (event) => {
                if ((<HTMLElement>event.target).classList.contains("jo_treeviewNode_caption")) {
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
                this.dragAndDropDestinationDiv.style.display = "none";

                this.nodeWithChildrenDiv.classList.toggle('jo_treeviewNode_highlightDragDropDestination', false);
                event.preventDefault();
                event.stopPropagation();

            }

            this.dropzoneDiv.ondrop = (event) => {
                this.dragAndDropDestinationDiv.style.display = "none";

                this.nodeWithChildrenDiv.classList.toggle('jo_treeviewNode_highlightDragDropDestination', false);
                let ddi = this.getDragAndDropIndex(event.pageX, event.pageY);
                if (ddi.index < 0) {
                    if (this.parent?.dropzoneDiv?.ondrop) {
                        this.parent.dropzoneDiv.ondrop(event);
                        return;
                    }
                }
                event.preventDefault();
                event.stopPropagation();

                console.log("OnDrop: " + this.caption + ", pos: " + ddi.index);

                let movedElements: E[] = this.treeview.getCurrentlySelectedNodes().map(n => n.externalObject!);
                let folder: E | null = this.externalObject;
                let elementBefore: E | null = ddi.index > 0 ? this.children[ddi.index - 1].externalObject : null;
                let elementAfter: E | null = ddi.index < this.children.length ? this.children[ddi.index].externalObject : null;

                if (this.treeview.invokeMoveNodesCallback(movedElements, folder, { order: ddi.index, elementBefore: elementBefore, elementAfter: elementAfter })) {

                    // iterate over selected nodes in order from top to bottom of tree:
                    for (let node of this.treeview.getOrderedNodeListRecursively()) {
                        if (this.treeview.getCurrentlySelectedNodes().indexOf(node) >= 0) {
                            node.parent?.children.splice(node.parent.children.indexOf(node), 1);
                            node.parent = this;
                            this.children.splice(ddi.index++, 0, node);
                        }
                    }
                    
                    DOM.clearAllButGivenClasses(this.childrenDiv, 'jo_treeviewChildrenLineDiv');

                    this.children.forEach(c => {
                        this.childrenDiv.appendChild(c.nodeWithChildrenDiv);
                        c.adjustLeftMarginToDepth();
                    });
                }

            }

        }



    }

    higlightReoderPosition(isAbove: boolean, doHighlight: boolean) {
        let klassEnable = 'jo_treeviewNode_highlightReorder' + (isAbove ? 'Above' : 'Below');
        let klassDisable = 'jo_treeviewNode_highlightReorder' + (!isAbove ? 'Above' : 'Below');
        this.nodeLineDiv.classList.toggle(klassEnable, doHighlight);
        this.nodeLineDiv.classList.toggle(klassDisable, false);
    }


    toggleChildrenDiv(state: ExpandCollapseState) {
        switch (state) {
            case "collapsed":
                this.childrenDiv.style.display = "none";
                break;
            case "expanded":
                this.childrenDiv.style.display = "flex";
                break;
        }
    }

    adjustLeftMarginToDepth() {
        if (this.isRootNode()) {
            this.childrenLineDiv.style.marginLeft = "0";
        } else {
            let depth = this.getDepth();
            this.childrenLineDiv.style.marginLeft = (7 + depth * 7) + "px";

            this.marginLeftDiv.style.width = 2 + (depth * 7) + "px";
        }
    }

    setErrors(errors: string) {
        this.errorsDiv.textContent = errors;
    }

    addIconButton(iconClass: string, listener: IconButtonListener, tooltip?: string): IconButtonComponent {
        let button = new IconButtonComponent(this.buttonsDiv, iconClass, listener, tooltip);
        return button;
    }

    destroy(removeFromTreeviewNodeList: boolean = true) {
        this.parent?.remove(this);
        this.nodeWithChildrenDiv.remove();
        if (removeFromTreeviewNodeList) this.treeview.removeNode(this);
    }

    public add(child: TreeviewNode<E>) {
        if (this.children.indexOf(child) < 0) {
            this.children.push(child);
        }

        if (this.childrenDiv) {
            if (child.getMainDiv()) {
                this.childrenDiv.appendChild(child.getMainDiv());
            }
        }
    }

    public appendHtmlChild(htmlElement: HTMLElement) {
        if (this.childrenDiv) this.childrenDiv.appendChild(htmlElement);
    }

    public remove(child: TreeviewNode<E>) {
        this.children.splice(this.children.indexOf(child), 1);
    }

    public sort(comparator: (e1: E, e2: E) => number) {
        this.children.sort((node1, node2) => comparator(node1.externalObject!, node2.externalObject!));

        let toRemove: HTMLElement[] = [];
        for (let child of this.childrenDiv.childNodes) {
            let hChild: HTMLElement = <HTMLElement>child;
            if (!hChild.classList.contains('jo_treeviewChildrenLineDiv')) {
                toRemove.push(hChild);
            }
        }
        toRemove.forEach(c => this.childrenDiv.removeChild(c));

        this.children.forEach(node => {
            this.childrenDiv.appendChild(node.getMainDiv());
            node.sort(comparator);
        }
        );
    }

    public getDepth(): number {
        if (this.parent) return this.parent.getDepth() + 1;
        return 0;
    }

    public getOrderedNodeListRecursively(): TreeviewNode<E>[] {

        let list: TreeviewNode<E>[] = [];

        this.children.forEach(c => {
            list.push(c);
            list = list.concat(c.getOrderedNodeListRecursively())
        })

        return list;

    }

}