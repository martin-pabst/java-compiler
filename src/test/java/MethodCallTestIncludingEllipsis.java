/**::
 * Test ellipsis
 * @ExpectOutput: "12\nNick\nEmma\n14\n"
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