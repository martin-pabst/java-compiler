import p5 from "p5";
import { JRC } from "../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { CallbackFunction } from "../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../types/NonPrimitiveType.ts";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass.ts";
import { DOM } from "../../../../tools/DOM.ts";
import { Interpreter } from "../../../common/interpreter/Interpreter.ts";
import { SchedulerState } from "../../../common/interpreter/Scheduler.ts";

export class PAppletClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class PApplet extends Object", comment: JRC.PAppletClassComment },

        { type: "method", signature: "PApplet()", java: PAppletClass.prototype._cj$_constructor_$PApplet$, comment: JRC.PAppletConstructorComment },

        { type: "method", signature: "void main()", java: PAppletClass.prototype._mj$main$void$, comment: JRC.PAppletMainComment },
        
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

    ]

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

    onSizeChanged: () => void = () => {};
    canvasCreated: boolean = false;

    _mj$setup$void$(t: Thread, callback: CallbackFunction){}
    _mj$settings$void$(t: Thread, callback: CallbackFunction){}
    _mj$preload$void$(t: Thread, callback: CallbackFunction){}
    _mj$draw$void$(t: Thread, callback: CallbackFunction){}
    _mj$mousePressed$void$(t: Thread, callback: CallbackFunction){}
    _mj$mouseReleased$void$(t: Thread, callback: CallbackFunction){}
    _mj$mouseClicked$void$(t: Thread, callback: CallbackFunction){}
    _mj$mouseDragged$void$(t: Thread, callback: CallbackFunction){}
    _mj$mouseEntered$void$(t: Thread, callback: CallbackFunction){}
    _mj$mouseExited$void$(t: Thread, callback: CallbackFunction){}
    _mj$mouseMoved$void$(t: Thread, callback: CallbackFunction){}
    _mj$keyPressed$void$(t: Thread, callback: CallbackFunction){}
    _mj$keyReleased$void$(t: Thread, callback: CallbackFunction){}

    _mj$main$void$(t: Thread, callback: CallbackFunction){

    }

    _cj$_constructor_$PApplet$(t: Thread, callback: CallbackFunction){
        this._constructor();
        t.s.push(this);

        let interpreter = t.scheduler.interpreter;
        this.graphicsDiv = <HTMLDivElement>interpreter.graphicsManager?.graphicsDiv;
        this.graphicsDiv.style.overflow = "hidden";

        this.setupGraphicsDiv(this.graphicsDiv);
        this.setupProcessing(this.containerInner, interpreter);

        interpreter.eventManager.once("stop", () => {
            this.p5o.remove();
            interpreter.objectStore["PApplet"] = undefined;
        })

        interpreter.objectStore["PApplet"] = this;

    }

    setupGraphicsDiv(graphicsDiv: HTMLDivElement){
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

        graphicsDiv.onresize = (ev) => {this.onSizeChanged()}

        this.onSizeChanged();

        this.containerInner = DOM.makeDiv(this.containerOuter);
        
        graphicsDiv.append(this.containerOuter);

        graphicsDiv.oncontextmenu = function (e) {
            e.preventDefault();
        };

        // this.module.main.getRightDiv()?.adjustWidthToWorld();

    }

    createCanvas(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.onSizeChanged();
        this.p5o.createCanvas(this.width, this.height, this.renderer);
        
        let canvas = this.containerInner.getElementsByTagName('canvas');
        if(canvas.length > 0){
            canvas[0].style.width = "";
            canvas[0].style.height = "";
        }
        
        this.canvasCreated = true;
    }


    setupProcessing(containerInner: HTMLDivElement, interpreter: Interpreter) {

        let that = this;
        this.canvasCreated = false;
        let drawMethodPending: boolean = false;

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
                }

                that.createCanvas(that.width, that.height);

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
                interpreter.timerFunction(1000/30.0);
                p5.background(50);
                p5.rect(p5.width / 2, p5.height / 2, 50, 50);

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
        if(canvas.length > 0){
            canvas[0].style.width = "";
            canvas[0].style.height = "";
        }

    }

    runMethod(method: (t: Thread, callback: CallbackFunction) => void, callback: CallbackFunction, interpreter: Interpreter){

        // Test if method is overridden:
        //@ts-ignore
        if(method == PAppletClass.prototype[method.name]){
            if(callback) callback();
            return;
        }

        let t: Thread = interpreter.scheduler.createThread("processing: " + method.name);
        method.call(this, t, callback);
        t.startIfNotEmptyOrDestroy();

    }
}