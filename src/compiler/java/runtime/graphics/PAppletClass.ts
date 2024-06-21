import p5 from "p5";
import { JRC } from "../../../../tools/language/JavaRuntimeLibraryComments.ts";
import { CallbackFunction } from "../../../common/interpreter/StepFunction.ts";
import { Thread } from "../../../common/interpreter/Thread.ts";
import { LibraryDeclarations } from "../../module/libraries/DeclareType.ts";
import { NonPrimitiveType } from "../../types/NonPrimitiveType.ts";
import { ObjectClass } from "../system/javalang/ObjectClassStringClass.ts";
import { DOM } from "../../../../tools/DOM.ts";
import { Interpreter } from "../../../common/interpreter/Interpreter.ts";

export class PAppletClass extends ObjectClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class PApplet extends Object", comment: JRC.PAppletClassComment },

        { type: "method", signature: "PApplet()", java: PAppletClass.prototype._cj$_constructor_$PApplet$, comment: JRC.PAppletConstructorComment },


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



    _cj$_constructor_$PApplet$(t: Thread, callback: CallbackFunction){
        this._constructor();
        t.s.push(this);

        let interpreter = t.scheduler.interpreter;
        this.graphicsDiv = <HTMLDivElement>interpreter.graphicsManager?.graphicsDiv;
        this.graphicsDiv.style.overflow = "hidden";

        this.setupGraphicsDiv(this.graphicsDiv);
        this.setupProcessing(this.containerInner, interpreter);

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
        
        jQuery(this.containerInner).find('canvas').css({
            'width': '',
            'height': ''

        });
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
                }

                that.createCanvas(that.width, that.height);

                let i = 2;

                that.runMethod('setup', () => {
                    if (--i == 0) afterFinishingBoth();
                });

                that.runMethod('settings', () => {
                    if (--i == 0) afterFinishingBoth();
                });


            };

            p5.preload = function () {
                that.runMethod('preload');
            };

            p5.draw = function () {
                if (that.interpreter.state == InterpreterState.running && !that.loopStopped) {
                    if (!drawMethodPending) {
                        drawMethodPending = true;
                        that.runMethod("draw", () => {
                            drawMethodPending = false;
                        });
                    }
                }
                that.tick();
                // p5.background(50);
                // p5.rect(p5.width / 2, p5.height / 2, 50, 50);

            };

            p5.mousePressed = function () {
                that.runMethod('mousePressed');
            };

            p5.mouseReleased = function () {
                that.runMethod('mouseReleased');
            };

            p5.mouseClicked = function () {
                that.runMethod('mouseClicked');
            };

            p5.mouseDragged = function () {
                that.runMethod('mouseDragged');
            };

            p5.mouseEntered = function () {
                that.runMethod('mouseEntered');
            };

            p5.mouseExited = function () {
                that.runMethod('mouseExited');
            };

            p5.mouseMoved = function () {
                that.runMethod('mouseMoved');
            };

            p5.keyPressed = function () {
                that.runMethod('keyPressed');
            };

            p5.keyReleased = function () {
                that.runMethod('keyReleased');
            };


        }

        //@ts-ignore
        new p5(sketch, containerInner);
        jQuery(containerInner).find('canvas').css({
            'width': '',
            'height': ''
        })

    }

    runMethod(method: (t: Thread, callback: CallbackFunction) => void, interpreter: Interpreter){
        let t: Thread = new Thread
    }
}