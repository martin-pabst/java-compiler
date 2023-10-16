import { Treeview } from "./Treeview.ts";

export class TreeviewElement<T> {

    constructor(public treeview: Treeview<T>, public externalObject: T, public caption: string, public isFolder: boolean){

    }

}