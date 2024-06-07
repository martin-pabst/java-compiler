import { Error, ErrorLevel } from "../Error.ts";
import { Module } from "../module/Module.ts";

export class ErrorMarker {

    static markErrors(errors: Error[], monacoModel: monaco.editor.IModel) {
        let markers: monaco.editor.IMarkerData[] = errors.map((error) => {
            return {
                startLineNumber: error.range.startLineNumber,
                startColumn: error.range.startColumn,
                endLineNumber: error.range.endLineNumber,
                endColumn: error.range.endColumn,
                message: error.message,
                severity: this.errorLevelToMarkerSeverity(error.level)
            }
        })

        monaco.editor.setModelMarkers(monacoModel, "martin", markers);
    }

    static markErrorsOfModule(module: Module) {

        ErrorMarker.markErrors(module.errors, module.file.getMonacoModel()!);

    }

    static errorLevelToMarkerSeverity(errorlevel: ErrorLevel): monaco.MarkerSeverity {
        switch (errorlevel) {
            case "info": return monaco.MarkerSeverity.Info;
            case "warning": return monaco.MarkerSeverity.Warning;
            case "error": return monaco.MarkerSeverity.Error;
        }
    }

}