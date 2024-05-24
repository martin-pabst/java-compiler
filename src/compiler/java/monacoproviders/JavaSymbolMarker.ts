import { IMain } from "../../common/IMain.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";

export class JavaSymbolMarker {

    decorations?: monaco.editor.IEditorDecorationsCollection;

    constructor(private editor: monaco.editor.IStandaloneCodeEditor,
        private main: IMain) {

            editor.onDidChangeCursorPosition((event) => {
                this.onDidChangeCursorPosition(event);
            })

        }

    onDidChangeCursorPosition(event: monaco.editor.ICursorPositionChangedEvent) {
        if(this.editor.getModel()?.getLanguageId() != 'myJava') return;

        this.clearDecorations();

        let module = <JavaCompiledModule>this.main.getModuleForMonacoModel(this.editor.getModel());
        if(!module) return;

        let usagePosition = module.findSymbolAtPosition(event.position);

        if(usagePosition == null){
            return;
        }

        let decorations: monaco.editor.IModelDeltaDecoration[] = [];

        let usagePositions = module.getUsagePositionsForSymbol(usagePosition?.symbol);

        if(!usagePositions) return;

        for(let up of usagePositions){
            decorations.push({
                range: up.range,
                options: {
                    inlineClassName: 'jo_revealSyntaxElement', isWholeLine: false, overviewRuler: {
                        color: { id: "editorIndentGuide.background" },
                        darkColor: { id: "editorIndentGuide.activeBackground" },
                        position: monaco.editor.OverviewRulerLane.Left
                    }
                }
            })
        }

        this.decorations = this.editor.createDecorationsCollection(decorations);

    }


    clearDecorations(){
        if(this.decorations){
            this.decorations.clear();
            this.decorations = undefined;
        }
    }

}