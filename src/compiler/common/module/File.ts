export class File {

    private _text: string = "";
    monacoModel?: monaco.editor.ITextModel;


    constructor(){

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