import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { InputManagerValidator } from "../../../../common/interpreter/IInputManager.ts";
import { Thread, ThreadState } from "../../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { ObjectClass, StringClass } from "../javalang/ObjectClassStringClass.ts";

type InputCallback = (value: string) => {valueToPushToStack: any, error: string | undefined};

export class InputClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class Input extends Object", comment: JRC.InputClassComment},
        {type: "method", signature: "static string readString(string message, string defaultValue)", java: InputClass._mj$readString$string$string$string, comment: JRC.InputClassReadStringComment},
        {type: "method", signature: "static string readString(string message)", java: InputClass._mj$readString$string$string, comment: JRC.InputClassReadStringComment},

        {type: "method", signature: "static boolean readBoolean(string message, boolean defaultValue)", java: InputClass._mj$readBoolean$boolean$string$boolean, comment: JRC.InputClassReadBooleanComment},
        {type: "method", signature: "static boolean readBoolean(string message)", java: InputClass._mj$readBoolean$boolean$string, comment: JRC.InputClassReadBooleanComment},
    ];

    static type: NonPrimitiveType;

    static readInput(t: Thread, message: string, defaultValue: string|undefined, validator: InputManagerValidator){
        t.state = ThreadState.waiting;
        t.scheduler.interpreter.showProgramPointer(undefined, "InputClass");
        t.scheduler.interpreter.inputManager?.readInput(message, defaultValue, validator, (value: string) => {
            t.s.push(value);
            t.state = ThreadState.runnable;
            t.scheduler.interpreter.hideProgrampointerPosition("InputClass");
            return ;
        })

    }

    static _mj$readString$string$string$string(t: Thread, message: string, defaultValue?: string){
        InputClass.readInput(t, message, defaultValue, (value: string) => {
            return {
                convertedValue: value,
                errorMessage: undefined
            }
        })
    }

    static _mj$readString$string$string(t: Thread, message: string){
        InputClass._mj$readString$string$string$string(t, message, undefined);
    }

    static _mj$readBoolean$boolean$string$boolean(t: Thread, message: string, defaultValue?: string){
        InputClass.readInput(t, message, defaultValue, (value: string) => {
            return {
                convertedValue: value == 'true',
                errorMessage: ['true', 'false'].indexOf(value) < 0 ? "Erwartet wird 'true' oder 'false'." : undefined
            }
        })
    }

    static _mj$readBoolean$boolean$string(t: Thread, message: string){
        InputClass._mj$readBoolean$boolean$string$boolean(t, message, undefined);
    }



}