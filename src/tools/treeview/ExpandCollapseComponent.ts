import { DOM } from "../DOM.ts";

export type ExpandCollapseState = "expanded" | "collapsed" | "hidden";

export type ExpandCollapseListener = (newState: ExpandCollapseState) => void;

export class ExpandCollapseComponent {

    private divElement: HTMLDivElement;

    private state: ExpandCollapseState = "collapsed";

    private darkLightState: DarkLightState = "dark";

    private static iconClasses = {
        "light" : {
            "expanded": "img_arrow-down",
            "collapsed": "img_arrow-right"
        },
        "dark" : {
            "expanded": "img_arrow-down-dark",
            "collapsed": "img_arrow-right-dark"
        }
    };

    constructor(private _parent: HTMLElement, private listener: ExpandCollapseListener){

        this.divElement = DOM.makeDiv(parent, 'jo_exandCollapseComponent');

    }    

    public get parent(): HTMLElement {
        return this._parent;
    }

    setState(newState: ExpandCollapseState, invokeListener: boolean = true){

    }

    render(){
        
    }

}