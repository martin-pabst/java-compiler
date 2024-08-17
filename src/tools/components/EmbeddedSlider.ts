import '/include/css/slider.css';
import { DOM } from '../DOM';

export class EmbeddedSlider {

    sliderDiv!: HTMLElement;
    otherDiv!: HTMLElement;

    /**
     * A div contains container and another div. Between the latter two 
     * a slider should get inserted.
     * @param container 
     * @param firstLast true, if container is left/on top of other div; false if otherwise
     * @param horVert true, if container and other div are left/right of another; false if they are on top/below each other
     * @param callback 
     * @param otherDiv 
     */
    constructor(private container: HTMLElement,
        private firstLast: boolean, private horVert: boolean,
        private callback: (newLength: number) => void, 
        otherDiv?: HTMLElement) {

        this.initSlider();
        if(otherDiv) this.otherDiv = otherDiv;
    }

    initSlider() {
        let that = this;

        if (this.otherDiv == null) {
            let parentElement = this.container.parentElement;
            if(!parentElement){
                console.log("Error in EmbeddedSlider: element has no parentElement.");
                return;
            }
            Array.from(parentElement.children).forEach((element) => {
                if (element != this.container) {
                    that.otherDiv = <HTMLElement>element;
                }
            });
        }

        this.sliderDiv = DOM.makeDiv(undefined, "joe_slider");

        this.sliderDiv.style.width = this.horVert ? "100%" : "4px";
        this.sliderDiv.style.height = this.horVert ? "4px" : "100%";
        this.sliderDiv.style.cursor = this.horVert ? "row-resize" : "col-resize";

        if (this.firstLast) {
            this.sliderDiv.style.top = "0px";
            this.sliderDiv.style.left = "0px";
        } else {
            if (this.horVert) {
                this.sliderDiv.style.bottom = "0px";
                this.sliderDiv.style.left = "0px";
            } else {
                this.sliderDiv.style.top = "0px";
                this.sliderDiv.style.right = "0px";
            }
        }

        this.container.append(this.sliderDiv);

        let mousePointer = window.PointerEvent ? "pointer" : "mouse";

        //@ts-ignore
        this.sliderDiv.addEventListener(mousePointer + "down", (md: PointerEvent) => {
            
            let x = md.clientX;
            let y = md.clientY;
            
            let ownRectangle = this.container.getBoundingClientRect();
            let ownStartHeight = ownRectangle.height;
            let ownStartWidth = ownRectangle.width;
            let otherRectangle = this.otherDiv.getBoundingClientRect();
            let otherStartHeight = otherRectangle.height;
            let otherStartWidth = otherRectangle.width;
            
            let moveListener: EventListener;
            //@ts-ignore
            document.addEventListener(mousePointer + "move", moveListener = (mm: PointerEvent) => {
                let dx = mm.clientX - x;
                let dy = mm.clientY - y;
                
                if (this.horVert) {
                    let newHeight = ownStartHeight + (this.firstLast ? -dy : dy);
                    let newOtherHeight = otherStartHeight + (this.firstLast ? dy : -dy);
                    this.container.style.height = newHeight + "px";
                    this.otherDiv.style.height = newOtherHeight + "px";
                    this.container.style.maxHeight =  newHeight + "px";
                    this.otherDiv.style.maxHeight = newOtherHeight + "px";
                    this.callback(newHeight);
                } else {
                    let newWidth = ownStartWidth + (this.firstLast ? -dx : dx);
                    let newOtherWidth = otherStartWidth + (this.firstLast ? dx : -dx);
                    this.container.style.width = newWidth + "px";
                    this.otherDiv.style.width = newOtherWidth + "px";
                    this.container.style.maxWidth = newWidth + "px";
                    this.otherDiv.style.maxWidth = newOtherWidth + "px";
                    this.callback(newWidth);
                }
                this.container.style.flex = "0 1 auto";
                
            });
            
            let upListener: EventListener;
            //@ts-ignore
            document.addEventListener(mousePointer + "up", upListener = () => {
                
                document.removeEventListener(mousePointer + "move", moveListener);
                document.removeEventListener(mousePointer + "up", upListener);
            });


        });

        setTimeout(() => {
            that.slide(1, 1);
        }, 600);

    }

    setColor(color: string) {
        this.sliderDiv.style.backgroundColor = color;
    }

    slide(dx: number, dy: number) {

    }


}