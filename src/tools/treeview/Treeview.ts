import { DOM } from '../DOM.ts';
import { TreeviewStack } from './TreeviewStack.ts';
import '/include/css/treeview.css';
import '/include/css/icons.css';
import { TreeviewElement } from './TreeviewElement.ts';
import { ExpandCollapseComponent } from './ExpandCollapseComponent.ts';
import { IconButtonComponent, IconButtonListener } from './IconButtonComponent.ts';


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
    captionLineExpandCollapseDiv!: HTMLDivElement;
    captionLineTextDiv!: HTMLDivElement;
    captionLineButtonsDiv!: HTMLDivElement;
    

    captionLineExpandCollapseComponent!: ExpandCollapseComponent;

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
        this.captionLineExpandCollapseDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treevew_caption_expandcollapse')
        this.captionLineTextDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treeview_caption_text')
        this.captionLineButtonsDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treeview_caption_buttons')

        this.captionLineExpandCollapseComponent = new ExpandCollapseComponent(this.captionLineExpandCollapseDiv, () => {
            
        })

        this.buildCaption();
    }

    buildCaption(){
        this.captionLineDiv.style.display = this.config.captionLine.enabled ? "flex" : "none";
        this.captionLineTextDiv.textContent = this.config.captionLine.text;
    }

    addButtonToCaptionLine(iconClass: string, callback: IconButtonListener, tooltip: string): IconButtonComponent {
        return new IconButtonComponent(this.captionLineButtonsDiv, iconClass, callback, tooltip);
    }

}