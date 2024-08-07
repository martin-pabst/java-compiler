import { CompilerFile } from '../compiler/common/module/CompilerFile.ts';
import { Editor } from '../testgui/editor/Editor.ts';
import '/include/css/tabs.css';

export class TabbedEditorManager {

    headingsDiv: HTMLDivElement;
    editorDiv: HTMLDivElement;

    headingDivs: HTMLDivElement[] = [];

    editor: Editor;

    activeIndex: number = 0;

    constructor(private container: HTMLElement, public files: CompilerFile[]) {
        this.container.classList.add('jo_tabs_container');

        this.headingsDiv = document.createElement('div');
        this.headingsDiv.classList.add('jo_tabs_tabheadings')
        this.container.appendChild(this.headingsDiv);

        this.editorDiv = document.createElement('div');
        this.editorDiv.classList.add('jo_tabs_tabbodies')
        this.container.appendChild(this.editorDiv);

        for (let file of files) {
            let headingDiv = document.createElement('div');
            headingDiv.classList.add('jo_tabs_tabheading');
            headingDiv.textContent = file.filename;

            headingDiv.onclick = (ev: MouseEvent) => {
                this.setActive(<HTMLDivElement>ev.target);
            }

            this.headingDivs.push(headingDiv);
            this.headingsDiv.appendChild(headingDiv);

        }

        this.editor = new Editor(this.editorDiv);

        this.setActive(this.headingDivs[0]);

    }


    setActive(heading: HTMLDivElement) {
        for (let h of this.headingDivs) {
            h.classList.remove('jo_tabs_active');
        }

        heading.classList.add('jo_tabs_active');

        this.activeIndex = this.headingDivs.indexOf(heading);
        let file = this.files[this.activeIndex];

        this.editor.editor.setModel(file.getMonacoModel()!);

    }

    getCurrentlyOpenedFile(): CompilerFile {
        return this.files[this.activeIndex];
    }


}
