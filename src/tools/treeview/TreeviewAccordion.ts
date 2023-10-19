import { Treeview } from './Treeview.ts';
import '/include/css/treeview.css';
import '/include/css/icons.css';

export class TreeviewAccordion {

    treeviewList: Treeview<Object>[] = [];

    constructor(public parentHtmlELement: HTMLElement){

    }



}