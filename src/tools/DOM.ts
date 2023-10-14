export class DOM {
    
    public static clear(element: HTMLElement){
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
        element.textContent = '';
    }

    public static makeDiv(parent: HTMLElement, ...classes: string[]): HTMLDivElement{
        let div = document.createElement('div');
        if(classes != null) div.classList.add(...classes);
        parent.appendChild(div); 
        return div;
    }

    public static makeSpan(parent: HTMLElement, ...classes: string[]): HTMLSpanElement{
        let span = document.createElement('span');
        if(classes != null) span.classList.add(...classes);
        parent.appendChild(span); 
        return span;
    }
}