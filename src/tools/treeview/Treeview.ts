import { DOM } from '../DOM.ts';
import { TreeviewAccordion } from './TreeviewAccordion.ts';
import '/include/css/treeview.css';
import '/include/css/icons.css';
import { ExpandCollapseComponent } from './ExpandCollapseComponent.ts';
import { IconButtonComponent, IconButtonListener } from './IconButtonComponent.ts';
import { TreeviewFileOrFolder } from './TreeviewFileOrFolder.ts';


export type TreeviewConfig = {
    captionLine: {
        enabled: boolean,
        text: string
    },
    withFolders: boolean,
    withDeleteButtons: boolean
}


export class Treeview<E> {

    private treeviewAccordion?: TreeviewAccordion;
    private elements: TreeviewFileOrFolder<E>[] = [];

    private outerDiv!: HTMLDivElement;

    // caption
    private captionLineDiv!: HTMLDivElement;
    private captionLineExpandCollapseDiv!: HTMLDivElement;
    private captionLineTextDiv!: HTMLDivElement;
    private captionLineButtonsDiv!: HTMLDivElement;

    // treeview
    private _treeviewMainDiv!: HTMLDivElement;

    captionLineExpandCollapseComponent!: ExpandCollapseComponent;

    config: TreeviewConfig;

    constructor(public parent: HTMLElement, config?: TreeviewConfig) {

        let c = config ? config : {};

        this.config = Object.assign(
            {
                captionLine: {
                    enabled: true,
                    text: "Überschrift"
                },
                withFolders: true,
                withDeleteButtons: true
            }, c);

        this.buildHtmlScaffolding();

    }

    buildHtmlScaffolding() {
        this.outerDiv = DOM.makeDiv(this.parent, 'jo_treeview_outer');

        this.buildCaption();
        this.buildTreeview();

    }

    buildTreeview() {
        this._treeviewMainDiv = DOM.makeDiv(this.outerDiv, 'jo_treeview_main');
    }

    buildCaption() {
        this.captionLineDiv = DOM.makeDiv(this.outerDiv, 'jo_treeview_caption');
        this.captionLineExpandCollapseDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treevew_caption_expandcollapse')
        this.captionLineTextDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treeview_caption_text')
        this.captionLineButtonsDiv = DOM.makeDiv(this.captionLineDiv, 'jo_treeview_caption_buttons')
        this.captionLineDiv.style.display = this.config.captionLine.enabled ? "flex" : "none";
        this.captionLineTextDiv.textContent = this.config.captionLine.text;

        this.captionLineExpandCollapseComponent = new ExpandCollapseComponent(this.captionLineExpandCollapseDiv, () => {

        })

        if(this.config.withFolders){
            this.captionLineAddButton("img_add-folder-dark", () => {

            }, "Ordner hinzufügen");
        }

    }

    captionLineAddButton(iconClass: string, callback: IconButtonListener, tooltip?: string): IconButtonComponent {
        return new IconButtonComponent(this.captionLineButtonsDiv, iconClass, callback, tooltip);
    }

    captionLineSetText(text: string) {
        this.captionLineTextDiv.textContent = text;
    }

    addFileOrFolder(isFolder: boolean, caption: string, iconClass: string | undefined,
        externalObject: E,
        externalReference: any,
        parentExternalReference: any, renderImmediately: boolean = false) {

        let element = new TreeviewFileOrFolder(this, isFolder, caption, iconClass,
            externalObject, externalReference, parentExternalReference,);
        this.elements.push(element);

        if(renderImmediately) element.render();        

    }

    renderAll(){
        let renderedExternalReferences: Map<any, boolean> = new Map();

        // the following algorithm ensures that parents are rendered before their children:
        let elementsToRender = this.elements.slice();
        let done: boolean = false;

        while(!done){
            
            done = true;

            for(let i = 0; i < elementsToRender.length; i++){
                let e = elementsToRender[i];
                if(e.parentExternalReference == null || renderedExternalReferences.get(e.parentExternalReference) != null){
                    e.render();
                    renderedExternalReferences.set(e.externalReference, true);
                    elementsToRender.splice(i, 1);
                    i--;
                    done = false;
                } 
            }
        }

    }

    public get treeviewMainDiv(): HTMLDivElement {
        return this._treeviewMainDiv;
    }

    findParent(fileOrFolder: TreeviewFileOrFolder<E>){
        return this.elements.find(e => e.externalReference == fileOrFolder.parentExternalReference);
    }

}