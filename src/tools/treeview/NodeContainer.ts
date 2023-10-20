import { DOM } from "../DOM.ts";
import { TreeviewNode } from "./TreeviewNode.ts";

export class NodeContainer<E> {
    protected children: TreeviewNode<E>[] = [];

    protected childrenDiv!: HTMLDivElement;

    constructor(protected parent?: NodeContainer<E>) {

    }

    public add(child: TreeviewNode<E>) {
        if (this.children.indexOf(child) < 0) {
            this.children.push(child);
        }

        if (this.childrenDiv) {
            if (child.getMainDiv()) {
                this.childrenDiv.appendChild(child.getMainDiv());
            }
        }
    }

    public appendHtmlChild(htmlElement: HTMLElement) {
        if (this.childrenDiv) this.childrenDiv.appendChild(htmlElement);
    }

    public remove(child: TreeviewNode<E>) {
        this.children.splice(this.children.indexOf(child), 1);
    }

    public sort(comparator: (e1: E, e2: E) => number) {
        this.children.sort((node1, node2) => comparator(node1.externalObject, node2.externalObject));
        
        let toRemove: HTMLElement[] = [];
        for(let child of this.childrenDiv.childNodes){
            let hChild: HTMLElement = <HTMLElement> child;
            if(!hChild.classList.contains('jo_treeviewChildrenLineDiv')){
                toRemove.push(hChild);
            }
        }
        toRemove.forEach(c => this.childrenDiv.removeChild(c));

        this.children.forEach(node => {
            this.childrenDiv.appendChild(node.getMainDiv());
            node.sort(comparator);
        }
        );
    }

    public getDepth(): number {
        if (this.parent) return this.parent.getDepth() + 1;
        return 0;
    }

    public getOrderedNodeListRecursively(): TreeviewNode<E>[] {

        let list: TreeviewNode<E>[] = [];

        this.children.forEach(c => {
            list.push(c);
            list = list.concat(c.getOrderedNodeListRecursively())
        })

        return list;

    }
}