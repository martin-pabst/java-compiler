import * as PIXI from 'pixi.js';
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { JRC } from '../../../../tools/language/JavaRuntimeLibraryComments';
import { InterfaceClass } from '../system/javalang/InterfaceClass';
import { CallbackParameter } from '../../../common/interpreter/CallbackParameter';

export class MouseListenerInterface extends InterfaceClass {
    static __javaDeclarations: LibraryDeclarations = [

        { type: "declaration", signature: "interface MouseListener", comment: JRC.mouseListenerInterfaceComment },

        { type: "method", signature: "void onMouseUp(double x, double y, int button)", java: MouseListenerInterface.prototype._mj$onMouseUp$void$double$double$int, comment: JRC.mouseListenerOnMouseUpComment },
        { type: "method", signature: "void onMouseDown(double x, double y, int button)", java: MouseListenerInterface.prototype._mj$onMouseDown$void$double$double$int, comment: JRC.mouseListenerOnMouseDownComment },
        { type: "method", signature: "void onMouseMove(double x, double y)", java: MouseListenerInterface.prototype._mj$onMouseMove$void$double$double, comment: JRC.mouseListenerOnMouseMoveComment },
        { type: "method", signature: "void onMouseEnter(double x, double y)", java: MouseListenerInterface.prototype._mj$onMouseEnter$void$double$double, comment: JRC.mouseListenerOnMouseEnterComment },
        { type: "method", signature: "void onMouseLeave(double x, double y)", java: MouseListenerInterface.prototype._mj$onMouseLeave$void$double$double, comment: JRC.mouseListenerOnMouseLeaveComment },
    ]

    static type: NonPrimitiveType;
   
    _mj$onMouseUp$void$double$double$int(t: Thread, callback: CallbackParameter, x: number, y: number, button: number){
        
    }

    _mj$onMouseDown$void$double$double$int(t: Thread, callback: CallbackParameter, x: number, y: number, button: number){

    }

    _mj$onMouseMove$void$double$double(t: Thread, callback: CallbackParameter, x: number, y: number){

    }

    _mj$onMouseEnter$void$double$double(t: Thread, callback: CallbackParameter, x: number, y: number){

    }

    _mj$onMouseLeave$void$double$double(t: Thread, callback: CallbackParameter, x: number, y: number){

    }

}