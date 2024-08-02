/**::
 * ArrayList-functions
 * // { "expectOutput": "abcdf" }
 */

ArrayList<String> list = new ArrayList<>();

list.add("Anton");
list.add("Bonny");
list.add("Charlie");
list.add("Dennis");
list.add("Emma");

assertEquals(2, list.indexOf("Charlie"), "ArrayList.indexOf not working.");

list.remove("Charlie");

assertTrue(list.contains("Bonny"), "ArrayList.contains");
assertFalse(list.contains("Bonnyx"), "ArrayList.contains");

Collection<String> coll = list;
assertTrue(coll.contains("Dennis"), "Collection.contains");
assertFalse(coll.contains("Dennisx"), "Collection.contains");

ArrayList<String> list2 = new ArrayList<>();

list2.add("Bonny");
list2.add("Emma");

assertTrue(list.containsAll(list2), "ArrayList.containsAll");