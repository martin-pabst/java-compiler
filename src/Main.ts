import { AstComponent } from "./testgui/AstComponent.ts";
import { ErrorLevel } from "./compiler/common/Error.ts";
import { Language } from "./compiler/common/Language.ts";
import { File } from "./compiler/common/module/File.ts";
import { Module } from "./compiler/common/module/Module.ts";
import { JavaCompiler } from "./compiler/java/JavaCompiler.ts";
import { JavaLanguage } from "./compiler/java/JavaLanguage.ts";
import { CodePrinter } from "./compiler/java/codegenerator/CodePrinter.ts";
import { TokenPrinter } from "./compiler/java/lexer/TokenPrinter.ts";
import { JavaLibraryModuleManager } from "./compiler/java/module/libraries/JavaLibraryModuleManager.ts";
import { Editor } from "./testgui/editor/Editor.ts";
import { Button } from "./tools/Button.ts";
import { DOM } from "./tools/DOM.ts";
import { TabManager } from "./tools/TabManager.ts";

import '/include/css/main.css';
import { ProgramControlButtons } from "./testgui/ProgramControlButtons.ts";
import { Interpreter } from "./compiler/common/interpreter/Interpreter.ts";
import { TestPrintManager } from "./testgui/TestPrintManager.ts";

import jQuery from "jquery";
import { ActionManager } from "./testgui/ActionManager.ts";
import { testPrograms } from "./testgui/testprograms/TestPrograms.ts";
import { JavaBaseModule } from "./compiler/java/module/JavaBaseModule.ts";
import { JavaCompiledModule } from "./compiler/java/module/JavaCompiledModule.ts";
import { ProgramViewerComponent } from "./testgui/ProgramViewerComponent.ts";
import { ProgramPointerPositionInfo } from "./compiler/common/interpreter/Scheduler.ts";
import { TabbedEditorManager } from "./tools/TabbedEditorManager.ts";

export class Main {

  language: Language;

  insightTabsManager: TabManager;
  tabbedEditorManager: TabbedEditorManager;

  tokenDiv: HTMLDivElement;
  astDiv: HTMLDivElement;
  codeOutputDiv: HTMLDivElement;
  errorDiv: HTMLDivElement;

  programControlButtons!: ProgramControlButtons;
  actionManager: ActionManager;

  astComponent: AstComponent;

  programViewerCompoment: ProgramViewerComponent;

  files: File[] = [];

  compiler: JavaCompiler;
  interpreter: Interpreter;

  decorations?: monaco.editor.IEditorDecorationsCollection;

  constructor() {
    this.language = new JavaLanguage();
    this.language.registerLanguageAtMonacoEditor();


    /*
     * Test program:
     */
    let testProgram: string = testPrograms.primzahlzwillinge.trim();
    
    this.insightTabsManager = new TabManager(document.getElementById('insighttabs')!,
    ['token', 'ast', 'code', 'errors']);

    this.insightTabsManager.setBodyElementClass('tabBodyElement');
    this.tokenDiv = this.insightTabsManager.getBodyElement(0);
    this.tokenDiv.style.overflow = 'auto';
    this.astDiv = this.insightTabsManager.getBodyElement(1);
    this.codeOutputDiv = this.insightTabsManager.getBodyElement(2);
    this.codeOutputDiv.classList.add('codeOutput');
    this.astDiv.classList.add('astOutput');
    this.errorDiv = this.insightTabsManager.getBodyElement(3);
    
    this.astComponent = new AstComponent(this.astDiv);
    this.programViewerCompoment = new ProgramViewerComponent(this.codeOutputDiv);
    
    for(let i = 0; i < 3; i++){
      this.files.push(new File("module " + i));
    }
    this.files[0].setText(testProgram);
    this.tabbedEditorManager = new TabbedEditorManager(document.getElementById('editorOuter')!,
    this.files);

    this.compiler = new JavaCompiler();

    this.actionManager = new ActionManager();

    this.interpreter = new Interpreter(new TestPrintManager(), this.actionManager);

    this.initButtons();

    this.interpreter.showProgramPointerCallback = (showHide: "show" | "hide", positionInfo?: ProgramPointerPositionInfo) => {
      switch (showHide) {
        case "show":
          this.decorations?.clear();
          let lineNumber: number | undefined = positionInfo?.range.startLineNumber! || positionInfo?.range.endLineNumber;
          if (!lineNumber) return;

          let range = new monaco.Range(lineNumber, positionInfo?.range.startColumn || 1, lineNumber, positionInfo?.range.endColumn || 100)

          this.decorations = this.tabbedEditorManager.editor.editor.createDecorationsCollection([{
            range: range,
            options: {
              isWholeLine: true,
              className: "jo_revealProgramPointer",
              overviewRuler: {
                color: "#6fd61b",
                position: monaco.editor.OverviewRulerLane.Center
              },
              minimap: {
                color: "#6fd61b",
                position: monaco.editor.MinimapPosition.Inline
              }
            },
          },
          {
            range: range,
            options: { beforeContentClassName: 'jo_revealProgramPointerBefore' }
          }])
          break;
          case "hide":
            this.decorations?.clear();
            break;
      }

      // let nextStep = positionInfo?.program.stepsSingle[positionInfo.nextStepIndex];
      // console.log(nextStep?.codeAsString);
    }



  }

