import { DOM } from "../DOM.ts";
import { ExpandCollapseComponent, ExpandCollapseState } from "./ExpandCollapseComponent.ts";
import { Treeview } from "./Treeview.ts";

export class TreeviewFileOrFolder<E> {

    private parent?: TreeviewFileOrFolder<E>;

    /* whole line */
    lineWithChildrenDiv!: HTMLElement;

    lineDiv!: HTMLElement;
    marginLeftDiv!: HTMLDivElement;
    expandCollapseDiv!: HTMLDivElement;
    iconDiv!: HTMLDivElement;
    captionDiv!: HTMLDivElement;
    errorsDiv!: HTMLDivElement;
    buttonsDiv!: HTMLDivElement;
    expandCollapseComponent!: ExpandCollapseComponent;
    childrenDiv!: HTMLDivElement;
    childrenLineDiv!: HTMLDivElement;

    currentCountOfVerticalLines: number = 0;
    currentIconClass?: string;

    constructor(private _treeview: Treeview<E>,
        private _isFolder: boolean, private _caption: string,
        private _iconClass: string | undefined,
        private _externalObject: E,
        private _externalReference: any,
        private _parentExternalReference: any) {

    }

    findAndCorrectParent(){
        let parent = this.treeview.findParent(this);
        if(this.parent != parent){
            this.parent = parent;
            if(this.lineWithChildrenDiv){
                this.parent?.childrenDiv.appendChild(this.lineWithChildrenDiv);
            }
        }
    }

    render() {
        if (!this.lineWithChildrenDiv){
            this.buildHtmlScaffolding();
        } else {
            this.findAndCorrectParent();
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

        this.findAndCorrectParent();

        let outerDiv = this._treeview.treeviewMainDiv;
        if (this.parent) outerDiv = this.parent.childrenDiv;

        this.lineWithChildrenDiv = DOM.makeDiv(outerDiv, 'jo_treeviewlineWithChildren');

        this.lineDiv = DOM.makeDiv(this.lineWithChildrenDiv, 'jo_treeviewline');
        this.childrenDiv = DOM.makeDiv(this.lineWithChildrenDiv, 'jo_treeviewChildren');
        this.childrenLineDiv = DOM.makeDiv(this.childrenDiv, 'jo_treeviewChildrenLineDiv');

        this.marginLeftDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_marginLeft');
        this.expandCollapseDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_expandCollapse');
        this.iconDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_icon');
        this.captionDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_caption');
        this.errorsDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_errors');
        this.buttonsDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_buttons');

        if (this._isFolder) {
            this.expandCollapseComponent =
                new ExpandCollapseComponent(this.expandCollapseDiv, (state: ExpandCollapseState) => {
                    this.toggleChildrenDiv(state);
                })
        }

        this.adjustLeftMarginToDepth();

    }
    
    toggleChildrenDiv(state: string) {
        throw new Error("Method not implemented.");
    }

    adjustLeftMarginToDepth() {
        let depth = this.getDepth();
        this.childrenLineDiv.style.marginLeft = (7 + depth * 7) + "px";
        
        this.marginLeftDiv.style.width = 2 + (depth * 7) + "px";

    }


}