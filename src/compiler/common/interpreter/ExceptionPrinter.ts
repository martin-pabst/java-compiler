import { DOM } from "../../../tools/DOM";
import { IMain } from "../IMain";
import { Exception } from "./ExceptionInfo";
import { IPrintManager } from "./IPrintManager";
import { Stacktrace } from "./ThrowableType";
import '/include/css/exception.css';


export class ExceptionPrinter {

    static print(exception: Exception, stacktrace: Stacktrace, printManager?: IPrintManager) {

        if (!printManager) return;

        printManager.print(exception.getIdentifier() + ": ", false, 0xff0000);
        printManager.print(exception.getMessage(), true, 0xffffff);
        printManager.print("Stacktrace:", true, 0xff0000);

        let indent = "   ";
        for (let ste of stacktrace) {
            let methodIdentifierWithClass = ste.methodIdentifierWithClass;
            if (methodIdentifierWithClass == ".main") methodIdentifierWithClass = "Main method";

            printManager.print(indent + methodIdentifierWithClass, false, 0xffffff);
            if (ste.range) {
                printManager.print("(" + ste.range.startLineNumber + ":" + ste.range.startColumn + ")",
                    true, 0x80ff80);
            }
        }
    }

    /*
     * Exception in thread "main" java.lang.RuntimeException: Something has gone wrong, aborting!
        at com.myproject.module.MyProject.badMethod(MyProject.java:22)
        at com.myproject.module.MyProject.oneMoreMethod(MyProject.java:18)
        at com.myproject.module.MyProject.anotherMethod(MyProject.java:14)
        at com.myproject.module.MyProject.someMethod(MyProject.java:10)
        at com.myproject.module.MyProject.main(MyProject.java:6)
     */

    /**
     * 
     * @param exception 
     * @param stacktrace 
     * @param printManager 
     * @returns 
     */

    static printWithLinks(exception: Exception, stacktrace: Stacktrace, printManager?: IPrintManager, main?: IMain) {

        if (!printManager || !main) return;

        let outerDiv = this.getHtmlWithLinks(exception, stacktrace, main);

        outerDiv.style.marginTop = '10px';

        printManager.printHtmlElement(outerDiv);

    }

    static getHtmlWithLinks(exception: Exception, stacktrace: Stacktrace, main: IMain): HTMLDivElement {
        let outerDiv = DOM.makeDiv(undefined, 'jo_exceptionPrinter_outer');

        let headingDiv = DOM.makeDiv(outerDiv, 'jo_exceptionPrinter_heading');
        let inThread = exception.getThread() ? " in thread " + exception.getThread().name : "";
        headingDiv.textContent = `${exception.getIdentifier()}${inThread}: ${exception.getMessage()}`;

        for (let ste of stacktrace) {
            if (!ste.range) continue;
            let stacktraceDiv = DOM.makeDiv(outerDiv, 'jo_exceptionPrinter_stacktrace');
            stacktraceDiv.innerHTML = `at ${ste.methodIdentifierWithClass} (<span class="jo_stacktraceLink">File ${ste.file.name}: ${ste.range.startLineNumber}</span>)`;

            let linkSpan = stacktraceDiv.getElementsByClassName("jo_stacktraceLink")[0];
            linkSpan.addEventListener("click", () => {
                main.showProgramPosition(ste.file, ste.range);
            })

        }

        return outerDiv;
    }

}