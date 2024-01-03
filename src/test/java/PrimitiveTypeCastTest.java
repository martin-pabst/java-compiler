/**::
 * Test casting primitive types
 */

char c = 'A';
int i = c;

assertEquals(65, i, "Casting char to int doesn't work.");
assertEquals(65, (int)c, "Casting char to int doesn't work.");

char c1 = (char)i;
assertEquals('A', c1, "Casting int to char doesn't work.");
assertEquals('A', (char)65, "Casting int to char doesn't work.");
assertEquals(77, (char)65 + 12, "Casting int to char doesn't work.");

