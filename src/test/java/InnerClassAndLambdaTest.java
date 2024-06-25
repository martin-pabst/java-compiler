/**::
 * anonymous class
 */
class Value {int n = 0;}

Value v = new Value();

Runnable r = new Runnable(){
    void run(){
        v.n = 10;
    }
};

r.run();

assertEquals(10, v.n, "Access to local variable outside inner class")


/**::
 * inner class
 */

class Test {
    int i = 10;
    int j = 20;

    class Inner {
        int timesTen(int a){
            return a * i;
        }

        void alterJ(){
            j = 30;
        }
    }

    void run(){
        Inner inner = new Inner();
        assertEquals(50, inner.timesTen(5), "read access to field from outer class");

        inner.alterJ();
        assertEquals(30, j, "write access to field from inner class");
    }

}

new Test().run();


/**::
 * Lambda function
 */
interface FunctionalInterface1 {
    int times(int a, int b);
}

class Test2 {
    int calc(FunctionalInterface1 f1, int a, int b){
        return f1.times(a, b);
    }
}

int result = new Test2().calc((x, y) -> {return x * y;}, 5, 4);
assertEquals(20, result, "Lambda function test");

int k = 10;
int result2 = new Test2().calc((x, y) -> {return x * y * k;}, 5, 4);
assertEquals(200, result2, "Lambda function access to local variables outside");



