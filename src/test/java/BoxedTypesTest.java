/**::
 * Boxed types
 */


Integer i1 = Integer.valueOf(12);

assertEquals(22, i1 + 10, "Add int to Integer");
assertEquals("12", i1 + "", "Integer.toString");

ArrayList<Integer> list = new ArrayList<>();
list.add(i1);
list.add(10);

assertEquals("[12, 10]", list.toString(), "add Integer and int to ArrayList<Integer>");

assertTrue(list.get(1) instanceof Integer, "Boxed int is Integer");