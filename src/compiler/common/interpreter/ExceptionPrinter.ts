import { range } from "lit/directives/range.js";
import { Exception } from "./ExceptionInfo";
import { PrintManager } from "./PrintManager";
import { Stacktrace } from "./ThrowableType";

export class ExceptionPrinter {

    static print(exception: Exception, stacktrace: Stacktrace, printManager?: PrintManager){

        if(!printManager) return;

        printManager.print(exception.getIdentifier() + ": ", false, 0xff0000);
        printManager.print(exception.getMessage(), true, 0xffffff);
        printManager.print("Stacktrace:", true, 0xff0000);
        
        let indent = "   ";
        for(let ste of stacktrace){
            let methodIdentifierWithClass = ste.methodIdentifierWithClass;
            if(methodIdentifierWithClass == ".main") methodIdentifierWithClass = "Main method";

            printManager.print(indent + methodIdentifierWithClass, false, 0xffffff);
            printManager.print("(" + ste.range.startLineNumber + ":" + ste.range.startColumn + ")",
             true, 0x80ff80);
        }
    }


}