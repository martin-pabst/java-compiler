#Lambda functions

"The term Java functional interface was introduced in Java 8. A functional interface in Java is an interface that contains **only a single abstract (unimplemented) method**. A functional interface can contain default and static methods which do have an implementation, in addition to the single unimplemented method. [...] A Java functional interface can be implemented by a Java Lambda Expression."([see here](https://jenkov.com/tutorials/java-functional-programming/functional-interfaces.html))

```java
public interface MyFunctionalInterface2{
    public void execute();

    public default void print(String text) {
        System.out.println(text);
    }

    public static void print(String text, PrintWriter writer) throws IOException {
        writer.write(text);
    }
}

MyFunctionalInterface lambda = () -> {
    System.out.println("Executing...");
}

Predicate<Integer> p1 = i -> i > 5;
```


[Here many examples from Oracle](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)