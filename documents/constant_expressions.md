# constant expressions
See [Java Spec](https://docs.oracle.com/javase/specs/jls/se20/html/jls-15.html#jls-15.29).

  * Solution: we implement constant folding by adding optional value field to StringCodeSnippet.
  * Constant expressions may contain references to static constant (that is: final!) fields or constant (that is: final!) fields, therefore constant folding can only take place after type resolving
  * Problem: static field initilizers can reference other static fields, see [Here](https://docs.oracle.com/javase/specs/jls/se11/html/jls-12.html#jls-12.4.2)