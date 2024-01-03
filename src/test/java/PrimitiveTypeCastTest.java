/**::
 * Test casting primitive types
 */

char c = 'A';
int i = c;

assertEquals(65, i, "Casting char to int doesn't work.");

char c1 = (char)i;
assertEquals('A', c1, "Casting int to char doesn't work.");

