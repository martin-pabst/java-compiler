# constant expressions
See [Java Spec](https://docs.oracle.com/javase/specs/jls/se20/html/jls-15.html#jls-15.29).

  * Solution: we implement constant folding by adding ConstantValueSnippet extends CodeSnippet.
  * Constant expressions may contain references to static constant fields or constant fields, therefore constant folding can only take place after type resolving
  * Problem: static field initilizers can reference other static fields, therefore initialization could need recursive approach, see [Here](https://docs.oracle.com/javase/specs/jls/se11/html/jls-12.html#jls-12.4.2)


## Order of steps:
  * TypeResolver:
    * instantiate type-objects for classes, enums, interfaces
    * instantiate objects for (static) methods and (static) fields 
    * iteratively assign types to
      * "extends" and "implements"-clauses
      * method-parameters and return-parameters
      * fields
    * builds runtime classes and runtime fields
  * CodeGenerator
    * iteratively compiles static field initialization for ALL classes (constant fields may depend on each other)
    * on compiling class: first compile fields iteratively to find constant fields
      * final fields (can be used e.g. in case-expressions later)
      * constant initializations (save them in prototype to avoid generation when creating objects at runtime)
    * then compile methods

## constant folding
  * when compiling expressions in TermCodeGenerator always do constant folding by using ConstantValueSnippet where possible

