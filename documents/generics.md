#Generics

## casting rules
[See hiere](https://www.baeldung.com/java-generics-type-parameter-vs-wildcard)

``->`` means "implicit casting possible"
``~>`` means "explicit casting possible"

```javascript
// standard class casting
   B extends A => B -> A and A ~> B
   B implements A => B -> A and A ~> B

// casting without wildcast
   B extends A => B<C> -> A<C> and A<C> ~> B<C>

// BEWARE:
   B extends A && D extends C does NOT imply B<D> -> A<C>!

// Wildcard casting:
   B extends A  && D extends C => B<D> -> A<? extends C>
   B extends A  && D extends C => B<C> -> A<? super D>

// Wildcard without bounds:
   A<?> is equivalent to A<? extends Object>, therefore
   B extends A => B<D> -> A<?> for all D


   T  CANNOT cast to ? extends T
   T CAN cast to ? super T

// OldStyle classes
   A<X> -> A for all A, X

```

## Generic methods

public <E> E testMethod(List<? extends E> li, E element);

ArrayList<String> al;
testMethod(al, "Hier");
 -> analyze all parameters to find possible types of E ("captures" of E)
 -> compare captures; if 




