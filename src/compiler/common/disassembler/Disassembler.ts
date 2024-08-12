import { DOM } from "../../../tools/DOM";
import { BaseType } from "../BaseType";
import { Module } from "../module/Module";
import { CodeFragment } from "./CodeFragment";

import { Executable } from "../Executable";
import { IMain } from "../IMain";
import { Step } from "../interpreter/Program";
import { CompilerFile } from "../module/CompilerFile";
import { ProgramPointerPositionInfo } from "../monacoproviders/ProgramPointerManager";
import { IRange } from "../range/Range";
import '/include/css/disassembler.css';

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
    
    constructor(parentElement: HTMLElement, private main: IMain) {
        parentElement.innerHTML = "";
        this.disassemblerDiv = DOM.makeDiv(parentElement, 'jo_disassemblerDiv', 'jo_scrollable');
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
    
    disassemble() {
        let module = this.main.getCurrentWorkspace()?.getCurrentlyEditedModule();
        if(module) this.disassembleModule(module);
    }
    
    disassembleModule(module: Module | undefined) {
        if(!module) return;
        if (module == this.currentModule) return;

        this.clear();
        this.currentModule = module;
        this.currentType = undefined;
    
        for (let fragment of module.getCodeFragments()) {
            this.dissassembleFragment(fragment);
        }
    }
    
    markElement(element: HTMLElement){
        this.unmarkAllElements();
        element.classList.add("jo_revealDisassemblerPosition");
    }
    
    unmarkAllElements(){
        //@ts-ignore
        for(let element of this.disassemblerDiv.children){
            element.classList.remove("jo_revealDisassemblerPosition");
        }
    }

    showElementpositionInMonacoModel(file: CompilerFile, range: IRange ){
        this.main.showFile(file);
        let model = file.getMonacoModel();
        if(!model) return;
        
        let programPointerManager = this.main.getInterpreter().programPointerManager;
        if(!programPointerManager) return;

        let p: ProgramPointerPositionInfo = {
            programOrmoduleOrMonacoModel: model,
            range: range
          }
      
          programPointerManager.show(p, {
            key: "disassemblerPosition",
            isWholeLine: true,
            className: "jo_revealDisassemblerPosition",
            minimapColor: "#d6c91b56",
            rulerColor: "#d6c91b56",
            beforeContentClassName: "jo_revealDisassemblerPositionBefore"
          })

    }

    hideElementPositionsInMonacoModel(){
        this.main.getInterpreter().programPointerManager?.hide("disassemblerPosition");
    }

    showProgramPointer(step: Step) {
        this.hideProgramPointer();        
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
        DOM.makeDiv(this.disassemblerDiv, 'jo_disassemblerHorizontalLine');
    }

    insertTypeHeading(type: BaseType) {
        let headingDiv = DOM.makeDiv(this.disassemblerDiv, "jo_disassemblerHeading");
        if(type.identifier == "main class"){
            headingDiv.textContent = "Main method:";
        } else {
            headingDiv.textContent = type.getDeclaration();
        }

        let module = type.module;
        if (type.identifierRange && module) {
            headingDiv.addEventListener('pointerdown', (ev) => {
                this.showElementpositionInMonacoModel(module.file, type.identifierRange);
                this.markElement(headingDiv);
            })
            headingDiv.classList.add("jo_disassemblerLink");
        }

    }

    insertSignature(signature: string, range: IRange | undefined) {
        let signatureDiv = DOM.makeDiv(this.disassemblerDiv, "jo_disassemblerSignature");

        monaco.editor.colorize(signature, 'myJava', { tabSize: 3 }).then((html) => {
            signatureDiv.innerHTML = html;
        });

        let module = this.currentModule;
        if (range && module) {
            signatureDiv.addEventListener('pointerdown', (ev) => {
                this.showElementpositionInMonacoModel(module.file, range);
                this.markElement(signatureDiv);
            })
            signatureDiv.classList.add("jo_disassemblerLink");
        }

    }

    insertCode(fragment: CodeFragment) {
        let index: number = 0;
        let elements: HTMLElement[] = [];

        for (let step of fragment.program.stepsSingle) {
            let stepDiv = DOM.makeDiv(this.disassemblerDiv, "jo_disassemblerStep");
            elements.push(stepDiv);
            let stepIndex = DOM.makeSpan(stepDiv, "jo_disassemblerStepIndex");
            stepIndex.textContent = index + ":";
            let codeSpan = DOM.makeSpan(stepDiv, "jo_disassemblerCodeSpan");

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
                        this.showElementpositionInMonacoModel(module!.file, <IRange>range);
                        this.markElement(stepDiv);
                    })
                    stepDiv.classList.add("jo_disassemblerLink");
                }
            }

        }
    }


}