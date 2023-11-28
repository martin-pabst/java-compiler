# Inner classes

## 01.11.2023: low priority, implement later if needed


  * Each class type has a list of inner class types
  * A inner class has Access to members of outer classes.
    * -> each inner class has a member _$outer which points to instance of outer class. It gets initialized when calling the constructor (additional invisible argument)
    * when accessing outer member: compiler _$outer.member or _$outer._$outer.member, ...
  * static inner classes don't have access to members of outer classes and therefore don't need __outer.
  * inner classes have visibility modifiers: public, private, protected
  * types JavaClass, JavaInterface, JavaEnum 
  

```java
class OuterClass {
  int x = 10;

  class InnerClass {
    public int myInnerMethod() {
      return x;
    }
  }
}

public class Main {
  public static void main(String[] args) {
    OuterClass myOuter = new OuterClass();
    OuterClass.InnerClass myInner = myOuter.new InnerClass();
    System.out.println(myInner.myInnerMethod());
  }
}
```
