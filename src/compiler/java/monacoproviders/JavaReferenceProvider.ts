import { IMain } from "../../common/IMain.ts";
import { UsagePosition } from "../../common/UsagePosition.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";

export class JavaReferenceProvider implements monaco.languages.ReferenceProvider {

    constructor(private main: IMain) {
    }

    provideReferences(model: monaco.editor.ITextModel, position: monaco.Position, context: monaco.languages.ReferenceContext, token: monaco.CancellationToken): 
    monaco.languages.ProviderResult<monaco.languages.Location[]> {
        
        let editor = monaco.editor.getEditors().find(e => e.getModel() == model);
        if(!editor) return;

        let usagePosition = this.getUsagePosition(position, editor);

        if(!usagePosition){
            return;
        } 

        let locations: monaco.languages.Location[] = [];

        for(let module of this.main.getCompiler().getAllModules()){
            
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

    getUsagePosition(position: monaco.Position, editor: monaco.editor.ICodeEditor): UsagePosition | undefined {
        if(editor.getModel()?.getLanguageId() != 'myJava') return undefined;

        let module = <JavaCompiledModule>this.main.getCurrentWorkspace()?.getModuleForMonacoModel(editor.getModel());
        if(!module) return;

        return module.compiledSymbolsUsageTracker.findSymbolAtPosition(position);
    }

}