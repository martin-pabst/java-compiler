import { Language } from "./compiler/common/Language.ts";
import { CompilerFile } from "./compiler/common/module/CompilerFile.ts";
import { Module } from "./compiler/common/module/Module.ts";
import { JavaCompiler } from "./compiler/java/JavaCompiler.ts";
import { JavaLanguage } from "./compiler/java/JavaLanguage.ts";
import { TokenPrinter } from "./compiler/java/lexer/TokenPrinter.ts";
import { AstComponent } from "./testgui/AstComponent.ts";
import { DOM } from "./tools/DOM.ts";
import { TabManager } from "./tools/TabManager.ts";

import { Interpreter } from "./compiler/common/interpreter/Interpreter.ts";
import { ProgramControlButtons } from "./testgui/ProgramControlButtons.ts";

import * as PIXI from 'pixi.js';

import jQuery from "jquery";
import { ProgramViewerComponent } from "./testgui/ProgramViewerComponent.ts";
import { testProgramsList } from "./testgui/testprograms/TestPrograms.ts";
import { TestResultViewer } from "./testgui/TestResultViewer.ts";
import { TabbedEditorManager } from "./tools/TabbedEditorManager.ts";

import { JavaCompiledModule } from "./compiler/java/module/JavaCompiledModule.ts";
import { OptionView } from "./testgui/OptionView.ts";
import { TerminalPrintManager } from "./testgui/TerminalPrintManager.ts";
import '/include/css/button.css';
import '/include/css/main.css';

import { BreakpointManager } from "./compiler/common/BreakpointManager.ts";
import { IMain } from "./compiler/common/IMain.ts";
import { GraphicsManager } from "./compiler/common/interpreter/GraphicsManager.ts";
import { KeyboardManager } from "./compiler/common/interpreter/KeyboardManager.ts";
import { Range } from "./compiler/common/range/Range.ts";

import { Debugger } from "./compiler/common/debugger/Debugger.ts";
import { ActionManager } from "./compiler/common/interpreter/ActionManager.ts";
import { TestManager } from "./test/TestManager.ts";
import { ErrorMarker } from "./compiler/common/monacoproviders/ErrorMarker.ts";
import { JavaOnDidTypeProvider } from "./compiler/java/monacoproviders/JavaOnDidTypeProvider.ts";
import { ProgramPointerManager } from "./compiler/common/monacoproviders/ProgramPointerManager.ts";
import { JavaRepl } from "./compiler/java/parser/repl/JavaRepl.ts";
import { JavaReplCompiledModule } from "./compiler/java/parser/repl/JavaReplCompiledModule.ts";
import { ReplGUI } from "./testgui/editor/ReplGUI.ts";
import { TestFileManager } from "./testgui/TestFileManager.ts";
import { TestInputManager } from "./testgui/TestInputManager.ts";
import spritesheetjson from '/include/graphics/spritesheet.json.txt';
import spritesheetpng from '/include/graphics/spritesheet.png';
import { Compiler } from "./compiler/common/Compiler.ts";
import { Executable } from "./compiler/common/Executable.ts";
import { CompilerWorkspace } from "./compiler/common/module/CompilerWorkspace.ts";
import { CompilerWorkspaceImpl } from "./test/CompilerWorkspaceImpl.ts";
import { EditorOpenerProvider } from "./compiler/common/monacoproviders/EditorOpenerProvider.ts";

export class Main implements IMain {

  language: Language;

  insightTabsManager: TabManager;
  tabbedEditorManager: TabbedEditorManager;
  testResultViewer: TestResultViewer;

  tokenDiv: HTMLDivElement;
  astDiv: HTMLDivElement;
  codeOutputDiv: HTMLDivElement;
  errorDiv: HTMLDivElement;
  testDiv: HTMLDivElement;
  graphicsDiv: HTMLDivElement;
  debuggerDiv: HTMLDivElement;
  inputDiv: HTMLDivElement;

  programControlButtons!: ProgramControlButtons;
  actionManager: ActionManager;

  breakpointManager!: BreakpointManager;

  astComponent: AstComponent;

  programViewerCompoment: ProgramViewerComponent;

  currentWorkspace: CompilerWorkspaceImpl;

  interpreter: Interpreter;

  decorations?: monaco.editor.IEditorDecorationsCollection;

  replGUI!: ReplGUI;

  errorMarker: ErrorMarker;

