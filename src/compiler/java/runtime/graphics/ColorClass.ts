import { Klass } from "../../../common/interpreter/StepFunction";
import { ColorHelper } from "../../lexer/ColorHelper";
import { LibraryDeclarations } from "../../module/libraries/DeclareType";
import { NonPrimitiveType } from "../../types/NonPrimitiveType";
import { ObjectClass, StringClass } from "../system/javalang/ObjectClassStringClass";

export class ColorClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Color extends Object" },

        { type: "field", signature: "int red" },
        { type: "field", signature: "int green" },
        { type: "field", signature: "int blue" },
        { type: "field", signature: "double alpha" },

        { type: "method", signature: "Color(int red, int green, int blue)", native: ColorClass.prototype._constructorColorClass },
        { type: "method", signature: "Color(int red, int green, int blue, double alpha)", native: ColorClass.prototype._constructorColorClass1 },
        { type: "method", signature: "static int randomColor()", native: ColorClass._randomColor },
        { type: "method", signature: "static int randomColor(int minimumRGBValue)", native: ColorClass._randomColorMin },
        { type: "method", signature: "static int randomColor(int minimumRGBValue, int maximumRGBValue)", native: ColorClass._randomColorMinMax },
        { type: "method", signature: "final String toString()", native: ColorClass.prototype._toString },
        { type: "method", signature: "final int toInt()", template: `(§1.r * 0x10000 + §1.g * 0x100 + §1.b)` },
        { type: "method", signature: "final boolean equals(Color otherColor)", template: `(§1.r == §2.r && §1.g == §2.g && §1.b == §2.b)` },
        { type: "method", signature: "final int getRed()", template: `(§1.r)` },
        { type: "method", signature: "final int getGreen()", template: `(§1.g)` },
        { type: "method", signature: "final int getBlue()", template: `(§1.b)` },
        { type: "method", signature: "static int fromRGB(int red, int green, int blue)", native: ColorClass.prototype._fromRGB },
        { type: "method", signature: "static string fromRGBA(int red, int green, int blue, double alpha)", native: ColorClass.prototype._fromRGBA },
        { type: "method", signature: "static string fromHSLA(double hue, double saturation, double luminance, double alpha)", native: ColorClass.prototype._fromHSLA },
        { type: "method", signature: "static int fromHSL(double hue, double saturation, double luminance)", native: ColorClass.prototype._fromHSL },
    ]

    static type: NonPrimitiveType;

    red!: number;
    green!: number;
    blue!: number;

    alpha: number = 1.0;

    static _initPredefinedColors(){

        for (let colorName in ColorHelper.predefinedColors) {

            let intColor = ColorHelper.predefinedColors[colorName];

            let c = new ColorClass();
            
            c.red = (intColor & 0xff0000) >> 16;
            c.green = (intColor & 0xff00) >> 8;
            c.blue = (intColor & 0xff);

            ColorClass.__javaDeclarations.push(
                {type: "field", signature: "final static Color " + colorName }
            )

            let k: Klass = ColorClass;

            k[colorName] = c;
        }



    }

    _constructorColorClass(red: number, green: number, blue: number): ColorClass {
        this.red = red;
        this.green = green;
        this.blue = blue;
        return this;
    }

    _constructorColorClass1(red: number, green: number, blue: number, alpha: number): ColorClass {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        return this;
    }

    static _randomColor(): number {
        return Math.floor(Math.random() * 0xffffff);
    }

    static _randomColorMin(min: number): number {
        if (min < 0) min = 0;
        if (min > 255) min = 255;

        let r: number = Math.floor(Math.random() * (256 - min)) + min;
        let g: number = Math.floor(Math.random() * (256 - min)) + min;
        let b: number = Math.floor(Math.random() * (256 - min)) + min;

        return 0x10000 * r + 0x100 * g + b;

    }

    static _randomColorMinMax(min: number, max: number): number {
        if (min < 0) min = 0;
        if (min > 255) min = 255;

        let r: number = Math.floor(Math.random() * (256 - min)) + min;
        let g: number = Math.floor(Math.random() * (256 - min)) + min;
        let b: number = Math.floor(Math.random() * (256 - min)) + min;

        return 0x10000 * r + 0x100 * g + b;

    }

    _toString(): StringClass {
        return new StringClass(ColorHelper.rgbColorToHexRGB(this.red, this.green, this.blue));
    }

    _fromRGB(r: number, g: number, b: number): number {
        r = Math.min(r, 255); r = Math.max(0, r);
        g = Math.min(g, 255); g = Math.max(0, g);
        b = Math.min(b, 255); b = Math.max(0, b);

        return (r * 0x10000 + g * 0x100 + b);

    }

    _fromRGBA(r: number, g: number, b: number, a: number): string {
        r = Math.min(r, 255); r = Math.max(0, r);
        g = Math.min(g, 255); g = Math.max(0, g);
        b = Math.min(b, 255); b = Math.max(0, b);

        a = Math.min(a, 1); a = Math.max(0, a);

        let color: string = (r * 0x1000000 + g * 0x10000 + b * 0x100 + Math.floor(a * 255)).toString(16);
        while (color.length < 8) color = "0" + color;

        return "#" + color;
    }

    _fromHSLA(h: number, s: number, l: number, a: number): string {
        h = Math.min(h, 360); h = Math.max(0, h);
        s = Math.min(s, 100); s = Math.max(0, s);
        l = Math.min(l, 100); l = Math.max(0, l);
        a = Math.min(a, 1); a = Math.max(0, a);

        let rgb = this.hslToRgb(h, s, l);

        let color: string = (rgb.r * 0x1000000 + rgb.g * 0x10000 + rgb.b * 0x100 + Math.floor(a * 255)).toString(16);
        while (color.length < 8) color = "0" + color;

        return "#" + color;

    }

    _fromHSL(h: number, s: number, l: number): number {
        h = Math.min(h, 360); h = Math.max(0, h);
        s = Math.min(s, 100); s = Math.max(0, s);
        l = Math.min(l, 100); l = Math.max(0, l);

        let rgb = this.hslToRgb(h, s, l);

        return (rgb.r * 0x10000 + rgb.g * 0x100 + rgb.b);
    }

    hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number } {

        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);


        return { r: r, g: g, b: b }

    }

    fromIntAndAlpha(color: number | undefined, alpha: number){
        if(color){
            this.red = color & 0xff0000/0x10000;
            this.green = color & 0xff00/0x100;
            this.blue = color & 0xff;
        }
        this.alpha = alpha;
    }

}