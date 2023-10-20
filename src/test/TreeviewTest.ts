import { Treeview } from '../tools/treeview/Treeview.ts';
import { TreeviewNode } from '../tools/treeview/TreeviewNode.ts';
import '/include/css/treeviewtest.css';

type Element = {
    caption: string,
    isFolder: boolean,
    id: number,
    parentId?: number,
    parent?: Element,
    treeviewLine?: TreeviewNode<Element>
}


export class TreeviewTest {

    elements: Element[] = [];


    constructor(){
        let leftDiv = document.getElementById('left')!;
        let tv: Treeview<Element> = new Treeview(leftDiv, {
            captionLine: {
                enabled: true,
                text: "Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!"
            },
            withDeleteButtons: true,
            withFolders: true,
            comparator: ((e1, e2) => e1.caption.localeCompare(e2.caption))
        })

        this.initElements();

        for(let el of this.elements){
            let tvLine = tv.addNode(el.isFolder, el.caption, el.isFolder ? undefined : 'img_file-dark-empty', el, el, el.parent);
            el.treeviewLine = tvLine;
        }

        tv.renderAll();

    }


    initElements(){
        this.elements = [
            {caption: "First Folder", isFolder: true, id: 10},
            {caption: "ASecond File", isFolder: false, id: 12, parentId: 10},
            {caption: "BFirst File", isFolder: false, id: 11, parentId: 10},
            {caption: "ASecond Folder", isFolder: true, id: 13, parentId: 10},
            {caption: "AThird File", isFolder: false, id: 14, parentId: 10},
            {caption: "BFirst File", isFolder: false, id: 15, parentId: 13},
            {caption: "BSecond File", isFolder: false, id: 16, parentId: 13},
            {caption: "BThird File", isFolder: false, id: 17, parentId: 13},
            {caption: "File0", isFolder: false, id: 18, parentId: undefined},
            {caption: "File1", isFolder: false, id: 19, parentId: undefined},
            {caption: "File2", isFolder: false, id: 20, parentId: undefined},
            {caption: "ZFile0", isFolder: false, id: 21, parentId: undefined},
            {caption: "ZFile1", isFolder: false, id: 22, parentId: undefined},
        ]

        let  idToElementMap: Map<number, Element> = new Map();
        this.elements.forEach(el => idToElementMap.set(el.id, el));
        this.elements.forEach(el => {if(el.parentId) el.parent = idToElementMap.get(el.parentId)});
    }



}



window.onload = () => {
    new TreeviewTest();
}