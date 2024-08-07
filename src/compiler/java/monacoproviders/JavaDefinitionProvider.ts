import { IMain } from "../../common/IMain.ts";
import { UsagePosition } from "../../common/UsagePosition.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";

export class JavaDefinitionProvider implements monaco.languages.DefinitionProvider {

    constructor(private main: IMain) {
    }

    provideDefinition(model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Definition> {
        let editor = monaco.editor.getEditors().find(e => e.getModel() == model);
        if(!editor) return;

        let usagePosition = this.getUsagePosition(position, editor);
        
        let uri = usagePosition?.symbol.module.file.getMonacoModel()?.uri;

        if(!uri) return;

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