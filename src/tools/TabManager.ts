import '/include/css/tabs.css';

export class TabManager {

    headingsDiv: HTMLDivElement;
    bodiesDiv: HTMLDivElement;

    headingDivs: HTMLDivElement[] = [];
    bodyDivs: HTMLDivElement[] = [];


    constructor(private container: HTMLElement, headings: string[]){
        this.container.classList.add('jo_tabs_container');
        
        this.headingsDiv = document.createElement('div');
        this.headingsDiv.classList.add('jo_tabs_tabheadings')
        this.container.appendChild(this.headingsDiv);

        this.bodiesDiv = document.createElement('div');
        this.bodiesDiv.classList.add('jo_tabs_tabbodies')
        this.container.appendChild(this.bodiesDiv);

        for(let caption of headings){
            let headingDiv = document.createElement('div');
            headingDiv.classList.add('jo_tabs_tabheading');
            headingDiv.textContent = caption;

            headingDiv.onclick = (ev: MouseEvent) => {
                this.setActive(<HTMLDivElement>ev.target);
            }

            this.headingDivs.push(headingDiv);
            this.headingsDiv.appendChild(headingDiv);

            let bodyDiv = document.createElement('div');
            bodyDiv.classList.add('jo_tabs_tabbody');
            this.bodiesDiv.appendChild(bodyDiv);
            this.bodyDivs.push(bodyDiv);

        }

        if(this.bodyDivs.length > 0){
            this.setActive(this.headingDivs[0]);
        }

    }


    setActive(heading: HTMLDivElement | number){
        if(typeof heading == 'number'){
            heading = this.headingDivs[heading];
        }

        for(let h of this.headingDivs){
            h.classList.remove('jo_tabs_active');
        }

        heading.classList.add('jo_tabs_active');

        let index = this.headingDivs.indexOf(heading);
        for(let b of this.bodyDivs){
            b.style.display = 'none';
        }
        this.bodyDivs[index].style.display = 'flex';

    }

    getBodyElement(index: number): HTMLDivElement {
        return this.bodyDivs[index];
    }

    setBodyElementClass(c: string){
        this.bodyDivs.forEach(bd => bd.classList.add(c));
    }

}