import { DOM } from "../DOM.ts";
import { ExpandCollapseComponent, ExpandCollapseState } from "./ExpandCollapseComponent.ts";
import { Treeview } from "./Treeview.ts";

export class TreeviewFileOrFolder<E> {

    /* whole line */
    lineWithChildrenDiv!: HTMLElement;

    lineDiv!: HTMLElement;
    verticalLinesDiv!: HTMLDivElement;
    expandCollapseDiv!: HTMLDivElement;
    captionDiv!: HTMLDivElement;
    errorsDiv!: HTMLDivElement;
    buttonsDiv!: HTMLDivElement;
    expandCollapseComponent!: ExpandCollapseComponent;
    childrenDiv!: HTMLDivElement;

    countOfVerticalLines: number = 0;

    constructor(private _treeview: Treeview<E>, 
        private _isFolder: boolean, private _caption: string, 
        private _iconClass: string, 
        private _externalObject: E, 
        private _parent?: TreeviewFileOrFolder<E>){
        
        let outerDiv = _treeview.treeviewMainDiv;
        if(_parent) outerDiv = _parent.childrenDiv;

        this.buildHtmlScaffolding(outerDiv);

    }

    public get externalObject(): E {
        return this._externalObject;
    }
    public get iconClass(): string {
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
public get parent(): TreeviewFileOrFolder<E> | undefined {
        return this._parent;
    }
    public set parent(value: TreeviewFileOrFolder<E>) {
        this._parent = value;
    }

    public getDepth(): number {
        if(!this.parent) return 0;
        return this.parent.getDepth();
    }

    buildHtmlScaffolding(outerDiv: HTMLDivElement){
        this.lineWithChildrenDiv = DOM.makeDiv(outerDiv, 'jo_treeviewlineWithChildren');

        this.lineDiv = DOM.makeDiv(this.lineWithChildrenDiv, 'jo_treeviewline');
        this.childrenDiv = DOM.makeDiv(this.lineWithChildrenDiv, 'jo_treeviewChildren');

        this.verticalLinesDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_verticallines');
        this.expandCollapseDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_expandCollapse');
        this.captionDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_caption');
        this.errorsDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_errors');
        this.buttonsDiv = DOM.makeDiv(this.lineDiv, 'jo_treeviewline_buttons');

        if(this._isFolder){
            this.expandCollapseComponent = 
            new ExpandCollapseComponent(this.expandCollapseDiv, (state: ExpandCollapseState) => {
                
            })
        }

        this.adjustNubmerOfVerticalLines();

    }

    adjustNubmerOfVerticalLines(){
        let verticalLinesNeeded = this.getDepth();

        while(this.countOfVerticalLines < verticalLinesNeeded){
            DOM.makeDiv(this.verticalLinesDiv, 'jo_treeviewVerticalLine');
            this.countOfVerticalLines++;
        }

        while(this.countOfVerticalLines > verticalLinesNeeded){
            this.verticalLinesDiv.removeChild(this.verticalLinesDiv.firstChild!);
            this.countOfVerticalLines--;
        }
    }


}