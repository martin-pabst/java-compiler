# constant expressions
See [Java Spec](https://docs.oracle.com/javase/specs/jls/se20/html/jls-15.html#jls-15.29).

  * Solution: we implement constant folding by adding optional value field to StringCodeSnippet.
  * Constant expressions may contain references to static constant (that is: final!) fields or constant (that is: final!) fields, therefore constant folding can only take place after type resolving
  * Problem: static field initilizers can reference other static fields, therefore initialization could need iterative approach, see [Here](https://docs.oracle.com/javase/specs/jls/se11/html/jls-12.html#jls-12.4.2)
  * we need this iterative approach anyway to get constant initial values for (static) fields wherever possible:

  ```javascript
    class TestA {
      final static int f = 10 + TestB.m;          // This is triky... we don't want two waste time at program startup!
      static int k = 12;              // This is easy: initialize with value 12
    }

    class TestB {
      static int m = TestA.k + 17;    

      int c = 7 + a;
      int f1 = TestA.f * 2;         // It's really important to resolve value 78 at compile time to avoid wasting time every time a TestB object is created!
      int a = 5;
    }
  ```



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




