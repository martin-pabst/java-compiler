export class File {

    public filename: string;
    private _text: string = "";
    private monacoModel?: monaco.editor.ITextModel;

    isSaved: boolean = true;

    static uriMap: { [name: string]: number } = {};

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

    getMonacoModel(): monaco.editor.ITextModel | undefined {
        return this.monacoModel;
    }

    createMonacolModel(){
        let path = this.filename;

        // a few lines later there's
        // monaco.Uri.from({ path: path, scheme: 'inmemory' });
        // this method throws an exception if path contains '//'
        path = path.replaceAll('//', '_');   

        let uriCounter = File.uriMap[path];
        if (uriCounter == null) {
            uriCounter = 0;
        } else {
            uriCounter++;
        }
        File.uriMap[path] = uriCounter;

        if (uriCounter > 0) path += " (" + uriCounter + ")";
        let uri = monaco.Uri.from({ path: path, scheme: 'inmemory' });
        this.monacoModel = monaco.editor.createModel(this._text, "myJava", uri);
    }
}