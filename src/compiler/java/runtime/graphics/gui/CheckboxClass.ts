import * as PIXI from 'pixi.js';
import { JRC } from "../../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../../types/NonPrimitiveType.ts";
import { GuiComponentClass } from "./GuiComponentClass.ts";
import { Thread } from '../../../../common/interpreter/Thread.ts';
import { CallbackFunction } from '../../../../common/interpreter/StepFunction.ts';
import { GuiTextComponentClass } from './GuiTextComponentClass.ts';
import { lightenDarkenIntColor } from '../../../../../tools/HtmlTools.ts';
import { MouseEventKind } from '../MouseManager.ts';

export class CheckBoxClass extends GuiTextComponentClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class CheckBox extends GuiTextComponent", comment: JRC.CheckBoxClassComment },
        { type: "method", signature: "CheckBox(double x, double y, double width, double fontsize, string text)", java: CheckBoxClass.prototype._cj$_constructor_$CheckBox$double$double$double$double$string, comment: JRC.CheckBoxConstructorComment },
        { type: "method", signature: "CheckBox(double x, double y, double width, double fontsize, string text, string fontFamily)", java: CheckBoxClass.prototype._cj$_constructor_$CheckBox$double$double$double$double$string, comment: JRC.CheckBoxConstructorComment },
        { type: "method", signature: "CheckBox(double x, double y, double width, double fontsize, string text, boolean checked)", java: CheckBoxClass.prototype._cj$_constructor_$CheckBox$double$double$double$double$string, comment: JRC.CheckBoxConstructorComment },
        { type: "method", signature: "CheckBox copy()", java: CheckBoxClass.prototype._mj$copy$Button$, comment: JRC.CheckBoxCopyComment },
        { type: "method", signature: "void setCrossColor(int color)", native: CheckBoxClass.prototype.setCrossColor, comment: JRC.CheckBoxSetCrossColorComment },
        { type: "method", signature: "void setChecked(boolean checked)", native: CheckBoxClass.prototype.setChecked, comment: JRC.CheckBoxSetCheckedComment },
        { type: "method", signature: "boolean isChecked()", native: CheckBoxClass.prototype._isChecked, comment: JRC.CheckBoxIsCheckedComment },
    ];

    static type: NonPrimitiveType;

    x!: number;
    y!: number;
    width!: number;

    backgroundGraphics!: PIXI.Graphics;
    cross!: PIXI.Graphics;

    distanceToText: number = 4;

    crossColor: number = 0x000000;

    isChecked: boolean = true;

    mouseIsDown: boolean = false;

    isMouseOver: boolean = false;

    _cj$_constructor_$CheckBox$double$double$double$double$string(t: Thread, callback: CallbackFunction,
        x: number, y: number, width: number, fontsize: number, text: string, fontFamilyOrChecked?: string | boolean
    ) {

        this.isChecked = false;
        let fontFamily: string = "sans serif";
        if (fontFamilyOrChecked) {
            if (typeof fontFamilyOrChecked == 'boolean') {
                this.isChecked = fontFamilyOrChecked;
            } else {
                fontFamily = fontFamilyOrChecked;
            }
        }

        this.x = x;
        this.y = y;
        this.width = width;

        this._cj$_constructor_$GuiTextComponent$(t, () => {
            this.centerXInitial = x;
            this.centerYInitial = y;

            this.borderColor = 0x808080;
            this.borderWidth = width / 10;
            this.fillColor = 0xffffff;

            this.hitPolygonInitial = [];

            this.render();

            if (callback) callback();

        }, true, false, fontsize, text, fontFamily);

    }

    onKeyDown(key: string, isShift: boolean, isCtrl: boolean, isAlt: boolean): void { }

    looseKeyboardFocus(): void { }

    _mj$copy$Button$(t: Thread, callback: CallbackFunction) {

        let checkBox = new CheckBoxClass();
        checkBox.textColor = this.textColor;
        checkBox.crossColor = this.crossColor;
        this._cj$_constructor_$CheckBox$double$double$double$double$string(t, () => {
            if (callback) callback();
        }, this.x, this.y, this.width, this.fontsize, this.text, this.fontFamily);

    }

    setCrossColor(color: number) {
        this.crossColor = color;
        this.render();
    }

    render(): void {

        this.textCompomentPrerender();

        if (this.container == null) {
            this.backgroundGraphics = new PIXI.Graphics();
            this.cross = new PIXI.Graphics();

            this.pixiText = new PIXI.Text({ text: this.text, style: this.textStyle });
            this.pixiText.x = this.width + this.distanceToText;
            this.pixiText.y = 0;

            this.container = new PIXI.Container();
            this.container.localTransform.translate(this.x, this.y);
            this.container.setFromMatrix(this.container.localTransform);
            this.container.updateLocalTransform();

            this.world.app!.stage.addChild(this.container);
            let container = <PIXI.Container>this.container;

            container.addChild(this.backgroundGraphics);
            container.addChild(this.pixiText);
            container.addChild(this.cross);

        } else {
            this.pixiText.text = this.text;
            this.backgroundGraphics.clear();
            this.cross.clear();

            this.pixiText.alpha = this.fillAlpha;
            this.pixiText.anchor.x = 0;
            this.textStyle.align = "left";
            this.pixiText.style = this.textStyle;
        }

        this.centerXInitial = 0;
        this.centerYInitial = 0;

        let textTop = 0;

        if (this.text != null) {
            let tm = PIXI.CanvasTextMetrics.measureText(this.text, this.textStyle);

            this.textWidth = tm.width;
            this.textHeight = tm.height;
            let ascent = tm.fontProperties.ascent

            textTop = (this.width - this.textHeight) / 2;
            this.distanceToText = tm.fontProperties.descent * 3;

            this.pixiText.localTransform.identity();
            this.pixiText.localTransform.translate(this.width + this.distanceToText, textTop);
            this.pixiText.setFromMatrix(this.pixiText.localTransform);
            this.pixiText.updateLocalTransform();

            this.centerXInitial = (this.width + this.textWidth + this.distanceToText) / 2;
            this.centerYInitial = this.width / 2;
        }

        let left = 0;
        let top = 0;
        let textBottom = top + this.width - textTop;
        let overallWidth = this.textWidth + this.width + this.distanceToText;
        this.width = overallWidth;
        this.height = Math.max(this.width, this.textHeight);

        this.hitPolygonInitial = [
            { x: left, y: top }, { x: left + this.width, y: top }, { x: left + this.width + this.distanceToText, y: textTop },
            { x: left + overallWidth, y: textTop },
            { x: left + overallWidth, y: textBottom },
            { x: left + this.width + this.distanceToText, y: textBottom },
            { x: left + this.width, y: top + this.width },
            { x: left, y: top + this.width }
        ];
        this.hitPolygonDirty = true;


        this.backgroundGraphics.roundRect(0, 0, this.width, this.width, this.width / 8);

        if (this.fillColor != null) {
            this.backgroundGraphics.fill(this.fillColor);
            this.backgroundGraphics.alpha = this.fillAlpha;
        }

        if (this.borderColor != null) {
            this.backgroundGraphics.stroke({
                width: this.borderWidth,
                color: this.borderColor,
                alpha: this.borderAlpha,
                alignment: 1.0
            })
        }

        let df = 3.0;
        let bwdf = this.borderWidth * df;

        // this.cross.lineStyle(this.borderWidth * 2, this.crossColor, this.fillAlpha, 0.5);
        this.cross.moveTo(bwdf, bwdf);
        this.cross.lineTo(this.width - bwdf, this.width - bwdf);
        this.cross.moveTo(this.width - bwdf, bwdf);
        this.cross.lineTo(bwdf, this.width - bwdf);

        this.cross.stroke({
            width: this.borderWidth * 2,
            color: this.crossColor,
            alpha: this.fillAlpha,
            alignment: 0.5,
            cap: "round"
        });

        this.cross.visible = this.isChecked;
    }

    setChecked(checked: boolean) {
        this.isChecked = checked;
        this.render();
    }

    onMouseEvent(kind: MouseEventKind, x: number, y: number): void {
        let containsPointer = this._containsPoint(x, y);

        switch (kind) {
            case "mousedown":
                if (containsPointer) {
                    this.mouseIsDown = true;
                }
                break;
            case "mouseup": {
                if (containsPointer && this.mouseIsDown) {
                    this.isChecked = !this.isChecked;
                    this.render();
                }
                this.mouseIsDown = false;
            }
                break;
            case "mouseleave": {
                this.isMouseOver = false;
                this.world._setCursor('default');
            }
                break;
            case "mousemove": {

                if (this.isMouseOver != containsPointer) {
                    this.isMouseOver = containsPointer;
                    this.world._setCursor(containsPointer ? "pointer" : "default");
                }

            }
        }

    }

    _isChecked(): boolean {
        return this.isChecked;
    }


}