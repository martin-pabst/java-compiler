import { IMain } from "../IMain";
import { CompilerFile } from "../module/CompilerFile";
import { ProgramPointerPositionInfo } from "../monacoproviders/ProgramPointerManager";
import { IRange } from "../range/Range";
import { Step } from "./Program";
import { IThrowable } from "./ThrowableType";
import '/include/css/exceptionmarker.css';

export class ExceptionMarker {

    key: string = "ExceptionMarker";

    constructor(private main: IMain){

    }

    markException(exception: IThrowable | {file: CompilerFile, range: IRange | undefined}, step: Step){
        let file = exception.file;
        let range = exception.range;
        let model = file?.getMonacoModel();

        if(!file || !model || !range) return;

        let ppm = this.main.getInterpreter().programPointerManager;
        if(!ppm) return;
        
        this.main.showFile(file);

        let p: ProgramPointerPositionInfo = {
            programOrmoduleOrMonacoModel: model,
            range: range
          }
      
          ppm.show(p, {
            key: this.key,
            isWholeLine: true,
            className: "jo_revealExceptionPosition",
            minimapColor: "#d61bd056",
            rulerColor: "#d61bd056",
            beforeContentClassName: "jo_revealExceptionPositionBefore"
          })

          setTimeout(() => {
            this.main.getDisassembler()?.markException(step);
          }, 1000);

    }

    removeExceptionMarker(){
        this.main.getInterpreter()?.programPointerManager?.hide(this.key);
    }

}