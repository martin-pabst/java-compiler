import { LitElement, html, css } from 'lit';

import { customElement, property } from 'lit/decorators.js';

import { TestError, TestResult, TestSuccess } from '../test/lib/GUITestRunner';

@customElement('test-result')

export class TestResultViewer extends LitElement {

    @property({ type: String })
    msg = "No test results available!";

    @property({ type: String, converter: TestResultViewer.convertToTestResult })
    results?: Array<TestResult>;

    static convertToTestResult(result: any) {
        let resultAsObject = JSON.parse(JSON.parse(result));
        return resultAsObject.map((r: any) => TestResult.fromJSON(r));
    }


    static styles = css`

    .result-container {
        display: grid;
        gap: 10px;
        grid-template-columns: auto;
    }

    .inner-container {
        display: grid;
        column-gap: 10px;
        grid-template-columns: 10em  auto;   
    }

    
    .test-name, .test-result {
      padding: 5px;
      color: black;
      border-radius: 2px;
      background-color: white;
    }

    .pass {
        background-color: rgb(150,255,150);
    }

    .fail {
        background-color: rgb(255,200,0);
    }

    button {
        border:none;
        border-radius: 3px;
        display:inline-block;
        padding:8px 16px;
        vertical-align:middle;
        overflow:hidden;
        text-decoration:none;
        text-align:center;
        cursor:pointer;
        white-space:nowrap;
        background-color: #caf1fa;
    }
  `;
    renderResult(result: TestResult) {
        return html`
            <div class="inner-container">
                <div class="test-name"> ${result.testName.name}</div>
                <div class="test-result ${result.isOk() ? 'pass' : 'fail'}">${result.print()}</div>
            </div>`;
            
    }

    render() {
        let groupedResults = this.groupResults(this.results);
        
        let runButton = html`
        <div>
            <button @click=${this.runTest}>Tests starten</button>
        </div>
  `;
        if (!this.results) {
            return runButton;
        }
        else {
            let numberOfTests = this.results?.length;
            let numberOfFailedTests = this.results.filter(r => !r.isOk()).length; 
            
            return html`
            <div>
                <div>${runButton}</div>
                <div class="result-container">
                    <div class="inner-container">
                        <div>Name des Tests</div><div>Ergebnis</div>
                    </div>
                    ${this.results.map((r) => this.renderResult(r))}</div>
                ${numberOfFailedTests > 0 
                    ? html`<div>${numberOfFailedTests} von ${numberOfTests} Tests sind fehlgeschlagen.</div>` 
                    : numberOfTests==0 ? html`<div>Du hast noch keine Tests definiert.</div>`: html`<div>Alle Tests erfolgreich.`}   
            </div>`;
        }

    }

    groupResults(results: TestResult[] | undefined) {
        let groupedResults = {};
        if (!results) return groupedResults;
    }

    runTest() {
        let runTestsEvent = new CustomEvent('run-all-tests', {
            detail: { message: 'Run all tests!' },
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(runTestsEvent);
    }


}
