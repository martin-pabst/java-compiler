import { Treeview } from '../tools/treeview/Treeview.ts';
import '/include/css/treeviewtest.css';

export class TreeviewTest {

    constructor(){
        let leftDiv = document.getElementById('left')!;
        let tv = new Treeview(leftDiv, {
            captionLine: {
                enabled: true,
                text: "Hier!"
            }
        })
    }

}



window.onload = () => {
    new TreeviewTest();
}