import { DOM } from "../DOM.ts";
import '/include/css/icons.css';

export type ExpandCollapseState = "expanded" | "collapsed";

export type ExpandCollapseListener = (newState: ExpandCollapseState) => void;

export class ExpandCollapseComponent {

    private divElement: HTMLDivElement;

    private state: ExpandCollapseState = "collapsed";

    private darkLightState: DarkLightState = "dark";

    private currentIconClass?: string;

    private static iconClasses = {
        "light" : {
            "expanded": "img_chevron-down",
            "collapsed": "img_chevron-right"
        },
        "dark" : {
            "expanded": "img_chevron-down-dark",
            "collapsed": "img_chevron-right-dark"
        }
    };

    constructor(private _parent: HTMLElement, private listener: ExpandCollapseListener,
        initialState: ExpandCollapseState){

        this.divElement = DOM.makeDiv(_parent, 'jo_exandCollapseComponent');

        this.divElement.onpointerup = () => {
            this.toggleState();
        }

        this.state = initialState;
        this.render();

    }    

    public toggleState(){
        switch(this.state){
            case "collapsed": this.setState("expanded", true);
            break;
            case "expanded": this.setState("collapsed", true);
            break;
        }
    }

    public get parent(): HTMLElement {
        return this._parent;
    }

    setState(newState: ExpandCollapseState, invokeListener: boolean = true){
        this.state = newState;
        this.render();
        if(invokeListener) this.listener(newState);
    }

    render(){

        if(this.currentIconClass) this.divElement.classList.remove(this.currentIconClass);

        this.currentIconClass = ExpandCollapseComponent.iconClasses[this.darkLightState][this.state];

        this.divElement.classList.add(this.currentIconClass);
    }

    setDarkLightState(darkLightState: DarkLightState){
        this.darkLightState = darkLightState;
        this.render();
    }

}