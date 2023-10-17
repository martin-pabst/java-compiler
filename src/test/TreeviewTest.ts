import { Treeview } from '../tools/treeview/Treeview.ts';
import '/include/css/treeviewtest.css';

export class TreeviewTest {

    constructor(){
        let leftDiv = document.getElementById('left')!;
        let tv = new Treeview(leftDiv, {
            captionLine: {
                enabled: true,
                text: "Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!Hier!"
            }
        })

        tv.addButtonToCaptionLine('img_start', () => {}, "Start Program");
        tv.addButtonToCaptionLine('img_start', () => {});
    }

}



window.onload = () => {
    new TreeviewTest();
}