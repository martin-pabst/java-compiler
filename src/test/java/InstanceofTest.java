/**::
 * instanceof
 */


Test t = new Test();

assertTrue(t instanceof TestInterface, "instanceof");
assertTrue(t instanceof Test, "instanceof");
assertFalse(t instanceof Integer, "instanceof");


class Test implements TestInterface {
   
}


interface TestInterface {

}

ArrayList<String> list = new ArrayList<String>();

assertTrue(list instanceof ArrayList, "instanceof with generic type");