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

## working status on current issue:

### fine-grained next todos on current issue:

## next todos
  * generics (status: mostly done)
  * anonymous inner classes (status: mostly done)
  * Lambda Functions (status: mostly done)
  * generic methods
  * Array constants
  * library method examples

 - Array-Literals (in den Formen new int[]{1, 2, 3} und int[] tes = { 1, 2, 3, 4, 6, 12, 24 }, auch mehrdimensional)
 - Alternative Array-Deklaration: Bisher geht int[] a;  Es fehlt noch int a[];
 - Deklaration mehrerer lokaler Variablen/mehrerer Attribute in einer Zeile (z.B. int two, three;), auch mit Arrays: int a, b[], c[][];
 - Schlüsselwort this (wird ausgewertet zu Helpers.elementRelativeToStackbase(0)); insbesondere auch in der besonderen Rolle zum Aufruf eines Konstruktors aus einem anderen heraus
 - Schlüsselwort super (insbesondere in der Rolle zum Aufruf eines super-Konstruktors)

  

