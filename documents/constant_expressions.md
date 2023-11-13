# constant expressions
See [Java Spec](https://docs.oracle.com/javase/specs/jls/se20/html/jls-15.html#jls-15.29).

  * Solution: we implement constant folding by adding attribute constantValue: any | undefined to CodeSnippet.
  * Constant expressions may contain references to static constant fields or constant fields, therefore constant folding can only take place after type resolving
  * Problem: static field initilizers can reference other static fields, therefore initialization could need recursive approach, see [Here](https://docs.oracle.com/javase/specs/jls/se11/html/jls-12.html#jls-12.4.2)


## Order of steps:
  * TypeResolver:
    * setup t

