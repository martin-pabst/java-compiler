import { lm } from "../../../tools/language/LanguageManager";

export class JUnitTestrunnerLanguage {
    static ExecuteAllTestsInWorkspace = () => lm({
    "de": "Führt alle im aktuellen Workspace enthaltenen JUnit-Test aus.",
    "en": "Executes all JUnit-tests in current workspace.",
    })

    static allTests = () => lm({
    "de": "Alle Tests",
    "en": "All tests",
    })

    static failed = () => lm({
    "de": `schlug fehl`,
    "en": `failed`,
    })

    static expectedValue = () => lm({
    "de": "Erwarteter Wert: &nbsp;&nbsp;",
    "en": "Expected Value: ",
    })

    static actualValue = () => lm({
    "de": "Erhaltener Wert: ",
    "en": "Actual value: &nbsp;",
    })

    static runningAllTestsOfClass = (classIdentifier: string) => lm({
    "de": `Führe alle Tests der Klasse <span class="jo_junitClassIdentifier">${classIdentifier}</span> aus:`,
    "en": `Running all tests of class <span class="jo_junitClassIdentifier">${classIdentifier}</span>:`,
    })

    static runningAllTestsOfWorkspace = (workspaceIdentifier: string) => lm({
    "de": `Führe alle Tests des Workspaces <span class="jo_junitWorkspaceIdentifier">${workspaceIdentifier}</span> aus:`,
    "en": `Running all tests of workspace <span class="jo_junitWorkspaceIdentifier">${workspaceIdentifier}</span>:`,
    })

    static executingTestMethod = (classIdentifier: string, methodIdentifier: string) => lm({
    "de": `Führe Testmethode <span class="jo_junitLink"><span class="jo_junitClassIdentifier">${classIdentifier}</span>.<span class="jo_junitMethodIdentifier">${methodIdentifier}</span></span> aus ...`,
    "en": `Running test-method <span class="jo_junitLink"><span class="jo_junitClassIdentifier">${classIdentifier}</span>.<span class="jo_junitMethodIdentifier">${methodIdentifier}</span></span> ...`,
    })

    static couldntGetMainThread = () => lm({
    "de": `Fehler: Konnte den main thread nicht erhalten.`,
    "en": `Error: Couldn't get main thread.`,
    })

    static line = (line: number, column: number) => lm({
    "de": `Zeile ${line}`,
    "en": `line ${line}`,
    })

}