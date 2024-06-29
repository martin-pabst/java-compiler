import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { KeyDownListener } from "../../../../common/interpreter/KeyboardManager.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { FilledShapeClass } from "../FilledShapeClass.ts";
import { InternalMouseListener, MouseEventKind } from "../MouseManager.ts";

export class GuiComponent extends FilledShapeClass implements InternalMouseListener {

    static __javaDeclarations: LibraryDeclarations = [
        {type: "declaration", signature: "class GUIComponent extends FilledShape", comment: JRC.GUIComponentClassComment}
    ];









    onMouseEvent(kind: MouseEventKind, x: number, y: number): void {
        throw new Error("Method not implemented.");
    }

}