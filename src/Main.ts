import { ErrorLevel } from "./compiler/common/Error.ts";
import { Language } from "./compiler/common/Language.ts";
import { CompilerFile } from "./compiler/common/module/CompilerFile.ts";
import { Module } from "./compiler/common/module/Module.ts";
import { JavaCompiler } from "./compiler/java/JavaCompiler.ts";
import { JavaLanguage } from "./compiler/java/JavaLanguage.ts";
import { TokenPrinter } from "./compiler/java/lexer/TokenPrinter.ts";
import { AstComponent } from "./testgui/AstComponent.ts";
import { Button } from "./tools/Button.ts";
import { DOM } from "./tools/DOM.ts";
import { TabManager } from "./tools/TabManager.ts";

import { Interpreter } from "./compiler/common/interpreter/Interpreter.ts";
import { ProgramControlButtons } from "./testgui/ProgramControlButtons.ts";

import * as PIXI from 'pixi.js';

import jQuery from "jquery";
import { ProgramViewerComponent } from "./testgui/ProgramViewerComponent.ts";
import { testProgramsList } from "./testgui/testprograms/TestPrograms.ts";
import { TabbedEditorManager } from "./tools/TabbedEditorManager.ts";
import { TestResultViewer } from "./testgui/TestResultViewer.ts";

import '/include/css/main.css';
import '/include/css/button.css';
import { JavaCompiledModule } from "./compiler/java/module/JavaCompiledModule.ts";
import { JavaHoverProvider } from "./compiler/java/monacoproviders/JavaHoverProvider.ts";
import { GUITestAssertions } from "./test/lib/GUITestAssertions.ts";
import { GUITestRunner } from "./test/lib/GUITestRunner.ts";
import { TerminalPrintManager } from "./testgui/TerminalPrintManager.ts";
import { OptionView } from "./testgui/OptionView.ts";

import { JavaCompletionItemProvider as JavaCompletionItemProvider } from "./compiler/java/monacoproviders/JavaCompletionItemProvider.ts";
import { JavaSymbolMarker } from "./compiler/java/monacoproviders/JavaSymbolMarker.ts";
import { JavaRenameProvider } from "./compiler/java/monacoproviders/JavaRenameProvider.ts";
import { JavaDefinitionProvider } from "./compiler/java/monacoproviders/JavaDefinitionProvider.ts";
import { Range } from "./compiler/common/range/Range.ts";
import { JavaReferenceProvider } from "./compiler/java/monacoproviders/JavaReferenceProvider.ts";
import { JavaSignatureHelpProvider } from "./compiler/java/monacoproviders/JavaSignatureHelpProvider.ts";
import { GraphicsManager } from "./compiler/common/interpreter/GraphicsManager.ts";
import { IMain } from "./compiler/common/IMain.ts";
import { KeyboardManager } from "./compiler/common/interpreter/KeyboardManager.ts";
import { BreakpointManager } from "./compiler/common/BreakpointManager.ts";
import { Formatter as JavaFormatter } from "./compiler/java/monacoproviders/JavaFormatter.ts";
import { ColorProvider } from "./compiler/common/monacoproviders/ColorProvider.ts";

