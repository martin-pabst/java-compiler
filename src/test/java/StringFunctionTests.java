/**::
 * Test String functions for primitive string literals
 */
assertEquals("1234".length(), 4, "Wrong string literal length.");
assertEquals("Das ist ein Test Test".indexOf("Test"), 12, "string literal indexOf not working.");
assertEquals("Das ist ein Test Test".indexOf("x"), -1, "string literal indexOf not working.");
assertEquals("Das ist ein Test und noch ein Test".indexOf("Test", 3), 12, "string literal indexOf not working.");
assertEquals("Das ist ein Test und noch ein Test".indexOf("Test", 13), 30, "string literal indexOf not working.");
assertEquals("Das ist ein Test und noch ein Test".indexOf('T'), 12, "string literal indexOf not working.");
assertEquals("Das ist ein Test und noch ein Test".indexOf('T', 3), 12, "string literal indexOf not working.");
assertEquals("Das ist ein Test und noch ein Test".indexOf('T', 14), 30, "string literal indexOf not working.");
assertEquals("Martin".charAt(2), 'r', "string literal charAt not working.");
assertEquals("Alpha".compareTo("Beta"), -1, "string literal compareTo not working.");
assertEquals("Alpha".compareTo("Alpha"), 0, "string literal compareTo not working.");
assertEquals("Alpha".compareTo("alpha"), 1, "string literal compareTo not working.");
assertEquals("Alpha".compareToIgnoreCase("alpha"), 0, "string literal compareToIgnoreCase not working.");
assertEquals("Alpha".concat("beta"), "Alphabeta", "string literal concat not working.");

String other = "beta";
assertEquals("Alpha".concat(other), "Alphabeta", "string literal concat not working.");

assertTrue("Alpha".contains("ph"), "string literal contains not working.");
assertFalse("Alpha".contains("Ph"), "string literal contains not working.");
assertTrue("Alpha".endsWith("pha"), "string literal endsWith not working.");
assertFalse("Alpha".endsWith("Pha"), "string literal endsWith not working.");
assertTrue("Alpha".startsWith("Alph"), "string literal startsWith not working.");
assertFalse("Alpha".startsWith("alph"), "string literal startsWith not working.");

assertTrue("Alpha".equals("Alpha"), "string literal equals not working.");
assertTrue("Alpha".equalsIgnoreCase("alpha"), "string literal equals not working.");
assertTrue("".isEmpty(), "string literal isEmpty not working.");
assertFalse(other.isEmpty(), "string literal isEmpty not working.");

assertEquals("Das ist ein Test und noch ein Test".lastIndexOf("Test"), 30, "string literal lastIndexOf not working.");
assertEquals("Das ist ein Test und noch ein Test".lastIndexOf("Test", 20), 12, "string literal lastIndexOf not working.");

assertEquals("ABCÄÖÜß".toLowerCase(), "abcäöüß", "string literal toLowerCase not working");
assertEquals("abcäöü".toUpperCase(), "ABCÄÖÜ", "string literal toUpperCase not working");

assertEquals("Das ist ein Test".substring(4), "ist ein Test", "string literal substring not working");
assertEquals("Das ist ein Test".substring(4, 7), "ist", "string literal substring not working");

assertEquals("   Das ist ein Test   \n".trim(), "Das ist ein Test", "string literal trim not working");
assertEquals("Das ist und ist und ist nicht wahr.".replace("ist", "war"), "Das war und ist und ist nicht wahr.", "string literal replace not working.");
assertEquals("Das ist und ist und ist nicht wahr.".replaceAll("ist", "war"), "Das war und war und war nicht wahr.", "string literal replace not working.");
assertTrue("12.08.2022".matches("\\d\\d\\.\\d\\d\\.\\d\\d\\d\\d"), "string literal matches not working.");
assertEquals("12.08.2022, 01.01.2023".replaceFirst("\\d\\d\\.\\d\\d\\.\\d\\d\\d\\d", "date"), "date, 01.01.2023", "string literal matches not working.");
assertEquals("Das ist und ist und ist nicht wahr.".split("ist").length, 4, "string literal split not working.");

/**::
 * Test String functions for String objects
 */
String s1 = "1234";
assertEquals(s1.length(), 4, "Wrong string literal length.");

String s2 = "Das ist ein Test";
assertEquals(s2.indexOf("Test"), 12, "String object indexOf not working.");
assertEquals(s2.indexOf("x"), -1, "String object indexOf not working.");

String s3 = "Das ist ein Test und noch ein Test";
assertEquals(s3.indexOf("Test", 3), 12, "String object indexOf not working.");
assertEquals(s3.indexOf("Test", 13), 30, "String object indexOf not working.");
assertEquals(s3.indexOf('T'), 12, "String object indexOf not working.");
assertEquals(s3.indexOf('T', 3), 12, "String object indexOf not working.");
assertEquals(s3.indexOf('T', 14), 30, "String object indexOf not working.");
assertEquals(s3.charAt(2), 's', "String object charAt not working.");
assertEquals("Alpha".compareTo("Beta"), -1, "String object compareTo not working.");
assertEquals("Alpha".compareTo("Alpha"), 0, "String object compareTo not working.");
assertEquals("Alpha".compareTo("alpha"), 1, "String object compareTo not working.");
assertEquals("Alpha".compareToIgnoreCase("alpha"), 0, "String object compareToIgnoreCase not working.");
assertEquals("Alpha".concat("beta"), "Alphabeta", "String object concat not working.");

String alpha = "Alpha";
String other = "beta";
assertEquals("Alpha".concat(other), "Alphabeta", "String object concat not working.");

assertEquals('h', alpha.toCharArray()[3], "String.toCharArray() doesn't work.");

assertTrue(alpha.contains("ph"), "String object contains not working.");
assertFalse(alpha.contains("Ph"), "String object contains not working.");
assertTrue(alpha.endsWith("pha"), "String object endsWith not working.");
assertFalse(alpha.endsWith("Pha"), "String object endsWith not working.");
assertTrue(alpha.startsWith("Alph"), "String object startsWith not working.");
assertFalse(alpha.startsWith("alph"), "String object startsWith not working.");

assertTrue(alpha.equals("Alpha"), "String object equals not working.");
assertTrue(alpha.equalsIgnoreCase("alpha"), "String object equals not working.");

String emptyString = "";
assertTrue(emptyString.isEmpty(), "String object isEmpty not working.");
assertFalse(other.isEmpty(), "String object isEmpty not working.");

assertEquals(s3.lastIndexOf("Test"), 30, "String object lastIndexOf not working.");
assertEquals(s3.lastIndexOf("Test", 20), 12, "String object lastIndexOf not working.");

assertEquals(s2.substring(4), "ist ein Test", "String object substring not working");
assertEquals(s2.substring(4, 7), "ist", "String object substring not working");

/**::
 * Test String < string and += operator
 */

String t = "Test";
t = "NewTest";
assertEquals(t, "NewTest", "Assigning a string literal to a String variable doesn't work...");
if(t < "Zest") t += t;

assertEquals(t, "NewTestNewTest", "if-clause gone wrong...");

