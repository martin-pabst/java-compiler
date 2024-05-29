import { DOM } from "../../../tools/DOM";
import { makeDiv } from "../../../tools/HtmlTools";
import { BaseSymbolTable } from "../BaseSymbolTable";
import { Thread } from "../interpreter/Thread";
import { Range } from "../range/Range";
import { SymbolTableSection } from "./SymbolTableSection";

export class Debugger {

    currentlyVisibleSymbolTableSections: SymbolTableSection[] = [];
    showVariablesDiv: HTMLDivElement;

    constructor(debuggerDiv: HTMLDivElement){
        this.showVariablesDiv = DOM.makeDiv(debuggerDiv);
        this.showVariablesDiv.style.display = "flex";
        this.showVariablesDiv.style.flexDirection = "column";
        
        let remainingDiv = DOM.makeDiv(debuggerDiv);
        remainingDiv.style.flex = "1";
    }

    showThreadState(thread: Thread | undefined){
        if(!thread || thread.programStack.length == 0){
            this.hideAll();
            return;
        }

        let programState = thread.programStack[thread.programStack.length - 1];
        let program = programState.program;

        let symbolTable = program.symbolTable;
        if(!symbolTable){
            this.hideAll();
            return;
        }

        let currentStep = programState.lastExecutedStep;
        if(!currentStep) currentStep = programState.currentStepList[programState.stepIndex];

        if(currentStep && currentStep.range.startLineNumber && currentStep.range.startColumn){
            symbolTable = symbolTable.findSymbolTableAtPosition({
                lineNumber: currentStep.range.startLineNumber!,
                column: currentStep.range.startColumn!
            })
        }
        
        let symbolTablesToShow: BaseSymbolTable[] = [];
        let st1 = symbolTable;
        while(st1){
            if(!st1.hiddenWhenDebugging){
                symbolTablesToShow.unshift(st1);
            }
            st1 = st1.parent;
        }

        let remainingSymbolTableSections: SymbolTableSection[] = [];

        let firstNonFittingFound = false;
        for(let i = 0; i < this.currentlyVisibleSymbolTableSections.length; i++){
            let sts = this.currentlyVisibleSymbolTableSections[i];
            if(i > symbolTablesToShow.length || sts.symbolTable != symbolTablesToShow[i] || firstNonFittingFound){
                sts.hide();
                firstNonFittingFound = true;
            } else {
                remainingSymbolTableSections.push(sts);
            }
        }

        while(remainingSymbolTableSections.length < symbolTablesToShow.length){
            let index = remainingSymbolTableSections.length;
            remainingSymbolTableSections.push(new SymbolTableSection(this.showVariablesDiv, symbolTablesToShow[index]));
        }
        
        this.currentlyVisibleSymbolTableSections = remainingSymbolTableSections;

        for(let sts of this.currentlyVisibleSymbolTableSections){
            sts.renewValues(thread.s, programState.stackBase);
        }

    }


    hideAll(){
        for(let ssm of this.currentlyVisibleSymbolTableSections){
            ssm.hide();
        }
    }


}