// <div id="controls">
// <div id="speedcontrol-outer" title="Geschwindigkeitsregler" draggable="false">
//     <div id="speedcontrol-bar" draggable="false"></div>
//     <div id="speedcontrol-grip" draggable="false">
//         <div id="speedcontrol-display">100 Schritte/s</div>
//     </div>
// </div>
// <!-- <img id="buttonStart" title="Start" src="assets/projectexplorer/start-dark.svg"> -->
// <div id="buttonStart" title="Start" class="img_start-dark button"></div>
// <div id="buttonPause" title="Pause" class="img_pause-dark button"></div>
// <div id="buttonStop" title="Stop" class="img_stop-dark button"></div>
// <div id="buttonStepOver" title="Step over" class="img_step-over-dark button"></div>
// <div id="buttonStepInto" title="Step into" class="img_step-into-dark button"></div>
// <div id="buttonStepOut" title="Step out" class="img_step-out-dark button"></div>
// <div id="buttonRestart" title="Restart" class="img_restart-dark button"></div>
// </div>
import jQuery from 'jquery';

import { SpeedControl } from "./SpeedControl.js";
import { Interpreter } from '../compiler/common/interpreter/Interpreter.js';
import { ActionManager } from './ActionManager.js';


type ButtonData = {
    actionIdentifier: string,
    title: string,
    iconClass: string,
}

export class ProgramControlButtons {

    speedControl: SpeedControl;


    buttonActiveMatrix: { [buttonName: string]: boolean[] } = {
        "start": [false, false, true, true, true, false],
        "pause": [false, true, false, false, false, false],
        "stop": [false, true, true, false, false, true],
        "stepOver": [false, false, true, true, true, false],
        "stepInto": [false, false, true, true, true, false],
        "stepOut": [false, false, true, false, false, false],
        "restart": [false, true, true, true, true, true]
    }

    buttonData: ButtonData[] = [
        { actionIdentifier: "interpreter.start", title: "Start", iconClass: "img_start-dark jo_button"},
        { actionIdentifier: "interpreter.pause", title: "Pause", iconClass: "img_pause-dark jo_button"},
        { actionIdentifier: "interpreter.stop", title: "Stop", iconClass: "img_stop-dark jo_button"},
        { actionIdentifier: "interpreter.stepOver", title: "Step Over", iconClass: "img_step-over-dark jo_button"},
        { actionIdentifier: "interpreter.stepInto", title: "Step Into", iconClass: "img_step-into-dark jo_button"},
        { actionIdentifier: "interpreter.stepOut", title: "Step Out", iconClass: "img_step-out-dark jo_button"},
        { actionIdentifier: "interpreter.restart", title: "Restart", iconClass: "img_restart-dark jo_button"},
    ]

    constructor($buttonsContainer: JQuery<HTMLElement>, interpreter: Interpreter, actionManager: ActionManager){

        
        for(let bd of this.buttonData){
            let $button = jQuery(`<div title="${bd.title}" class="${bd.iconClass}"></div>`);
            $buttonsContainer.append($button);
            actionManager.registerButton(bd.actionIdentifier, $button);
            if(bd.actionIdentifier == 'interpreter.pause') $button.hide();
        }

        this.speedControl = new SpeedControl($buttonsContainer, interpreter);
        this.speedControl.initGUI();


        // this.$buttonStart = jQuery('<div title="Start" class="img_start-dark jo_button"></div>');
        // this.$buttonPause = jQuery('<div title="Pause" class="img_pause-dark jo_button"></div>');
        // this.$buttonStop = jQuery('<div title="Stop" class="img_stop-dark jo_button"></div>');
        // this.$buttonStepOver = jQuery('<div title="Step over" class="img_step-over-dark jo_button"></div>');
        // this.$buttonStepInto = jQuery('<div title="Step into" class="img_step-into-dark jo_button"></div>');
        // this.$buttonStepOut = jQuery('<div title="Step out" class="img_step-out-dark jo_button"></div>');
        // this.$buttonRestart = jQuery('<div title="Restart" class="img_restart-dark jo_button"></div>');


        

// <!-- <img id="buttonStart" title="Start" src="assets/projectexplorer/start-dark.svg"> -->
// <div id="buttonStart" title="Start" class="img_start-dark button"></div>
// <div id="buttonPause" title="Pause" class="img_pause-dark button"></div>
// <div id="buttonStop" title="Stop" class="img_stop-dark button"></div>
// <div id="buttonStepOver" title="Step over" class="img_step-over-dark button"></div>
// <div id="buttonStepInto" title="Step into" class="img_step-into-dark button"></div>
// <div id="buttonStepOut" title="Step out" class="img_step-out-dark button"></div>
// <div id="buttonRestart" title="Restart" class="img_restart-dark button"></div>



    }

}