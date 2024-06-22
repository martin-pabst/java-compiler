# TODO-List

## done:
  * wire up interpreter  -> done!
  * CodeGenerator: while-loop, then test performance... -> done. Looks great!
  * CodeGenerator: implicit casting -> done, needs testing...
  * CodeGenerator: class declaration -> done
  * CodeGenerator: method-declaration -> done (without ellipsis yet...)
  * CodeGenerator: method-call -> done
  * CodeGenerator: object instantiation -> done
  * CodeGenerator: field access -> done
  * CodeGenerator: constant folding -> done
  * try ... catch ... finally -> done
  * check if return statement happened in every execution line
  * check if local variables have been initialized before first access
  * wire up step over, step into, step out
  * enums...    -> needs more testing
  * interfaces...  -> needs more testing
  * use templates to generate fast code for static library functions like Math.sin, Math.atan2, ...
  * invoke methods on expressions wich evaluate to a string primitive (with constant folding)
  * library method to gather information for automated tests
  * switch..case -> done
  * break and continue in loops -> done
  * String-methods
  * Math-methods
  * Declaration of several fields/local variables like int a = 4, b[], c = 3;
  * Array literals
  * Alternative array declaration: int a[] instead of int[] a
  * Keywords this and super (especially to call constructor from other constructor)
  * while resolving types: Store which library methods are overridden by java methods. Afterwards we can call all other methods natively.
  * Instantiate object of generic type without specifying generic parameters, like List<String> list = new ArrayList<>();
  * simplified for-loop over Iterable or array
  * varArgs-parameters (== ellipsis)
  * compiler messages in different languages (at least: german and english)
  * class Thread and Runnable
  * synchronized methods/blocks
  * class Semaphor
  * automatic tests for compiler errors
  * generics (status: need more testing)
  * anonymous inner classes (status: need more testing)
  * Lambda Functions (status: need more testing)
  * generic methods (status: need more testing)
  * library method examples
  * REPL
  * debugger: show fields of base classes

## working status on current issue:

### fine-grained next todos on current issue:

## next 
  * Classes BigInteger, Console, Gamepad, Input, Math, MathToolsClass, System, SystemTools, Timer, Vector2 
  * Missing Collections 
  * GNG classes
  * JavaKara
  * JavaHamster
  * Robot
  * classes for graphical GUI-Elements
  * if method overrides or implements other method and has no comment, then take the overriden method's comment
  * detect cyclic calling of constructors

## after integrating new compiler into online-ide
  * class Sound
  * Database classes
  * class Files
  * HTTP-Client and JSON-Converter



  