  initButtons() {
    let buttonDiv = document.getElementById('buttons')!;
    let firstRow = DOM.makeDiv(buttonDiv);
    new Button(firstRow, 'compile', '#30c030', () => {
      this.compile()

      setInterval(() => {
      }, 500)


    }, 'myButton');

    let programControlButtonDiv = DOM.makeDiv(buttonDiv, "programControlbuttons");

    this.programControlButtons = new ProgramControlButtons(jQuery(programControlButtonDiv), this.interpreter, this.actionManager);

  }

  compile() {

    let executable = this.compiler.compile(this.files, this.tabbedEditorManager.getCurrentlyOpenedFile());

    let module = this.compiler.moduleManager.getModuleFromFile(this.tabbedEditorManager.getCurrentlyOpenedFile())!;


    if (module) {
      TokenPrinter.print(module.tokens!, this.tokenDiv);
      this.astComponent.buildTreeView(module.ast);

      this.markErrors(module);
      this.printErrors(module);

      let codePrinter = new CodePrinter();

    }

    this.interpreter.setExecutable(executable);
    this.programViewerCompoment.buildTreeView(this.compiler.moduleManager);

  }

  markErrors(module: Module) {

    let markers: monaco.editor.IMarkerData[] = module.errors.map((error) => {
      return {
        startLineNumber: error.range.startLineNumber,
        startColumn: error.range.startColumn,
        endLineNumber: error.range.endLineNumber,
        endColumn: error.range.endColumn,
        message: error.message,
        severity: this.errorLevelToMarkerSeverity(error.level)
      }
    })

    monaco.editor.setModelMarkers(this.tabbedEditorManager.editor.editor.getModel()!, "martin", markers);

  }

  errorLevelToMarkerSeverity(errorlevel: ErrorLevel): monaco.MarkerSeverity {
    switch (errorlevel) {
      case "info": return monaco.MarkerSeverity.Info;
      case "warning": return monaco.MarkerSeverity.Warning;
      case "error": return monaco.MarkerSeverity.Error;
    }
  }

  printErrors(module: Module) {
    DOM.clear(this.errorDiv);
    this.errorDiv.classList.add('errorDiv');

    for (let error of module.errors) {
      let errorLine = DOM.makeDiv(this.errorDiv, 'errorLine');
      let errorPos = DOM.makeSpan(errorLine, 'errorPosition');
      errorPos.textContent = `[${error.range.startLineNumber}:${error.range.startColumn}]`;
      let errorText = DOM.makeSpan(errorLine, 'errorText');
      errorText.textContent = error.message;
    }

  }

}




async function initMonacoEditor(): Promise<void> {

  return new Promise((resolve) => {
    //@ts-ignore
    window.AMDLoader.Configuration.ignoreDuplicateModules = ["jquery"];

    //@ts-ignore
    window.require.config({ paths: { 'vs': 'lib/monaco-editor/dev/vs' } });
    //@ts-ignore
    window.require.config({
      'vs/nls': {
        availableLanguages: {
          '*': 'de'
        }
      },
      ignoreDuplicateModules: ["vs/editor/editor.main", 'jquery']
    });

    //@ts-ignore
    window.require(['vs/editor/editor.main'], function () {

      resolve();

    });

  })


}


window.onload = () => {
  initMonacoEditor().then(() => {
    new Main();
  })
  // document.body.innerText = 'Hello World!';
}

