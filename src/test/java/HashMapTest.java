/**::
 * HashMap-functions
 */

HashMap<String, Integer> hm = new HashMap<>();

hm.put("Martin", 74);
hm.put("Gerhard", 75);
hm.put("Mona", 76);

assertEquals(null, hm.get("Test"), "HashMap.get");
assertEquals(75, hm.get("Gerhard"), "HashMap.get");
assertEquals(3, hm.size(), "HashMap.size");

