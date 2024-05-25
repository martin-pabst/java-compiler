import * as PIXI from 'pixi.js';

export function updateWorldTransformRecursively(container: PIXI.Container, includeChildren: boolean){

    let parent = container.parent;

    if(parent){
        updateWorldTransformRecursively(parent, false);
        PIXI.updateWorldTransform(container.localTransform, parent.worldTransform, container.worldTransform);
    
        if(includeChildren){
            for(let child of container.children){
                updateWorldTransformRecursively(child, true);
            }
        }
    }


}