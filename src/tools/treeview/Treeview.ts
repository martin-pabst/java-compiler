import { DOM } from '../DOM.ts';
import { TreeviewStack } from './TreeviewStack.ts';
import '/include/css/treeview.css';
import '/include/css/icons.css';
import { TreeviewElement } from './TreeviewElement.ts';


export type TreeviewAction<T> = {
    iconClass: string,
    tooltip: string,
    callback: (element: T) => void
}

export type TreeviewConfig = {
    captionLine: {
        enabled: boolean,
        text: string
    }
}


export class Treeview<T> {

    treeviewStack?: TreeviewStack;
    elements: TreeviewElement<T>[] = [];

    mainDiv!: HTMLDivElement;
    captionLineDiv!: HTMLDivElement;
    captionLineExpandCollapse!: HTMLDivElement;
    captionLineText!: HTMLDivElement;

    config: TreeviewConfig;

    constructor(public parent: HTMLElement, config?: TreeviewConfig) {

        let c = config ? config : {};

        this.config = Object.assign(
            {
                captionLine: {
                    enabled: true,
                    text: "Überschrift"
                }

            }, c);

        this.buildHtmlScaffolding();

    }

    buildHtmlScaffolding() {
        this.mainDiv = DOM.makeDiv(this.parent, 'jo_treeview_main');
        this.captionLineDiv = DOM.makeDiv(this.mainDiv, 'jo_treeview_caption');
        this.captionLineExpandCollapse = DOM.makeDiv(this.captionLineDiv, 'jo_treevew_caption_expandcollapse')
        this.captionLineText = DOM.makeDiv(this.captionLineDiv, 'jo_treevew_caption_text')

        this.buildCaption();
    }

    buildCaption(){
        this.captionLineDiv.style.display = this.config.captionLine.enabled ? "flex" : "none";
        this.captionLineText.textContent = this.config.captionLine.text;
    }

}