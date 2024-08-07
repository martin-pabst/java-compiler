export class File {

    /**
     * filename == "" for test files
     */
    public filename: string;

    /**
     * When running tests we don't have monaco as dependency. Therefore 
     * we store text in variable _testfileText in these cases.
     */
    private _testfileText: string = "";
    private monacoModel?: monaco.editor.ITextModel;

    private lastSavedMonacoVersion: number = -1;

    private static uriMap: { [name: string]: number } = {};

    constructor(filename?: string){
        this.filename = filename || "";
    }

    getText(){
        if(this.monacoModel){
            return this.monacoModel.getValue(monaco.editor.EndOfLinePreference.LF);
        } else {
            return this._testfileText;
        }
    }    

    setText(text: string){
        if(this.monacoModel){
            this.monacoModel.setValue(text);
        } else {
            this._testfileText = text;
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
        this.monacoModel = monaco.editor.createModel(this._testfileText, "myJava", uri);
    }

    getMonacoVersion(): number {
        if(this.monacoModel){
            return this.monacoModel.getAlternativeVersionId();
        } else {
            return -1;
        }
    }

    isSaved(): boolean {
        return this.lastSavedMonacoVersion == this.getMonacoVersion();
    }

    setSaved() {
        this.lastSavedMonacoVersion = this.getMonacoVersion();
    }
}