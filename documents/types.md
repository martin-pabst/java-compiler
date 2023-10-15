# Types

## PrimitiveType vs. NonPrimitiveType
  * Every type has a member isPrimitive: boolean


## Generics
```java
    class A <S extends Object, T extends Object> extends ArrayList<S> {

    }

    class B <U extends String, V extends Object>{
        member1: A<U, V>;
        member2: A<ArrayList<U>, ? extends Integer>
    }
```