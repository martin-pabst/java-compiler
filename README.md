# New java-compiler for the  [online-ide](https://www.online-ide.de)
This compiler/interpreter combo (work in progress...) understands a fairly large subset of the java programming language and transpiles it stepwise into individual javascript functions. These can then be executed inside a browser step by step. The compiler is a replacement for the old one that is currently integrated in the online-ide. Main difference is that there is no more intermediate language (P-Code) needed. Initial tests indicate that the new compiler/interpreter combo executes java code about 50 times faster than the old one.

## Features (done)
  * primitive types (int, long, double, ...)
  * classes, interfaces, enums, records, arrays
  * classes String, Math
  * for, while, if...else
  * break, continue
  * switch statement
  * simplified for-loop over collections
  * class ArrayList
  * try...catch...finally (exceptions)
  * generics (with wildcard-operator!)
  * named inner classes
  * anonymous classes
  * lambda functions
  * function declarations in main program
  * class Thread/multithreaded execution
  * locking, wait, notify
  * synchronized methods/blocks
  * semaphors (not yet tested)

## Features (in progress)
  * [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)-mode
  * port whole Onlne-IDE API to new compiler (2 %)
  * rich semantic support for editing sourcecode in the [monaco editor](https://microsoft.github.io/monaco-editor/)

