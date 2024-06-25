import { IInputManager, InputManagerCallback, InputManagerValidator } from "../compiler/common/interpreter/IInputManager.ts";
import { DOM } from "../tools/DOM.ts";
import { TabManager } from "../tools/TabManager.ts";

export class TestInputManager implements IInputManager{
    
    inputField: HTMLInputElement;
    question: HTMLDivElement;
    errorDiv: HTMLDivElement;

    constructor(private div: HTMLDivElement, private tabManager: TabManager){
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


    readInput(question: string, defaultValue: string | undefined, validator: InputManagerValidator, successCallback: InputManagerCallback): void { 
        this.question.textContent = question;
        this.inputField.value = defaultValue ? defaultValue : "";
        this.tabManager.setActive(7);
        this.enable(true);
        this.inputField.focus();
        if(defaultValue){
            this.inputField.selectionStart = 0;
            this.inputField.selectionEnd = defaultValue.length;
        }
        this.inputField.onkeydown = (event) => {
            if(event.key == 'Enter'){

                let validatorRet = validator(this.inputField.value || '');
                if(validatorRet.errorMessage){
                    this.errorDiv.textContent = validatorRet.errorMessage;
                    this.inputField.selectionStart = 0;
                    this.inputField.selectionEnd = (this.inputField.value || '').length;
                    return;
                } else {
                    this.enable(false);
                    this.inputField.onkeydown = null;
                    successCallback(validatorRet.convertedValue);
                }

            }
        }
    }

    enable(enabled: boolean){
        this.inputField.disabled = !enabled;
    }

}