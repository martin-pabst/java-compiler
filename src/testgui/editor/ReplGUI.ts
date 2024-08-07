import { IMain } from "../../compiler/common/IMain";
import { DOM } from "../../tools/DOM";

export class ReplGUI {
    editor!: monaco.editor.IStandaloneCodeEditor;
    upperDiv: HTMLElement;

    constructor(private main: IMain, parentElement: HTMLElement) {
        this.upperDiv = DOM.makeDiv(parentElement);
        this.upperDiv.style.flex = "1";
        this.upperDiv.style.width = "100%";
        this.upperDiv.style.backgroundColor = "#808080";

        let editorDiv = DOM.makeDiv(parentElement);
        editorDiv.style.width = "100%";
        editorDiv.style.height = "22px";

        this.initEditor(editorDiv);

        let lastStatement: string = "";

        this.editor.onKeyUp((e) => {
            let statement = this.editor.getModel()?.getValue();
            if (!statement) return;

            if (e.code == 'Enter') {
                setTimeout(async () => {
                    // let returnValue = main.getRepl().executeSynchronously(statement);
                    let returnValue = await main.getRepl().executeAsync(statement!, false);
                    if(returnValue["value"]) returnValue = returnValue.value;
                    let outputDiv = DOM.makeDiv(this.upperDiv);
                    outputDiv.textContent = '' + returnValue;
                    this.editor.getModel()?.setValue('');
                }, 10);
            } else {
                if(statement != lastStatement){
                    main.getRepl().compileAndShowErrors(statement);
                    lastStatement = statement;
                }
            }
        })



    }

    initEditor(parentElement: HTMLElement) {
        monaco.editor.defineTheme('myCustomThemeDark', {
            base: 'vs-dark', // can also be vs-dark or hc-black
            inherit: true, // can also be false to completely replace the builtin rules
            rules: [
                { token: 'method', foreground: 'dcdcaa', fontStyle: 'italic' },
                { token: 'print', foreground: 'dcdcaa', fontStyle: 'italic bold' },
                { token: 'class', foreground: '3DC9B0' },
                { token: 'number', foreground: 'b5cea8' },
                { token: 'type', foreground: '499cd6' },
                { token: 'identifier', foreground: '9cdcfe' },
                { token: 'statement', foreground: 'bb96c0', fontStyle: 'bold' },
                { token: 'keyword', foreground: '68bed4', fontStyle: 'bold' },
                { token: 'string3', foreground: 'ff0000' },

                // { token: 'comment.js', foreground: '008800', fontStyle: 'bold italic underline' },

                // semantic tokens:
                { token: 'property', foreground: 'ffffff', fontStyle: 'bold' },
            ],
            colors: {
                "editor.background": "#1e1e1e",
                "jo_highlightMethod": "#2b2b7d"
            }
        });


        this.editor = monaco.editor.create(parentElement, {
            // value: [
            //     'function x() {',
            //     '\tconsole.log("Hello world!");',
            //     '}'
            // ].join('\n'),
            language: 'myJava',
            "semanticHighlighting.enabled": true,
            lightbulb: {
                enabled: true
            },
            // gotoLocation: {
            //     multipleReferences: "gotoAndPeek"
            // },
            lineDecorationsWidth: 0,
            peekWidgetDefaultFocus: "tree",
            fixedOverflowWidgets: true,
            quickSuggestions: true,
            quickSuggestionsDelay: 10,
            fontSize: 14,
            //@ts-ignore
            fontFamily: window.javaOnlineFont == null ? "Consolas, Roboto Mono" : window.javaOnlineFont,
            fontWeight: "500",
            roundedSelection: true,
            selectOnLineNumbers: false,
            // selectionHighlight: false,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            occurrencesHighlight: false,
            autoIndent: "advanced",
            // renderWhitespace: "boundary",
            dragAndDrop: true,
            formatOnType: true,
            formatOnPaste: true,
            suggestFontSize: 16,
            suggestLineHeight: 22,
            wordBasedSuggestions: false,
            suggest: {
                localityBonus: true,
                insertMode: "replace",
                preview: true
                // snippetsPreventQuickSuggestions: false
            },
            parameterHints: { enabled: true, cycle: true },
            // //@ts-ignore
            // contribInfo: {
            //     suggestSelection: 'recentlyUsedByPrefix',
            // },

            tabSize: 3,
            insertSpaces: true,
            detectIndentation: false,
            minimap: {
                enabled: false
            },
            scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
            },
            theme: "myCustomThemeDark",
            wrappingIndent: "same",
            folding: false,
            overviewRulerBorder: false,
            lineNumbers: "off"
            // automaticLayout: true

        }
        );
    }

}