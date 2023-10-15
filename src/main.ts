import { Language } from "./compiler/common/Language";
import { Module } from "./compiler/common/module/module";
import { JavaLanguage } from "./compiler/java/JavaLanguage";
import { Lexer } from "./compiler/java/lexer/Lexer";
import { TokenPrinter } from "./compiler/java/lexer/TokenPrinter";
import { Editor } from "./editor/Editor";
import { Button } from "./tools/Button";
import { TabManager } from "./tools/TabManager";

import '/include/css/main.css';

export class Main {

  language: Language;
  editor: Editor;

  tabManager: TabManager;

  tokenDiv: HTMLDivElement;
  astDiv: HTMLDivElement;
  codeDiv: HTMLDivElement;
  errorDiv: HTMLDivElement;


  constructor() {
    this.language = new JavaLanguage();
    this.language.registerLanguageAtMonacoEditor();

    this.editor = new Editor(this, document.getElementById('editor')!);

    this.tabManager = new TabManager(document.getElementById('tabs')!, 
    ['token', 'ast', 'code', 'errors']);

    this.tabManager.setBodyElementClass('tabBodyElement');
    this.tokenDiv = this.tabManager.getBodyElement(0);
    this.astDiv = this.tabManager.getBodyElement(1);
    this.codeDiv = this.tabManager.getBodyElement(2);
    this.errorDiv = this.tabManager.getBodyElement(3);

    this.initButtons();

  }

  initButtons(){
    let buttonDiv = document.getElementById('buttons')!;
    new Button(buttonDiv, 'compile', '#30c030', () => {this.compile()}, 'myButton');


  }

  compile(){
    let text = this.editor.editor.getModel()?.getValue();
    if(text){
      let module = new Module(text);
      let lexer = new Lexer(module);
      lexer.lex();

      TokenPrinter.print(module.tokens!, this.tokenDiv);
    }
  }

}




async function initMonacoEditor(): Promise<void> {

  return new Promise((resolve) => {
    //@ts-ignore
    window.require.config({ paths: { 'vs': 'lib/monaco-editor/dev/vs' } });
    //@ts-ignore
    window.require.config({
      'vs/nls': {
        availableLanguages: {
          '*': 'de'
        }
      },
      ignoreDuplicateModules: ["vs/editor/editor.main"]
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

