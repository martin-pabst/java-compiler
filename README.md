# New java-compiler for the  [online-ide](https://www.online-ide.de)
This compiler/interpreter combo (work in progress...) understands a fairly large subset of the java programming language and transpiles it into individual javascript functions. These can then be executed step by step inside a browser. The compiler is a replacement for the old one that is currently integrated in the [online-ide](https://www.online-ide.de). The main difference is that it understands a significantly larger subset of the Java Programming Language and that there is no more intermediate language (P-Code) needed. Initial tests indicate that the new compiler/interpreter combo executes java code **about 50 times faster** than the old one.

## Features (done)
  * primitive types (int, long, double, ...)
  * classes, interfaces, enums, arrays
  * classes String, Math
  * for, while, if...else
  * break, continue
  * switch statement
  * simplified for-loop over collections
  * class ArrayList
  * try...catch...finally (exceptions) (**new!**)
  * generics(**new: with wildcard-operator and generic methods**)
  * named inner classes (**new!**)
  * anonymous classes (**new!**)
  * lambda functions (**new!**)
  * function declarations in main program (**new!**)
  * class Thread/multithreaded execution (**new!**)
  * locking, wait, notify (**new!**)
  * synchronized methods/blocks (**new!**)
  * semaphors (not yet tested) (**new!**)
  * rich semantic support for editing sourcecode in the [monaco editor](https://microsoft.github.io/monaco-editor/)
  * [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)-mode

## Features (in progress)
  * port whole Onlne-IDE API to new compiler (30 %)
  * records

