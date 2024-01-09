import { Main } from "../../Main";

export class Editor {
    editor: monaco.editor.IStandaloneCodeEditor;

    constructor(element: HTMLElement) {

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
                {token: 'property', foreground: 'ffffff' ,fontStyle: 'bold'},
            ],
            colors: {
                "editor.background": "#1e1e1e",
                "jo_highlightMethod": "#2b2b7d"
            }
        });


        this.editor = monaco.editor.create(element, {
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
            suggest: {
                localityBonus: true,
                insertMode: "replace"
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
                enabled: true
            },
            scrollbar: {
                vertical: 'auto',
                horizontal: 'auto'
            },
            theme: "myCustomThemeDark",
            wrappingIndent: "same"
            // automaticLayout: true

        }
        );

        

    
    }

    setValue(text: string){
        this.editor.getModel()?.setValue(text);
    }

}