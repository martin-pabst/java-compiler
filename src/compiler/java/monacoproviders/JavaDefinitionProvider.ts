import { IMain } from "../../common/IMain.ts";
import { Position } from "../../common/range/Position.ts";
import { EmptyRange, Range } from "../../common/range/Range.ts";
import { UsagePosition } from "../../common/UsagePosition.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";

export class JavaDefinitionProvider implements monaco.languages.DefinitionProvider {

    constructor(private main: IMain) {
    }

    count: number = 0;

    provideDefinition(model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Definition> {
        let editor = monaco.editor.getEditors().find(e => e.getModel() == model);
        if(!editor) return;

        let usagePosition = this.getUsagePosition(position, editor);
        
        let targetModel = usagePosition?.symbol.module.file.getMonacoModel();
        let uri = targetModel?.uri;

        if(!uri) return;

        let range = usagePosition?.symbol.identifierRange;
        if(!range) return;

        /**
         * bug in monaco-editor:
         * if model is current model then cursor is set to definition position but view doesn't scroll
         * to cursor, so:
         */
        setTimeout(() => {
            let currentEditorPosition = editor.getPosition();
            if(model == targetModel && currentEditorPosition){
                if(Position.equals(editor.getPosition(), Range.getStartPosition(range))){
                    editor.revealPositionInCenterIfOutsideViewport(currentEditorPosition);
                }

            } 
        }, 200);
        
        return {
            range: usagePosition!.symbol.identifierRange,
            uri: uri
        }
    }



    getUsagePosition(position: monaco.Position, editor: monaco.editor.ICodeEditor): UsagePosition | undefined {

        if(editor.getModel()?.getLanguageId() != 'myJava') return undefined;

        let module = <JavaCompiledModule>this.main.getCurrentWorkspace()?.getModuleForMonacoModel(editor.getModel());
        if(!module) return;

        return module.compiledSymbolsUsageTracker.findSymbolAtPosition(position);
    }

}