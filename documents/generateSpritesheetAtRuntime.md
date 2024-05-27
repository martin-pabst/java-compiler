# Pixi.js v8: How to generate spritesheet at runtime

See [here](https://pixijs.com/8.x/guides/migrations/v8)
```javascript
            // see https://pixijs.com/8.x/guides/migrations/v8
            let textureNew = PIXI.Texture.from(new PIXI.BufferImageSource({resource: this.pngImageData, 
                width: this.pixiSpritesheetData.meta.size.w,
                height: this.pixiSpritesheetData.meta.size.h                
            }))

            let spritesheet = new PIXI.Spritesheet(textureNew, this.pixiSpritesheetData);


```

-> For use in Spritesheetdata.ts