/**::
 * Test String < string and += operator
 */

String t = "Test";
t = "NewTest";
assertEquals(t, "NewTest", "Assigning a string literal to a String variable doesn't work...");
if(t < "Zest") t += t;

assertEquals(t, "NewTestNewTest", "if-clause gone wrong...");