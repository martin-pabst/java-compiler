export class JavaAddEditorShortcuts {
    static addActions(editor: monaco.editor.IStandaloneCodeEditor) {
        editor.addAction({
            // An unique identifier of the contributed action.
            id: 'Find bracket',

            // A label of the action that will be presented to the user.
            label: 'Finde korrespondierende Klammer',

            // An optional array of keybindings for the action.
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],

            // A precondition for this action.
            precondition: undefined,

            // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
            keybindingContext: undefined,

            contextMenuGroupId: 'navigation',

            contextMenuOrder: 1.5,

            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convenience
            run: function (ed) {
                ed.getAction('editor.action.jumpToBracket')?.run();
                return undefined;
            }
        });

        // Strg + # funktioniert bei Firefox nicht, daher alternativ Strg + ,:
        editor.addAction({
            // An unique identifier of the contributed action.
            id: 'Toggle line comment',

            // A label of the action that will be presented to the user.
            label: 'Zeilenkommentar ein-/ausschalten',

            // An optional array of keybindings for the action.
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Comma],

            // A precondition for this action.
            precondition: undefined,

            // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
            keybindingContext: undefined,

            contextMenuGroupId: 'insert',

            contextMenuOrder: 1.5,

            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convinience
            run: function (ed) {
                console.log('Hier!');
                ed.getAction('editor.action.commentLine')?.run();
                return undefined;
            }
        });

    }
}