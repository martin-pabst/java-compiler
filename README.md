# New java-compiler for the  [online-ide](https://www.online-ide.de)
This compiler/interpreter combo (work in progress...) understands a fairly large subset of the java programming language and transpiles it stepwise into individual javascript functions which can then get executed in the browser in single-step-mode. It is a replacement for the old compiler which is included in the online-ide until now.

## Features (done)
  * primitive types (int, long, double, ...)
  * classes, interfaces, enums, records, arrays
  * for, while, if...else
  * try...catch...finally (exceptions)

## Features (in progress)
  * switch statement
  * simplified for-loop over collecitons
  * break, continue
  * generics (needs testing)
  * lambda functions
  * multi threaded execution (50 %)
  * locks, semaphors (50 %)
  * [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)-mode
  * port whole Onlne-IDE API to new compiler (2 %)
  * rich semantic support for editing sourcecode in the [monaco editor](https://microsoft.github.io/monaco-editor/)

