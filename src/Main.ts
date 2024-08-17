import { Language } from "./compiler/common/Language.ts";
import { CompilerFile } from "./compiler/common/module/CompilerFile.ts";
import { Module } from "./compiler/common/module/Module.ts";
import { JavaLanguage } from "./compiler/java/JavaLanguage.ts";
import { TokenPrinter } from "./compiler/java/lexer/TokenPrinter.ts";
import { AstComponent } from "./testgui/AstComponent.ts";
import { DOM } from "./tools/DOM.ts";
import { TabManager } from "./tools/TabManager.ts";

import { Interpreter } from "./compiler/common/interpreter/Interpreter.ts";
import { ProgramControlButtons } from "./testgui/ProgramControlButtons.ts";

import * as PIXI from 'pixi.js';

import jQuery from "jquery";
import { testProgramsList } from "./testgui/testprograms/TestPrograms.ts";
import { TabbedEditorManager } from "./tools/TabbedEditorManager.ts";

import { JavaCompiledModule } from "./compiler/java/module/JavaCompiledModule.ts";
import { OptionView } from "./testgui/OptionView.ts";
import '/include/css/button.css';
import '/include/css/main.css';
import '/include/css/junit.css';

import { BreakpointManager } from "./compiler/common/BreakpointManager.ts";
import { IMain } from "./compiler/common/IMain.ts";
import { GraphicsManager } from "./compiler/common/interpreter/GraphicsManager.ts";
import { KeyboardManager } from "./compiler/common/interpreter/KeyboardManager.ts";

import { Compiler } from "./compiler/common/Compiler.ts";
import { Debugger } from "./compiler/common/debugger/Debugger.ts";
import { Disassembler } from "./compiler/common/disassembler/Disassembler.ts";
import { Executable } from "./compiler/common/Executable.ts";
import { ActionManager } from "./compiler/common/interpreter/ActionManager.ts";
import { CompilerWorkspace } from "./compiler/common/module/CompilerWorkspace.ts";
import { EditorOpenerProvider } from "./compiler/common/monacoproviders/EditorOpenerProvider.ts";
import { ErrorMarker } from "./compiler/common/monacoproviders/ErrorMarker.ts";
import { ProgramPointerManager } from "./compiler/common/monacoproviders/ProgramPointerManager.ts";
import { JavaRepl } from "./compiler/java/parser/repl/JavaRepl.ts";
import { CompilerWorkspaceImpl } from "./test/CompilerWorkspaceImpl.ts";
import { ReplGUI } from "./testgui/editor/ReplGUI.ts";
import { TestFileManager } from "./testgui/TestFileManager.ts";
import { TestInputManager } from "./testgui/TestInputManager.ts";
import spritesheetjson from '/include/graphics/spritesheet.json.txt';
import spritesheetpng from '/include/graphics/spritesheet.png';
import { ExceptionMarker } from "./compiler/common/interpreter/ExceptionMarker.ts";
import { IPosition } from "./compiler/common/range/Position.ts";
import { IRange, Range } from "./compiler/common/range/Range.ts";
import { JUnitTestrunner } from "./compiler/common/testrunner/JUnitTestrunner.ts";
import { TestPrintManager } from "./testgui/TestPrintManager.ts";

export class Main implements IMain {

  language: Language;

  insightTabsManager: TabManager;
  tabbedEditorManager: TabbedEditorManager;

  tokenDiv: HTMLDivElement;
  astDiv: HTMLDivElement;
  codeOutputDiv: HTMLDivElement;
  errorDiv: HTMLDivElement;
  junitDiv: HTMLDivElement;
  graphicsDiv: HTMLDivElement;
  debuggerDiv: HTMLDivElement;
  inputDiv: HTMLDivElement;

  programControlButtons!: ProgramControlButtons;
  actionManager: ActionManager;

  breakpointManager!: BreakpointManager;

  astComponent: AstComponent;

  disassembler: Disassembler;

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
    this.junitDiv = this.insightTabsManager.getBodyElement(4);
    this.graphicsDiv = this.insightTabsManager.getBodyElement(5);
    this.debuggerDiv = this.insightTabsManager.getBodyElement(6);
    this.inputDiv = this.insightTabsManager.getBodyElement(7);

    this.debuggerDiv.id = "debuggerdiv";

    this.astComponent = new AstComponent(this.astDiv);

    this.currentWorkspace = new CompilerWorkspaceImpl(this);

    for (let i = 0; i < 3; i++) {
      let file = new CompilerFile("module " + i);

      this.currentWorkspace.addFile(file);
    }
    let file = new CompilerFile("Tests");
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

    let inputManager = new TestInputManager(this.inputDiv, this.insightTabsManager);

    let fileManager = new TestFileManager(this);

    this.interpreter = new Interpreter(new TestPrintManager(), this.actionManager,
      new GraphicsManager(this.graphicsDiv), keyboardManager,
      this.breakpointManager, _debugger, new ProgramPointerManager(this),
      inputManager, fileManager, new ExceptionMarker(this));

    this.errorMarker = new ErrorMarker();

    this.initButtons();

    /**
     * Compiler and Repl are fields of language!
    */
    this.language = new JavaLanguage(this, this.errorMarker);
    this.language.registerLanguageAtMonacoEditor(this);

    new JUnitTestrunner(this, this.junitDiv);

    this.language.getCompiler().eventManager.on("compilationFinished", this.onCompilationFinished, this)
    this.language.getCompiler().startCompilingPeriodically();
     
      new EditorOpenerProvider(this);
      
      this.disassembler = new Disassembler(this.codeOutputDiv, this);
      
      this.tabbedEditorManager.eventManager.on("onActivateTab", (file: CompilerFile) => {
          this.disassembler.disassembleModule(this.getCompiler().findModuleByFile(file));        
      })

    // document.addEventListener('keydown', (key) => {
    //   console.log(key.code);
    // });


  }
  showProgramPosition(file?: CompilerFile, positionOrRange?: IPosition | IRange) {
    this.showFile(file);
    if(!positionOrRange) return;
    // @ts-ignore
    if(positionOrRange["startLineNumber"]) positionOrRange = Range.getStartPosition(<IRange>positionOrRange);
    this.getMainEditor().setPosition(<IPosition>positionOrRange)
    this.getMainEditor().focus();

  }
  getActionManager(): ActionManager {
    return this.actionManager;
  }
  showJUnitDiv(): void {
    this.tabbedEditorManager.setActive(this.junitDiv)
  }

  showFile(file?: CompilerFile): void {
    if(!file) return;
    let monacoModel = file.getMonacoModel();
    if (!monacoModel) return;
    this.getMainEditor().setModel(monacoModel);
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

  getDisassembler(): Disassembler | undefined {
    return this.disassembler;
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

