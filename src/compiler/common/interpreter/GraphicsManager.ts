import * as PIXI from 'pixi.js';
import { IMain } from '../IMain';
export class GraphicsManager {
    
    userSpritesheet?: PIXI.Spritesheet;

    constructor(public graphicsDiv: HTMLElement | null, public main: IMain){

    }

    adjustWidthToWorld(){
        this.main.adjustWidthToWorld();
    }

}