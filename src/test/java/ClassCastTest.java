/**::
 * Test explicit and implicit casts
 */

interface A {}

class B implements A { }

class C extends B { }

C c = new C();

B b = c;

C c1 = (C)b;

A a = c;

C c2 = (C)a;

assertCodeReached("Test explicit und implicit casts: Program should reach this statement without errors.")