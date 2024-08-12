import { IMain } from "../IMain";
import { ProgramPointerPositionInfo } from "../monacoproviders/ProgramPointerManager";
import { Exception } from "./ExceptionInfo";
import { Step } from "./Program";
import { IThrowable } from "./ThrowableType";
import '/include/css/exceptionmarker.css';

export class ExceptionMarker {

    key: string = "ExceptionMarker";

    constructor(private main: IMain){

    }

    markException(exception: Exception & IThrowable, step: Step){
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

          this.main.getDisassembler()?.markException(step);

    }

    removeExceptionMarker(){
        this.main.getInterpreter()?.programPointerManager?.hide(this.key);
    }

}