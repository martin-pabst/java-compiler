import * as PIXI from 'pixi.js';
import { ActorType, IActor } from "./IActor";
import { GroupClass } from './GroupClass';
import { ShapeClass } from './ShapeClass';


export interface IWorld {
    app: PIXI.Application;
    defaultGroup?: GroupClass;
    shapesWhichBelongToNoGroup: ShapeClass[];

    currentLeft: number;
    currentTop: number;
    currentWidth: number;
    currentHeight: number;

    registerActor(actor: IActor, type: ActorType): void;
    unregisterActor(actor: IActor): void;
    hasActors(): boolean;
}