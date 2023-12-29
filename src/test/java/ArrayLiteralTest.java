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

   void test(){
      assertEquals(11, array[2], "Test array literal in field initialization.");
      assertEquals(9, array[1], "Test array literal in field initialization.");
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