  constructor() {
    this.loadSpritesheet();


    /*
    * Test program:
    */
    //let testProgram: string = testPrograms.listeVorlage.trim();

    this.insightTabsManager = new TabManager(document.getElementById('insighttabs')!,
      ['token', 'ast', 'code', 'errors', 'tests', 'graphics', 'debugger', 'input']);

    this.insightTabsManager.setBodyElementClass('tabBodyElement');
    this.tokenDiv = this.insightTabsManager.getBodyElement(0);
    this.tokenDiv.style.overflow = 'auto';
    this.astDiv = this.insightTabsManager.getBodyElement(1);
    this.codeOutputDiv = this.insightTabsManager.getBodyElement(2);
    this.codeOutputDiv.classList.add('codeOutput');
    this.astDiv.classList.add('astOutput');
    this.errorDiv = this.insightTabsManager.getBodyElement(3);
    this.testDiv = this.insightTabsManager.getBodyElement(4);
    this.graphicsDiv = this.insightTabsManager.getBodyElement(5);
    this.debuggerDiv = this.insightTabsManager.getBodyElement(6);
    this.inputDiv = this.insightTabsManager.getBodyElement(7);

    this.debuggerDiv.id = "debuggerdiv";

    this.testResultViewer = new TestResultViewer();

    this.testDiv.appendChild(this.testResultViewer);
    this.astComponent = new AstComponent(this.astDiv);


    this.programViewerCompoment = new ProgramViewerComponent(this.codeOutputDiv);

    this.currentWorkspace = new CompilerWorkspaceImpl(this);

    for (let i = 0; i < 3; i++) {
      let file = new CompilerFile("module " + i);
      file.createMonacolModel();

      this.currentWorkspace.addFile(file);
    }
    let file = new CompilerFile("Tests");
    file.createMonacolModel();
    //file.setText(testPrograms.testFuerListe.trim());
    this.currentWorkspace.addFile(file);


    this.tabbedEditorManager = new TabbedEditorManager(document.getElementById('editorOuter')!,
      this.currentWorkspace.getFiles());
    this.initReplGUI();


    this.setProgram(testProgramsList[1][0]);


    this.actionManager = new ActionManager();
    let keyboardManager = new KeyboardManager(jQuery('#insighttabs'), this);

    this.breakpointManager = new BreakpointManager(this);
    let _debugger = new Debugger(this.debuggerDiv, this);

    let testManager = new TestManager(this, this.actionManager, this.testResultViewer);

    let inputManager = new TestInputManager(this.inputDiv, this.insightTabsManager);

    let fileManager = new TestFileManager(this);

    this.interpreter = new Interpreter(new TerminalPrintManager(), this.actionManager,
      new GraphicsManager(this.graphicsDiv, this), keyboardManager,
      this.breakpointManager, _debugger, new ProgramPointerManager(this),
      testManager, inputManager, fileManager);

    this.errorMarker = new ErrorMarker();


    /**
     * Compiler and Repl are fields of language!
    */
    this.language = new JavaLanguage(this, this.errorMarker);
    this.language.registerLanguageAtMonacoEditor(this);
    this.language.getCompiler().setFiles(this.currentWorkspace.getFiles());

    this.testResultViewer.addEventListener('run-all-tests',
      (e) => { if (e.type == "run-all-tests") testManager.executeAllTests(); });

    this.initButtons();

    new EditorOpenerProvider(this);


    // document.addEventListener('keydown', (key) => {
    //   console.log(key.code);
    // });

  }

  isEmbedded(): boolean {
    return false;
  }

  getInterpreter(): Interpreter {
    return this.interpreter;
  }

  getMainEditor(): monaco.editor.IStandaloneCodeEditor {
    return this.tabbedEditorManager.editor.editor;
  }

  getCompiler(): Compiler {
    return this.language.getCompiler();
  }

  getLanguage(): Language {
    return this.language;
  }

  initButtons() {
    let buttonDiv = document.getElementById('bottomleft')!;
    buttonDiv.style.display = "flex"
    buttonDiv.style.flexDirection = "column"

    let firstRow = DOM.makeDiv(buttonDiv);
    firstRow.style.margin = "10px 0px"
    firstRow.style.display = "flex"
    firstRow.style.flexDirection = "row"
    firstRow.style.alignItems = "center"
    // new Button(firstRow, 'update tree', '#30c030', () => {
    //   this.programViewerCompoment.buildTreeView(this.compiler.moduleManager);
    // }, 'myButton');

    let programNames = testProgramsList.map((value) => value[0])

    let optionView = new OptionView();
    optionView.setAttribute('programs', JSON.stringify(programNames));
    optionView.style.margin = "0 10px"

    optionView.addEventListener('set-program',
      (e: any) => { if (e.type == "set-program") this.setProgram(e!.detail!.programName); });
    firstRow.appendChild(optionView);

    let programControlButtonDiv = DOM.makeDiv(firstRow, "programControlbuttons");

    this.programControlButtons = new ProgramControlButtons(jQuery(programControlButtonDiv), this.interpreter, this.actionManager);

  }

  initReplGUI() {

    let buttonDiv = document.getElementById('bottomleft')!;
    this.replGUI = new ReplGUI(this, buttonDiv);

  }

  getReplEditor(): monaco.editor.IStandaloneCodeEditor {
    return this.replGUI.editor;
  }


  onCompilationFinished(executable: Executable | undefined): void {
    this.interpreter.setExecutable(executable);
    if (executable) {
      for (let module of executable.moduleManager.modules) {
        this.printErrors(module);
      }

      if (executable.mainModule) {
        let jcm = <JavaCompiledModule>executable.mainModule;
        this.astComponent.buildTreeView(jcm.ast);
        TokenPrinter.print(jcm.tokens!, this.tokenDiv);
      }

      this.programViewerCompoment.buildTreeView((<JavaCompiler>this.getCompiler()).moduleManager);

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

  setProgram(programName: string) {
    for (let program of testProgramsList) {
      if (program[0] == programName) {
        let currentTab = this.tabbedEditorManager.activeIndex;
        this.currentWorkspace.getFiles()[currentTab].setText(program[1].trim());
        return;
      }
    }
  }

  loadSpritesheet() {
    fetch(`${spritesheetjson}`)
      .then((response) => response.json())
      .then((spritesheetData: any) => {
        PIXI.Assets.load(`${spritesheetpng}`).then((texture: PIXI.Texture) => {
          let source: PIXI.ImageSource = texture.source;
          source.minFilter = "nearest";
          source.magFilter = "nearest";

          spritesheetData.meta.size.w = texture.width;
          spritesheetData.meta.size.h = texture.height;
          let spritesheet = new PIXI.Spritesheet(texture, spritesheetData);
          spritesheet.parse().then(() => {
            PIXI.Assets.cache.set('spritesheet', spritesheet);
          });
        })
      });

  }

  getRepl(): JavaRepl {
    return this.language.getRepl();
  }

  getCurrentWorkspace(): CompilerWorkspace | undefined {
    return this.currentWorkspace;
  }

  adjustWidthToWorld(): void {
      // nothing to do
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