import spritesheetjson from '/include/graphics/spritesheet.json.txt';
import spritesheetpng from '/include/graphics/spritesheet.png';
import { Debugger } from "./compiler/common/debugger/Debugger.ts";
import { ProgramPointerManager } from "./compiler/common/monacoproviders/ProgramPointerManager.ts";
import { JavaMethod } from "./compiler/java/types/JavaMethod.ts";
import { TestManager } from "./compiler/common/interpreter/TestManager.ts";
import { ActionManager } from "./compiler/common/interpreter/IActionManager.ts";
import { ErrorMarker } from "./compiler/common/monacoproviders/ErrorMarker.ts";
import { ReplGUI } from "./testgui/editor/ReplGUI.ts";
import { Repl } from "./compiler/java/parser/repl/Repl.ts";
import { ReplCompiledModule } from "./compiler/java/parser/repl/ReplCompiledModule.ts";
import { TestInputManager } from "./testgui/TestInputManager.ts";
import { TestFileManager } from "./testgui/TestFileManager.ts";
import { OnDidTypeProvider } from "./compiler/common/monacoproviders/OnDidTypeProvider.ts";

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

  files: CompilerFile[] = [];

  compiler: JavaCompiler;
  interpreter: Interpreter;

  decorations?: monaco.editor.IEditorDecorationsCollection;

  replGUI!: ReplGUI;
  repl!: Repl;

  constructor() {
    this.loadSpritesheet();

    this.language = new JavaLanguage();
    this.language.registerLanguageAtMonacoEditor();

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

    for (let i = 0; i < 3; i++) {
      let file = new CompilerFile("module " + i);
      file.createMonacolModel();

      this.files.push(file);
    }
    let file = new CompilerFile("Tests");
    file.createMonacolModel();
    //file.setText(testPrograms.testFuerListe.trim());
    this.files.push(file);


    this.tabbedEditorManager = new TabbedEditorManager(document.getElementById('editorOuter')!,
      this.files);

    OnDidTypeProvider.configureEditor(this.tabbedEditorManager.editor.editor);

    this.setProgram("simpleWhileLoops");

    this.compiler = new JavaCompiler();
    this.compiler.files = this.files;

    this.actionManager = new ActionManager();
    let keyboardManager = new KeyboardManager(jQuery('#insighttabs'), this);

    this.breakpointManager = new BreakpointManager(this);
    let _debugger = new Debugger(this.debuggerDiv, this);

    let testManager = new TestManager(this, this.actionManager, this.testResultViewer);

    let inputManager = new TestInputManager(this.inputDiv, this.insightTabsManager);

    let fileManager = new TestFileManager(this);

    this.interpreter = new Interpreter(new TerminalPrintManager(), this.actionManager,
      new GraphicsManager(this.graphicsDiv), keyboardManager,
      this.breakpointManager, _debugger, new ProgramPointerManager(this),
      testManager, inputManager, fileManager);

    this.testResultViewer.addEventListener('run-all-tests',
      (e) => { if (e.type == "run-all-tests") testManager.executeAllTests(); });

    this.initButtons();
    this.initCompiler();

    this.initRepl();
    this.interpreter.repl = this.repl;

    this.registerMonacoProviders();

    // document.addEventListener('keydown', (key) => {
    //   console.log(key.code);
    // });

  }

  getCurrentlyEditedModule(): Module | undefined {
    let model = this.getEditor().getModel();
    if (!model) return;
    return this.getModuleForMonacoModel(model);
  }

  isEmbedded(): boolean {
    return false;
  }

  getInterpreter(): Interpreter {
    return this.interpreter;
  }

  getEditor(): monaco.editor.IStandaloneCodeEditor {
    return this.tabbedEditorManager.editor.editor;
  }

  getCompiler(): JavaCompiler {
    return this.compiler;
  }

  ensureModuleIsCompiled(module: JavaCompiledModule): void {
    if (module instanceof ReplCompiledModule) {
      this.repl.compileAndShowErrors(module.file.getText());
    } else {
      this.compiler.updateSingleModuleForCodeCompletion(module);
    }
  }

  getModuleForMonacoModel(model: monaco.editor.ITextModel | null): JavaCompiledModule | undefined {
    if (model == null) return undefined;

    for (let file of this.files) {
      if (file.getMonacoModel() == model) {
        return this.compiler.lastCompiledExecutable?.moduleManager.findModuleByFile(file);
      }
    }

    if (model == this.replGUI.editor.getModel()) {
      return this.repl.getCurrentModule();
    }

    return undefined;
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

  initRepl() {

    let buttonDiv = document.getElementById('bottomleft')!;
    this.replGUI = new ReplGUI(this, buttonDiv);

    this.repl = new Repl(this.interpreter, this.compiler.libraryModuleManager, this.replGUI.editor);

  }


  initCompiler() {
    this.compiler.compilationFinishedCallback = (executable) => {
      this.interpreter.setExecutable(executable);
      if (executable) {
        for (let module of executable.moduleManager.modules) {
          ErrorMarker.markErrorsOfModule(module);
          this.printErrors(module);
        }

        if (executable.mainModule) {
          let jcm = <JavaCompiledModule>executable.mainModule;
          this.astComponent.buildTreeView(jcm.ast);
          TokenPrinter.print(jcm.tokens!, this.tokenDiv);
        }

        this.programViewerCompoment.buildTreeView(this.compiler.moduleManager);

      }

    }

    this.compiler.askBeforeCompilingCallback = () => {
      return !this.interpreter.isRunningOrPaused();
    }

    this.compiler.startCompilingPeriodically();

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

  registerMonacoProviders() {
    let editor = this.tabbedEditorManager.editor.editor;
    monaco.languages.registerHoverProvider('myJava', new JavaHoverProvider(editor, this));
    monaco.languages.registerCompletionItemProvider('myJava', new JavaCompletionItemProvider(editor, this));
    monaco.languages.registerRenameProvider('myJava', new JavaRenameProvider(editor, this));
    monaco.languages.registerDefinitionProvider('myJava', new JavaDefinitionProvider(editor, this));
    monaco.languages.registerReferenceProvider('myJava', new JavaReferenceProvider(editor, this));
    monaco.languages.registerSignatureHelpProvider('myJava', new JavaSignatureHelpProvider(editor, this));
    new JavaSymbolMarker(this.tabbedEditorManager.editor.editor, this);
    new ColorProvider(this);

    new JavaFormatter().init();

    let that = this;
    monaco.editor.registerEditorOpener({
      openCodeEditor(source: monaco.editor.ICodeEditor, resource: monaco.Uri, selectionOrPosition?: monaco.IRange | monaco.IPosition): boolean | Promise<boolean> {

        let module = that.getCompiler().moduleManager.modules.find(m => m.file.getMonacoModel()?.uri == resource);

        if (module) {
          let model = module.file.getMonacoModel();
          if (model) {
            editor.setModel(model);
            editor.setPosition(Range.getStartPosition(<monaco.IRange>selectionOrPosition));
            return true;
          }
        }

        return false;
      }
    })
  }

  setProgram(programName: string) {
    for (let program of testProgramsList) {
      if (program[0] == programName) {
        let currentTab = this.tabbedEditorManager.activeIndex;
        this.files[currentTab].setText(program[1].trim());
        return;
      }
    }
  }

  getAllModules(): Module[] {
    return this.getCompiler().moduleManager.modules;
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

  getRepl(): Repl {
    return this.repl;
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

