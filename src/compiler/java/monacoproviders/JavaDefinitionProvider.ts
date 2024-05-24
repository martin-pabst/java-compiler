import { IMain } from "../../common/IMain.ts";
import { UsagePosition } from "../../common/UsagePosition.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";

export class JavaDefinitionProvider implements monaco.languages.DefinitionProvider {

    constructor(private editor: monaco.editor.IStandaloneCodeEditor,
        private main: IMain) {
    }

    provideDefinition(model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Definition> {
        let usagePosition = this.getUsagePosition(position);
        
        let uri = usagePosition?.symbol.module.file.getMonacoModel()?.uri;

        if(!uri) return;

        return {
            range: usagePosition!.symbol.identifierRange,
            uri: uri
        }
    }



    getUsagePosition(position: monaco.Position): UsagePosition | undefined {
        if(this.editor.getModel()?.getLanguageId() != 'myJava') return undefined;

        let module = <JavaCompiledModule>this.main.getModuleForMonacoModel(this.editor.getModel());
        if(!module) return;

        return module.compiledSymbolsUsageTracker.findSymbolAtPosition(position);
    }

}