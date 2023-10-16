import { Treeview } from './Treeview.ts';
import '/include/css/treeview.css';
import '/include/css/icons.css';

export class TreeviewStack {

    treeviewList: Treeview<Object>[] = [];

    constructor(){
        let tv1:Treeview<HTMLElement> = new Treeview(document.getElementById("x")!)
    }



}