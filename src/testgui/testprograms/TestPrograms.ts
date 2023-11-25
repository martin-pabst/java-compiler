export var testPrograms = {
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
singleStepTest:`
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
fieldTest:`

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
tryCatchTest:`
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
stringTest:`
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
   hanoi:`
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
simpleClass:`
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
forLoop:`
for(int i = 0; i < 10; i++){
    print(i + ", ");
}
`,
primzahlzwillinge:`int max = 100000;
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