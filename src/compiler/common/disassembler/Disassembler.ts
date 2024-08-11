import { BaseType } from "../BaseType";
import { DOM } from "../../../tools/DOM";
import { Module } from "../module/Module";
import { IPosition } from "../range/Position";
import { CodeFragment } from "./CodeFragment";
import { IJumpToCodeProvider } from "./IJumpToCodeProvider";

import '/include/css/disassembler.css';
import { IRange, Range } from "../range/Range";
import { IMain } from "../IMain";
import { Executable } from "../Executable";
import { Step } from "../interpreter/Program";

type DisassembledStep = {
    element: HTMLElement;
    range: IRange;
}

export class Disassembler {

    currentModule?: Module;
    currentType?: BaseType;

    disassembledSteps: DisassembledStep[] = [];
    stepToHtmlElementMap: Map<Step, HTMLElement> = new Map();

    currentlyHighlightedHtmlElement: HTMLElement | undefined;

    disassemblerDiv: HTMLDivElement;

    constructor(parentElement: HTMLElement, public jumpToCodeProvider: IJumpToCodeProvider, private main: IMain) {
        parentElement.innerHTML = "";
        this.disassemblerDiv = DOM.makeDiv(parentElement, 'disassemblerDiv');
        let compiler = this.main.getCompiler();
        compiler.eventManager.on("compilationFinished", (executable: Executable) => {
            setTimeout(() => {
                this.disassemble();
            }, 300);
        });

        this.main.getInterpreter().eventManager.on("showProgramPointer", () => {
            let step = this.main.getInterpreter().scheduler.getNextStep();
            if (step) {
                this.showProgramPointer(step);
            } else {
                this.hideProgramPointer();
            }
        })

        this.main.getInterpreter().eventManager.on("hideProgramPointer", () => {
            this.hideProgramPointer();
        })

        this.disassemble();
    }

    showProgramPointer(step: Step) {
        if (this.currentlyHighlightedHtmlElement) {
            this.currentlyHighlightedHtmlElement.classList.remove("jo_revealProgramPointer");
        }

        this.currentlyHighlightedHtmlElement = this.stepToHtmlElementMap.get(step);
        if (this.currentlyHighlightedHtmlElement) {
            this.currentlyHighlightedHtmlElement.classList.add("jo_revealProgramPointer");
            this.currentlyHighlightedHtmlElement.scrollIntoView({block: "nearest", inline: "nearest"});
        }
    }

    hideProgramPointer() {
        if (this.currentlyHighlightedHtmlElement) {
            this.currentlyHighlightedHtmlElement.classList.remove("jo_revealProgramPointer");
        }
        this.currentlyHighlightedHtmlElement = undefined;
    }

    disassemble() {
        this.clear();
        let module = this.main.getCurrentWorkspace()?.getCurrentlyEditedModule();
        if(module) this.disassembleModule(module);
    }

    disassembleModule(module: Module) {
        if (module == this.currentModule) return;
        this.currentModule = module;
        this.currentType = undefined;

        for (let fragment of module.getCodeFragments()) {
            this.dissassembleFragment(fragment);
        }
    }

    clear() {
        this.currentModule = undefined;
        this.disassemblerDiv.innerHTML = ""; // erase all old content
        this.disassembledSteps = [];
        this.stepToHtmlElementMap.clear();
        this.currentType = undefined;
    }

    dissassembleFragment(fragment: CodeFragment) {

        if ((typeof this.currentType != "undefined") && this.currentType != fragment.type) {
            this.insertHorizontalLine();
        }

        if (this.currentType != fragment.type) {
            this.currentType = fragment.type;
            this.insertTypeHeading(fragment.type);
        }

        this.insertSignature(fragment.signature, fragment.methodDeclarationRange)
        this.insertCode(fragment);

    }

    insertHorizontalLine() {
        DOM.makeDiv(this.disassemblerDiv, 'disassemblerHorizontalLine');
    }

    insertTypeHeading(type: BaseType) {
        let headingDiv = DOM.makeDiv(this.disassemblerDiv, "disassemblerHeading");
        if(type.identifier == "main class"){
            headingDiv.textContent = "Main method:";
        } else {
            headingDiv.textContent = type.getDeclaration();
        }

        let module = type.module;
        if (type.identifierRange && module) {
            headingDiv.addEventListener('pointerdown', (ev) => {
                this.jumpToCodeProvider.jumpTo(module.file, type.identifierRange);
            })
            headingDiv.classList.add("disassemblerLink");
        }

    }

    insertSignature(signature: string, range: IRange | undefined) {
        let signatureDiv = DOM.makeDiv(this.disassemblerDiv, "disassemblerSignature");

        monaco.editor.colorize(signature, 'myJava', { tabSize: 3 }).then((html) => {
            signatureDiv.innerHTML = html;
        });

        let module = this.currentModule;
        if (range && module) {
            signatureDiv.addEventListener('pointerdown', (ev) => {
                this.jumpToCodeProvider.jumpTo(module.file, range);
            })
            signatureDiv.classList.add("disassemblerLink");
        }

    }

    insertCode(fragment: CodeFragment) {
        let index: number = 0;
        let elements: HTMLElement[] = [];

        for (let step of fragment.program.stepsSingle) {
            let stepDiv = DOM.makeDiv(this.disassemblerDiv, "disassemblerStep");
            elements.push(stepDiv);
            let stepIndex = DOM.makeSpan(stepDiv, "disassemblerStepIndex");
            stepIndex.textContent = index + ":";
            let codeSpan = DOM.makeSpan(stepDiv, "disassemblerCodeSpan");

            let code = step.codeAsString.trim();
            let regExp = new RegExp("(.*)return " + (index + 1) + ";(\s*)$", "s");
            let match = code.match(regExp);
            if(match){
                code = match[1].trim();
            }

            
            index++;
            
            monaco.editor.colorize(code, 'javascript', { tabSize: 3 }).then((html) => {
                html = html.replaceAll("&nbsp;", " ");
                html = html.replaceAll("\u00a0", " ");
                codeSpan.innerHTML = html;
            });

            let range = step.range;
            if (range) {
                if (range.startLineNumber && range.endLineNumber && range.startColumn && range.endColumn) {
                    this.disassembledSteps.push({
                        element: stepDiv,
                        range: <IRange>range
                    })
                    this.stepToHtmlElementMap.set(step, stepDiv);
                }
                let module = this.currentModule;
                if (range.startLineNumber && range.startColumn) {
                    stepDiv.addEventListener('pointerdown', (ev) => {
                        this.jumpToCodeProvider.jumpTo(module!.file, <IRange>range);
                    })
                    stepDiv.classList.add("disassemblerLink");
                }
            }

        }
    }


}