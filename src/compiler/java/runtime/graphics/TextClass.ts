import * as PIXI from 'pixi.js';
import { Thread } from "../../../common/interpreter/Thread";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ShapeClass } from './ShapeClass';
import { FilledShapeClass } from './FilledShapeClass';
import { CallbackFunction } from '../../../common/interpreter/StepFunction';
import { JRC } from '../../../../tools/language/JavaRuntimeLibraryComments';
import { CallbackParameter } from '../../../common/interpreter/CallbackParameter';
import { StringClass } from '../system/javalang/ObjectClassStringClass';

export class TextClass extends FilledShapeClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Text extends FilledShape", comment: JRC.TextClassComment },

        { type: "method", signature: "Text()", java: TextClass.prototype._cj$_constructor_$Text$, comment: JRC.TextEmptyConstructorComment },
        { type: "method", signature: "Text(double x, double y, double fontSize, string text)", java: TextClass.prototype._cj$_constructor_$Text$double$double$double$string, comment: JRC.TextConstructorComment1 },
        
        
        
        { type: "method", signature: "final Text copy()", java: TextClass.prototype._mj$copy$Text$, comment: JRC.TextCopyComment },

        { type: "method", signature: "String toString()", java: TextClass.prototype._mj$toString$String$ , comment: JRC.objectToStringComment},

    ]

    static type: NonPrimitiveType;
   
    alignment: string = "left";

    textStyle: PIXI.TextStyle =
        new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 10,
            fontStyle: 'normal',
            fontWeight: 'normal',
            fill: this.fillColor == null ? 0x000000 : this.fillColor, // gradient possible...
            stroke: this.borderColor == null ? 0x000000 : this.borderColor,
            //strokeThickness: this.borderColor == null ? 0 : this.borderWidth,
            dropShadow: false,
            wordWrap: false,
            align: "left",
            //lineJoin: 'round'
        });
    
    x!: number;
    y!: number;
    fontsize!: number;
    text!: string;
    fontFamily!: string;

    _cj$_constructor_$Text$(t: Thread, callback: CallbackFunction) {
        this._cj$_constructor_$Text$double$double$double$string(t, callback, 0, 0, 24, "Text");
    }

    _cj$_constructor_$Text$double$double$double$string(t: Thread, callback: CallbackFunction,
        x: number, y: number, fontSize: number, text: string, fontFamily?: string
    ) {
        this._cj$_constructor_$FilledShape$(t, () => {
            this.x = x;
            this.y = y; 
            this.fontsize = fontSize; 
            this.text = text;

            this.centerXInitial = x;
            this.centerYInitial = y;
    
            if (this.fontsize == 0) this.fontsize = 10;
    
            this.borderColor = undefined;
            this.textStyle.stroke = 0x000000;
            if (fontFamily != undefined) {
                this.textStyle.fontFamily = fontFamily;
            }
    
            this.hitPolygonInitial = [];
    

            this.render();
        });   // call base class constructor


    }

    _mj$copy$Text$(t: Thread, callback: CallbackFunction){
        let copy = new TextClass();
        copy._cj$_constructor_$Text$double$double$double$string(t, callback, this.x, this.y, this.fontsize, this.text, this.fontFamily);
        copy.copyFrom(this);
        copy.render();
        t.s.push(copy);
        if(callback) callback();
    }

    render(): void {

        let g: PIXI.Text = <any>this.container;
        this.textStyle.fill = this.fillColor == null ? 0x000000 : this.fillColor;
        this.textStyle.stroke = this.borderColor == null ? 0x000000 : this.borderColor;
        //this.textStyle.strokeThickness = this.borderColor == null ? 0 : this.borderWidth;
        this.textStyle.fontSize = this.fontsize;

        if (!this.container) {
            g = new PIXI.Text({
                text: this.text,
                style: this.textStyle
            });
            this.container = g;

            this.container.localTransform.translate(this.x, this.y);
            //@ts-ignore
            this.container.transform.onChange();

            this.world.app!.stage.addChild(g);
        } else {
            g.text = this.text;
            g.alpha = this.fillAlpha;
            switch (this.alignment) {
                case "left": g.anchor.x = 0; break;
                case "center": g.anchor.x = 0.5; break;
                case "right": g.anchor.x = 1.0; break;
            }
            //@ts-ignore
            this.textStyle.align = this.alignment;
            g.style = this.textStyle;
        }

        this.centerXInitial = 0;
        this.centerYInitial = 0;

        let width = 0;
        let height = 0;

        if (this.text != null) {
            let tm = PIXI.TextMetrics.measureText( "" + this.text, this.textStyle);

            width = tm.width;
            height = tm.height;
            tm.fontProperties.ascent

            this.centerXInitial = width / 2;
            this.centerYInitial = height / 2;
        }

        let left = 0 - g.anchor.x * width;
        let top = 0 - g.anchor.y * height;

        this.hitPolygonInitial = [
            { x: left , y: top }, { x: left, y: top + height },
            { x: left + width, y: top + height }, { x: left + width, y: top }
        ];


    };

    _setWidth(width: number){
        this.width = width / this.container.scale.x;
        this.centerXInitial = this.left + this.width / 2;

        this.render();
    }

    _setHeight(height: number){
        this.height = height / this.container.scale.y;
        this.centerYInitial = this.top + this.height / 2;

        this.render();
    }

    _moveTo(x: number, y: number){
        this.transformHitPolygon();

        this._move(x - this.hitPolygonTransformed[0].x, y - this.hitPolygonTransformed[0].y);

    }

    _mj$toString$String$(t: Thread, callback: CallbackParameter) {

        t.s.push(new StringClass(this._debugOutput()));

        if(callback) callback();
        
        return;
    }

    _debugOutput(){
        let s = `{width: ${this.width * this.scaleFactor}, height: ${this.height * this.scaleFactor}, centerX: ${this._getCenterX()}, centerY: ${this._getCenterY()} }`;
        return s;
    }

    

}