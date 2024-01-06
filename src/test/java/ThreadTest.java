/**::
 * Test Threads
 */

class Adder {
    int sum = 0;
    int completedThreads = 0;
}

Adder adder = new Adder();

for(int n = 0; n < 10; n++){

   Thread t = new Thread(new Runnable(){
      void run(){
         for(int i = 0; i < 10; i++){
            adder.sum += n*i;
         }
         adder.completedThreads++;
         if(adder.completedThreads == 10){
            assertEquals(2025, adder.sum, "Threads are not working");
            assertCodeReached("Threads are not working");
         }
      }
   });

   t.start();
}


