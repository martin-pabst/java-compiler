import { DOM } from "../DOM.ts";
import '/include/css/icons.css';

export type IconButtonListener = () => void;

export class IconButtonComponent {

    private divElement: HTMLDivElement;

    private darkLightState: DarkLightState = "dark";

    private isActive: boolean = true;

    private currentIconClass?: string;

    constructor(private _parent: HTMLElement, private iconClass: string, private listener: IconButtonListener, tooltip: string){

        this.divElement = DOM.makeDiv(_parent, 'jo_iconButton');

        if(tooltip) this.divElement.title = tooltip;

        if(this.iconClass.endsWith("-dark")) this.iconClass = this.iconClass.substring(0, this.iconClass.length - "-dark".length);

        this.divElement.onclick = () => {
            if(this.listener) this.listener();
        }

        this.render();

    }    

    public get parent(): HTMLElement {
        return this._parent;
    }

    render(){
        
        if(this.currentIconClass) this.divElement.classList.remove(this.currentIconClass);

        this.currentIconClass = this.iconClass;
        if(this.darkLightState == "dark") this.currentIconClass += "-dark";

        this.divElement.classList.add(this.currentIconClass);
    }

    setDarkLightState(darkLightState: DarkLightState){
        this.darkLightState = darkLightState;
        this.render();
    }

    setActive(active: boolean){
        if(this.isActive != active){
            this.divElement.classList.toggle("jo_iconButton_active");
            this.isActive = active;
        }
    }

}