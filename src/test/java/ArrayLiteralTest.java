/**::
 * Test array literals in field initialization
 */

A a = new A();
a.test();
A b = new A();
b.array[2] = 20;

a.test();
assertEquals(20, b.array[2], "Test if array literal in field initialization is created anew for every object.");

class A {
   int[] array = {1, plus(7, 2), 7 + 4};

   String names[] = {"Charles", "Lucy", "Emma"};

   void test(){
      assertEquals(11, array[2], "Test array literal in field initialization.");
      assertEquals(9, array[1], "Test array literal in field initialization.");
      assertEquals("Charles", names[0], "Test array literal with alternative type syntax");
   }

   int plus(int a, int b){
    return a + b;
   }

}

/**::
 * Test multi-dimensional array literals
 */

int[][] testArray = {{1, 2}, {3, 4}};

assertEquals(2, testArray.length, "Test length of array literal");

String s = testArray;

assertEquals("[[1, 2], [3, 4]]", s, "Cast from array to string doesn't work.");

int[][][] threeDimensional = {testArray, testArray};

String s1 = threeDimensional;
assertEquals("[[[1, 2], [3, 4]], [[1, 2], [3, 4]]]", threeDimensional, "Cast from array to string doesn't work.");

// cast arrays of objects to string:
class Test {

   int i;

   Test(int i) {
      this.i = i;
   }

   String toString() {
      return "Zahl: " + i;
   }
}

Test[] a1 = { new Test(0), new Test(1), new Test(2) };

Test[][] a2 = { a1, a1 };

String a1String = a1;
String a2String = a2;

assertEquals("[Zahl: 0, Zahl: 1, Zahl: 2]", a1String, "Casting array of objects to string doesn't work.");
assertEquals("[[Zahl: 0, Zahl: 1, Zahl: 2], [Zahl: 0, Zahl: 1, Zahl: 2]]", a2String, "Casting array of objects to string doesn't work.");
