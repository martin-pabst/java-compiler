/**::
 * Test this keyword
 */

A1 a1 = new A1();
assertTrue(a1.equalsThis(a1), "keyword this with equal-operator not working.");
assertFalse(a1.equalsThis("Test"), "keyword this with equal-operator not working.");
a1.testFieldAccess();
a1.testMethodCall();


class A1 {
    int x = 12;

    void testFieldAccess(){
        assertEquals(12, this.x, "Fieldaccess with this-keyword not working.");
    }

    boolean equalsThis(Object o){
        return o == this;
    }

    void methodToCall(){
        assertCodeReached("Method call with keyword this not working.");
    }

    void testMethodCall(){
        this.methodToCall();
    }

}


/**::
 * Test method call with keyword super
 */

new C().testMethodCall();
new C().testFieldAccess();

class A {
   int x = 1;
   String getName(){
      return "A";
   }
}

class B extends A {
    int x = 2;
   String getName(){
      return "B";
   }
}

class C extends B {
    int x = 3;
   String getName(){
      return "C";
   }

   void testMethodCall(){
      assertEquals("C", getName(), "Normal method call not working.");
      assertEquals("B", super.getName(), "Method call with super keyword not working.");
      assertEquals("A", super.super.getName(), "Method call with super.super not working.");
   }

   void testFieldAccess(){
      assertEquals(3, x, "Normal field access not working.");
      assertEquals(2, super.x, "Field access with super keyword not working.");
      assertEquals(1, super.super.x, "Field access with super.super not working.");
   }

}


/**::
 * This and super to call other constructors
 * { "expectedOutput": "B: 14\nA: 12\nA1\n" }
 */
new A();

class A extends B {
   A(){
      this(12);
      println("A1");
   }

   A(int x){
      super(x + 2);
      println("A: " + x);
   }
}

class B {
   B(int y){
      println("B: " + y);
   }
}