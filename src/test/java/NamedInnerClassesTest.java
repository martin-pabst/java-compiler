/**::
 * Test named inner classes
 */

A a = new A();
A.B b = a.getB();
assertEquals(10, b.getOuterI(), "Test outer class field access");
a.i = 20;
assertEquals(20, b.getOuterI(), "Test outer class field access");

A.B.C c1 = b.new A.B.C();
assertEquals(20, c1.getOuterI(), "Test outer class field access");
assertEquals(100, c1.getOuterJ(), "Test outer class field access");

A.B.C c2 = b.getC();
assertEquals(20, c2.getOuterI(), "Test outer class field access");
assertEquals(100, c2.getOuterJ(), "Test outer class field access");

class A {
   int i = 10;

   class B {
      
      int j = 100;

      int getOuterI(){
         return i;
      }

      C getC(){
        return new C();
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