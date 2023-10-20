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

        if(this.isFolder){
            this.dropzoneDiv = DOM.makeDiv(this.nodeWithChildrenDiv, this._isFolder ? 'jo_treeviewNode_dropzone': 'jo');
        }

        this.dragAndDropDestinationDiv = DOM.makeDiv(this.nodeWithChildrenDiv, 'jo_treeviewNode_dragAndDropDestinationLine');
        this.dragAndDropDestinationDiv.style.display = "none";

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
        let nodeLineBoundingRect = this.nodeLineDiv.getBoundingClientRect();
        let top = nodeLineBoundingRect.top;

        if (mouseY <= nodeLineBoundingRect.top + nodeLineBoundingRect.height / 2) {
            return { index: -1, insertPosY: nodeLineBoundingRect.top - top };
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

        this.nodeWithChildrenDiv.ondragstart = ()=>{
            setTimeout(() => {
                this.treeview.startStopDragDrop(true);
            }, 100);
        }
        
        this.nodeWithChildrenDiv.ondragend = () => {
            this.treeview.startStopDragDrop(false);
        }

        if (this.isFolder) {
            this.dropzoneDiv.ondragover = (event) => {
                let ddi = this.getDragAndDropIndex(event.pageX, event.pageY);
                if (ddi.index < 0) return; // event bubbles up to parent div's handler

                this.dragAndDropDestinationDiv.style.top = (ddi.insertPosY - 1) + "px";
                this.dragAndDropDestinationDiv.style.display = "block";

                this.nodeWithChildrenDiv.classList.toggle('jo_treeviewNode_highlightDragDropDestination', true);
                event.preventDefault();
                event.stopPropagation();
                this.treeview.dragLeave(event);
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
                if (ddi.index < 0) return; // event bubbles up to parent div's handler
                event.preventDefault();
                event.stopPropagation();

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