import { ErrorLevel } from "./compiler/common/Error.ts";
import { Language } from "./compiler/common/Language.ts";
import { File } from "./compiler/common/module/File.ts";
import { Module } from "./compiler/common/module/Module.ts";
import { JavaCompiler } from "./compiler/java/JavaCompiler.ts";
import { JavaLanguage } from "./compiler/java/JavaLanguage.ts";
import { CodePrinter } from "./compiler/java/codegenerator/CodePrinter.ts";
import { TokenPrinter } from "./compiler/java/lexer/TokenPrinter.ts";
import { AstComponent } from "./testgui/AstComponent.ts";
import { Button } from "./tools/Button.ts";
import { DOM } from "./tools/DOM.ts";
import { TabManager } from "./tools/TabManager.ts";

import { Interpreter } from "./compiler/common/interpreter/Interpreter.ts";
import { ProgramControlButtons } from "./testgui/ProgramControlButtons.ts";
import { TestPrintManager } from "./testgui/TestPrintManager.ts";

import jQuery from "jquery";
import { ProgramPointerPositionInfo, SchedulerState } from "./compiler/common/interpreter/Scheduler.ts";
import { ActionManager } from "./testgui/ActionManager.ts";
import { ProgramViewerComponent } from "./testgui/ProgramViewerComponent.ts";
import { testProgramsList } from "./testgui/testprograms/TestPrograms.ts";
import { TabbedEditorManager } from "./tools/TabbedEditorManager.ts";
import { TestResultViewer } from "./testgui/TestResultViewer.ts";

import '/include/css/main.css';
import { MainClass } from "./compiler/java/MainInterface.ts";
import { JavaCompiledModule } from "./compiler/java/module/JavaCompiledModule.ts";
import { Executable } from "./compiler/common/Executable.ts";
import { JavaHoverProvider } from "./compiler/java/monacoproviders/JavaHoverProvider.ts";
import chalk from "chalk";
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

export class Main implements MainClass {

  language: Language;

  insightTabsManager: TabManager;
  tabbedEditorManager: TabbedEditorManager;
  testResultViewer: TestResultViewer;

  tokenDiv: HTMLDivElement;
  astDiv: HTMLDivElement;
  codeOutputDiv: HTMLDivElement;
  errorDiv: HTMLDivElement;
  testDiv: HTMLDivElement;

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
    //let testProgram: string = testPrograms.listeVorlage.trim();

    this.insightTabsManager = new TabManager(document.getElementById('insighttabs')!,
      ['token', 'ast', 'code', 'errors', 'tests']);

    this.insightTabsManager.setBodyElementClass('tabBodyElement');
    this.tokenDiv = this.insightTabsManager.getBodyElement(0);
    this.tokenDiv.style.overflow = 'auto';
    this.astDiv = this.insightTabsManager.getBodyElement(1);
    this.codeOutputDiv = this.insightTabsManager.getBodyElement(2);
    this.codeOutputDiv.classList.add('codeOutput');
    this.astDiv.classList.add('astOutput');
    this.errorDiv = this.insightTabsManager.getBodyElement(3);
    this.testDiv = this.insightTabsManager.getBodyElement(4);

    this.testResultViewer = new TestResultViewer();

    this.testResultViewer.addEventListener('run-all-tests',
      (e) => { if (e.type == "run-all-tests") this.runTest(); });

    this.testDiv.appendChild(this.testResultViewer);
    this.astComponent = new AstComponent(this.astDiv);


    this.programViewerCompoment = new ProgramViewerComponent(this.codeOutputDiv);

    for (let i = 0; i < 3; i++) {
      let file = new File("module " + i);
      file.createMonacolModel();

      this.files.push(file);
    }
    let file = new File("Tests");
    file.createMonacolModel();
    //file.setText(testPrograms.testFuerListe.trim());
    this.files.push(file);


    this.tabbedEditorManager = new TabbedEditorManager(document.getElementById('editorOuter')!,
      this.files);

    this.setProgram("listeVorlage");

    this.compiler = new JavaCompiler();
    this.compiler.files = this.files;

    this.actionManager = new ActionManager();

    this.interpreter = new Interpreter(new TerminalPrintManager(), this.actionManager);

    this.initButtons();
    this.initCompiler();

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

