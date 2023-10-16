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
        text: string,

    }
}


export class Treeview<T> {

    treeviewStack?: TreeviewStack;
    mainDiv: HTMLDivElement;
    elements: TreeviewElement<T>[] = [];

    constructor(parent: HTMLElement){

        this.mainDiv = DOM.makeDiv(parent, 'jo_treeview_main');

    }

}