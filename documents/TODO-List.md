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

## working status on current issue:

### fine-grained next todos on current issue:

## next todos
  * simplified for-loop over Iterable or array
  * generics (status: mostly done)
  * anonymous inner classes (status: mostly done)
  * Lambda Functions (status: mostly done)
  * generic methods
  * library method examples
  * detect cyclic calling of constructors


  

