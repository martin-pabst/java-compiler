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

export class Main {

  language: Language;
  inputEditor: Editor;
  codeOutputEditor: monaco.editor.IStandaloneCodeEditor;

  tabManager: TabManager;
 
  tokenDiv: HTMLDivElement;
  astDiv: HTMLDivElement;
  codeOutputDiv: HTMLDivElement;
  errorDiv: HTMLDivElement;

  programControlButtons!: ProgramControlButtons;
  actionManager: ActionManager;

  astComponent: AstComponent;

  file: File;

  compiler: JavaCompiler;
  interpreter: Interpreter;

  libraryModuleManager: JavaLibraryModuleManager;

  constructor() {
    this.language = new JavaLanguage();
    this.language.registerLanguageAtMonacoEditor();

    this.inputEditor = new Editor(this, document.getElementById('editor')!);
    
    this.tabManager = new TabManager(document.getElementById('tabs')!,
    ['token', 'ast', 'code', 'errors']);
    
    this.tabManager.setBodyElementClass('tabBodyElement');
    this.tokenDiv = this.tabManager.getBodyElement(0);
    this.astDiv = this.tabManager.getBodyElement(1);
    this.codeOutputDiv = this.tabManager.getBodyElement(2);
    this.errorDiv = this.tabManager.getBodyElement(3);
    
    this.codeOutputEditor = monaco.editor.create(this.codeOutputDiv, {
      value: "/** Awaiting compilation... */",
      language: "javascript",
      automaticLayout: true,
    });

    this.astComponent = new AstComponent(this.astDiv);

    
    this.file = new File();
    this.file.monacoModel = this.inputEditor.editor.getModel()!;
    
    this.libraryModuleManager = new JavaLibraryModuleManager();
    this.libraryModuleManager.compileClassesToTypes();
    
    this.compiler = new JavaCompiler(this.libraryModuleManager);
    
    this.actionManager = new ActionManager();
    
    this.interpreter = new Interpreter(new TestPrintManager(), this.actionManager);


    this.initButtons();
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

    this.compiler.compile([this.file]);

    let module = this.compiler.moduleManager.getModuleFromFile(this.file)!;

    TokenPrinter.print(module.tokens!, this.tokenDiv);
    this.astComponent.buildTreeView(module.ast);

    this.markErrors(module);
    this.printErrors(module);

    let codePrinter = new CodePrinter();
    let output = codePrinter.formatCode(module);

    this.codeOutputEditor.getModel()?.setValue(output);

    module.mainProgram?.compileToJavascriptFunctions();

    this.interpreter.init(module, {});

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

    monaco.editor.setModelMarkers(this.inputEditor.editor.getModel()!, "martin", markers);

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

