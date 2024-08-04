/**::
 * Test ellipsis
 * { "expectedOutput": "12\nNick\nEmma\n14\n" }
 */

new A().test(12, "Nick", "Emma",14);

class A {
   void test(int x, String... names){
      println(x);
      for(int i = 0; i < names.length; i++){
         println(names[i]);
      }
   }
}



/**::
 * Static method invocation
 */

A.a = 10;           

A a = new A();
a.b = 20;

new A().test();
A.staticTest();

B.test();

new B().test1();

class A {
   static int a = 1;
   static int b = 2;

   static int staticGetA(){
      return a;
   } 

   static int staticGetB(){
      return b;
   } 

   void test(){
      assertEquals(10, staticGetA(), "Calling static method from non-static method of same class works");
      assertEquals(20, staticGetB(), "Calling static method from non-static method of same class works");
      assertEquals(10, a, "Accessing static fields from non-static method of same class works");
   }

   static void staticTest(){
      assertEquals(10, staticGetA(), "Calling static method from other static method of same class works");
      assertEquals(20, staticGetB(), "Calling static method from other static method of same class works");
      assertEquals(10, a, "Accessing static fields from static method of same class works");
   }

}

class B extends A {
   static void test(){
      assertEquals(10, staticGetA(), "Calling static method from static method of child class works.");
      assertEquals(10, a, "Accessing static field from static method of child class works.");
   }

   void test1(){
      assertEquals(10, staticGetA(), "Accessing static field from non-static method of child class works.");
      assertEquals(10, a, "Accessing static field from static method of child class works.");
   }
}