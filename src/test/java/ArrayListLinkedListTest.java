/**::
 * ArrayList-functions
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

list2.add("Tony");
assertFalse(list.containsAll(list2), "ArrayList.containsAll");


/**::
 * LinkedList-functions
 */

LinkedList<String> list3 = new LinkedList<>();

list3.add("Bonny");
list3.addFirst("Anton");
list3.addLast("Charlie");
list3.add("Dennis");
list3.add("Emma");

assertEquals("[Anton, Bonny, Charlie, Dennis, Emma]", list3.toString(), "LinkedList.add/addFirst/addLast/toString not working.");

list3.remove("Charlie");

assertTrue(list3.contains("Bonny"), "LinkedList.contains");
assertFalse(list3.contains("Charlie"), "LinkedList.contains");

assertEquals("Anton", list3.peekFirst(), "LinkedList.peekFirst");
assertEquals("Emma", list3.peekLast(), "LinkedList.peekLast");
assertEquals("[Anton, Bonny, Dennis, Emma]", list3.toString(), "LinkedList.peekFirst/peekLast not working.");

assertEquals("Anton", list3.removeFirst(), "LinkedList.removeFirst");
assertEquals("Emma", list3.removeLast(), "LinkedList.removeLast");
assertEquals("[Bonny, Dennis]", list3.toString(), "LinkedList.removeFirst/removeLast not working.");

assertEquals("Dennis", list3.pop(), "LinkedList.pop");
assertEquals("[Bonny]", list3.toString(), "LinkedList.pop not working.");

list3.push("Martin");
list3.push("Claudia");
list3.push("Martin");
assertEquals("[Bonny, Martin, Claudia, Martin]", list3.toString(), "LinkedList.push not working.");

assertTrue(list3.removeFirstOccurrence("Martin"), "LinkedList.removeFirstOccurrence");
assertEquals("[Bonny, Claudia, Martin]", list3.toString(), "LinkedList.push not working.");

assertFalse(list3.removeFirstOccurrence("Edith"), "LinkedList.removeFirstOccurrence");

list3.push("Veronika");
list3.push("Martin");

assertTrue(list3.removeLastOccurrence("Martin"), "LinkedList.removeLastOccurrence");
assertEquals("[Bonny, Claudia, Martin, Veronika]", list3.toString(), "LinkedList.removeLastOccurrence not working.");

assertFalse(list3.removeLastOccurrence("Edith"), "LinkedList.removeLastOccurrence");

Iterator<String> it = list3.descendingIterator();
String text = "";
for (Iterator<String> iter = list3.descendingIterator(); iter.hasNext(); ) {
    String element = iter.next();
    text += element + ", ";
}

assertEquals("Veronika, Martin, Claudia, Bonny, ", text, "LinkedList.descendingIterator not working.");

/**::
 * Stack tests
 */

Stack<String> stack = new Stack<>();

stack.add("Anton");
stack.add("Bonny");
stack.push("Charlie");
stack.push("Dennis");
stack.push("Emma");

assertEquals(2, stack.indexOf("Charlie"), "Stack.indexOf not working.");
assertEquals(2, stack.search("Charlie"), "Stack.search not working.");

stack.remove("Charlie");

assertTrue(stack.contains("Bonny"), "Stack.contains");
assertEquals("Emma", stack.peek(), "Stack.peek");
assertFalse(stack.contains("Bonnyx"), "Stack.contains");

Collection<String> coll = stack;
assertTrue(coll.contains("Dennis"), "Collection.contains");
assertFalse(coll.contains("Dennisx"), "Collection.contains");

Stack<String> stack2 = new Stack<>();

stack2.add("Bonny");
stack2.add("Emma");

assertTrue(stack.containsAll(stack2), "Stack.containsAll");

stack2.add("Tony");
assertFalse(stack.containsAll(stack2), "Stack.containsAll");

stack.push("Zach");
assertEquals("Zach", stack.pop(), "Stack.pop()");
assertFalse(stack.contains("Zach"), "Stack.pop()");

