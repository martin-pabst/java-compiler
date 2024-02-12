/**::
 * Test Optional class
 */

Optional<String> o1 = Optional.empty();
Optional<String> o2 = Optional.of("ABCD");

assertTrue(o1.isEmpty(), "Optional.empty() should be empty");
assertFalse(o2.isEmpty(), "Optional.of(\"ABCD\") should not be empty");


assertEquals("ELSE", o1.orElse("ELSE"), "Return else value when o1 is empty.");
assertEquals("ABCD", o2.orElse("ELSE"), "Return actual value when o2 is not empty.");

o1.ifPresent((v) -> {fail("This should never be called since o1 is empty");});
o2.ifPresent((v) -> {assertCodeReached("This should be reached."); assertEquals("ABCD", v, "Function parameter should equal content of o2.");});

assertEquals("Nothing", o1.toString(), "Optional.empty() should have string representation \"Nothing\"");
assertEquals("Just ABCD", o2.toString(), "Optional.(\"ABCD\") should have string representation \"Just ABCD\"");



Optional<String> o3 = o2.map((e) -> {return e.toLowerCase();});
assertEquals(Optional.of("abcd"),o3, "Function maps content of Optional.");
assertEquals(Optional.empty(),o1.map((e) -> {return e.toLowerCase();}), "Function maps empty optional to empty optional.");

assertEquals(Optional.of("ABCDABCD"),o2.flatMap((e) -> {return Optional.of(e+e);}), "Function maps empty optional to empty optional.");

