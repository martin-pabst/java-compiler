import { IMain } from "../../common/IMain.ts";
import { UsagePosition } from "../../common/UsagePosition.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";

export class JavaReferenceProvider implements monaco.languages.ReferenceProvider {

    constructor(private editor: monaco.editor.IStandaloneCodeEditor,
        private main: IMain) {
    }

    provideReferences(model: monaco.editor.ITextModel, position: monaco.Position, context: monaco.languages.ReferenceContext, token: monaco.CancellationToken): 
    monaco.languages.ProviderResult<monaco.languages.Location[]> {
        
        let usagePosition = this.getUsagePosition(position);

        if(!usagePosition){
            return;
        } 

        let locations: monaco.languages.Location[] = [];

        for(let module of this.main.getAllModules()){
            
            let allUsagePositions = (<JavaCompiledModule>module).getUsagePositionsForSymbol(usagePosition?.symbol);
    
            if(!allUsagePositions) continue;
    
    
            for(let up of allUsagePositions){
                if(!up.file.getMonacoModel()?.uri) continue;
                locations.push({
                    range: up.range,
                    uri: up.file.getMonacoModel()?.uri!
                })
            }
        }

        return locations;

    }

    getUsagePosition(position: monaco.Position): UsagePosition | undefined {
        if(this.editor.getModel()?.getLanguageId() != 'myJava') return undefined;

        let module = <JavaCompiledModule>this.main.getModuleForMonacoModel(this.editor.getModel());
        if(!module) return;

        return module.compiledSymbolsUsageTracker.findSymbolAtPosition(position);
    }

}