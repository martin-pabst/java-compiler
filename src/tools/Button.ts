import '/include/css/button.css';

export class Button {

    buttonDiv: HTMLDivElement;

    constructor(parent: HTMLElement, caption: string, color: string, onClick: () => void, klass?: string){
        this.buttonDiv = document.createElement('div');
        this.buttonDiv.classList.add('jo_button', 'jo_active');
        if(klass) this.buttonDiv.classList.add(klass);
        this.buttonDiv.textContent = caption;
        this.buttonDiv.style.backgroundColor = color;
        this.buttonDiv.onclick = onClick;

        parent.appendChild(this.buttonDiv);
    }


}