import * as PIXI from 'pixi.js';

export function updateWorldTransformRecursively(container: PIXI.Container, recursively: boolean){

    let parent = container.parent;
    PIXI.updateWorldTransform(container.localTransform, parent.worldTransform, container.worldTransform);

    if(recursively){
        for(let child of container.children){
            updateWorldTransformRecursively(child, true);
        }
    }

}