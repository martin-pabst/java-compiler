export var testPrograms = {
synchronizedTest: `
new A().test();


class A {
   synchronized void test(){
      println("Hier");
      synchronized(this){
         for(int i = 0; i < 10; i++){
            println(i);
            if(i == 5) return;
         }
      }
      println("Hallo!");
   }
}`,
switchCaseWithConstant:`
public class A {
   public static final String a = "ABC";
   public static final int x = 5;
 }

 String b = "DEF";
 int y = 4;
 
 switch(b) {
     case A.a: fail("Case A.a must not be reached."); break;
     
     default: switch(y) {
       case 4:
       case 5: assertCodeReached("Didn't reache case 5."); break;
       default: fail("Default case must not be reached."); break;
     }
 }
 assertCodeReached("Code after switch...case-block not reached.");

 print("Here!");

`,
threadTest:`
for(int n = 0; n < 10; n++){
   Thread t = new Thread(new Runnable(){
      void run(){
         for(int i = 0; i < 1000000; i++){
            if(i % 100000 == 0){
               print("T " + n + ": " + i/100000 + ", ");
            }
         }
      }
   });

   t.start();
}


for(int i = 0; i < 1000000; i++){
   if(i % 100000 == 0){
      print("M: " + i/100000 + ", ");
   }
}
`,
sortTest:`
ArrayList<String> list = new ArrayList<>();

list.add("c");
list.add("b");
list.add("a");
list.add("f");
list.add("d");

class StringComparator implements Comparator<String> {
   int compare(String s1, String s2){
      return s1.compareTo(s2);
   }
}

list.sort(new StringComparator());

list.forEach((s) -> {println(s);})`,
ellipsisTest:`
new A().test(12, "Nick", "Emma");



class A {
   void test(int x, String... names){
      println(x);
      for(int i = 0; i < names.length; i++){
         println(names[i]);
      }
   }
}`,
consumerTestWithLambda:`
var list = new ArrayList<String>();

list.add("first");
list.add("second");
list.add("third");


list.forEach((e) -> {println(e);});

println("Fertig!");
`,
   consumerTest:`
var list = new ArrayList<String>();

list.add("first");
list.add("second");
list.add("third");

var consumer = new Consumer<String>(){
   void accept(String s){
      println(s);
   }
};


list.forEach(consumer);
`,
iteratorTest:`
class A implements Iterable<String> {
   Iterator<String> iterator(){
      return new Iterator<String>() {
         int counter = 200;
         boolean hasNext(){
            return counter < 210;
         }

         String next(){
            return counter++;
         }
      }
   }
}

for(var n: new A()){
   println(n);
}
`,
   forLoopWithIterator:`
var list = new ArrayList<Integer>();

list.add(12);
list.add(13);
list.add(14);

for (Iterator<Integer> i = list.iterator(); i.hasNext(); ) {
    println(i.next());
}`,
enhancedForLoopTest:`
int[] array = {1, 2, 3, 4};

for(var n: array){
   println(n);
}

var list = new ArrayList<Integer>();

list.add(12);
list.add(13);
list.add(14);

for(var n: list){
   println(n);
}`,
   dynamicCallingConvention:`
ArrayList<String> arrayList = new ArrayList<String>();
arrayList.add("First");

List<String> list = arrayList;

list.add("Second");


class A<E> extends ArrayList<E> {

   boolean add(E e){
      return super.add(e);
   }


}`,
charAtError: `
String s3 = "Das ist ein Test und noch ein Test";
println(s3.charAt(2));

//assertEquals(s3.charAt(2), 's', "String object charAt not working.");
`,
callingConventions:`
ArrayList<String> arrayList = new ArrayList<String>();
arrayList.add("First");

List<String> list = arrayList;
list.add("Second");


class A<E> extends ArrayList<E> {
   boolean add(E e){
      super.add(e);
   }
}
`,
   superconstructorCall: `
new A();

class A {
   A(){
      super();
      println("A's constructor called.");
   }
}

class B {
   B(){
      println("B's constructor called.");
   }
}
`,
   super: `
new C().test();


class A {
   void printName(){
      println("Test A");
   }
}

class B extends A {
   void printName(){
      println("Test B");
   }
}

class C extends B {
   void printName(){
      println("Test C");
   }

   void test(){
      printName();
      super.printName();
      super.super.printName();
   }

}`,
   arrayLiteral: `
new A().test();

class A {
   int[] a = {1, 2, 7 + 4};

   void test(){
      println(a[2]);
   }

}
`,
   cast: `
interface A {}

class B implements A { }

class C extends B { }

C c = new C();

B b = c;

C c1 = (C)b;

A a = c;

C c2 = (C)a;

println("Fertig");`,
   switch_case_with_enums: `
enum Test {
   eins, zwei, drei
}

Test t = Test.drei;

switch(t){
   case Test.eins: println("eins!");
   case Test.zwei: println("zwei!");
}

println("Fertig");`,
   switch_case: `
class A {
   static final int x = 5;
   static final String y= "XYZ";
}
String s = "XYZ";
switch(s) {
   case A.y: 
   case "PQR": println("A"); break;
   default: println("B"); break;
}
int t = 2;
switch(t) {
   case A.x: break;
   default: println("C");
}
`, arrayListTest: `
ArrayList<String> list = new ArrayList<String>();

list.add("one");
list.add("two");
list.add("three");

println(list.get(1));

String[] list2 = new String[1];

String[] list3 = list.toArray(list2);

println(list3[2]);
`, genericParameterTest: `
interface I1<T> {
   void doIt(T t);
}

class C1 implements I1<String> {
   void doIt(String x){
      println("Hier");
   }
}

C1 x = new C1();
I1 y = x;

y.doIt("Test");`,
   genericMethodTest1: `
Test te = new Test();
Integer i = Integer.valueOf(10);

te.test(i);

class Test <T super Integer> {
   <S extends Integer> void test(S y){
      
      y.toString();
   }
} `,
   lambdaTest2: `
interface TestInterface {
   int foo(int n);
}


TestClass tc = new TestClass();
tc.bar(x -> x * 2);


class TestClass {
   void bar(TestInterface t){
      println(t.foo(10));
   }
}
`,
   lambdaTest: `
interface TestInterface {
   int foo(int n);
}

TestInterface t = (x) -> { return x * 2; };

println(t.foo(3));
 `,
   anonymousInnerClassTest: `
A a = new A();
Test t = a.test();
t.doIt();

class A {
   int i = 10;

   Test test(){

      int j = 20;

      return new Test(){
         void doIt(){
            println("Hier!");
            println(i);
            println(j);
         }
      };

   }

}

interface Test {
   void doIt();
}
    `,
   innerClassesTest: `
   A a = new A();
   A.B b = a.getB();
   println(b.getOuterI());
   a.i = 20;
   println(b.getOuterI());
   
   A.B.C c = new A.B.C();
   println(c.getOuterI());
   println(c.getOuterJ());
   
   
   class A {
      int i = 10;
   
      class B {
         
         int j = 100;
   
         int getOuterI(){
            return i;
         }
   
         class C {
           int getOuterJ(){
               return j;
           }
   
           int getOuterI(){
               return i;
           }
         }
   
      }
   
      B getB(){
         return new B();
      }
   
   
   }
`,
   simpleGenericsTest: `
A<String> a = new A<String>();
a.set("Test");
println(a.get());

class A<T> {
   T obj;
   
   T get(){
      return obj;
   }

   void set(T t){
      obj = t;
   }
}

`,
   staticFieldsTest: `
A a = new A();
a.test();

class A {
   static int x;
   int y;

   void test(){
      println("x: " + x + ", y: " + y);
   }
}
`,
   interfaceTest: `
T t = new T();
t.def();

S s = new S();
s.def();

interface Test {
   int doIt(String s);

   default void def(){
      println("Hier!" + doIt("Test"));
   }
}

class T implements Test {
   int doIt(String s){
      return 10;
   }
} 


class S implements Test {
   int doIt(String s){
      return 20;
   }
}`,
   enumTest: `
println(Test.eins.x);

enum Test {
   eins(5), zwei(10), drei(20);
   int x;
   private Test(int wert){
      x = wert;
   }
}
`,
   singleStepTest: `
println("A");
println("B");
println("C");
println("D");
println("E");
println("F");
println("G");
println("H");
println("I");
`,
   fieldTest: `

A a = new A();
a.privateA = 12;
a.protectedA = 12;
a.publicA = 14;

class A extends B {
   private int privateA;
   protected int protectedA;
   int publicA;

   void doIt(){
      privateA = 10;
      protectedA = 12;
      publicA = 14;
   }
}

class B {
   private int privateB;
   protected int protectedB;
   int publicB;

   void doIt(){
      publicA = 10;
   }
}
`,
   tryCatchTest: `
A a = new A();
a.testA();
println("Main program continues...");

class A {
   void testA(){
      println("Before try");
      try {
         println("before Exception");
         testB();
         println("after Exception");
      } catch(Exception ex){
         println("catch " + ex.getMessage());
      } finally{
         println("finally...");
      }
      println("After try-block");
   }

   void testB(){
      println("Method B begins");
      try {
         throw new Exception("TestException");
         println("After Exception b");
      } catch(MyException ex1){
         println("catch-Block b:" + ex1.getMessage());
      } finally {
         println("finally b...");
      }
   }
}


class MyException extends Exception {

}

`,
   stringTest: `
String s = "A";

new StringTest().test(s);

println("z" + s);



class StringTest {
   void test(String s1){
      println("x" + s1);
      s1 = "B";
      println("y" + s1);
   }
} 
`,
   hanoi: `
Hanoi h = new Hanoi();
h.erkläreLösung(1, 3, 4);    // Erkläre, wie man 4 Scheiben von Turm 1 zu Turm 3 bringt.

class Hanoi {

   void erkläreLösung(int startTurmNummer, int zielTurmNummer, int n) {
      if(n == 0) {
         return;
      }

      int übrigerTurmNummer = 6 - startTurmNummer - zielTurmNummer;
      
      erkläreLösung(startTurmNummer, übrigerTurmNummer, n - 1);
      println("Bewege eine Scheibe von Turm " + startTurmNummer + " zu Turm " + zielTurmNummer); 
      erkläreLösung(übrigerTurmNummer, zielTurmNummer, n - 1);
   }

}`,
   simpleClass: `
Test m = new Test();
int i = m.doIt("Hier!");

println(i);

class Test {
   int i = 12;
   int j = i + 7;
   public int doIt(String s){
      println(s);
      return j;
   }
}
`,
   simpleWhileLoops: `
int i = 0;
while(i < 10000){
    int j = 0;
    while(j < 10000){
        j++;
    }
    i++;
    if(i % 1000 == 0){
    print(i + "; ");
    }
}
`,
   arrayIndices: `
int[] test = new int[10];
test[5] = 2;
println(test[5]);
`,
   forLoop: `
for(int i = 0; i < 10; i++){
    print(i + ", ");
}
`,
   primzahlzwillinge: `int max = 100000;
boolean[] isPrime = new boolean[max];
for(int i = 0; i < max; i++) {
   isPrime[i] = true;
}

int i = 2;
while(i < max) {
   // Vielfache von i streichen
   int j = 2 * i;
   while(j < max) {
      isPrime[j] = false;
      j += i;
   }

   i++;
   while(i < max && !isPrime[i]) {
      i++;
   }
}

int k = 0;
for(int i = 0; i < max - 2; i++) {
   if(isPrime[i] && isPrime[i + 2]) { 
      print(i + "/" + (i + 2) + "; ");
      k++;
      if(k % 10 == 0) {
         println();
      } 
   }
}

println();
println(k + " Primzahlzwillinge gefunden!");`
}