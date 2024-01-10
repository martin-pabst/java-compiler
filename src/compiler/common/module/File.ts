export class File {

    public filename: string;
    private _text: string = "";
    monacoModel?: monaco.editor.ITextModel;


    constructor(filename?: string){
        this.filename = filename || "";
    }

    getText(){
        if(this.monacoModel){
            this._text = this.monacoModel.getValue(monaco.editor.EndOfLinePreference.LF);
        }

        return this._text;
    }    

    setText(text: string){
        this._text = text;
        if(this.monacoModel){
            this.monacoModel.setValue(text);
        }
    }

}