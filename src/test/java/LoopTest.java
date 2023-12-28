/**::
 * Test various loops
 */
int n = 0;
for(int i = 1; i <= 100; i++){
    n += i;
}

assertEquals(5050, n, "The sum from 1 to 100 should be 5050.");

int a = 1;
int b = 1;
while(b < 4000){
    int c = a + b;
    a = b;
    b = c;
}

assertEquals(4181, b, "Test of while-loop should yield 4181.");

int x = 1;
do {
    x = x * 2;
} while (x < 1024);

assertEquals(1024, x, "Test do-while-loop");


/**::
 * Test break, continue in for-loop
 */
int i1;
int j1;
for(int i = 0; i < 10; i++){
    i1 = i;
    for(int j = 0; j < 10; j++){
        j1 = j;
        if(j == 2) break;
    }
    if(i == 3) break;
}

assertEquals(2, j1, "Test break in for-loop");
assertEquals(3, i1, "Test break in for-loop");

int n = 0;
for(int i = 0; i < 10; i++){
    if(i < 8) continue;
    for(int j = 0; j < 10; j++){
        if(j > 2) continue;
        n++;
    }
}

assertEquals(6, n, "Test continue in for-loop");

/**::
 * Test break, continue in while-loop
 */
int i1;
int j1;

int i = 0;
while(i < 10){
    i1 = i;
    int j = 0;
    while(j < 10){
        j1 = j;
        if(j == 2) break;
        j++;
    }
    if(i == 3) break;
    i++;
}

assertEquals(2, j1, "Test break in while-loop");
assertEquals(3, i1, "Test break in while-loop");

int n = 0;
int i = 0;
while(i < 10){
    i++;
    if(i < 8) continue;
    int j = 0;
    while(j < 10){
        j++;
        if(j > 2) continue;
        n++;
    }
}

assertEquals(6, n, "Test continue in while-loop");


/**::
 * Test break, continue in do...while-loop
 */
int i1;
int j1;

int i = 0;
do{
    i1 = i;
    
    int j = 0;
    do{
        j1 = j;
        if(j == 2) break;
        j++;
    } while(j < 10);

    if(i == 3) break;
    i++;
} while(i < 10);

assertEquals(2, j1, "Test break in do..while-loop");
assertEquals(3, i1, "Test break in do..while-loop");

int n = 0;
int i = 0;
do{
    i++;
    if(i < 8) continue;
    int j = 0;
    do{
        j++;
        if(j > 2) continue;
        n++;
    } while (j < 10);
} while (i < 10);

assertEquals(6, n, "Test continue in do..while-loop");