    this.registerMonacoProviders();

  }

  getCompiler(): JavaCompiler {
    return this.compiler;
  }

  ensureModuleIsCompiled(module: JavaCompiledModule): void {
    this.compiler.updateSingleModuleForCodeCompletion(module);
  }

  getModuleForMonacoModel(model: monaco.editor.ITextModel | null): JavaCompiledModule | undefined {
    if (model == null) return undefined;

    for (let file of this.files) {
      if (file.getMonacoModel() == model) {
        return this.compiler.lastCompiledExecutable?.moduleManager.findModuleByFile(file);
      }
    }

    return undefined;
  }

  initButtons() {
    let buttonDiv = document.getElementById('buttons')!;
    let firstRow = DOM.makeDiv(buttonDiv);
    new Button(firstRow, 'update tree', '#30c030', () => {
      this.programViewerCompoment.buildTreeView(this.compiler.moduleManager);
    }, 'myButton');

    let programNames = testProgramsList.map((value) => value[0])

    let optionView = new OptionView();
    optionView.setAttribute('programs', JSON.stringify(programNames));

    optionView.addEventListener('set-program',
      (e: any) => { if (e.type == "set-program") this.setProgram(e!.detail!.programName); });
    firstRow.appendChild(optionView);

    let programControlButtonDiv = DOM.makeDiv(buttonDiv, "programControlbuttons");

    this.programControlButtons = new ProgramControlButtons(jQuery(programControlButtonDiv), this.interpreter, this.actionManager);

  }

  runTest() {
    this.compiler.files = this.files;
    let executable = this.compiler.compileIfDirty();
    if (!executable) {
      return;
    }
    let testMethods = executable.getTestMethods();

    let testRunner = new GUITestRunner();
    this.interpreter.attachAssertionObserver(new GUITestAssertions(testRunner));
    for (let testMethode of testMethods) {
      let classEnumInterface = testMethode.classEnumInterface;
      let className = classEnumInterface.identifier;
      let methodName = testMethode.identifier;

      testRunner.startTest(methodName, "");

      let file = new File("TEST_FILE"); //TODO: Change to unique name 
      file.setText(`${className} testObject = new ${className}(); testObject.${methodName}();`);
      this.compiler.files.push(file);
      executable = this.compiler.compileIfDirty();
      if (executable?.isCompiledToJavascript == false) {
        testRunner.endTest(true);
        continue;
      }
      this.interpreter.setTestExecutable(executable);
      this.interpreter.runMainProgramSynchronously();
      // TODO: When programm crashes, the test should fail.
      //let executionError = this.interpreter.scheduler.state != SchedulerState.error;
      testRunner.endTest(false);
      this.compiler.files = this.compiler.files.filter(f => f.filename != "TEST_FILE");
    }

    let testResults = testRunner.getTestResults();

    this.testResultViewer.setAttribute('results', JSON.stringify(testResults));
  }

  compile() {

    // let executable = this.compiler.compileIfDirty(this.files, this.tabbedEditorManager.getCurrentlyOpenedFile());

    // let module = this.compiler.moduleManager.getModuleFromFile(this.tabbedEditorManager.getCurrentlyOpenedFile())!;


    // if (module) {
    //   TokenPrinter.print(module.tokens!, this.tokenDiv);
    //   this.astComponent.buildTreeView(module.ast);

    //   this.markErrors(module);
    //   this.printErrors(module);

    //   let codePrinter = new CodePrinter();

    // }

    // this.interpreter.setExecutable(executable);
    // this.programViewerCompoment.buildTreeView(this.compiler.moduleManager);

  }

  initCompiler() {
    this.compiler.compilationFinishedCallback = (executable) => {
      this.interpreter.setExecutable(executable);
      if (executable) {
        for (let module of executable.moduleManager.modules) {
          this.markErrors(module);
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

    monaco.editor.setModelMarkers(module.file.getMonacoModel()!, "martin", markers);

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

  registerMonacoProviders() {
    let editor = this.tabbedEditorManager.editor.editor;
    monaco.languages.registerHoverProvider('myJava', new JavaHoverProvider(editor, this));
    monaco.languages.registerCompletionItemProvider('myJava', new JavaCompletionItemProvider(editor, this));
    monaco.languages.registerRenameProvider('myJava', new JavaRenameProvider(editor, this));
    monaco.languages.registerDefinitionProvider('myJava', new JavaDefinitionProvider(editor, this));
    monaco.languages.registerReferenceProvider('myJava', new JavaReferenceProvider(editor, this));
    monaco.languages.registerSignatureHelpProvider('myJava', new JavaSignatureHelpProvider(editor, this));
    new JavaSymbolMarker(this.tabbedEditorManager.editor.editor, this);

    let that = this;
    monaco.editor.registerEditorOpener({
      openCodeEditor(source: monaco.editor.ICodeEditor, resource: monaco.Uri, selectionOrPosition?: monaco.IRange | monaco.IPosition): boolean | Promise<boolean> {
        
        let module = that.getCompiler().moduleManager.modules.find(m => m.file.getMonacoModel()?.uri == resource);

        if(module){
          let model = module.file.getMonacoModel();
          if(model){
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
        this.files[currentTab].setText(program[1]);
        return;
      }
    }
  }

  getAllModules(): Module[] {
    return this.getCompiler().moduleManager.modules;
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

