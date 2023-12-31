/**::
 * Instantiate generic object
 */

ArrayList<String> list = new ArrayList<String>();
List<String> list1 = new ArrayList<>();

List<String> list2 = list;

list.add("First");
list.add("Second");

assertEquals("Second", list.get(1), "Error instantiating ArrayList<String>");
assertEquals("Second", list2.get(1), "Error assigning ArrayList<String> to List<String>");


