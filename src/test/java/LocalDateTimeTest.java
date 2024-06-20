/**::
 * LocalDateTime
 */

LocalDateTime ldt = LocalDateTime.of(2024, 6, 20, 12, 15, 25);
LocalDateTime ldt2 = LocalDateTime.of(2025, 5, 10, 12, 15, 25);

assertEquals(2024, ldt.getYear(), "LocalDateTime.getYear");
assertEquals(6, ldt.getMonth(), "LocalDateTime.getMonth");
assertEquals(20, ldt.getDayOfMonth(), "LocalDateTime.getDayOfMonth");
assertEquals(12, ldt.getHour(), "LocalDateTime.getHour");
assertEquals(15, ldt.getMinute(), "LocalDateTime.getMinute");
assertEquals(25, ldt.getSecond(), "LocalDateTime.getSecond");

assertEquals(-324, ldt.until(ldt2), "LocalDateTime.until");


