/**::
 * Operator precedence
 */

int a = 10;
int b = 20;

int c = b/a + 5;
assertEquals(7, c, "Precedence / before + not working.");

int n = 0;

double d = a + 3 / b * n;
assertEquals(10.0, d, "Operators with identical precedence are not evaluated left to right.");
