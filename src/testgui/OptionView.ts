import { LitElement, html, css } from 'lit';

import { customElement, property } from 'lit/decorators.js';




@customElement('my-option')

export class OptionView extends LitElement {

    static styles = css`
select {
    // A reset of styles, including removing the default dropdown arrow
    appearance: none;
    // Additional resets for further consistency
    background-color: transparent;
    border: none;
    padding: 0.5em;
    margin: 0;

    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;
  }`;

    @property({ type: Object })
    programs : string[] = [];


    render() {
        return html`<select id="test-program" @change=${this.setProgramm}>
            ${this.programs.map((programName) => html`<option value=${programName}>${programName}</option>`)}
        </select>`;
    }


    setProgramm(e: Event) {
        if (! e.target) return;
        let programName : EventTarget = (e.target as any)?.value;
        if (!programName) return;
        let runTestsEvent = new CustomEvent('set-program', {
            detail: { programName: programName },
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(runTestsEvent);
    }
}
