import { Punkt, abstandPunktZuGerade, abstandPunktZuStrecke, polygonEnthältPunkt, schnittpunkteKreisStrecke, streckeSchneidetStrecke } from "../../../../../tools/MatheTools";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { CallbackFunction } from "../../../../common/interpreter/StepFunction";
import { Thread, ThreadState } from "../../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType";
import { ObjectClass, StringClass } from "../javalang/ObjectClassStringClass";

export class PrintStreamClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class PrintStream extends Object", comment: JRC.PrintStreamClassComment },
        { type: "method", signature: "void print(string text)", java: PrintStreamClass.prototype._mn$print$void$string, comment: JRC.PrintStreamPrintComment},
        { type: "method", signature: "void println(string text)", java: PrintStreamClass.prototype._mn$println$void$string, comment: JRC.PrintStreamPrintlnComment},
        { type: "method", signature: "void println()", java: PrintStreamClass.prototype._mn$println$void$string, comment: JRC.PrintStreamPrintlnComment2},
    ];

    static type: NonPrimitiveType;

    _mn$print$void$string(t: Thread, callback: CallbackFunction, text: string){
        if(text == null) return;
        t.print(text, 0xffffff);
        if(callback) callback();
    }
    
    _mn$println$void$string(t: Thread, callback: CallbackFunction, text?: string){
        if(!text){
            t.println("", 0xffffff);
        } else {
            t.println(text, 0xffffff);
        }

        if(callback) callback();
    }


}

export class SystemClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class System extends Object", comment: JRC.SystemClassComment },
        { type: "field", signature: "static PrintStream out", comment: JRC.SystemOutComment},
        { type: "method", signature: "static void exit(int status)", java: SystemClass._mj$exit$void$int, comment: JRC.SystemExitComment },
        { type: "method", signature: "static int currentTimeMillis()", native: SystemClass._currentTimeMillis, comment: JRC.SystemCurrentTimeMillisComment },
    ];    

    static type: NonPrimitiveType;
    static deltaTimeMillis: number = 0;   // when using WebSocket then the Server sends time synchronization
    static out = new PrintStreamClass();

    static _mj$exit$void$int(t: Thread, status: number){
        t.state = ThreadState.terminated;
        t.scheduler.exit(status);
    }    

    static _currentTimeMillis(){
        return Math.round(performance.now()) + SystemClass.deltaTimeMillis;
    }    



}    


