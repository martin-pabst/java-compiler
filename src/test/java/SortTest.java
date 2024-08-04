/**::
 * Sort ArrayList with java Comparator
 * { "expectedOutput": "abcdf" }
 */

ArrayList<String> list = new ArrayList<>();

list.add("c");
list.add("b");
list.add("a");
list.add("f");
list.add("d");

class StringComparator implements Comparator<String> {
   int compare(String s1, String s2){
      return s1.compareTo(s2);
   }
}

list.sort(new StringComparator());

list.forEach((s) -> {print(s);})