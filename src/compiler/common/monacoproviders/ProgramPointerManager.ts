import { IMain } from "../IMain"
import { Program } from "../interpreter/Program"
import { Module } from "../module/Module"
import { IRange, Range } from "../range/Range"

export type ProgramPointerPositionInfo = {
    module: Module,
    range: IRange,
    program: Program
}

export type ProgramPointerStyle = {
    key: string,
    isWholeLine: boolean,
    className: string,
    rulerColor: string, // "#6fd61b"
    minimapColor: string, // "#6fd61b"
    beforeContentClassName?: string
}

export class ProgramPointerManager {

    editor: monaco.editor.IStandaloneCodeEditor;

    keyToDecorationsMap: Map<string, monaco.editor.IEditorDecorationsCollection> = new Map();

    constructor(private main: IMain) {
        this.editor = main.getMainEditor();
    }

    show(position: ProgramPointerPositionInfo, style: ProgramPointerStyle) {
        let model = position.module.file.getMonacoModel();
        if(model){
            this.editor.setModel(model);
            this.editor.revealPosition(Range.getStartPosition(position.range));
        }

        let oldDecorations = this.keyToDecorationsMap.get(style.key);
        oldDecorations?.clear();

        let decorationList: monaco.editor.IModelDeltaDecoration[] = [];
        decorationList.push({
            range: position.range,
            options: {
                isWholeLine: style.isWholeLine,
                className: style.className,
                overviewRuler: {
                    color: style.rulerColor,
                    position: monaco.editor.OverviewRulerLane.Center
                },
                minimap: {
                    color: style.minimapColor,
                    position: monaco.editor.MinimapPosition.Inline
                }
            },
        });
        if (style.beforeContentClassName) {
            decorationList.push({
                range: position.range,
                options: { beforeContentClassName: style.beforeContentClassName }
            })
        }

        let decorations = this.editor.createDecorationsCollection(decorationList);
        this.keyToDecorationsMap.set(style.key, decorations);
    }

    hide(key: string) {
        this.keyToDecorationsMap.get(key)?.clear();
        this.keyToDecorationsMap.delete(key);
    }

    hideAll(){
        this.keyToDecorationsMap.forEach((decoration, key) => {decoration?.clear()});
        this.keyToDecorationsMap.clear();
    }

}