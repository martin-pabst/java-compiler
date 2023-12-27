/**::
 * test switch case with int
 * @expectedOutput: "Here!"
 */
    int x = 1;

    boolean case0reached = false;
    boolean case1reached = false;
    boolean case2reached = false;
    boolean defaultCaseReached = false;

    switch(x) {
        case 0: case0reached = true; break;
        case 1: case1reached = true;
        case 2: case2reached = true; break;
        default: defaultCaseReached = true; break;
    }

    assertFalse(case0reached, "Case 0 must not be reached.");
    assertTrue(case1reached, "Didn't reach case 1.");
    assertTrue(case2reached, "Didn't reach case 2.");
    assertFalse(defaultCaseReached, "Default case must not be reached.");

    print("Here!")

/**::
 * Test switch case with constant
 * @expectedOutput: "Here!"
 */

  public class A {
    public static final String a = "ABC";
    public static final int x = 5;
  }

  String b = "DEF";
  int y = 4;
  
  boolean case5reached = false;

  switch(b) {
      case A.a: Assertions.fail("Case A.a must not be reached."); break;
      
      default: switch(y) {
        case 4:
        case 5: case5reached = true; break;
        default: Assertions.fail("Default case must not be reached."); break;
      }
  }

  assertTrue(case5reached, "Didn't reache case 5.");

  print("Here!");
