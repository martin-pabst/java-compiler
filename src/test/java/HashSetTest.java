/**::
 * HashSet - Test
 * { "expectedOutput": "AnnaBertaCharlieDennis" }
 */

Set<String> s = new HashSet<String>();

s.add("Anna");
s.add("Berta");
s.add("Charlie");
s.add("Dennis");
s.add("Dennis");

assertEquals(4, s.size(), "HashSet.size");

assertTrue(s.contains("Berta"), "HashSet.contains");
assertFalse(s.contains("Tim"), "HashSet.contains");

s.forEach(element -> {print(element);});


ArrayList<String> list = new ArrayList<>();
list.add("Anna");
list.add("Charlie");
list.add("Dennis");

assertTrue(s.containsAll(list), "HashSet.containsAll");

list.add("Martin");
assertFalse(s.containsAll(list), "HashSet.containsAll");

s.addAll(list);
assertTrue(s.contains("Martin"), "HashSet.addAll");

s.remove("Dennis");
assertFalse(s.contains("Dennis"), "HashSet.remove");

s.removeAll(list);
assertTrue(s.contains("Berta"), "HashSet.removeAll");
assertFalse(s.contains("Martin"), "HashSet.removeAll");