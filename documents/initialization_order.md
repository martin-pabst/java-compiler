# initialization order
  * Order of static initializers: [see java spec](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4)
    * A class or interface type T will be initialized immediately before the first occurrence of any one of the following:
      * T is a class and an instance of T is created.
      * T is a class and a static method declared by T is invoked.
      * A static field declared by T is assigned.
      * A static field declared by T is used and the field is not a constant variable (§4.12.4).
      * T is a top level class (§7.6), and an assert statement (§14.10) lexically nested within T (§8.1.3) is executed.
    * Static initializers inside a class are executed in the same order as they appear in the sourcecode [see java spec here](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.1.3) ("Initialization consists of execution of any class variable initializers and static initializers of the class Test, in textual order. But before Test can be initialized, its direct superclass must be initialized, as well as the direct superclass of its direct superclass, and so on, recursively. In the simplest case, Test has Object as its implicit direct superclass; if class Object has not yet been initialized, then it must be initialized before Test is initialized. Class Object has no superclass, so the recursion terminates here.")
  * Order of instance initialization (on calling new T(...)) [see java spec here](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.5):
    * instance initializer blocks and instance variable initializers are executed in the same order as they appear in the sourcecode
    * if first statement of the constructor is this(...) - call to other constructor, then code of other constructor is executed before current constructor
    * if first statement of constructor is super(...) then super-constructor is called before current constructor (superconstructor-call is mandatory if there is no default constructor in base class and automatically inserted if there is any)
    * code inside constructor is executed last

  ```java
  public class WhyIsThisOk {
    
    // This is an instance initializer block. I didn't know they exist...
    {
        a = get5();
    }

    public WhyIsThisOk() {
        a = get7();
    }

    public static void main(String[] args) {
        System.out.println(new WhyIsThisOk().a);
    }

    int a = get10();    // This is an instance variable initializer

    public static int get5() {
        System.out.println("get5 from: " + new Exception().getStackTrace()[1].getMethodName());
        return 5;
    }

    public static int get7() {
        System.out.println("get7 from: " + new Exception().getStackTrace()[1].getMethodName());
        return 7;
    }

    public static int get10() {
        System.out.println("get10 from: " + new Exception().getStackTrace()[1].getMethodName());
        return 10;
    }
  }

  // Output is:
  // get5 from: <init>
  //get10 from: <init>
  //get7 from: <init>
  //7

  ```
