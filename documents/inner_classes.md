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

  public class InnerClass {               // Path: OuterClass.InnerClass  (class-scope: allowed)
    public int myInnerMethod() {
      return x;
    }
  }

  private int test() {
    interface InnerInterface {            // Local class: for the time being we don't allow these
      ...
    }

    printl("Test");
    final int localVar = 100;

    class InnerClass2 {           // Local class: for the time being we don't allow these

      void do(){
        int y = localVar * 2;
        int z = x * 2;
      }

    }

    void test2(){
       Runnable r = new Runnable {      // block scope anonymous -> allowed!
          void run(){
            ...
          }
       }

       List<String> list;
       Collections.sort(list, (a, b) -> b - a );            // Lambda function with functional interface Comparable<String, String>
       Collections.sort(list, (a, b) -> { return b - a;});    


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




## Implementation details

  * We have to track which outer local variables are accessed inside inner classes' methods. 
  * We store class-object in step.
  * 
  * Compiled code:
  ```javascript
    new this.AnoymousClass1(localVar1, localVar2, ...).c_$$xy(__t, parameter1, ..., parameterN)

    javascript-class:
    class AnonymousClass1 extends XYZ {

      constructor(localVar1, localVar2, ...){
        super();
        this.localVar1 = localVar1;
        this.localVar2 = localVar2;
        ...
      }

    }


  ```

