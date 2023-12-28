/**::
 * Test Declaration of fields and local variables
 */

class A {
   int x = 3, y = 2;
}

A a = new A();

assertEquals(3, a.x, "Test field declaration");
assertEquals(2, a.y, "Test field declaration");


String t1, t2 = "Test";

t1 = "Hello";

assertEquals("Hello", t1, "Test local variable declaration");
assertEquals("Test", t2, "Test local variable declaration");