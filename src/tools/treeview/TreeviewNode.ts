import { DOM } from "../DOM.ts";
import { ExpandCollapseComponent, ExpandCollapseState } from "./ExpandCollapseComponent.ts";
import { IconButtonComponent, IconButtonListener } from "./IconButtonComponent.ts";
import { NodeContainer } from "./NodeContainer.ts";
import { Treeview } from "./Treeview.ts";

export class TreeviewNode<E> extends NodeContainer<E> {

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

    /* whole line */
    private nodeWithChildrenDiv!: HTMLElement;

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
        private _externalObject: E,
        private _externalReference: any,
        private _parentExternalReference: any) {
        super();
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

    public get externalObject(): E {
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

    public getDepth(): number {
        if (!this.parent) return 0;
        return this.parent.getDepth() + 1;
    }

    buildHtmlScaffolding() {

        this.nodeWithChildrenDiv = DOM.makeDiv(undefined, 'jo_treeviewNodeWithChildren');

        this.parent?.appendHtmlChild(this.nodeWithChildrenDiv);

        this.nodeLineDiv = DOM.makeDiv(this.nodeWithChildrenDiv, 'jo_treeviewNode');
        this.childrenDiv = DOM.makeDiv(this.nodeWithChildrenDiv, 'jo_treeviewChildren');
        this.childrenLineDiv = DOM.makeDiv(this.childrenDiv, 'jo_treeviewChildrenLineDiv');

        this.marginLeftDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_marginLeft');
        this.expandCollapseDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_expandCollapse');
        this.iconDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_icon');
        this.captionDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_caption');
        this.errorsDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_errors');
        this.buttonsDiv = DOM.makeDiv(this.nodeLineDiv, 'jo_treeviewNode_buttons');

        if (this._isFolder) {
            this.expandCollapseComponent =
                new ExpandCollapseComponent(this.expandCollapseDiv, (state: ExpandCollapseState) => {
                    this.toggleChildrenDiv(state);
                }, "expanded")
            this.captionDiv.onpointerup = () => {
                this.expandCollapseComponent.toggleState();
            }
        }

        if (this.treeview.config.withDeleteButtons) {
            this.addIconButton("img_delete", () => {
                // TODO!
            }, "Löschen");
        }

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

        this.adjustLeftMarginToDepth();

        if (this.treeview.config.withDragAndDrop) this.initDragAndDrop();

    }

    initDragAndDrop() {
        this.nodeLineDiv.setAttribute("draggable", "true");
        this.nodeLineDiv.ondragstart = (event) => {
            TreeviewNode.currentlyDraggedNode = this;
            this.treeview.addToSelection(this);
        }



        if (this.isFolder) {
            this.nodeWithChildrenDiv.ondragover = (event) => {
                if (TreeviewNode.currentlyDraggedNode?.parent != this) {
                    event.preventDefault();
                    this.nodeWithChildrenDiv.classList.toggle('jo_treeviewNode_highlightDestinationFolder', true);
                }
            }
            this.nodeWithChildrenDiv.ondragleave = (event) => {
                let bcr = this.nodeWithChildrenDiv.getBoundingClientRect();
                let x = event.pageX;
                let y = event.pageY;
                let d = 3;
                if (x > bcr.right - d || x < bcr.left + d || y < bcr.top + d || y > bcr.bottom - d) {
                    this.nodeWithChildrenDiv.classList.toggle('jo_treeviewNode_highlightDestinationFolder', false);
                }
            }
            this.nodeWithChildrenDiv.ondragend = () => {
                TreeviewNode.currentlyDraggedNode = undefined;
            }
            this.nodeWithChildrenDiv.ondrop = (event) => {
                event.stopPropagation();
                this.nodeWithChildrenDiv.classList.toggle('jo_treeviewNode_highlightDestinationFolder', false);
            }
        } else {
            this.nodeLineDiv.ondragover = (event) => {
                if (this.isDragToReorder() && !this.isFolder) {
                    event.preventDefault();
                    let bcr = this.nodeLineDiv.getBoundingClientRect();
                    let midHeight = bcr.top + bcr.height / 2;
                    let destinationIsparentOfDraggedNode = TreeviewNode.currentlyDraggedNode?.parent == this;
                    this.nodeLineDiv.classList.toggle('jo_treeviewNode_highlightReorderAbove', event.pageY - midHeight < 0 && !destinationIsparentOfDraggedNode);
                    this.nodeLineDiv.classList.toggle('jo_treeviewNode_highlightReorderBelow', event.pageY - midHeight >= 0);
                }
            }

            this.nodeLineDiv.ondragleave = (event) => {
                this.nodeLineDiv.classList.toggle('jo_treeviewNode_highlightReorderAbove', false);
                this.nodeLineDiv.classList.toggle('jo_treeviewNode_highlightReorderBelow', false);
            }
            this.nodeLineDiv.ondragend = (event) => {
                TreeviewNode.currentlyDraggedNode = undefined;
                this.nodeLineDiv.classList.toggle('jo_treeviewNode_highlightReorderAbove', false);
                this.nodeLineDiv.classList.toggle('jo_treeviewNode_highlightReorderBelow', false);
            }
            this.nodeWithChildrenDiv.ondrop = (event) => {
                event.stopPropagation();
                this.nodeLineDiv.classList.toggle('jo_treeviewNode_highlightReorderAbove', false);
                this.nodeLineDiv.classList.toggle('jo_treeviewNode_highlightReorderBelow', false);
            }
        }

    }

    isDragToReorder(): boolean {
        let draggedNodeParent = TreeviewNode.currentlyDraggedNode?.parent;

        return this.treeview.getCurrentlySelectedNodes().length == 1 &&
            (draggedNodeParent == this.parent || draggedNodeParent == this)

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
        let depth = this.getDepth();
        this.childrenLineDiv.style.marginLeft = (7 + depth * 7) + "px";

        this.marginLeftDiv.style.width = 2 + (depth * 7) + "px";

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


}