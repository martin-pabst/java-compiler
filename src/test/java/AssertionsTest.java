/**::
 * Test assertions
 * { "expectedOutput": "Here!" }
 */

Assertions.assertTrue(1 == 1, "1 == 1 should be true");
Assertions.assertEquals(10, 20 - 10, "10 should be 20 - 10");

int sum = 0;
for(int i = 1; i <= 10000; i++){
    sum += i;
}

// Compiler-Magic (see TermCodeGenerator.compileMethodCall): static methods of class 
// Assertions are "statically imported" globally:
assertEquals(sum, 50005000, "Sum from 1 to 10000 should be 5050.");

String a = "This is";
String b = " a test."; 
assertEquals(a + b, "This is a test.", "Test string concatenation");

assertCodeReached("This code must be reached.");

print("Here!");