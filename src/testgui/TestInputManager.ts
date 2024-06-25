import { IInputManager, InputManagerCallback } from "../compiler/common/interpreter/IInputManager.ts";
import { DOM } from "../tools/DOM.ts";

export class TestInputManager implements IInputManager{
    
    inputField: HTMLInputElement;
    question: HTMLDivElement;
    errorDiv: HTMLDivElement;

    constructor(private div: HTMLDivElement){
        let outerDiv = DOM.makeDiv(div, 'jo_inputManagerOuter');
        outerDiv.style.display = 'flex';
        outerDiv.style.flexDirection = 'column';
        
        this.question = DOM.makeDiv(outerDiv, 'jo_inputManagerQuestion');

        let div1 = DOM.makeDiv(outerDiv, 'jo_inputManagerDiv');
        let label = DOM.makeDiv(div1, 'jo_inputManagerLabel');
        label.textContent = 'InputManager-Input:';
        this.inputField = DOM.makeElement(div1, 'input', 'jo_inputManagerInput') as HTMLInputElement;

        this.errorDiv = DOM.makeDiv(outerDiv, 'jo_inputManagerError');

        this.enable(false);
    }


    readInput(question: string, defaultValue: string, callback: InputManagerCallback): void { 
        this.question.textContent = question;
        this.inputField.textContent = defaultValue;
        this.inputField.selectionStart = 0;
        this.inputField.selectionEnd = defaultValue.length;
        this.inputField.onkeydown = (event) => {
            if(event.key == '\n'){
                this.inputField.onkeydown = null;
                let error: string | undefined = callback(this.inputField.textContent || '');
                this.errorDiv.textContent = error ? error : '';
            }
        }
    }

    enable(enabled: boolean){
        this.inputField.disabled = !enabled;
    }

}