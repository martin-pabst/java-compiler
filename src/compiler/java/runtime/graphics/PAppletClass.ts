import p5 from "p5";
import { JRC } from "../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { CallbackFunction } from "../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../common/interpreter/Thread.ts";
import { LibraryDeclarations, LibraryMethodOrAttributeDeclaration } from "../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../types/NonPrimitiveType.ts";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass.ts";
import { DOM } from "../../../../tools/DOM.ts";
import { Interpreter } from "../../../common/interpreter/Interpreter.ts";
import { SchedulerState } from "../../../common/interpreter/Scheduler.ts";

export class PAppletClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = (<LibraryDeclarations>[
        { type: "declaration", signature: "class PApplet extends Object", comment: JRC.PAppletClassComment },

        { type: "field", signature: "int mouseX", template: "§1.p5o.mouseX", comment: JRC.PAppletMouseXComment },
        { type: "field", signature: "int mouseY", template: "§1.p5o.mouseY", comment: JRC.PAppletMouseYComment },
        { type: "field", signature: "int pMouseX", template: "§1.p5o.pMouseX", comment: JRC.PAppletPMouseXComment },
        { type: "field", signature: "int pMouseY", template: "§1.p5o.pMouseY", comment: JRC.PAppletPMouseYComment },
        { type: "field", signature: "int mouseButton", template: "§1.p5o.mouseButton", comment: JRC.PAppletMouseButtonComment },
        
        { type: "field", signature: "int key", template: "§1.p5o.key", comment: JRC.PAppletKeyComment },
        
        { type: "field", signature: "int LEFT", template: "§1.p5o.LEFT", comment: JRC.PAppletLEFTComment },
        { type: "field", signature: "int CENTER", template: "§1.p5o.CENTER", comment: JRC.PAppletCENTERComment },
        { type: "field", signature: "int RIGHT", template: "§1.p5o.RIGHT", comment: JRC.PAppletRIGHTComment },
        { type: "field", signature: "int TOP", template: "§1.p5o.TOP", comment: JRC.PAppletTOPComment },
        { type: "field", signature: "int BASELINE", template: "§1.p5o.BASELINE", comment: JRC.PAppletBASELINEComment },
        { type: "field", signature: "int BOTTOM", template: "§1.p5o.BOTTOM", comment: JRC.PAppletBOTTOMComment },
        
        { type: "field", signature: "int CORNER", template: "§1.p5o.CORNER", comment: JRC.PAppletCORNERComment },
        { type: "field", signature: "int CORNERS", template: "§1.p5o.CORNERS", comment: JRC.PAppletCORNERSComment },
        { type: "field", signature: "int RADIUS", template: "§1.p5o.RADIUS", comment: JRC.PAppletRADIUSComment },
        
        { type: "field", signature: "int POINTS", template: "§1.p5o.POINTS", comment: JRC.PAppletPOINTSComment },
        { type: "field", signature: "int LINES", template: "§1.p5o.LINES", comment: JRC.PAppletLINESComment },
        { type: "field", signature: "int TRIANGLES", template: "§1.p5o.TRIANGLES", comment: JRC.PAppletTRIANGLESComment },
        { type: "field", signature: "int TRIANGLE_STRIP", template: "§1.p5o.TRIANGLE_STRIP", comment: JRC.PAppletTRIANGLE_STRIPComment },
        { type: "field", signature: "int TRIANGLE_FAN", template: "§1.p5o.TRIANGLE_FAN", comment: JRC.PAppletTRIANGLE_FANComment },
        
        { type: "field", signature: "string QUADS", template: "§1.p5o.QUADS", comment: JRC.PAppletQUADSComment },
        { type: "field", signature: "string QUAD_STRIP", template: "§1.p5o.QUAD_STRIP", comment: JRC.PAppletQUAD_STRIPComment },
        { type: "field", signature: "string TESS", template: "§1.p5o.TESS", comment: JRC.PAppletTESSComment },
        
        { type: "field", signature: "string CLOSE", template: "§1.p5o.CLOSE", comment: JRC.PAppletCLOSEComment },
        
        { type: "field", signature: "string DEGREES", template: "§1.p5o.DEGREES", comment: JRC.PAppletDEGREESComment },
        { type: "field", signature: "string RADIANS", template: "§1.p5o.RADIANS", comment: JRC.PAppletRADIANSComment },
        
        { type: "field", signature: "string WEBGL", template: "§1.p5o.WEBGL", comment: JRC.PAppletWEBGLComment },
        { type: "field", signature: "string P2D", template: "§1.p5o.P2D", comment: JRC.PAppletP2DComment },

        { type: "field", signature: "string RGB", template: "§1.p5o.RGB", comment: JRC.PAppletRGBComment },
        { type: "field", signature: "string HSL", template: "§1.p5o.HSL", comment: JRC.PAppletHSLComment },
        { type: "field", signature: "string HSB", template: "§1.p5o.HSB", comment: JRC.PAppletHSBComment },
        
        { type: "field", signature: "string PI", template: "§1.p5o.PI", comment: "PI = 3.1415..." },
        { type: "field", signature: "string QUARTER_PI", template: "§1.p5o.QUARTER_PI", comment: "PI/4" },
        { type: "field", signature: "string TWO_PI", template: "§1.p5o.TWO_PI", comment: "2*PI" },
        { type: "field", signature: "string TAU", template: "§1.p5o.TAU", comment: "2*PI" },
        
        { type: "method", signature: "PApplet()", java: PAppletClass.prototype._cj$_constructor_$PApplet$, comment: JRC.PAppletConstructorComment },

        { type: "method", signature: "void main()", java: PAppletClass.prototype._mj$main$void$, comment: JRC.PAppletMainComment },
        { type: "method", signature: "void loop()", template: `§1.loopStopped = false`, comment: JRC.PAppletLoopComment },
        { type: "method", signature: "void noLoop()", template: `§1.loopStopped = true`, comment: JRC.PAppletNoLoopComment },
        { type: "method", signature: "void size(int width, int height)", native: PAppletClass.prototype._createCanvas, comment: JRC.PAppletCreateCanvasComment },
        { type: "method", signature: "void createCanvas(int width, int height)", native: PAppletClass.prototype._createCanvas, comment: JRC.PAppletCreateCanvasComment },
        { type: "method", signature: "void createCanvas(int width, int height, string renderer)", native: PAppletClass.prototype._createCanvas, comment: JRC.PAppletCreateCanvasComment },

        // Events:
        { type: "method", signature: "void setup()", java: PAppletClass.prototype._mj$setup$void$, comment: JRC.PAppletSetupComment },
        { type: "method", signature: "void settings()", java: PAppletClass.prototype._mj$settings$void$, comment: JRC.PAppletSettingsComment },
        { type: "method", signature: "void preload()", java: PAppletClass.prototype._mj$preload$void$, comment: JRC.PAppletPreloadComment },
        { type: "method", signature: "void draw()", java: PAppletClass.prototype._mj$draw$void$, comment: JRC.PAppletDrawComment },
        { type: "method", signature: "void mousePressed()", java: PAppletClass.prototype._mj$mousePressed$void$, comment: JRC.PAppletMousePressedComment },
        { type: "method", signature: "void mouseReleased()", java: PAppletClass.prototype._mj$mouseReleased$void$, comment: JRC.PAppletMouseReleasedComment },
        { type: "method", signature: "void mouseClicked()", java: PAppletClass.prototype._mj$mouseClicked$void$, comment: JRC.PAppletMouseClickedComment },
        { type: "method", signature: "void mouseDragged()", java: PAppletClass.prototype._mj$mouseDragged$void$, comment: JRC.PAppletMouseDraggedComment },
        { type: "method", signature: "void mouseEntered()", java: PAppletClass.prototype._mj$mouseEntered$void$, comment: JRC.PAppletMouseEnteredComment },
        { type: "method", signature: "void mouseExited()", java: PAppletClass.prototype._mj$mouseExited$void$, comment: JRC.PAppletMouseExitedComment },
        { type: "method", signature: "void mouseMoved()", java: PAppletClass.prototype._mj$mouseMoved$void$, comment: JRC.PAppletMouseMovedComment },
        { type: "method", signature: "void keyPressed()", java: PAppletClass.prototype._mj$keyPressed$void$, comment: JRC.PAppletKeyPressedComment },
        { type: "method", signature: "void keyReleased()", java: PAppletClass.prototype._mj$keyReleased$void$, comment: JRC.PAppletKeyReleasedComment },



    ]).concat(PAppletClass.addProcessingMethods());

    static type: NonPrimitiveType;

    // graphicsDiv contains containerOuter contains containerInnen
    graphicsDiv!: HTMLDivElement;
    containerOuter!: HTMLDivElement;
    containerInner!: HTMLDivElement;


    width: number = 800;
    height: number = 600;

    p5o!: p5;

    renderer: p5.RENDERER = "webgl";
    loopStopped: boolean = false;

    onSizeChanged: () => void = () => { };
    canvasCreated: boolean = false;

    _mj$setup$void$(t: Thread, callback: CallbackFunction) { }
    _mj$settings$void$(t: Thread, callback: CallbackFunction) { }
    _mj$preload$void$(t: Thread, callback: CallbackFunction) { }
    _mj$draw$void$(t: Thread, callback: CallbackFunction) { }
    _mj$mousePressed$void$(t: Thread, callback: CallbackFunction) { }
    _mj$mouseReleased$void$(t: Thread, callback: CallbackFunction) { }
    _mj$mouseClicked$void$(t: Thread, callback: CallbackFunction) { }
    _mj$mouseDragged$void$(t: Thread, callback: CallbackFunction) { }
    _mj$mouseEntered$void$(t: Thread, callback: CallbackFunction) { }
    _mj$mouseExited$void$(t: Thread, callback: CallbackFunction) { }
    _mj$mouseMoved$void$(t: Thread, callback: CallbackFunction) { }
    _mj$keyPressed$void$(t: Thread, callback: CallbackFunction) { }
    _mj$keyReleased$void$(t: Thread, callback: CallbackFunction) { }

    _mj$main$void$(t: Thread, callback: CallbackFunction) {

    }

    _cj$_constructor_$PApplet$(t: Thread, callback: CallbackFunction) {
        this._constructor();
        t.s.push(this);

        let interpreter = t.scheduler.interpreter;
        interpreter.isExternalTimer = true;
        this.graphicsDiv = <HTMLDivElement>interpreter.graphicsManager?.graphicsDiv;
        this.graphicsDiv.style.overflow = "hidden";

        this.setupGraphicsDiv(this.graphicsDiv);
        this.setupProcessing(this.containerInner, interpreter);

        interpreter.eventManager.once("stop", () => {
            let dummy = () => { };
            this.p5o.draw = dummy;
            this.p5o.setup = dummy;
            this.p5o.preload = dummy;
            this.p5o.mousePressed = dummy;
            this.p5o.mouseReleased = dummy;
            this.p5o.mouseClicked = dummy;
            this.p5o.mouseDragged = dummy;
            this.p5o.keyPressed = dummy;
            this.p5o.keyReleased = dummy;
            interpreter.isExternalTimer = false;
        })

        this.p5o.POINTS

        interpreter.eventManager.once("resetRuntime", () => {
            this.p5o.remove();
            interpreter.objectStore["PApplet"] = undefined;
            this.canvasCreated = false;
        })

        interpreter.objectStore["PApplet"] = this;

    }

    setupGraphicsDiv(graphicsDiv: HTMLDivElement) {
        this.containerOuter = DOM.makeDiv(undefined);

        this.onSizeChanged = () => {
            // let $jo_tabs = $graphicsDiv.parents(".jo_tabs");
            let $jo_tabs = graphicsDiv.parentElement!;
            let maxWidth: number = $jo_tabs.getBoundingClientRect().width;
            let maxHeight: number = $jo_tabs.getBoundingClientRect().height;

            if (this.height / this.width > maxHeight / maxWidth) {
                graphicsDiv.style.width = this.width / this.height * maxHeight + "px";
                graphicsDiv.style.height = maxHeight + "px";
            } else {
                graphicsDiv.style.width = maxWidth + "px";
                graphicsDiv.style.height = this.height / this.width * maxWidth + "px";
            }
        };

        graphicsDiv.onresize = (ev) => { this.onSizeChanged() }

        this.onSizeChanged();

        this.containerInner = DOM.makeDiv(this.containerOuter);
        graphicsDiv.innerHTML = '';
        graphicsDiv.append(this.containerOuter);

        graphicsDiv.oncontextmenu = function (e) {
            e.preventDefault();
        };

        // this.module.main.getRightDiv()?.adjustWidthToWorld();

    }

    _createCanvas(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.onSizeChanged();
        this.p5o.createCanvas(this.width, this.height, this.renderer);

        let canvas = this.containerInner.getElementsByTagName('canvas');
        if (canvas.length > 0) {
            canvas[0].style.width = "";
            canvas[0].style.height = "";
        }

        this.canvasCreated = true;
    }


    setupProcessing(containerInner: HTMLDivElement, interpreter: Interpreter) {

        let that = this;
        this.canvasCreated = false;
        let drawMethodPending: boolean = true;

        let sketch = (p5: p5) => {

            p5.setup = function () {
                that.renderer = p5.P2D;
                that.p5o = p5;

                let afterFinishingBoth = () => {
                    drawMethodPending = false
                    // $div.find('canvas').css({
                    //     'width': '',
                    //     'height': ''
                    // })            
                    if(!that.canvasCreated){
                        that._createCanvas(that.width, that.height);
                    }
                }


                let i = 2;

                that.runMethod(that._mj$setup$void$, () => {
                    if (--i == 0) afterFinishingBoth();
                }, interpreter);

                that.runMethod(that._mj$settings$void$, () => {
                    if (--i == 0) afterFinishingBoth();
                }, interpreter);


            };

            p5.preload = function () {
                that.runMethod(that._mj$preload$void$, undefined, interpreter);
            };

            p5.draw = function () {
                if (interpreter.scheduler.state == SchedulerState.running && !that.loopStopped) {
                    if (!drawMethodPending) {
                        drawMethodPending = true;
                        that.runMethod(that._mj$draw$void$, () => {
                            drawMethodPending = false;
                        }, interpreter);
                    }
                }
                interpreter.timerFunction(1000 / 60.0);
                // p5.background(50);
                // p5.rect(p5.width / 2, p5.height / 2, 50, 50);

            };

            p5.mousePressed = function () {
                that.runMethod(that._mj$mousePressed$void$, undefined, interpreter);
            };

            p5.mouseReleased = function () {
                that.runMethod(that._mj$mouseReleased$void$, undefined, interpreter);
            };

            p5.mouseClicked = function () {
                that.runMethod(that._mj$mouseClicked$void$, undefined, interpreter);
            };

            p5.mouseDragged = function () {
                that.runMethod(that._mj$mouseDragged$void$, undefined, interpreter);
            };

            // p5.mouseEntered = function () {
            //     that.runMethod(that._mj$mouseEntered$void$, undefined, interpreter);
            // };

            // p5.mouseExited = function () {
            //     that.runMethod(that._mj$mouseExited$void$, undefined, interpreter);
            // };

            p5.mouseMoved = function () {
                that.runMethod(that._mj$mouseMoved$void$, undefined, interpreter);
            };

            p5.keyPressed = function () {
                that.runMethod(that._mj$keyPressed$void$, undefined, interpreter);
            };

            p5.keyReleased = function () {
                that.runMethod(that._mj$keyReleased$void$, undefined, interpreter);
            };


        }

        //@ts-ignore
        new p5(sketch, containerInner);
        let canvas = this.containerInner.getElementsByTagName('canvas');
        if (canvas.length > 0) {
            canvas[0].style.width = "";
            canvas[0].style.height = "";
        }

    }

    runMethod(method: (t: Thread, callback: CallbackFunction) => void, callback: CallbackFunction, interpreter: Interpreter) {

        // Test if method is overridden:
        //@ts-ignore
        if (method == PAppletClass.prototype[method.name]) {
            if (callback) callback();
            return;
        }

        let t: Thread = interpreter.scheduler.createThread("processing: " + method.name);
        method.call(this, t, callback);
        t.startIfNotEmptyOrDestroy();

    }

    static addProcessingMethods(): LibraryDeclarations {
        return [
/**
 * Setzen von Farben
 */
            PAppletClass.getProcessingMethod('clear', [], [],
                'Löscht die Zeichenfläche.'),

            PAppletClass.getProcessingMethod('background', ['rgb'], "double",
                'Übermalt die komplette Zeichenfläche mit der übergebenen Farbe.'),

            PAppletClass.getProcessingMethod('background', ['colorAsString'], "string",
                "Übermalt die komplette Zeichenfläche mit der übergebenen Farbe. Übergeben wird eine Zeichenkette der Form 'rgb(0,0,255)' oder 'rgb(0%, 0%, 100%)' oder 'rgba(0, 0, 255, 1)' oder 'rgba(0%, 0%, 100%, 1)' und all diese Kombinationen statt rgb auch mit hsl und hsb.", "string"),

            PAppletClass.getProcessingMethod('background', ['v1', 'v2', 'v3'], "double",
                'Übermalt die komplette Zeichenfläche mit der übergebenen Farbe. v1, v2 und v3 sind - abhängig vom aktuellen color mode - rot, grün und blauwert oder Farbe, Sättigung und Helligkeit'),

            PAppletClass.getProcessingMethod('fill', ['rgb'], "int",
                'Setzt die Füllfarbe.'),

            PAppletClass.getProcessingMethod('fill', ['rgb'], "string",
                'Setzt die Füllfarbe.'),

            PAppletClass.getProcessingMethod('fill', ['rgb', 'alpha'], ["int", "double"],
                'Setzt die Füllfarbe.'),

            PAppletClass.getProcessingMethod('fill', ['gray'], "double",
                'Setzt die Füllfarbe.'),

            PAppletClass.getProcessingMethod('fill', ['v1', 'v2', 'v3'], "double",
                'Setzt die Füllfarbe. v1, v2 und v3 sind - abhängig vom aktuellen color mode - rot, grün und blauwert oder Farbe, Sättigung und Helligkeit'),

            PAppletClass.getProcessingMethod('fill', ['v1', 'v2', 'v3', 'alpha'], "double",
                'Setzt die Füllfarbe. v1, v2 und v3 sind - abhängig vom aktuellen color mode - rot, grün und blauwert oder Farbe, Sättigung und Helligkeit'),

            PAppletClass.getProcessingMethod('noFill', [], [],
                'Die nachfolgend gezeichneten Figuren werden nicht gefüllt.'),

            PAppletClass.getProcessingMethod('stroke', ['rgb'], "int",
                'Setzt die Linienfarbe.'),

            PAppletClass.getProcessingMethod('stroke', ['rgb'], "string",
                'Setzt die Linienfarbe.'),

            PAppletClass.getProcessingMethod('stroke', ['rgb', 'alpha'], ["int", "double"],
                'Setzt die Linienfarbe.'),

            PAppletClass.getProcessingMethod('stroke', ['gray'], "double",
                'Setzt die Linienfarbe.'),

            PAppletClass.getProcessingMethod('stroke', ['v1', 'v2', 'v3'], "double",
                'Setzt die Linienfarbe. v1, v2 und v3 sind - abhängig vom aktuellen color mode - rot, grün und blauwert oder Farbe, Sättigung und Helligkeit'),

            PAppletClass.getProcessingMethod('stroke', ['v1', 'v2', 'v3', 'alpha'], "double",
                'Setzt die Linienfarbe. v1, v2 und v3 sind - abhängig vom aktuellen color mode - rot, grün und blauwert oder Farbe, Sättigung und Helligkeit'),

            PAppletClass.getProcessingMethod('strokeWeight', ['weight'], "double",
                'Setzt die Linienbreite.'),

            PAppletClass.getProcessingMethod('noStroke', [], [],
                'Die nachfolgend gezeichneten Figuren werden ohne Rand gezeichnet.'),

            PAppletClass.getProcessingMethod('color', ['gray'], "double",
                'Gibt den Grauton als String-kodierte Farbe zurück.', "string"),

            PAppletClass.getProcessingMethod('color', ['colorAsString'], "string",
                "Gibt die Farbe zurück. Übergeben kann eine Zeichenkette der Form 'rgb(0,0,255)' oder 'rgb(0%, 0%, 100%)' oder 'rgba(0, 0, 255, 1)' oder 'rgba(0%, 0%, 100%, 1)' und all diese Kombinationen statt rgb auch mit hsl und hsb.", "string"),

            PAppletClass.getProcessingMethod('color', ['gray', 'alpha'], "double",
                'Gibt den Grauton als String-kodierte Farbe zurück.', "string"),

            PAppletClass.getProcessingMethod('color', ['v1', 'v2', 'v3'], "double",
                'Gibt die aus v1, v2, v3 gebildete Farbe String-kodiert zurück.', "string"),

            PAppletClass.getProcessingMethod('color', ['v1', 'v2', 'v3', 'alpha'], "double",
                'Gibt die aus v1, v2, v3 und alpha gebildete Farbe String-kodiert zurück.', "string"),

            PAppletClass.getProcessingMethod('lerpColor', ['colorA', 'colorB', 't'], ["string", "string", "double"],
                'Gibt eine Zwischenfarbe zwischen colorA und colorB zurück. t == 0 bedeutet: colorA, t == 1 bedeutet: colorB, t == 0.5 bedeutet: genau zwischen beiden, usw.', "string"),

            PAppletClass.getProcessingMethod('colorMode', ['mode'], "string",
                'Setzt den Modus, in dem nachfolgende Aufrufe von color(...) interpretiert werden. Möglich sind die Werte RGB, HSL und HSB.'),

            PAppletClass.getProcessingMethod('colorMode', ['mode', 'max'], ["string", "double"],
                'Setzt den Modus, in dem nachfolgende Aufrufe von color(...) interpretiert werden. Möglich sind die Werte RGB, HSL und HSB für Mode. Max ist der Maximalwert jeder Farbkomponente.'),

            PAppletClass.getProcessingMethod('colorMode', ['mode', 'max1', 'max2', 'max3'], ["string", "double", "double", "double"],
                'Setzt den Modus, in dem nachfolgende Aufrufe von color(...) interpretiert werden. Möglich sind die Werte RGB, HSL und HSB für Mode. Max ist der Maximalwert jeder Farbkomponente.'),

            PAppletClass.getProcessingMethod('colorMode', ['mode', 'max1', 'max2', 'max3', 'maxAlpha'], ["string", "double", "double", "double", "double"],
                'Setzt den Modus, in dem nachfolgende Aufrufe von color(...) interpretiert werden. Möglich sind die Werte RGB, HSL und HSB für Mode. Max ist der Maximalwert jeder Farbkomponente.'),



            /**
             * Zeichnen geometrischer Figuren
             */
            PAppletClass.getProcessingMethod('rectMode', ['mode'], "string",
                'Setzt den Modus, in dem nachfolgende Aufrufe von rect(...) interpretiert werden. Möglich sind die Werte CORNER, CORNERS, RADIUS und CENTER.'),

            PAppletClass.getProcessingMethod('rect', ['left', 'top', 'width', 'height'], "double",
                'Zeichnet ein Rechteck. (left, top) ist die linke obere Ecke, width die Breite und height die Höhe des Rechtecks.'),

            PAppletClass.getProcessingMethod('rect', ['left', 'top', 'width', 'height', 'radius'], "double",
                'Zeichnet ein Rechteck mit abgerundeten Ecken. (left, top) ist die linke obere Ecke, width die Breite und height die Höhe des Rechtecks.'),

            PAppletClass.getProcessingMethod('rect', ['left', 'top', 'width', 'height', 'radius1', 'radius2', 'radius3', 'radius4'], "double",
                'Zeichnet ein Rechteck mit abgerundeten Ecken. (left, top) ist die linke obere Ecke, width die Breite und height die Höhe des Rechtecks.'),

            PAppletClass.getProcessingMethod('square', ['left', 'top', 'width'], "double",
                'Zeichnet ein Quadrat. (left, top) ist die linke obere Ecke, width Seitenlänge des Quadrats.'),

            PAppletClass.getProcessingMethod('square', ['left', 'top', 'width', 'radius'], "double",
                'Zeichnet ein Quadrat mit abgerundeten Ecken. (left, top) ist die linke obere Ecke, width Seitenlänge des Quadrats. Radius ist der Eckenradius.'),

            PAppletClass.getProcessingMethod('square', ['left', 'top', 'width', 'radius1', 'radius2', 'radius3', 'radius4'], "double",
                'Zeichnet ein Quadrat mit abgerundeten Ecken. (left, top) ist die linke obere Ecke, width Seitenlänge des Quadrats. Radius ist der Eckenradius.'),

            PAppletClass.getProcessingMethod('rect', ['left', 'top', 'width', 'height', 'radius'], "double",
                'Zeichnet ein Rechteck. (left, top) ist die linke obere Ecke, width die Breite und height die Höhe des Rechtecks. Radius ist der Eckenradius'),

            PAppletClass.getProcessingMethod('ellipse', ['left', 'top', 'width', 'height'], "double",
                'Zeichnet eine Ellipse. (left, top) ist die linke obere Ecke der Boundingbox der Ellipse, width ihre Breite und height ihre Höhe. Das lässt sich aber mit ellipseMode(...) ändern!'),

            PAppletClass.getProcessingMethod('circle', ['x', 'y', 'extent'], "double",
                'Zeichnet einen Kreis. (x, y) ist der Mittelpunkt des Kreises, extent der doppelte Radius.'),

            PAppletClass.getProcessingMethod('ellipseMode', ['mode'], "string",
                'Setzt den Modus, in dem nachfolgende Aufrufe von ellipse(...) interpretiert werden. Möglich sind die Werte CORNER, CORNERS, RADIUS und CENTER.'),


            PAppletClass.getProcessingMethod('line', ['x1', 'y1', 'x2', 'y2'], "double",
                'Zeichnet eine Strecke von (x1, y1) nach (x2, y2).'),

            PAppletClass.getProcessingMethod('line', ['x1', 'y1', 'z1', 'x2', 'y2', 'z2'], "double",
                'Zeichnet eine Strecke von (x1, y1, z1) nach (x2, y2, z2).'),

            PAppletClass.getProcessingMethod('triangle', ['x1', 'y1', 'x2', 'y2', 'x3', 'y3'], "double",
                'Zeichnet eine Dreieck mit den Eckpunkten (x1, y1), (x2, y2) und (x3, y3).'),

            PAppletClass.getProcessingMethod('quad', ['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4'], "double",
                'Zeichnet eine Viereck mit den Eckpunkten (x1, y1), (x2, y2), (x3, y3) und (x4, y4).'),

            PAppletClass.getProcessingMethod('bezier', ['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4'], "double",
                'Zeichnet eine kubische Bezierkurve mit den Ankerpunkten (x1, y1), (x4, y4) und den Kontrollpunkten (x2, y2), (x3, y3).'),

            PAppletClass.getProcessingMethod('curve', ['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4'], "double",
                'Zeichnet eine Catmull-Rom-Kurve vom Punkt (x2, y2) nach (x3, y3) so, als würde sie von (x1, x2) kommen und es am Ende zu (x4, y4) weitergehen.'),

            PAppletClass.getProcessingMethod('curvePoint', ['a', 'b', 'c', 'd', 't'], "double",
                'Will man die Zwischenpunkte einer Curve erhalten (Beginn b, Ende c, als würde sie von a kommen und nach d gehen), so verwendet man sowohl für die x- als auch für die y-Koordinate diese Funktion. t gibt an, welchen Punkt der Kurve man haben möchte. t hat Werte zwischen 0 (Startpunkt) und 1 (Endpunkt).', "double"),

            PAppletClass.getProcessingMethod('curveTangent', ['a', 'b', 'c', 'd', 't'], "double",
                'Will man die Zwischentangenten einer Curve erhalten (Beginn b, Ende c, als würde sie von a kommen und nach d gehen), so verwendet man sowohl für die x- als auch für die y-Koordinate diese Funktion. t gibt an, welchen Punkt der Kurve man haben möchte. t hat Werte zwischen 0 (Startpunkt) und 1 (Endpunkt).', "double"),

            PAppletClass.getProcessingMethod('bezierPoint', ['x1', 'x2', 'x3', 'x4', 't'], "double",
                'Will man die Zwischenpunkte einer Bezierkurve erhalten (Ankerkoordinaten x1, x4 und Stützkoordinaten x2, x3), so nutzt man - einzeln sowohl für die x- also auch für die y-Koordinate - diese Funktion. t gibt an, welchen Punkt der Kurve man haben möchte. t hat Werte zwischen 0 (Startpunkt) und 1 (Endpunkt).', "double"),

            PAppletClass.getProcessingMethod('bezierTangent', ['x1', 'x2', 'x3', 'x4', 't'], "double",
                'Will man die Zwischentangenten einer Bezierkurve erhalten (Ankerkoordinaten x1, x4 und Stützkoordinaten x2, x3), so nutzt man - einzeln sowohl für die x- also auch für die y-Koordinate - diese Funktion. t gibt an, welchen Punkt der Kurve man haben möchte. t hat Werte zwischen 0 (Startpunkt) und 1 (Endpunkt).', "double"),


            PAppletClass.getProcessingMethod('beginShape', [], [],
                'Beginnt mit dem Zeichnen eines Polygons. Die einzelnen Punkte werden mit der Methode vertex(x, y) gesetzt.'),

            PAppletClass.getProcessingMethod('endShape', [], [],
                'Endet das Zeichnen eines Polygons.'),

            PAppletClass.getProcessingMethod('beginShape', ['kind'], "string",
                'Beginnt mit dem Zeichnen eines Polygons. Die einzelnen Punkte werden mit der Methode vertex(x, y) gesetzt. Mögliche Werte für kind sind: POINTS, LINES, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN, QUADS, QUAD_STRIP'),

            PAppletClass.getProcessingMethod('endShape', ['kind'], "string",
                'endShape(CLOSE) schließt den Linienzug.'),

            PAppletClass.getProcessingMethod('vertex', ['x', 'y'], "double",
                'Setzt zwischen beginShape() und endShape() einen Punkt.'),

            PAppletClass.getProcessingMethod('point', ['x', 'y'], "double",
                'Zeichnet einen Punkt.'),

            PAppletClass.getProcessingMethod('set', ['x', 'y', 'color'], ["double", "double", "string"],
                'Setzt die Farbe des Pixels bei (x, y).'),

            PAppletClass.getProcessingMethod('vertex', ['x', 'y', 'z'], "double",
                'Setzt zwischen beginShape() und endShape() einen Punkt.'),

            PAppletClass.getProcessingMethod('point', ['x', 'y', 'z'], "double",
                'Zeichnet einen Punkt.'),

            PAppletClass.getProcessingMethod('curveVertex', ['x', 'y'], "double",
                'Setzt zwischen beginShape() und endShape() einen Punkt. Processing zeichnet damit eine Kurve nach dem Catmull-Rom-Algorithmus.'),

            PAppletClass.getProcessingMethod('curvevertex', ['x', 'y', 'z'], "double",
                'Setzt zwischen beginShape() und endShape() einen Punkt. Processing zeichnet damit eine Kurve nach dem Catmull-Rom-Algorithmus.'),

            PAppletClass.getProcessingMethod('box', ['size'], "double",
                'Zeichnet einen 3D-Würfel mit der Seitenlänge size.'),

            PAppletClass.getProcessingMethod('box', ['sizeX', 'sizeY', 'sizeZ'], "double",
                'Zeichnet einen 3D-Würfel mit den angegebenen Seitenlängen.'),

            /**
             * Transformationen
             */
            PAppletClass.getProcessingMethod('resetMatrix', [], [],
                'Setzt alle erfolgten Transformationen zurück.'),

            PAppletClass.getProcessingMethod('push', [], [],
                'Sichert den aktuellen Zeichenzustand, d.h. die Farben und Transformationen, auf einen Stack.'),

            PAppletClass.getProcessingMethod('pop', [], [],
                'Holt den obersten Zeichenzustand, d.h. die Farben und Transformationen, vom Stack.'),

            PAppletClass.getProcessingMethod('scale', ['factor'], "double",
                'Streckt die nachfolgend gezeichneten Figuren.'),

            PAppletClass.getProcessingMethod('scale', ['factorX', 'factorY'], "double",
                'Streckt die nachfolgend gezeichneten Figuren.'),

            PAppletClass.getProcessingMethod('scale', ['factorX', 'factorY', 'factorZ'], "double",
                'Streckt die nachfolgend gezeichneten Figuren.'),

            PAppletClass.getProcessingMethod('translate', ['x', 'y'], "double",
                'Verschiebt die nachfolgend gezeichneten Figuren.'),

            PAppletClass.getProcessingMethod('translate', ['x', 'y', 'z'], "double",
                'Verschiebt die nachfolgend gezeichneten Figuren.'),

            PAppletClass.getProcessingMethod('rotate', ['angle'], "double",
                'Rotiert die nachfolgend gezeichneten Figuren. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.'),

            PAppletClass.getProcessingMethod('rotateX', ['angle'], "double",
                'Rotiert die nachfolgend gezeichneten Figuren um die X-Achse. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.'),

            PAppletClass.getProcessingMethod('rotateY', ['angle'], "double",
                'Rotiert die nachfolgend gezeichneten Figuren um die Y-Achse. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.'),

            PAppletClass.getProcessingMethod('shearX', ['angle'], "double",
                'Schert die nachfolgend gezeichneten Figuren in Richtung derX-Achse. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.'),

            PAppletClass.getProcessingMethod('shearY', ['angle'], "double",
                'Schert die nachfolgend gezeichneten Figuren in Richtung der Y-Achse. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.'),

            PAppletClass.getProcessingMethod('rotateZ', ['angle'], "double",
                'Rotiert die nachfolgend gezeichneten Figuren um die Z-Achse. Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie angle interpretiert wird. Default ist RADIANS.'),

            PAppletClass.getProcessingMethod('angleMode', ['mode'], "string",
                'Mit angleMode(RADIANS) bzw. angleMode(DEGREES) kann beeinflusst werden, wie winkel bei Rotationen interpretiert werden. Default ist RADIANS.'),

            /**
             * Text
             */
            PAppletClass.getProcessingMethod('textSize', ['size'], "double",
                'Setzt die Schriftgröße in Pixel.'),

            // PAppletClass.getProcessingMethod('loadFont', ['fontname'], "string",
            //     'Lädt eine Schriftart. Diese Methode muss in der Methode preload aufgerufen werden.'),

            PAppletClass.getProcessingMethod('textAlign', ['alignX'], "int",
                'Setzt die Ausrichtung des nächsten ausgegebenen Textes in x-Richtung. Mögliche Werte sind CENTER, LEFT, RIGHT'),

            PAppletClass.getProcessingMethod('textAlign', ['alignX', 'alignY'], "int",
                'Setzt die Ausrichtung des nächsten ausgegebenen Textes. Mögliche Werte für alignX sind CENTER, LEFT, RIGHT, mögliche Werte für alignY sind TOP, CENTER, BASELINE, BOTTOM'),

            PAppletClass.getProcessingMethod('text', ['text', 'x', 'y'], ["string", "double", "double"],
                'Gibt Text aus.'),

            PAppletClass.getProcessingMethod('text', ['text', 'x', 'y', 'x2', 'y2'], ["string", "double", "double", "double", "double"],
                'Gibt Text aus. x2 und y2 sind die Breite und Höhe des Textausgabebereichs. Hat der Text horizontal nicht Platz, so wird er entsprechend umgebrochen.'),

            /**
             * Mathematische Funktionen
             */
            PAppletClass.getProcessingMethod('random', ['low', 'high'], "double",
                'Gibt eine Zufallszahl zwischen low und high zurück.', "double"),

            PAppletClass.getProcessingMethod('random', ['high'], "double",
                'Gibt eine Zufallszahl zwischen 0 und high zurück.', "double"),

            PAppletClass.getProcessingMethod('sqrt', ['n'], "double",
                'Gibt die Quadratwurzel von n zurück.', "double"),

            PAppletClass.getProcessingMethod('pow', ['basis', 'exponent'], "double",
                'Gibt die den Wert der Potenz ("basis hoch exponent") zurück.', "double"),

            PAppletClass.getProcessingMethod('max', ['a', 'b'], "double",
                'Gibt den größeren der beiden Werte zurück.', "double"),

            PAppletClass.getProcessingMethod('min', ['a', 'b'], "double",
                'Gibt den kleineren der beiden Werte zurück.', "double"),

            PAppletClass.getProcessingMethod('abs', ['n'], "double",
                'Gibt den Betrag des Wertes zurück.', "double"),

            PAppletClass.getProcessingMethod('sin', ['n'], "double",
                'Gibt den Sinus des Wertes zurück.', "double"),

            PAppletClass.getProcessingMethod('cos', ['n'], "double",
                'Gibt den Cosinus des Wertes zurück.', "double"),

            PAppletClass.getProcessingMethod('tan', ['n'], "double",
                'Gibt den Tangens des Wertes zurück.', "double"),

            PAppletClass.getProcessingMethod('asin', ['n'], "double",
                'Gibt den Arcussinus des Wertes zurück.', "double"),

            PAppletClass.getProcessingMethod('acos', ['n'], "double",
                'Gibt den Arcussosinus des Wertes zurück.', "double"),

            PAppletClass.getProcessingMethod('radians', ['angle'], "double",
                'Wandelt einen Winkel vom Gradmaß ins Bogenmaß um.', "double"),

            PAppletClass.getProcessingMethod('degrees', ['angle'], "double",
                'Wandelt einen Winkel vom Bogenmaß ins Gradmaß um.', "double"),

            PAppletClass.getProcessingMethod('atan', ['n'], "double",
                'Gibt den Arcussangens des Wertes zurück.', "double"),

            PAppletClass.getProcessingMethod('atan2', ['x', 'y'], "double",
                'Gibt den Arcussangens des Wertes zurück.', "double"),

            PAppletClass.getProcessingMethod('sqrt', ['x', 'y'], "double",
                'Gibt die Quadratwurzel des Wertes zurück.', "double"),

            PAppletClass.getProcessingMethod('sq', ['x', 'y'], "double",
                'Gibt das Quadrat des Wertes zurück.', "double"),

            PAppletClass.getProcessingMethod('abs', ['n'], "int",
                'Gibt den Betrag des Wertes zurück.', "int"),

            PAppletClass.getProcessingMethod('round', ['n'], "double",
                'Rundet den Wert auf eine ganze Zahl.', "int"),

            PAppletClass.getProcessingMethod('ceil', ['n'], "double",
                'Rundet den Wert auf eine ganze Zahl (Aufrunden!).', "int"),

            PAppletClass.getProcessingMethod('floor', ['n'], "double",
                'Rundet den Wert auf eine ganze Zahl (Abfrunden!).', "int"),

            PAppletClass.getProcessingMethod('dist', ['x1', 'y1', 'x2', 'y2'], "double",
                'Berechnet den Abstand der Punkte (x1, y1) und (x2, y2).', "double"),

            PAppletClass.getProcessingMethod('lerp', ['a', 'b', 't'], "double",
                'Berechnet den a + (b - a)*t. Wählt man t zwischen 0 und 1, so kann man damit die Zwischenwerte zwischen a und b errechnen.', "double"),

            PAppletClass.getProcessingMethod('constrain', ['value', 'min', 'max'], "double",
                'Beschränkt value auf den Bereich [min, max], genauer: Ist value < min, so wird min zurückgegeben. Ist value > max, so wird max zurückgegeben. Ansonsten wird value zurückgegeben.', "double"),

            /**
             * Sonstiges
             */

            PAppletClass.getProcessingMethod('year', [], [],
                'Aktuelle Jahreszahl', "int"),

            PAppletClass.getProcessingMethod('month', [], [],
                'Monat: 1 == Januar, 12 == Dezember', "int"),

            PAppletClass.getProcessingMethod('day', [], [],
                'Tag (innerhalb des Monats) des aktuellen Datums', "int"),

            PAppletClass.getProcessingMethod('hour', [], [],
                'Stundenzahl der aktuellen Uhrzeit', "int"),

            PAppletClass.getProcessingMethod('hour', [], [],
                'Stundenzahl der aktuellen Uhrzeit', "int"),

            PAppletClass.getProcessingMethod('minute', [], [],
                'Minutenzahl der aktuellen Uhrzeit', "int"),

            PAppletClass.getProcessingMethod('second', [], [],
                'Sekundenzahl der aktuellen Uhrzeit', "int"),

            PAppletClass.getProcessingMethod('frameRate', ['n'], "int",
                'Setzt die Framerate (Anzahl der Aufrufe von draw() pro Sekunde)'),

            PAppletClass.getProcessingMethod('textWidth', ['text'], "string",
                'Gibt die Breite des Texts zurück.', "double"),

            PAppletClass.getProcessingMethod('textAscent', ['text'], "string",
                'Gibt den Ascent Textes zurück ( = Höhe des größten Zeichens über der Grundlinie).', "double"),

            PAppletClass.getProcessingMethod('textDescent', ['text'], "string",
                'Gibt den Descent Textes zurück ( = Tiefe des tiefsten Zeichens unter der Grundlinie).', "double"),

            PAppletClass.getProcessingMethod('textLeading', ['leading'], "double",
                'Setzt den Abstand zweier aufeinanderfolgender Textzeilen.'),

            PAppletClass.getProcessingMethod('cursor', ['type'], "string",
                'Ändert das Aussehen des Mauscursors. Type ist einer der Werte "arrow", "cross", "text", "move", "hand", "wait", "progress".'),

            PAppletClass.getProcessingMethod('noCursor', ['type'], "string",
                'Hat zur Folge, dass der Mauscursor über dem Zeichenbereich unsichtbar ist.'),

            PAppletClass.getProcessingMethod('copy', ['sx', 'sy', 'sw', 'sh', 'dx', 'dy', 'dw', 'dh'], "double",
                'Kopiert den rechteckigen Bereich mit der linken oberen Ecke (sx, sy) sowie der Breite sw und der Höhe sh in den Bereich mit der linken oberen Ecke (dx, dy), der Breite dw und der Höhe dh.'),

            PAppletClass.getProcessingMethod('millis', [], [],
                'Gibt die Millisekunden zurück, die vergangen sind, seit setup() aufgerufen wurde.'),

            PAppletClass.getProcessingMethod('redraw', [], [],
                'Führt draw() genau ein Mal aus. Macht ggf. Sinn, wenn die Render-Loop zuvor mit noLoop() gestoppt wurde.'),

        ];
    }

    static getProcessingMethod(identifier: string, parameterNames: string[], parameterTypes: string[] | string, comment: string, returnType?: string): LibraryMethodOrAttributeDeclaration {
        if(!Array.isArray(parameterTypes)) parameterTypes = [parameterTypes];
        
        let parametersCommaSeparated = parameterNames.map((name, index) => {
            let type: string = index < parameterTypes.length ? parameterTypes[index] : parameterTypes[0];
            return type + " " + name;
        }).join(", ");

        let templateParametersCommaSeparated = parameterNames.map((name, index) => "§" + (index + 2)).join(", ");

        let rt: string = returnType || "void";

        let decl: LibraryMethodOrAttributeDeclaration = {
            type: "method",
            signature: `${rt} ${identifier}(${parametersCommaSeparated})`,
            template: `§1.p5o.${identifier}(${templateParametersCommaSeparated})`,
            comment: comment
        }

        return decl;
    }

}