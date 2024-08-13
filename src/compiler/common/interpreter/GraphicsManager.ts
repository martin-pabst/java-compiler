import * as PIXI from 'pixi.js';
import { JRC } from '../../java/language/JavaRuntimeLibraryComments';
import { RuntimeExceptionClass } from '../../java/runtime/system/javalang/RuntimeException';
import { Interpreter } from './Interpreter';

export interface GraphicSystem {
    getIdentifier(): string;
}


export class GraphicsManager {
    
    userSpritesheet?: PIXI.Spritesheet;

    currentGraphicSystem?: GraphicSystem;

    interpreter?: Interpreter;

    constructor(public graphicsDiv: HTMLElement | null){

    }

    registerGraphicSystem(graphicSystem: GraphicSystem){
        if(this.currentGraphicSystem){
            throw new RuntimeExceptionClass(JRC.GraphicSystemNotAvailableError(this.currentGraphicSystem.getIdentifier(), graphicSystem.getIdentifier()));
        }

        this.currentGraphicSystem = graphicSystem;
    }

    setInterpreter(interpreter: Interpreter){
        this.interpreter = interpreter;
        interpreter.eventManager.on("resetRuntime", () => {
            this.currentGraphicSystem = undefined;
        });
    }

}