import * as PIXI from "pixi.js";


/**
 * @see https://javascript.plainenglish.io/inside-pixijs-projection-system-897872a3dc17
 */
export class WorldContainer extends PIXI.Container {

    projectionTransform: PIXI.Matrix;

    constructor(public sourceFrame: PIXI.Rectangle, public destinationFrame: PIXI.Rectangle) {
        super();
        this.projectionTransform = new PIXI.Matrix();
    }

    render(renderer: PIXI.Renderer) {

        let projectionMatrix = renderer.renderTarget.projectionMatrix;

        projectionMatrix.identity();
        projectionMatrix.set(this.projectionTransform.a, this.projectionTransform.b, 
            this.projectionTransform.c, this.projectionTransform.d, this.projectionTransform.tx,
            this.projectionTransform.ty
        );
        renderer.texture.generateCanvas(
            renderer.texture.current,
            this.sourceFrame,
            this.destinationFrame,
        );
        super.render(renderer);
        renderer.batch.flush();

        // renderer.batch.flush();
        renderer.projection.projectionMatrix.identity();
        renderer.projection.transform = null;
        renderer.renderTexture.bind(null);
    }
}
