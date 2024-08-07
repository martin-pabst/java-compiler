import { IMain } from "../IMain";
import { Range } from "../range/Range";

export class EditorOpenerProvider implements monaco.editor.ICodeEditorOpener {

    constructor(private main: IMain) {
        monaco.editor.registerEditorOpener(this);
    }

    openCodeEditor(source: monaco.editor.ICodeEditor, resource: monaco.Uri, selectionOrPosition?: monaco.IRange | monaco.IPosition): boolean | Promise<boolean> {
        let editor = this.main.getMainEditor();


        let file = this.main.getCurrentWorkspace()?.getFiles().find(file => file.getMonacoModel()?.uri == resource);
        let model = file?.getMonacoModel();

        if (model) {
            editor.setModel(model);
            editor.setPosition(Range.getStartPosition(<monaco.IRange>selectionOrPosition));
            return true;
        }

        return false;

    }

}