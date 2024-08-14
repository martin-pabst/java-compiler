export type FileContentChangedListener = (changedfile: CompilerFile) => void;

export class CompilerFile {

    /**
     * filename == "" for test files
     */
    public name: string;

    /**
     * When running tests we don't have monaco as dependency. Therefore 
     * we store text in variable _testfileText in these cases.
     */
    private _testfileText: string = "";
    private monacoModel?: monaco.editor.ITextModel;

    private lastSavedMonacoVersion: number = -1;

    private static uriMap: { [name: string]: number } = {};

    private fileContentChangedListeners: FileContentChangedListener[] = [];

    private editorState: monaco.editor.ICodeEditorViewState | null = null;

    /*
     * monaco editor counts LanguageChangedListeners and issues ugly warnings in console if more than
     * 200, 300, ... are created. Unfortunately it creates one each time a monaco.editor.ITextModel is created.
     * To keep monaco.editor.ITextModel instance count low we instantiate it only when needed and dispose of it
     * when switching to another workspace. Meanwhile we store file text here: 
     */
    private __textWhenMonacoModelAbsent: string = "";
    private storedMonacoModelVersion: number = 0;


    constructor(name?: string, private withMonacoModel?: true) {
        this.name = name || "";
    }

    getText() {
        if (this.withMonacoModel) {
            if (this.monacoModel) {
                return this.monacoModel.getValue(monaco.editor.EndOfLinePreference.LF);
            } else {
                return this.__textWhenMonacoModelAbsent;
            }
        } else {
            return this._testfileText;
        }
    }

    setText(text: string) {
        if (this.withMonacoModel) {
            if (this.monacoModel) {
                this.monacoModel.setValue(text);
            } else {
                this.__textWhenMonacoModelAbsent = text;
            }
        } else {
            this._testfileText = text;
        }

        this.notifyListeners();
    }

    getMonacoModel(): monaco.editor.ITextModel | undefined {
        if(!this.monacoModel){
            this.createMonacolModel();
        } 

        return this.monacoModel;
    }

    disposeMonacoModel(){
        if(this.monacoModel){
            this.storedMonacoModelVersion = this.getMonacoVersion();
            this.__textWhenMonacoModelAbsent = this.monacoModel.getValue();
            this.monacoModel?.dispose();
            this.monacoModel = undefined;
        }
    }

    private createMonacolModel() {
        let path = this.name;

        // a few lines later there's
        // monaco.Uri.from({ path: path, scheme: 'inmemory' });
        // this method throws an exception if path contains '//'
        path = path.replaceAll('//', '_');

        let uriCounter = CompilerFile.uriMap[path];
        if (uriCounter == null) {
            uriCounter = 0;
        } else {
            uriCounter++;
        }
        CompilerFile.uriMap[path] = uriCounter;

        if (uriCounter > 0) path += " (" + uriCounter + ")";
        let uri = monaco.Uri.from({ path: path, scheme: 'inmemory' });
        this.monacoModel = monaco.editor.createModel(this._testfileText, "myJava", uri);
        this.monacoModel.updateOptions({ tabSize: 3, bracketColorizationOptions: { enabled: true, independentColorPoolPerBracketType: false } });

        this.monacoModel.onDidChangeContent(() => { this.notifyListeners() });
    }

    getMonacoVersion(): number {
        if (this.monacoModel) {
            return this.monacoModel.getAlternativeVersionId() + this.storedMonacoModelVersion;
        } else {
            return this.storedMonacoModelVersion;
        }
    }

    isSaved(): boolean {
        return this.lastSavedMonacoVersion == this.getMonacoVersion();
    }

    setSaved(isSaved: boolean) {
        if (isSaved) {
            this.lastSavedMonacoVersion = this.getMonacoVersion();
        } else {
            this.lastSavedMonacoVersion = -1;
        }
    }

    onFileContentChanged(listener: FileContentChangedListener) {
        this.fileContentChangedListeners.push(listener);
    }

    private notifyListeners() {
        for (let listener of this.fileContentChangedListeners) {
            listener(this);
        }
    }

    saveViewState(editor: monaco.editor.IStandaloneCodeEditor) {
        this.editorState = editor.saveViewState();
    }

    restoreViewState(editor: monaco.editor.IStandaloneCodeEditor) {
        if (this.editorState) editor.restoreViewState(this.editorState);
    }
}