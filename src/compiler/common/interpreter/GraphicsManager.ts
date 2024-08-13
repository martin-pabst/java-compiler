import * as PIXI from 'pixi.js';
import { IMain } from '../IMain';
import { RuntimeExceptionClass } from '../../java/runtime/system/javalang/RuntimeException';
import { JRC } from '../../java/language/JavaRuntimeLibraryComments';

export interface GraphicSystem {
    getIdentifier(): string;
}


export class GraphicsManager {
    
    userSpritesheet?: PIXI.Spritesheet;

    currentGraphicSystem?: GraphicSystem;

    constructor(public graphicsDiv: HTMLElement | null, public main: IMain){

        main.getInterpreter().eventManager.on("resetRuntime", () => {
            this.currentGraphicSystem = undefined;
        });

    }

    adjustWidthToWorld(){
        this.main.adjustWidthToWorld();
    }

    registerGraphicSystem(graphicSystem: GraphicSystem){
        if(this.currentGraphicSystem){
            throw new RuntimeExceptionClass(JRC.GraphicSystemNotAvailableError(this.currentGraphicSystem.getIdentifier(), graphicSystem.getIdentifier()));
        }

        this.currentGraphicSystem = graphicSystem;
    }

}