import { Treeview } from '../tools/components/treeview/Treeview.ts';
import { TreeviewAccordion } from '../tools/components/treeview/TreeviewAccordion.ts';
import { TreeviewNode } from '../tools/components/treeview/TreeviewNode.ts';
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

    constructor(){
        let leftDiv = document.getElementById('left')!;

        let accordion = new TreeviewAccordion(leftDiv);

        let tv1: Treeview<Element> = new Treeview(accordion, {
            captionLine: {
                enabled: true,
                text: "Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!"
            },
            withDeleteButtons: true,
            withFolders: true,
            comparator: ((e1, e2) => e1.caption.localeCompare(e2.caption)),
            flexWeight: "2"
        })

        this.initElementsForTreeview(tv1);

        let tv2: Treeview<Element> = new Treeview(accordion, {
            captionLine: {
                enabled: true,
                text: "Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!"
            },
            withDeleteButtons: true,
            withFolders: true,
            comparator: ((e1, e2) => e1.caption.localeCompare(e2.caption)),
            flexWeight: "2"
        })

        this.initElementsForTreeview(tv2);

        let tv3: Treeview<Element> = new Treeview(accordion, {
            captionLine: {
                enabled: true,
                text: "Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!"
            },
            withDeleteButtons: true,
            withFolders: true,
            comparator: ((e1, e2) => e1.caption.localeCompare(e2.caption)),
            flexWeight: "1"
        })

        this.initElementsForTreeview(tv3);

        accordion.switchToPixelHeights();

    }


    initElementsForTreeview(tv1: Treeview<Element>){
        let elements: Element[] = [];

        elements = [
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
        elements.forEach(el => idToElementMap.set(el.id, el));
        elements.forEach(el => {if(el.parentId) el.parent = idToElementMap.get(el.parentId)});

        for(let el of elements){
            let tvLine = tv1.addNode(el.isFolder, el.caption, el.isFolder ? undefined : 'img_file-dark-empty', el, el, el.parent);
            el.treeviewLine = tvLine;
        }

        
        tv1.renameCallback = (element, newName, _node) => {
            element.caption = newName;
            console.log(element.caption + " is renamed to " + newName);
            return true;
        }
        
        tv1.initialRenderAll();
        elements[0].treeviewLine?.setErrors("(10)");

    }



}



window.onload = () => {
    new TreeviewTest();
}