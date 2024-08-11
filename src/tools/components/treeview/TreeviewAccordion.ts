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
        window.addEventListener('resize', () => {this.onResize()});
    }

    onResize(){
        let overallHeight = this._mainDiv.getBoundingClientRect().height;
    
        let fixedHeight: number = 0;
        let variableHeight: number = 0;
        for(let tv of this.treeviewList){
            let height = tv.outerDiv.getBoundingClientRect().height;
            if(tv.isCollapsed()){
                fixedHeight += height;
            } else {
                variableHeight += height;
            }
        }

        let factor = (overallHeight - fixedHeight)/variableHeight;
        for(let tv of this.treeviewList){
            if(!tv.isCollapsed()){
                let height = tv.outerDiv.getBoundingClientRect().height * factor;
                tv.outerDiv.style.height = height + "px";
            }
        }
    }

    addTreeview(treeview: Treeview<any>){
        this.treeviewList.push(treeview);
        if(this.treeviewList.length > 1){
            this.splitterList.push(new TreeviewSplitter(this, this.treeviewList.length - 1));
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

    constructor(private accordion: TreeviewAccordion, private treeviewBelowIndex: number){
        let parentDiv = accordion.treeviewList[treeviewBelowIndex].outerDiv;
        this.div = DOM.makeDiv(parentDiv, 'jo_treeview_splitter');
        this.div.style.display = 'none';
        this.enable();
    }

    enable(){
        this.div.style.display = '';
        
        this.div.onpointerdown = (ev) => {
            
            this.div.style.backgroundColor = '#800000';

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
            this.transparentOverlay.style.cursor = 'ns-resize';
            
            this.transparentOverlay!.onpointermove = (ev) => {
                this.onPointerMove(ev.pageY);
                ev.stopPropagation();
            }
            
            this.transparentOverlay!.onmousemove = (ev) => {ev.stopPropagation()};
            
            this.transparentOverlay!.onpointerup = () => {
                this.transparentOverlay!.remove();
                this.div.style.backgroundColor = '';
            }
            
        }
        
    }
    
    onPointerMove(newY: number){
        let dyCursor = newY - this.yStart!;
        let treeviewList: Treeview<any>[] = this.accordion.treeviewList;
        let treeviewBelow = treeviewList[this.treeviewBelowIndex];

        let targetHeights: number[] = this.divsStartHeights.slice();

        if(this.divsStartHeights[this.treeviewBelowIndex] - dyCursor < treeviewBelow.config.minHeight!){
            dyCursor = this.divsStartHeights[this.treeviewBelowIndex] - treeviewBelow.config.minHeight!;
        }

        if(dyCursor > 0){
            targetHeights[this.treeviewBelowIndex - 1] += dyCursor;
            targetHeights[this.treeviewBelowIndex] -= dyCursor;
        } else {
            let dyTodo:  number = dyCursor;  // < 0!
            for(let i = this.treeviewBelowIndex - 1; i >= 0; i--){
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
            targetHeights[this.treeviewBelowIndex] -= dyCursor - dyTodo;
        }

        for(let i = 0; i <= this.treeviewBelowIndex; i++){
            treeviewList[i].outerDiv.style.height = targetHeights[i] + "px";
        }


    }


}