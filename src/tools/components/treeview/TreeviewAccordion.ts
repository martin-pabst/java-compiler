import { Treeview } from './Treeview.ts';
import '/include/css/treeview.css';
import '/include/css/icons.css';
import { DOM } from '../../DOM.ts';
import { ExpandCollapseState } from '../ExpandCollapseComponent.ts';

export class TreeviewAccordion {

    treeviewList: Treeview<any>[] = [];
    splitterList: TreeviewSplitter[] = [];

    private _mainDiv: HTMLDivElement;
    public get mainDiv(): HTMLDivElement {
        return this._mainDiv;
    }
    public set mainDiv(value: HTMLDivElement) {
        this._mainDiv = value;
    }

    constructor(public parentHtmlELement: HTMLElement){
        this._mainDiv = DOM.makeDiv(parentHtmlELement, 'jo_treeviewAccordion_mainDiv');
    }

    addTreeview(treeview: Treeview<any>){
        this.treeviewList.push(treeview);
        this.splitterList.push(new TreeviewSplitter(this, this.treeviewList.length - 1));
        if(this.splitterList.length > 1){
            this.splitterList[this.splitterList.length - 2].enable();
        }
    }

    onExpandCollapseTreeview(tv: Treeview<any>, newState: ExpandCollapseState, deltaHeight: number) {
        let currentIndex = this.treeviewList.indexOf(tv);

        let heightList: number[] = this.treeviewList.map(tv => tv.outerDiv.getBoundingClientRect().height);
        
        switch(newState){
            case "collapsed":  // deltaHeight > 0;
                // who gets the cake?
                for(let i = this.treeviewList.length - 1; i >= 0; i -= 1){
                    if(i == currentIndex) continue;
                    let tv1 = this.treeviewList[i];
                    if(tv1.isCollapsed()) continue;

                    heightList[i] += deltaHeight;
                    tv1.outerDiv.style.height = heightList[i] + "px";
                    break;
                }
                break;
            case "expanded": // deltaHeight < 0
                // who pays the cake?
                for(let i = this.treeviewList.length - 1; i >= 0; i -= 1){
                    if(i == currentIndex) continue;
                    let tv1 = this.treeviewList[i];
                    if(tv1.isCollapsed()) continue;

                    let givenHeight = Math.min(-deltaHeight, heightList[i] - tv1.config.minHeight!);
                    if(givenHeight <= 0) continue;

                    deltaHeight += givenHeight;
                    heightList[i] -= givenHeight;
                    tv1.outerDiv.style.height = heightList[i] + "px";
                    break;
                }
                break;
        }

    }   

    switchToPixelHeights(){
        let heightList: number[] = this.treeviewList.map(tv => tv.outerDiv.getBoundingClientRect().height);
        for(let i = 0; i < this.treeviewList.length; i++){
            let tv = this.treeviewList[i];
            tv.outerDiv.style.flex = "none";
            tv.outerDiv.style.height = heightList[i] + "px";
        }
    }

}

class TreeviewSplitter {
    
    div: HTMLDivElement;
    
    yStart: number | undefined;
    divsStartHeights: number[] = [];

    transparentOverlay: HTMLDivElement | undefined;

    constructor(private accordion: TreeviewAccordion, private treeviewAboveIndex: number){
        this.div = DOM.makeDiv(accordion.mainDiv, 'jo_treeview_splitter');
        this.div.style.display = 'none';
    }

    enable(){
        this.div.style.display = '';
        
        this.div.onpointerdown = (ev) => {
            this.yStart = ev.pageY;
            let treeviewList: Treeview<any>[] = this.accordion.treeviewList;
            
            this.divsStartHeights = [];
            for(let tv of treeviewList){
                let height = tv.outerDiv.getBoundingClientRect().height;
                this.divsStartHeights.push(height);
                tv.outerDiv.style.height = height + "px";
                tv.outerDiv.style.flex = "none";
            }
            
            this.transparentOverlay = DOM.makeDiv(document.body, 'jo_treeview_splitter_overlay');
            
            this.transparentOverlay.onpointermove = (ev) => {
                this.onPointerMove(ev.pageY);
                ev.stopPropagation();
            }
            
            this.transparentOverlay.onmousemove = (ev) => {ev.stopPropagation()};
            
            this.transparentOverlay.onpointerup = () => {
                this.transparentOverlay!.remove();
            }
            
        }
        
    }
    
    onPointerMove(newY: number){
        let dyCursor = newY - this.yStart!;
        let treeviewList: Treeview<any>[] = this.accordion.treeviewList;
        let treeviewBelowIndex = this.treeviewAboveIndex + 1;
        let treeviewBelow = treeviewList[treeviewBelowIndex];

        let targetHeights: number[] = this.divsStartHeights.slice();

        if(this.divsStartHeights[treeviewBelowIndex] - dyCursor < treeviewBelow.config.minHeight!){
            dyCursor = this.divsStartHeights[treeviewBelowIndex] - treeviewBelow.config.minHeight!;
        }

        if(dyCursor > 0){
            targetHeights[treeviewBelowIndex - 1] += dyCursor;
            targetHeights[treeviewBelowIndex] -= dyCursor;
        } else {
            let dyTodo:  number = dyCursor;  // < 0!
            for(let i = this.treeviewAboveIndex; i >= 0; i--){
                let achievable = treeviewList[i].config.minHeight! - targetHeights[i];
                if(achievable <= dyTodo){
                    targetHeights[i] += dyTodo;
                    dyTodo = 0;
                    break;
                } else {
                    dyTodo -= achievable;
                    targetHeights[i] += achievable;
                }
            }
            targetHeights[treeviewBelowIndex] -= dyCursor - dyTodo;
        }

        for(let i = 0; i <= treeviewBelowIndex; i++){
            treeviewList[i].outerDiv.style.height = targetHeights[i] + "px";
        }


    }


}