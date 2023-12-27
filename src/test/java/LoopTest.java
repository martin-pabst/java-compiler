/**::
 * Test various loops
 */
int n = 0;
for(int i = 1; i <= 100; i++){
    n += i;
}

assertEquals(n, 5050, "The sum from 1 to 100 should be 5050.");

int a = 1;
int b = 1;
while(b < 4000){
    int c = a + b;
    a = b;
    b = c;
}

assertEquals(b, 4181, "Test of while-loop should yield 4181.");

